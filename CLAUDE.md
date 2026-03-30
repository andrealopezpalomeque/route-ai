# Root AI — CLAUDE.md

## Project Overview

A natural language route planner PWA. The user types or speaks a casual description of where they need to go, the AI extracts and orders the stops, and the app opens Google Maps with everything pre-filled.

**Core value**: The AI acts as a translator between human language and Google Maps input. Google Maps never has to understand natural language — it just receives clean, structured addresses.

**Live URL**: https://route-ai-4cf0b.web.app
**API URL**: https://route-ai-v42a.onrender.com
**Repository**: github.com/andrealopezpalomeque/root-ai
**Client deployment**: Firebase Hosting (`yarn generate` + `firebase deploy`)
**Server deployment**: Render (Express + Node) — auto-deploys on git push

---

## Monorepo Structure

```
root-ai/
├── CLAUDE.md
├── package.json               ← root workspace (yarn workspaces)
├── client/                    ← Nuxt 4 PWA
│   ├── app/
│   │   ├── app.vue
│   │   ├── assets/css/main.css
│   │   ├── components/
│   │   │   ├── route/
│   │   │   │   ├── RouteInput.vue
│   │   │   │   ├── StopsList.vue
│   │   │   │   ├── TimeNote.vue
│   │   │   │   └── MapsButton.vue
│   │   │   └── ui/
│   │   │       ├── Button.vue
│   │   │       ├── Card.vue
│   │   │       └── StatusIndicator.vue
│   │   ├── composables/
│   │   │   ├── useRouteParser.ts   ← POSTs to /api/parse-route on Express
│   │   │   └── useMapsUrl.ts       ← builds Google Maps URL from stops[]
│   │   ├── pages/
│   │   │   └── index.vue
│   │   ├── stores/
│   │   │   └── route.ts            ← Pinia store
│   │   └── types/
│   │       └── index.ts
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── robots.txt
│   ├── nuxt.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── firebase.json
│   ├── .env.example            ← NUXT_PUBLIC_API_BASE_URL
│   └── package.json            ← name: routeai-client
└── server/                    ← Express + TypeScript API
    ├── src/
    │   ├── index.ts            ← Express entry, CORS, port
    │   ├── routes/
    │   │   └── parseRoute.ts   ← POST /api/parse-route → Gemini → stops[]
    │   └── middleware/
    │       └── errorHandler.ts
    ├── tsconfig.json
    ├── .env.example            ← GEMINI_API_KEY, PORT, CLIENT_URL
    └── package.json            ← name: routeai-server
```

---

## Tech Stack

### Client
- **Framework**: Nuxt 4 (Vue 3)
- **Package Manager**: yarn (NEVER npm)
- **Styling**: Tailwind CSS exclusively
- **TypeScript**: strict, no `any`
- **Icons**: Iconify (`~icons/pack-name/icon-name`)
- **State**: Pinia
- **Maps**: Google Maps URL scheme — no SDK needed
- **PWA**: @vite-pwa/nuxt

### Server
- **Runtime**: Node.js
- **Framework**: Express + TypeScript
- **AI SDK**: @google/generative-ai (Gemini)
- **Other**: cors, dotenv
- **Dev**: ts-node, nodemon

---

## Root package.json

```json
{
  "name": "root-ai",
  "private": true,
  "workspaces": ["client", "server"],
  "scripts": {
    "dev:client": "yarn workspace routeai-client dev",
    "dev:server": "yarn workspace routeai-server dev",
    "dev": "concurrently \"yarn dev:client\" \"yarn dev:server\"",
    "install:all": "yarn install"
  }
}
```

---

## TypeScript Types

```typescript
// client/app/types/index.ts

export interface Stop {
  label: string       // Human-friendly name: "Central Park"
  address: string     // Google Maps-ready: "Central Park, New York, NY"
}

export interface ParsedRoute {
  stops: Stop[]
  timeNote: string    // "about an hour" or ""
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

## Data Flow

```
User types natural language
        ↓
useRouteParser.ts (client)
  POST ${API_BASE_URL}/api/parse-route
  body: { input: string }
        ↓
server/src/routes/parseRoute.ts
  calls Gemini API with system prompt
  returns ParsedRoute JSON
        ↓
Pinia store (route.ts)
  stores stops[], timeNote
        ↓
useMapsUrl.ts
  builds https://www.google.com/maps/dir/Stop1/Stop2/Stop3
        ↓
MapsButton.vue
  window.open(mapsUrl)
        ↓
Google Maps opens with pre-filled stops
```

---

## AI Integration

### Server route: POST /api/parse-route
```typescript
// server/src/routes/parseRoute.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
```

### System Prompt
```
You are a route extraction assistant. The user describes a trip in natural language.
Extract an ordered list of stops in the most logical order to minimize backtracking,
plus any time constraint mentioned.

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "stops": [
    {
      "label": "short human-friendly name, e.g. Central Park",
      "address": "full address or place name Google Maps can understand"
    }
  ],
  "timeNote": "any time constraint mentioned, or empty string"
}

Make addresses specific enough for Google Maps to resolve.
Include city/state if mentioned or implied.
Do not include the user's home/origin unless explicitly named.
```

### Future: Claude API swap
When switching from Gemini to Claude, only `server/src/routes/parseRoute.ts` changes.
The system prompt, response shape, and everything else stays identical.

```typescript
// Replace @google/generative-ai with direct fetch:
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.CLAUDE_API_KEY!,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: input }]
  })
})
```

---

## Google Maps URL Builder

```typescript
// client/app/composables/useMapsUrl.ts
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

No geocoding. Google Maps resolves text addresses natively.

---

## Environment Variables

### client/.env
```bash
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001
# Production: https://root-ai-server.onrender.com
```

### server/.env
```bash
GEMINI_API_KEY=your_key_here
PORT=3001
CLIENT_URL=http://localhost:3000
# Production CLIENT_URL: https://root-ai.web.app
```

---

## PWA Configuration

```typescript
// client/nuxt.config.ts
pwa: {
  manifest: {
    name: 'Root AI',
    short_name: 'Root AI',
    description: 'Plan routes with natural language',
    theme_color: '#0a0a0f',
    background_color: '#0a0a0f',
    display: 'standalone',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  workbox: { navigateFallback: '/' }
}
```

---

## Design Direction

Dark, utilitarian, confident. This is a tool — fast and focused. Terminal meets maps app.

### Color Palette
```css
:root {
  --bg: #0a0a0f;
  --surface: rgba(255,255,255,0.03);
  --border: rgba(255,255,255,0.07);
  --text-primary: #ffffff;
  --text-secondary: #888888;
  --text-muted: #444444;
  --accent: #00ffb2;        /* electric green — primary CTA */
  --accent-maps: #1a73e8;   /* Google blue — Maps button only */
}
```

### Typography
- **Display / Labels**: `Syne` — geometric, technical
- **Mono / Addresses / Status**: `Space Mono`
- **Body**: `DM Sans`

### Key UI Rules
- Single-column, max-width 640px, centered
- Mobile-first — this app lives on phones
- Accent (`--accent`) for CTAs, stop numbers, pulse animations
- Maps button always `--accent-maps` for instant Google recognition
- Stops list: numbered cards, fade-in stagger on appear

---

## Deployment

### Client → Firebase Hosting
```bash
cd client
yarn generate
firebase deploy
```

### Server → Render
- Connect GitHub repo on Render
- Root directory: `server`
- Build command: `yarn build`
- Start command: `node dist/index.js`
- Add env vars in Render dashboard: `GEMINI_API_KEY`, `PORT`, `CLIENT_URL`

---

## Phases

### Phase 1 — Core (current)
- [x] Monorepo skeleton (client + server)
- [x] Express server with `/api/parse-route` placeholder
- [x] Nuxt 4 client with Pinia store and composables placeholder
- [x] Implement real Gemini call in server
- [x] Build UI components (RouteInput, StopsList, MapsButton)
- [x] End-to-end test locally
- [x] Geolocation: current position as Maps origin
- [x] Geolocation: location context sent to Gemini for accurate address resolution
- [x] Deploy client to Firebase
- [x] Deploy server to Render
- [x] Share link with first users

### Phase 2 — PWA Polish
- [ ] PWA icons (192 + 512)
- [ ] Offline fallback page
- [ ] Test "Add to Home Screen" on iOS + Android

### Phase 3 — Voice Input
- [ ] Web Speech API in RouteInput
- [ ] Mic button, transcript feeds existing parse flow

### Phase 4 — History (optional)
- [ ] Firebase Auth (Google sign-in)
- [ ] Firestore: save routes per user
- [ ] History page

### Phase 5 — AI Upgrade
- [ ] Swap Gemini for Claude API in server/src/routes/parseRoute.ts
- [ ] Update env vars

---

## What to NEVER Do

- Don't use npm — always yarn
- Don't call Gemini or Claude from the client — always go through the Express server
- Don't expose API keys in the client — they live in server/.env only
- Don't geocode manually — Google Maps resolves text addresses natively
- Don't add heavy animation libraries
- Don't add a Maps SDK — the URL scheme is enough
- Don't over-engineer Phase 1 — ship the core loop first