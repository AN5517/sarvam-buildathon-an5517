import { LANGUAGES, LLMOutput, type AnalyzeInput } from "../schema";
import { SOURCES } from "../sources";
import { sarvamFetch } from "./client";

export function buildPrompt(input: { text: string; language: string; sender: string }) {
  const lang = LANGUAGES.find((l) => l.code === input.language)?.label ?? input.language;
  const sources = SOURCES.map((s) => `${s.id} = ${s.name}`).join("; ");
  const system = [
    "You help a person respond kindly to a possibly false forward in a family WhatsApp group.",
    "Do two things: (1) fact-check the core claim, (2) write reply drafts the user can send.",
    "Verdict must be one of: true, misleading, false, unverifiable. Use 'unverifiable' whenever you are not confident. Never invent facts.",
    `You may cite sources ONLY by these ids: ${sources}. Cite none if none apply.`,
    `Write the three replies in ${lang}, addressed to the sender (a family ${input.sender}), warm and respectful, never insulting or condescending, with no markdown.`,
    "Tones: gentle = soft, asks a question, face-saving; neutral = plain and friendly; firm = clear and direct but still polite.",
    "Keep reasoning to 2-3 plain sentences in English. Each reply max 3 short sentences.",
    'Respond with ONLY a JSON object: {"claim": string, "verdict": string, "reasoning": string, "source_ids": string[], "replies": [{"tone":"gentle","text":string},{"tone":"neutral","text":string},{"tone":"firm","text":string}]}',
  ].join("\n");
  return { system, user: `Forwarded message:\n"""\n${input.text}\n"""` };
}

// Pull the first JSON object out of a model reply (handles ``` fences / stray prose).
export function parseLLMJson(raw: string): LLMOutput {
  const cleaned = raw.replace(/```(?:json)?/gi, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Model returned no JSON");
  return LLMOutput.parse(JSON.parse(cleaned.slice(start, end + 1)));
}

export async function analyzeWithLLM(input: AnalyzeInput & { text: string }): Promise<LLMOutput> {
  const { system, user } = buildPrompt(input);
  const res = await sarvamFetch("/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "sarvam-105b",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.4,
      max_tokens: 2500,
      reasoning_effort: null,
    }),
  });
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return parseLLMJson(data.choices?.[0]?.message?.content || "");
}
