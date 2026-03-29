import type { Stop } from '~/types'

interface Coords {
  lat: number
  lng: number
}

export const useMapsUrl = () => {
  const buildUrl = (stops: Stop[], coords?: Coords | null): string => {
    if (stops.length === 0) return ''
    const waypoints = stops
      .map(s => encodeURIComponent(s.address))
      .join('/')
    const origin = coords ? `${coords.lat},${coords.lng}/` : ''
    return `https://www.google.com/maps/dir/${origin}${waypoints}`
  }

  return { buildUrl }
}
