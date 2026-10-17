# Family Group Whisperer

Got a doubtful forward in the family WhatsApp group? Paste it (or upload the voice note), pick the sender and a language, and get:
a fact-check verdict with sources, plus three ready-to-send replies (gentle / neutral / firm) in that language. It never posts anything.

Built for the Sarvam AI Buildathon with **Saaras** (speech-to-text) and **Sarvam-105B** (fact-check + tone-calibrated replies).

**Live:** https://family-group-whisperer.vercel.app (live Sarvam mode)

## Hero flow
1. Paste a forward (or click "Use demo message") or upload a voice note.
2. Choose reply language and who sent it.
3. Get verdict (true / misleading / false / unverifiable), sources, and 3 replies. Copy one.

## Safety
AI-generated check, not an authority. Sources come from a fixed allow-list (`src/lib/sources.ts`). Nothing is stored or posted. Without an API key the app shows a MOCK badge with canned output.

## Local setup
```bash
npm install
cp .env.example .env.local   # add your SARVAM_API_KEY (optional; mock mode without it)
npm run dev                  # http://localhost:3000
```

## Env vars
| Var | Purpose |
|---|---|
| `SARVAM_API_KEY` | Sarvam key from https://dashboard.sarvam.ai. Empty => mock mode. |
| `SARVAM_BASE_URL` | Optional override (default `https://api.sarvam.ai`). |

## Tests
```bash
npm test
```
Unit tests cover JSON parsing, verdict validation, source allow-listing, reply ordering, prompt building. Smoke tests call `/api/health` and `/api/analyze` in mock mode.

## Deploy (Vercel)
Import the repo, framework Next.js, add `SARVAM_API_KEY` in Project Settings -> Environment Variables, deploy. Or `vercel --prod`.

## Status
Works: text + voice flow, mock mode, tests. Not built yet: image/screenshot intake (Sarvam Vision), Sarvam Translate pass, live web retrieval. See `PLAN.md`.
