import { Router, Request, Response, NextFunction } from 'express'
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

const router = Router()

const SYSTEM_PROMPT = `You are a route extraction assistant. The user describes a trip in natural language.
Extract an ordered list of stops in the most logical order to minimize backtracking, plus any time constraint.

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "stops": [
    {
      "label": "short human-friendly name, e.g. Central Park",
      "address": "full address or place name Google Maps can understand, e.g. Central Park, New York, NY"
    }
  ],
  "timeNote": "any time constraint mentioned, or empty string"
}

Make addresses specific enough for Google Maps to resolve. Include city/state if mentioned or implied.
Do not include the user's home/origin unless explicitly named with an address.`

interface Stop {
  label: string
  address: string
}

interface ParsedRoute {
  stops: Stop[]
  timeNote: string
}

let model: GenerativeModel | null = null

function getModel(): GenerativeModel {
  if (model) return model

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Server misconfiguration: missing GEMINI_API_KEY')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })
  return model
}

function validateParsedRoute(data: unknown): ParsedRoute {
  if (typeof data !== 'object' || data === null) {
    throw new Error('AI response is not a valid object')
  }

  const obj = data as Record<string, unknown>

  if (!Array.isArray(obj.stops) || obj.stops.length === 0) {
    throw new Error('AI response missing valid stops array')
  }

  for (const stop of obj.stops) {
    if (typeof stop !== 'object' || stop === null) {
      throw new Error('Invalid stop entry in AI response')
    }
    const s = stop as Record<string, unknown>
    if (typeof s.label !== 'string' || typeof s.address !== 'string') {
      throw new Error('Stop missing required label or address')
    }
  }

  return {
    stops: obj.stops as Stop[],
    timeNote: typeof obj.timeNote === 'string' ? obj.timeNote : '',
  }
}

router.post('/parse-route', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { input, locationContext } = req.body

    if (!input || typeof input !== 'string') {
      res.status(400).json({ message: 'Missing or invalid "input" field' })
      return
    }

    const geminiModel = getModel()

    let prompt = input
    if (typeof locationContext === 'string' && locationContext.trim()) {
      prompt = `[User is currently located in ${locationContext}. Use this to resolve ambiguous addresses and add correct city/region to all stops.]\n\n${input}`
    }

    const result = await geminiModel.generateContent(prompt)
    const text = result.response.text()

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)
    const route = validateParsedRoute(parsed)

    res.json(route)
  } catch (error) {
    if (error instanceof SyntaxError) {
      res.status(502).json({ message: 'AI returned invalid JSON' })
      return
    }
    if (error instanceof Error && error.message.startsWith('Server misconfiguration')) {
      res.status(500).json({ message: error.message })
      return
    }
    if (error instanceof Error && (error.message.startsWith('AI response') || error.message.startsWith('Stop missing') || error.message.startsWith('Invalid stop'))) {
      res.status(502).json({ message: error.message })
      return
    }
    next(error)
  }
})

export { router as parseRouteRouter }
