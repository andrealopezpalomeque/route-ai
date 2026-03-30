# Route AI

A natural language route planner progressive web app. Describe where you need to go in plain language — the AI extracts and orders your stops, then opens Google Maps with everything pre-filled.

**Live**: https://routeai.tech

---

## How it works

The AI acts as a translator between human language and Google Maps input. You type or speak a casual description of your trip; the server sends it to Gemini, which returns a structured list of stops in the most logical order. Google Maps receives clean addresses — it never has to understand natural language.

```
User types: "I need to pick up dry cleaning, grab coffee at Blue Bottle, and drop off a package at the post office"
        ↓
Gemini extracts and orders stops
        ↓
Google Maps opens with three pre-filled waypoints
```

---

## Stack

**Client** — Nuxt 4 (Vue 3), Tailwind CSS, Pinia, PWA via `@vite-pwa/nuxt`

**Server** — Express + TypeScript, Gemini via `@google/generative-ai`

**Deployment** — Firebase Hosting (client), Render (server)

---

## Monorepo structure

```
root-ai/
├── client/                    # Nuxt 4 PWA
│   └── app/
│       ├── components/route/  # RouteInput, StopsList, MapsButton
│       ├── composables/       # useRouteParser, useMapsUrl, useVoiceInput
│       ├── pages/index.vue
│       └── stores/route.ts
└── server/                    # Express API
    └── src/
        ├── index.ts
        └── routes/parseRoute.ts   # POST /api/parse-route → Gemini → stops[]
```

---

## Getting started

**Requirements**: Node.js, yarn

```bash
# Install all dependencies
yarn install

# Copy env files
cp client/.env.example client/.env
cp server/.env.example server/.env
# Fill in GEMINI_API_KEY and other values

# Run both client and server
yarn dev
```

Client runs on `http://localhost:3000`, server on `http://localhost:3001`.

---

## Environment variables

**client/.env**
```
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

**server/.env**
```
GEMINI_API_KEY=your_key_here
PORT=3001
CLIENT_URL=http://localhost:3000
```

---

## API

### POST /api/parse-route

**Request**
```json
{ "input": "Pick up groceries, then swing by the pharmacy and the bank" }
```

**Response**
```json
{
  "stops": [
    { "label": "Grocery Store", "address": "Whole Foods, 123 Main St, City, State" },
    { "label": "Pharmacy",      "address": "CVS Pharmacy, 456 Oak Ave, City, State" },
    { "label": "Bank",          "address": "Chase Bank, 789 Elm St, City, State" }
  ],
  "timeNote": ""
}
```

---

## Features

- Natural language input — type or speak your trip in plain English, Spanish, or any language
- Voice input via Web Speech API
- Geolocation support — current position used as Maps origin
- Multilingual — stop labels returned in the user's language, addresses always Maps-compatible
- PWA — installable on iOS and Android, offline fallback page
- No geocoding — Google Maps resolves text addresses natively

---

## Deployment

**Client** (Firebase Hosting)
```bash
cd client
yarn generate
firebase deploy
```

**Server** (Render)

Connect the GitHub repo on Render, set root directory to `server`, build command `yarn build`, start command `node dist/index.js`. Add `GEMINI_API_KEY`, `PORT`, and `CLIENT_URL` in the Render dashboard — it auto-deploys on push.

---

## Design

Dark, utilitarian, confident. Single-column, mobile-first. Primary accent is electric green (`#00ffb2`); the Maps button uses Google blue (`#1a73e8`) for instant recognition. Typography: Syne for display, Space Mono for addresses and status, DM Sans for body.
