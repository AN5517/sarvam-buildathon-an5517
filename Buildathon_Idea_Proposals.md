# Buildathon Proposal Pack — 5 Candidate Ideas

Five ideas, each written up as a shippable hackathon proposal: the problem, what to build, the MVP vs the stretch, the tech stack, the demo, and the risks. Each ends with a feasibility read so you and your judge can pick one and start coding.

A note that applies to all five: several of these touch sensitive areas (medical, legal, recording of conversations). Every proposal below is framed as a **documentation / decision-support / awareness tool**, not a substitute for a doctor, a lawyer, or a therapist, and each one is designed **consent-first**. Build that framing into the product and the pitch — it is also what makes these ideas defensible and impressive rather than gimmicky.

---

## Proposal 1 — Family Group Whisperer

**One-line pitch:** A private assistant that helps you answer misinformation in the family WhatsApp group *in the sender's own tone and language*, so the correction lands instead of starting a war.

### The problem
Family WhatsApp is one of India's biggest misinformation vectors — fake health cures, invented government schemes, communal forwards, "WhatsApp is charging ₹99" panics. The hard part is not detecting the nonsense; it is the **social cost of correcting it**. Most people either stay silent or post a blunt fact-check that insults an elder and starts a fight. So the misinformation spreads, and the person who knows better does nothing.

### Why now / why AI
LLMs already fact-check. The missing and genuinely hard piece is **register control** — producing a reply calibrated to *who sent it* (uncle, aunt, cousin), *their dialect*, and *the right level of directness* (gentle nudge vs firm correction), with a credible source attached. That is exactly what a modern LLM is good at, and what a human finds exhausting to get right.

### What it does
1. You forward the suspicious message (text, image, or voice note) to the tool.
2. It extracts the core claim, checks it against credible sources, and returns a verdict band — **true / misleading / false / unverifiable** — with links.
3. It generates **2–3 ready-to-send replies** in the chosen language, each with a different tone: *gentle*, *neutral*, *firm*.
4. You copy the one you like. **It never posts automatically.**

### Hackathon MVP (must-have)
- Input: pasted text, a forwarded voice note, or a forwarded image.
- Claim extraction → verdict + 3 tone-calibrated reply drafts in a selectable Indian language.
- Handle voice notes (speech-to-text) and image forwards (OCR) so the demo covers all three message types.
- A simple web UI. No auto-posting, no group access.

### Stretch (v2)
- Auto-detect the language and the sender's likely relationship from context.
- A small curated fact-source library (PIB Fact Check, WHO, official portals) for grounded verdicts.
- Deepfake / manipulated-image hints on forwarded media.
- "Group temperature" model that learns what phrasing actually works in *your* family.

### Tech stack (Sarvam-mapped)
- **Sarvam-105B** — claim analysis, verdict reasoning, and the tone-calibrated reply generation (the core of the product).
- **Saaras** — transcription of forwarded voice notes.
- **Sarvam Vision** — reading forwarded images / screenshots / posters.
- **Sarvam Translate** — cross-language rendering of the reply.
- Retrieval over a small fact-source set for citations.

### Architecture sketch
`Forward (text/voice/image) → normalise (Saaras / Vision) → claim extract + retrieve evidence → verdict → tone-calibrated reply generator → user copies`. Stateless per request; no access to the user's actual groups.

### Privacy & legal
- The user **manually forwards** — the tool never reads a group, never stores other people's messages, and never posts.
- Keep it local-first if possible. No account scraping.

### Demo script (3 minutes)
Forward a fake "WhatsApp will charge ₹99/month" message → show the verdict with a source → show three replies, one of them a warm Marathi note addressed to an uncle → copy and send live.

### Why it wins
Uniquely Indian, emotionally real, and it showcases the *hard* capability (register + multilingual + multimodal) rather than a generic fact-check API. Judges see a human problem solved with taste.

### Risks & mitigations
- **Fact-check accuracy.** Frame as "here's what credible sources say," always with links, and use a "misleading / unverifiable" band rather than binary true-false.
- **"It's just a wrapper."** The tone/register engine and multimodal intake are the differentiators — make them the demo centrepiece.

### Feasibility: **High** — text-first MVP is a weekend build; the wow is in the tone engine, not infrastructure.

---

## Proposal 2 — Medical Gaslighting Detector

**One-line pitch:** A voice-first symptom journal that logs how a patient feels over weeks, finds the pattern a rushed consult misses, and compiles a one-page evidence brief they hand to the next doctor.

### The problem
Chronic and "invisible" conditions — endometriosis, thyroid, autoimmune disease, fibromyalgia, chronic pain — take **years** to diagnose. Consults last about seven minutes; patients cannot recall specifics; symptoms get attributed to stress and dismissed. Women and low-income patients are dismissed the most. The patient leaves with nothing to show for months of suffering.

### Why now / why AI
A voice diary removes the typing barrier and works in any language. An LLM can do what a rushed doctor cannot: read **months** of entries at once, find frequency and trigger patterns, and turn them into a clinically structured summary — timeline, frequency table, triggers, red flags, and the exact questions to ask.

### What it does
1. A short daily/weekly **voice check-in**: how you feel, where it hurts, sleep, food, meds, energy.
2. Speech-to-text transcribes; the LLM structures each entry into a symptom record.
3. Over time: **frequency charts, trigger correlations, flare patterns.**
4. On demand: a one-page **patient evidence brief** — chief complaint, timeline, frequency table, red flags, questions for the doctor — in English plus the patient's language.

### Hackathon MVP (must-have)
- Voice-in → structured symptom entries (persisted).
- A timeline/frequency view that visibly shows a pattern.
- One-click generation of a one-page brief (PDF), readable aloud.
- Seed with ~20–30 synthetic entries so the demo shows a *pattern found*, not an empty app.

### Stretch (v2)
- Photo-of-medication intake; wearable/sleep import.
- Doctor-facing view with side-by-side raw quotes.
- Gentle triage flags ("this pattern warrants urgent review").

### Tech stack (Sarvam-mapped)
- **Saaras** — multilingual speech-to-text for the diary.
- **Sarvam-105B** — structuring entries, pattern-finding, and brief generation.
- **Bulbul** — spoken check-in prompts and reading the brief back to the patient.
- **Sarvam Vision** — optional: reading medication strips / old prescriptions.
- PDF generation for the brief.

### Architecture sketch
`Voice check-in → Saaras → structured record (DB) → pattern engine over history → on-demand brief generator → PDF + audio`. Long-term history is the moat; build the entry loop cleanly.

### Privacy & legal — important
- **Not a diagnostic tool.** It is a *documentation and communication aid*. Say this in the UI, the pitch, and the disclaimer: "We do not diagnose. We help you be heard."
- Health data is sensitive: local storage or explicit consent, encryption, easy deletion.

### Demo script
Show six weeks of voice entries → the tool surfaces "headaches cluster two days before the period, rated 8/10, repeatedly logged as 'stress'" → generates the brief → reads it aloud in Hindi.

### Why it wins
High empathy, obvious social impact, and a genuinely novel angle — **patient agency through longitudinal data**, not another symptom chatbot. Very buildable.

### Risks & mitigations
- **Medical-claims sensitivity.** Stay strictly on documentation and communication; never output a diagnosis or treatment.
- **"Empty app" demo risk.** Pre-seed history so the pattern-finding is visible in the first 30 seconds.

### Feasibility: **High–Medium** — voice + LLM + PDF is a clean weekend build; the craft is in the brief's clinical structure.

---

## Proposal 3 — Scam Shield for Parents

**One-line pitch:** A real-time companion that listens (with consent) to calls to elderly parents, detects scam patterns, and cuts in — in their language and dialect, with the calm of a relative.

### The problem
"Digital arrest," fake KYC, lottery, and "your son is in trouble" scams are draining Indian elders' savings. The call usually comes when they are **alone and panicked**, and the scammer's script specifically tells them not to contact family. By the time anyone finds out, the money is gone.

### Why now / why AI
Streaming speech-to-text, a fast classifier, and text-to-speech can now run a live "guardian" that recognises the scam *script* mid-call and intervenes before the transfer — something that was not feasible even a year or two ago.

### What it does
1. Runs on or around the parent's phone (companion app / overlay), with the parent's **explicit consent**.
2. Transcribes the call in real time and classifies escalating risk: mentions of police/CBI/arrest, "urgent transfer," OTP, screen-share, "don't tell your family."
3. On crossing a threshold: a calm voice and on-screen alert **in the parent's language** — "This is a scam. Do not share the OTP. I am calling your son now." — and a notification to family.

### Hackathon MVP (must-have)
- Ingest a **live or simulated** audio stream; detect scam intent and fire the intervention.
- Demo with a scripted scam call played into the system **plus a benign call as a control** (to show it doesn't cry wolf).
- A family notification (SMS/WhatsApp-style) and a spoken intervention clip.

### Stretch (v2)
- On-device inference; a real phone overlay; auto-call family; number flagging; one-tap report to the cybercrime portal.

### Tech stack (Sarvam-mapped)
- **Saaras** (streaming) — real-time transcription.
- **Sarvam-105B** — risk classification (hybrid: rules for hard signals like "OTP"/"CBI" + LLM for intent) and intervention phrasing.
- **Bulbul** — the spoken intervention in the parent's language.
- Few-shot / light fine-tune on known scam transcripts.

### Architecture sketch
`Audio stream → Saaras (streaming) → risk classifier (rule + LLM) → threshold → Bulbul intervention + family alert`. Keep a hard "confidence gate" so low-confidence never triggers an alert.

### Privacy & legal — important
- **Consent-first, non-negotiable.** In India, recording a call you are a party to is generally permissible, but listening to *someone else's* call raises consent and privacy issues. The parent must install and consent; or use a consensual three-way "guardian line." State this openly — it is a strength, not a footnote.
- Frame as **advisory**, never as something that silently blocks a call.

### Demo script
Play a "digital arrest" script → the system flags at "CBI officer" + "transfer ₹50,000 now" → the intervention fires in Tamil and a family alert appears. Then play a normal call → nothing fires.

### Why it wins
Visceral and timely (digital arrest is a national crisis), technically meaty (streaming STT + classification + TTS in a live loop), and emotionally compelling to any judge with parents.

### Risks & mitigations
- **Latency.** Streaming must feel instant; prototype on short streams and cache aggressively.
- **False positives.** A hard confidence threshold and an "advisory" framing protect the experience.
- **Live-overlay complexity.** MVP can be stream/file-based detection; the overlay is stretch.

### Feasibility: **Medium** — the MVP (stream-in → detect → intervene) is very doable; the live on-device overlay is the ambitious part.

---

## Proposal 4 — Loan Shark Defuser

**One-line pitch:** A shield for people harassed by predatory lenders and recovery agents — it records the call, tells them their rights as it happens, and drafts the complaint.

### The problem
Predatory digital-lending apps and informal recovery agents harass borrowers with abusive calls, contact-bombing, and threats — practices that violate fair-practice norms and RBI's digital-lending framework. Borrowers often don't know their rights, don't know where to complain, and are too ashamed or scared to act.

### Why now / why AI
Real-time speech-to-text plus an LLM that knows the regulatory playbook can do two things at once: coach the borrower **in the moment** and produce a **filing-ready complaint** from the transcript — turning an intimidating, opaque process into a guided one.

### What it does
1. **During a call:** transcribes, flags abusive or illegal tactics, and feeds the user discreet prompts ("You can demand a written statement," "They may not call outside permitted hours," "This is harassment — note the time").
2. **After a call:** generates a structured complaint (RBI Sachet / consumer forum / cybercrime) with a timestamped, transcript-based evidence log.
3. A quiet **"rights card"** mode for when there's no live call.

### Hackathon MVP (must-have)
- Ingest a recording of a call the user is a party to.
- Detect violations against a small, cited rule set.
- Draft a structured complaint (PDF) with the evidence log and timestamps.
- A "rights card" screen with plain-language rights and the escalation ladder.

### Stretch (v2)
- Live coaching during the call; a case tracker; anonymised pattern data on which lenders are worst; automated escalation.

### Tech stack (Sarvam-mapped)
- **Saaras** — transcription.
- **Sarvam-105B** — violation detection and complaint drafting, grounded in a curated RBI digital-lending knowledge base.
- **Bulbul** — optional spoken rights card.
- PDF generation for the complaint.

### Architecture sketch
`Call recording → Saaras → violation detector (rule set + LLM) → complaint generator → PDF`. Ground every flag in a cited clause so the output is defensible.

### Privacy & legal — important
- **Not legal advice.** Present it as information that helps the user act, and point them to a lawyer / consumer forum for anything serious.
- Recording must be a call the user is a party to (generally lawful in India) — make consent and legality explicit in the UI.

### Demo script
Play an abusive recovery call → the system flags the violations with timestamps → produces a complaint PDF the user could file, plus the rights card.

### Why it wins
Empowering and niche with a real legal-tech edge, a clear villain (predatory recovery), and a tangible artifact (the complaint). Highly buildable and easy to demo.

### Risks & mitigations
- **Legal accuracy.** Keep the rule set small, cited, and conservative; never overclaim.
- **Live coaching difficulty.** Post-call MVP carries the demo; live is stretch.

### Feasibility: **High–Medium** — the post-call MVP is straightforward; live coaching is the stretch.

---

## Proposal 5 — Argument Replay

**One-line pitch:** With both partners' consent, record an argument; the tool replays it fairly, names the actual underlying issue, and drafts the apology neither of you wants to write.

### The problem
Couples' fights spiral because both people are defending, nobody is listening, and the *real* issue — usually not the stated one — gets buried. By the time anyone cools down, the specifics are gone and the hurt has calcified. The thing humans cannot do mid-fight is hold both perspectives at once.

### Why now / why AI
An LLM can do exactly that: separate the trigger from the issue, reflect each side without judgement, and produce neutral language both people can accept. This is a perspective-taking task, and it's what LLMs are unusually good at.

### What it does
1. Both partners consent; they record the argument — **or**, in a calmer mode, each records their own side separately.
2. The tool produces: a fair two-column replay (what each said, no judgement), the **stated topic vs the underlying issue**, the emotional need each person expressed, and **2–3 draft reconnection messages / apologies** in each person's tone.
3. It never assigns blame. It is a de-escalation aid, not a verdict.

### Hackathon MVP (must-have)
- **"Each says their side" mode** — both partners speak or type their version (this sidesteps live-recording consent mess for the demo).
- Output: neutral replay + underlying-issue analysis + two suggested messages.
- Optional spoken playback.

### Stretch (v2)
- Live both-consent recording; recurring-pattern tracking ("you fight about this every month"); a "cooling-off" timer; a shared history view.

### Tech stack (Sarvam-mapped)
- **Saaras** — transcription of each side.
- **Sarvam-105B** — perspective-taking, neutral framing, and message drafting (the core).
- **Bulbul** — optional spoken playback.

### Architecture sketch
`Two inputs (voice/text) → Saaras → neutral replay + issue analysis → message drafts → display`. Fully stateless; nothing shared beyond the session unless both consent.

### Privacy & legal — important
- **Consent of both parties is non-negotiable**, and recording without it is illegal. Build a consent gate into the product itself.
- **Not therapy.** For serious or unsafe situations, the tool should signpost professional help rather than mediate.

### Demo script
Two scripted "sides" → the neutral replay → "the fight about the dishes was really about feeling unappreciated" → two draft messages, one in each partner's voice.

### Why it wins
Emotionally compelling and immediately demoable, and it shows off the LLM's perspective-taking rather than a generic summariser. Distinct from every "meeting notes" app.

### Risks & mitigations
- **Can feel gimmicky or invasive.** The "each says their side" mode plus consent-first design keeps it tasteful.
- **Safety.** Add a clear "if there is abuse or danger, this tool is not the answer — here are real resources" path.

### Feasibility: **High** — voice/text in, structured output out; very buildable and quick to polish.

---

## How to choose (decision aid for the judge)

| Idea | Build risk | Demo wow | Social impact | Uniqueness | Best if you want… |
|---|---|---|---|---|---|
| Family Group Whisperer | Low | High | High | High | A polished, low-risk build with a hard-to-copy "tone engine" |
| Medical Gaslighting Detector | Low–Med | High | Very high | Very high | An empathy-driven story with a clean PDF artifact |
| Scam Shield for Parents | Med | Very high | Very high | High | A technically impressive live streaming demo |
| Loan Shark Defuser | Low–Med | Med–High | High | High | A legal-tech angle with a filing-ready output |
| Argument Replay | Low | Med–High | Med | High | The fastest build with the most novel LLM capability on display |

Quick guidance:
- **Want maximum polish with minimum risk?** Family Group Whisperer.
- **Want the strongest human story?** Medical Gaslighting Detector.
- **Want the most impressive live tech moment?** Scam Shield for Parents.
- **Want the fastest path to a working demo?** Argument Replay.

Whatever you pick, the winning move in all five is the same: pick **one** core capability and make it undeniably good in the demo, rather than spreading thin across the stretch features.
