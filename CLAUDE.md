# RouteAI — CLAUDE.md

## Project Overview

A natural language route planner PWA. The user types or speaks a casual description of where they need to go, the AI extracts and orders the stops, and the app opens Google Maps with everything pre-filled.

**Core value**: The AI acts as a translator between human language and Google Maps input. Google Maps never has to understand natural language — it just receives clean, structured addresses.

**Live URL**: TBD (Firebase Hosting)
**Repository**: TBD
**Deployment**: Firebase Hosting (static generation via `yarn generate`)

---

## Tech Stack

- **Framework**: Nuxt 4 (Vue 3) — static site generation
- **Package Manager**: yarn (NEVER npm)
- **Styling**: Tailwind CSS exclusively (NO custom CSS except variables and keyframes)
- **TypeScript**: Strict typing for all data structures
- **Icons**: Iconify (`~icons/pack-name/icon-name`)
- **State**: Pinia
- **AI**: Gemini API (swap-ready for Claude API later — see AI Integration section)
- **Maps**: Google Maps URL scheme (no Maps SDK needed)
- **Deployment**: Firebase Hosting via `yarn generate` + `firebase deploy`
- **PWA**: @vite-pwa/nuxt for installability on mobile

---

## Folder Structure

```
routeai/
├── CLAUDE.md
├── app.vue
├── assets/
│   └── css/
│       └── main.css           ← CSS variables, global resets, keyframes
├── components/
│   ├── route/
│   │   ├── RouteInput.vue     ← Natural language textarea + submit
│   │   ├── StopsList.vue      ← Extracted stops display
│   │   ├── TimeNote.vue       ← Time constraint callout
│   │   └── MapsButton.vue     ← "Open in Google Maps" CTA
│   └── ui/
│       ├── Button.vue
│       ├── Card.vue
│       └── StatusIndicator.vue
├── composables/
│   ├── useRouteParser.ts      ← Calls Gemini, returns structured stops
│   └── useMapsUrl.ts          ← Builds Google Maps URL from stops array
├── pages/
│   └── index.vue
├── public/
│   ├── favicon.ico
│   ├── icon-192.png           ← PWA icons
│   ├── icon-512.png
│   └── robots.txt
├── stores/
│   └── route.ts               ← Pinia store: input, stops, status, mapsUrl
├── types/
│   └── index.ts               ← Route, Stop, ParsedRoute types
├── nuxt.config.ts
├── tailwind.config.js
├── tsconfig.json
├── firebase.json
└── package.json
```

---

## TypeScript Types

```typescript
// types/index.ts

export interface Stop {
  label: string       // Human-friendly name: "Central Park"
  address: string     // Google Maps-ready string: "Central Park, New York, NY"
}

export interface ParsedRoute {
  stops: Stop[]
  timeNote: string    // e.g. "about an hour" or "" if none mentioned
}

export interface RouteState {
  input: string
  stops: Stop[]
  timeNote: string
  mapsUrl: string
  status: string
  loading: boolean
  error: string
}
```

---

## AI Integration

### Current: Gemini API
```typescript
// composables/useRouteParser.ts
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  }
)
```

### Future: Claude API (drop-in swap)
```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  })
})
```

### System Prompt (same for both)
```
You are a route extraction assistant. The user describes a trip in natural language.
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
Do not include the user's home/origin unless explicitly named with an address.
```

---

## Google Maps URL Builder

```typescript
// composables/useMapsUrl.ts
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
```

No geocoding needed. Google Maps resolves text addresses natively.

---

## PWA Configuration

```typescript
// nuxt.config.ts — PWA module config
pwa: {
  manifest: {
    name: 'RouteAI',
    short_name: 'RouteAI',
    description: 'Plan routes with natural language',
    theme_color: '#0a0a0f',
    background_color: '#0a0a0f',
    display: 'standalone',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  workbox: {
    navigateFallback: '/'
  }
}
```

---

## Environment Variables

```bash
# .env (never commit this)
NUXT_PUBLIC_GEMINI_API_KEY=your_key_here

# When switching to Claude:
# NUXT_PUBLIC_CLAUDE_API_KEY=your_key_here
```

Access in code via `useRuntimeConfig().public.geminiApiKey`

---

## Design Direction

Dark, utilitarian, confident. This is a tool — it should feel fast and focused. Not a marketing page, not a dashboard. Think terminal meets maps app.

### Color Palette
```css
:root {
  --bg: #0a0a0f;
  --surface: rgba(255,255,255,0.03);
  --border: rgba(255,255,255,0.07);
  --text-primary: #ffffff;
  --text-secondary: #888888;
  --text-muted: #444444;
  --accent: #00ffb2;          /* electric green — primary CTA */
  --accent-maps: #1a73e8;     /* Google blue — Maps button only */
}
```

### Typography
- **Display**: `Space Grotesk` or `Syne` — geometric, technical
- **Mono / UI**: `Space Mono` — for addresses, status messages, stop items
- **Body**: `DM Sans` — inherited from Andrea's standard stack

### Key UI Rules
- Single-column layout, max-width 640px, centered
- Mobile-first — this app lives on phones
- Accent color (`--accent`) for active state, pulse animations, stop numbers
- Maps button always `--accent-maps` (Google blue for instant recognition)
- Status indicator: pulsing dot + monospace text
- Stops list: numbered cards with fade-in stagger

---

## Pinia Store

```typescript
// stores/route.ts
export const useRouteStore = defineStore('route', {
  state: (): RouteState => ({
    input: '',
    stops: [],
    timeNote: '',
    mapsUrl: '',
    status: '',
    loading: false,
    error: ''
  }),
  actions: {
    async parseRoute() { ... },
    reset() { ... }
  }
})
```

---

## Component Conventions

- One component per UI concern
- Props typed with TypeScript interfaces from `~/types`
- No `<style>` blocks — Tailwind only
- Composables handle all async logic — components stay lean
- `useRouteParser` owns the AI call
- `useMapsUrl` owns the URL construction
- Store owns the state

---

## Code Standards

- **Language**: Code and comments in English
- **Package manager**: yarn always (NEVER npm)
- **TypeScript**: strict typing, no `any`
- **Styling**: Tailwind CSS only
- **Icons**: Iconify only
- **No UI libraries**: No Vuetify, Quasar, etc.
- **Error handling**: always wrap API calls in try/catch with user-facing messages
- **Loading states**: always show status during async operations

---

## Deployment

```bash
# Generate static site
yarn generate

# Deploy to Firebase Hosting
firebase deploy

# Or combined:
yarn deploy
```

---

## Phases

### Phase 1 — Core (current)
- [ ] Project skeleton from this CLAUDE.md
- [ ] RouteInput component
- [ ] Gemini API integration via `useRouteParser`
- [ ] Google Maps URL builder via `useMapsUrl`
- [ ] StopsList display
- [ ] Firebase deploy + share link

### Phase 2 — PWA
- [ ] @vite-pwa/nuxt setup
- [ ] App icons (192 + 512)
- [ ] Offline fallback page
- [ ] "Add to Home Screen" prompt

### Phase 3 — Voice Input
- [ ] Web Speech API integration
- [ ] Mic button in RouteInput
- [ ] Transcript fed into existing parse flow

### Phase 4 — History (optional)
- [ ] Firebase Auth (Google)
- [ ] Firestore: save past routes per user
- [ ] History page

---

## What to NEVER Do

- Don't use npm — always yarn
- Don't add a backend server — this is a pure frontend PWA
- Don't geocode manually — Google Maps resolves text addresses natively
- Don't add heavy animation libraries
- Don't store API keys in the codebase — always `.env`
- Don't add a Maps SDK — the URL scheme is enough
- Don't over-engineer Phase 1 — ship the core loop first