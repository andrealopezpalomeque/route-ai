interface Coords {
  lat: number
  lng: number
}

interface ReverseGeocodeAddress {
  city?: string
  town?: string
  village?: string
  state?: string
  country?: string
}

export const useGeolocation = () => {
  const coords = ref<Coords | null>(null)
  const locationContext = ref('')
  const loading = ref(false)
  const error = ref('')

  async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      )
      if (!response.ok) return ''

      const data = await response.json()
      const addr: ReverseGeocodeAddress = data.address ?? {}
      const city = addr.city ?? addr.town ?? addr.village ?? ''
      const country = addr.country ?? ''

      if (!city && !country) return ''
      return [city, country].filter(Boolean).join(', ')
    } catch {
      return ''
    }
  }

  async function requestLocation(): Promise<void> {
    if (!import.meta.client) return
    if (!navigator.geolocation) {
      error.value = 'Geolocation not supported'
      return
    }

    loading.value = true
    error.value = ''

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        })
      })

      coords.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      locationContext.value = await reverseGeocode(coords.value.lat, coords.value.lng)
    } catch (e) {
      const geoError = e as GeolocationPositionError
      if (geoError.code === geoError.PERMISSION_DENIED) {
        error.value = 'Location permission denied'
      } else if (geoError.code === geoError.TIMEOUT) {
        error.value = 'Location request timed out'
      } else {
        error.value = 'Unable to get location'
      }
      coords.value = null
      locationContext.value = ''
    } finally {
      loading.value = false
    }
  }

  return { coords, locationContext, loading, error, requestLocation }
}
