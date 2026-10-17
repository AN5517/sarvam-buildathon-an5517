# Master Prompt — Buildathon: Judge, Spec, Build, Test, Deploy

Paste everything between the two rules below as your first message to Claude (Claude Code, Cursor, or any local coding agent). Before you do, put the files listed in "Folder setup" at the very bottom into the same working folder.

---

## THE PROMPT (copy from here)

**ROLE.** You are a senior full-stack engineer and a sharp hackathon judge. You make decisions, you write production-quality but minimal code, and you ship working software — you do not produce plans and stop.

**CONTEXT.** I am competing in an AI buildathon. I started from an idea library of ~50 product ideas (in `Idea_Library_Sarvam.xlsx`) and narrowed it to five candidate concepts, each written up as a full proposal in `Buildathon_Idea_Proposals.md`. Those five are:

1. **Family Group Whisperer** — helps you answer misinformation in family WhatsApp groups in the sender's own tone and language.
2. **Medical Gaslighting Detector** — a voice-first symptom journal that finds the pattern a rushed consult misses and compiles a one-page evidence brief for the doctor.
3. **Scam Shield for Parents** — a consent-first companion that detects scam calls to elderly parents and intervenes in their language.
4. **Loan Shark Defuser** — records harassment by recovery agents, flags rights violations, and drafts a complaint.
5. **Argument Replay** — with both partners' consent, replays an argument fairly, names the underlying issue, and drafts reconnection messages.

The stack is centred on Sarvam's APIs: **Saaras** (speech-to-text), **Bulbul** (text-to-speech), **Sarvam-105B** (LLM reasoning/generation), **Sarvam Vision** (document/image understanding), **Sarvam Translate** (translation). Read the proposal file for the full detail on each.

**PURPOSE.** Pick the single best idea for a buildathon, then take it end-to-end: expand it into specs, a staged build plan, a deployment plan and a todo list, then actually build a very simple but working prototype, add basic tests, deploy it to Vercel, and push it to a new public GitHub repo. I want a live URL and a public repo at the end, not a design doc.

**WORK IN THESE PHASES, IN ORDER.**

**Phase 0 — Read and orient.** Read `Buildathon_Idea_Proposals.md` and `Idea_Library_Sarvam.xlsx`. Confirm in 2–3 lines which five ideas you're judging.

**Phase 1 — Judge and choose.** Score all five against this rubric (1–5 each, then a one-line rationale per idea):
- *Impact* — how real and how large is the problem?
- *Demoability* — can a stranger understand the win in 60 seconds?
- *Feasibility* — can a working prototype be finished in the time I have (assume a hackathon-scale window)?
- *Uniqueness* — is it more than a thin wrapper over an off-the-shelf model?
- *Safety/ethics* — can it be built responsibly (consent, disclaimers)?
- *Stack fit* — does it showcase Sarvam's voice/multilingual/document strengths?

Then **choose exactly one.** State it in one line, then give 3–5 bullets on why it won and why the runners-up lost. Commit to it — do not hedge or present options for me to pick.

**Phase 2 — Spec.** Write a concise spec for the chosen idea:
- Problem statement and the single core value proposition.
- The one hero user flow (start to finish) that the demo will show.
- **MVP scope** (must-have) vs **explicitly out of scope** (everything else). Be ruthless: the MVP must be buildable and demoable.
- Any safety/consent/disclaimer requirements that are non-negotiable for this idea (e.g. "documentation aid, not diagnosis"; consent gates for recording).

**Phase 3 — Architecture, pipeline and deployment plan.** Write:
- The system architecture (components, data flow, where each Sarvam API is called).
- The request pipeline for the hero flow, step by step.
- The tech stack (default: Next.js + TypeScript + Tailwind, API routes for the backend, deployed on Vercel — deviate only if there's a strong reason, and say why).
- The deployment plan: env vars, Vercel project setup, build command, GitHub repo structure.
- Data/privacy notes: what is stored, where, and how it's deleted.

**Phase 4 — Staged build plan and todo.** Break the build into ordered milestones, each independently runnable (e.g. M1 skeleton + UI, M2 wire the first Sarvam call, M3 hero flow end-to-end, M4 tests, M5 deploy + repo). Give a checkbox todo list covering every task. Write these into `PLAN.md` in the repo root.

**Phase 5 — Build the prototype.** Now build it. Keep it minimal but real and running. Rules:
- **Never hardcode secrets.** Read all keys from environment variables. Ship a `.env.example` listing every variable with placeholder values, and make sure `.env` is in `.gitignore`.
- **Degrade gracefully without keys.** If a Sarvam API key is missing, fall back to a clearly-labelled mock so the app and demo still run end-to-end. Never crash on a missing key.
- Follow the architecture from Phase 3. Keep files small and readable. Commit as you go with clear messages.
- If you hit a genuine blocker (missing tool, missing credential, an ambiguity that changes the build), ask me exactly one focused question, then continue.

**Phase 6 — Tests.** Add basic tests: at least one unit test for the core logic and one smoke test (e.g. a health endpoint or a mocked end-to-end call of the hero flow). Make `npm test` (or the stack's equivalent) pass, and record how to run them in the README.

**Phase 7 — Deploy and publish.**
- Initialise a git repo, create a **public** GitHub repo (e.g. via `gh repo create <name> --public --source=. --push`), and push the code.
- Deploy to Vercel (via the Vercel CLI, or by connecting the repo). Set the env vars in the Vercel project. Get a **production URL**.
- Verify the live URL actually loads and the hero flow works (mocked is fine if keys aren't set in prod).

**Phase 8 — Handoff.** Write a `README.md` with: what it does, the hero flow, local setup, env vars, test commands, deployment notes, and the live URL. End your run with a short summary: the idea chosen, the live URL, the repo URL, what works, what's mocked, and what you'd do next.

**HARD RULES.**
- Prefer finishing a small, working, deployed thing over a large, unfinished one.
- No secrets in code, commits, or logs — ever.
- Keep the safety framing from the proposal in the actual product (disclaimers, consent gates, "not medical/legal advice" where relevant).
- Write in plain, direct language. No filler.
- Do not stop at a plan. Keep going until the prototype is built, tested, deployed, and pushed.

**DEFINITION OF DONE.** All of these are true:
1. A chosen idea, justified, committed to.
2. `PLAN.md` with spec, architecture, pipeline, deployment plan, and a todo list.
3. A working prototype in the repo that runs locally.
4. Basic tests passing.
5. A public GitHub repo with the code pushed.
6. A live Vercel production URL that loads.
7. A `README.md` and a `.env.example`; no secrets committed.

## (end of prompt)

---

## Folder setup — keep these files together

Put all of these in the same folder before you start the agent:

| File | Why it's needed |
|---|---|
| `Idea_Library_Sarvam.xlsx` | The original idea library — background context for the judge. |
| `Buildathon_Idea_Proposals.md` | The five proposals the agent judges and builds from. **Essential.** |
| `buildathon_master_prompt.md` | This file — paste its contents as the first message. |

That's the minimum. The agent needs nothing else to start.

## Credentials and tools to have ready (not files — just access)

Have these set up so the agent can deploy and publish without stalling:

- **Sarvam API key(s)** — for Saaras / Bulbul / Sarvam-105B / Sarvam Vision / Sarvam Translate. You'll paste these into `.env` locally and into Vercel's env settings; the agent must never commit them.
- **GitHub** — a GitHub account, authenticated for the CLI (`gh auth login`) so it can create the public repo and push.
- **Vercel** — a Vercel account, logged in via the CLI (`vercel login`) or ready to connect the GitHub repo in the dashboard.
- **Local toolchain** — Node.js and npm (for the default Next.js stack), plus `git`. `gh` and `vercel` CLIs if you want the agent to automate deploy/publish; otherwise it will hand you the steps.

## Optional

- If you use **Claude Code**, you can additionally save the prompt's Phase 0–8 instructions as `CLAUDE.md` in the project folder so the agent re-reads the context automatically on every run. Not required, but convenient.
