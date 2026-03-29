import type { Stop } from '~/types'

export const useMapsUrl = () => {
  const buildUrl = (stops: Stop[]): string => {
    if (stops.length === 0) return ''
    const waypoints = stops
      .map(s => encodeURIComponent(s.address))
      .join('/')
    return `https://www.google.com/maps/dir/${waypoints}`
  }

  return { buildUrl }
}
