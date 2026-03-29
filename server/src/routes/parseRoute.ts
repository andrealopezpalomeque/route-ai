import { Router, Request, Response, NextFunction } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

router.post('/parse-route', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { input } = req.body

    if (!input || typeof input !== 'string') {
      res.status(400).json({ message: 'Missing or invalid "input" field' })
      return
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      res.status(500).json({ message: 'Server misconfiguration: missing API key' })
      return
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    const result = await model.generateContent(input)
    const text = result.response.text()

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)

    res.json(parsed)
  } catch (error) {
    next(error)
  }
})

export { router as parseRouteRouter }
