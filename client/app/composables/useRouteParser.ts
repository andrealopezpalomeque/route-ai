import type { ParsedRoute } from '~/types'

export const useRouteParser = () => {
  const config = useRuntimeConfig()

  const parse = async (input: string): Promise<ParsedRoute> => {
    const baseUrl = config.public.apiBaseUrl

    const response = await fetch(`${baseUrl}/api/parse-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to parse route' }))
      throw new Error(error.message || 'Failed to parse route')
    }

    const data: ParsedRoute = await response.json()
    return data
  }

  return { parse }
}
