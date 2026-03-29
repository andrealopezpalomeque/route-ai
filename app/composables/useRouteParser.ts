import type { ParsedRoute } from '~/types'

export const useRouteParser = () => {
  const parse = async (input: string): Promise<ParsedRoute> => {
    // TODO: call Gemini API with system prompt
    // Placeholder: return empty result
    console.warn('[useRouteParser] Not yet implemented — returning placeholder')
    return {
      stops: [],
      timeNote: '',
    }
  }

  return { parse }
}
