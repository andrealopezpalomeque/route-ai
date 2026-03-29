export interface Stop {
  label: string
  address: string
}

export interface ParsedRoute {
  stops: Stop[]
  timeNote: string
}

export interface RouteState {
  input: string
  stops: Stop[]
  timeNote: string
  mapsUrl: string
  status: string
  loading: boolean
  error: string
  locationContext: string
}
