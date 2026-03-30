import { defineStore } from 'pinia'
import type { RouteState } from '~/types'

export const useRouteStore = defineStore('route', {
  state: (): RouteState => ({
    input: '',
    stops: [],
    timeNote: '',
    mapsUrl: '',
    status: '',
    loading: false,
    error: '',
    locationContext: '',
  }),
  actions: {
    async parseRoute(coords?: { lat: number; lng: number } | null, locationCtx?: string) {
      if (!this.input.trim()) return

      this.loading = true
      this.error = ''
      this.status = ''
      this.stops = []
      this.timeNote = ''
      this.mapsUrl = ''
      this.locationContext = locationCtx ?? ''

      try {
        const { parse } = useRouteParser()
        const result = await parse(this.input, this.locationContext)

        this.stops = result.stops
        this.timeNote = result.timeNote

        const { buildUrl } = useMapsUrl()
        this.mapsUrl = buildUrl(result.stops, coords)

        this.status = 'done'
      } catch (e) {
        this.error = e instanceof Error ? e.message : ''
        this.status = ''
      } finally {
        this.loading = false
      }
    },
    reset() {
      this.input = ''
      this.stops = []
      this.timeNote = ''
      this.mapsUrl = ''
      this.status = ''
      this.loading = false
      this.error = ''
      this.locationContext = ''
    },
  },
})
