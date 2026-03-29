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
  }),
  actions: {
    async parseRoute() {
      // TODO: integrate with useRouteParser composable
    },
    reset() {
      this.input = ''
      this.stops = []
      this.timeNote = ''
      this.mapsUrl = ''
      this.status = ''
      this.loading = false
      this.error = ''
    },
  },
})
