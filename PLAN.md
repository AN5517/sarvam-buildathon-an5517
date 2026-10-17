# PLAN — Family Group Whisperer

## Chosen idea
**Family Group Whisperer**, picked from 5 candidates (scores out of 30: Whisperer 28, Medical Gaslighting 24, Scam Shield 24, Loan Shark 22, Argument Replay 21).
Why: stateless (fits Vercel, no DB), safe (nothing posted, nothing stored), uses Sarvam voice + LLM + multilingual in one 60-second demo.
Runners-up lost on build risk (live streaming, persistence + PDF, legal rule base) or being a thinner wrapper (Argument Replay).

## Spec
- **Problem:** correcting misinformation in family WhatsApp groups is socially costly, so people stay silent.
- **Value:** a fact-check with sources plus 3 replies (gentle / neutral / firm) in the sender's language.
- **Hero flow:** paste a forward or upload a voice note -> pick language + who sent it -> verdict (true / misleading / false / unverifiable) + sources -> copy a reply.
- **MVP:** text + voice note input, 10 Indian languages, 4-band verdict, 3 tones, curated source allow-list, mock mode without a key.
- **Out of scope:** auto-posting, group access, accounts, storage, image/OCR intake (Sarvam Vision is an async job API; planned next), deepfake detection, live web retrieval.
- **Non-negotiable safety:** never posts; manual forward only; "AI-generated, check sources" banner; `unverifiable` is a first-class verdict; MOCK badge when no key; nothing stored.

## Architecture
Next.js (App Router, TS, Tailwind) on Vercel. Stateless API routes.
- `POST /api/analyze` (multipart: text, audio, language, sender); `GET /api/health`.
- Pipeline (`src/lib/pipeline.ts`): audio -> Saaras `saaras:v4` `/speech-to-text` -> text -> `sarvam-105b` `/v1/chat/completions` (one JSON call: claim, verdict, reasoning, source ids, 3 replies in target language) -> zod validation -> drop non-allow-listed sources -> response.
- `src/lib/sarvam/*`: client (key from env), stt, llm, mock. Missing/placeholder key => mock mode (`mock: true`).
- Env: `SARVAM_API_KEY` (optional `SARVAM_BASE_URL`).
- Privacy: audio/text handled in memory only, 5 MB cap, never persisted or logged.

## Deployment
GitHub `AN5517/sarvam-buildathon-an5517` (public) -> Vercel project, framework Next.js, build `next build`, env `SARVAM_API_KEY`.

## Milestones / todo
- [x] M1 Scaffold Next.js + TS + Tailwind + Vitest, `.env.example`, `.gitignore`
- [x] M2 Sarvam clients (STT, LLM) with mock fallback, `/api/health`
- [x] M3 Hero flow UI end-to-end (text + voice, language/sender, verdict, copy)
- [x] M4 Tests: 6 unit + 2 smoke (`npm test`)
- [x] M5 README + PLAN
- [ ] M6 Push to public GitHub
- [ ] M7 Deploy to Vercel, set env, verify live URL
- [ ] M8 Test with a real Sarvam key (live mode)
