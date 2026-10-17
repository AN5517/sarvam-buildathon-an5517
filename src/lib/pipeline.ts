import { TONES, type AnalyzeInput, type AnalyzeResult, type LLMOutput } from "./schema";
import { resolveSources } from "./sources";
import { hasKey } from "./sarvam/client";
import { analyzeWithLLM } from "./sarvam/llm";
import { mockAnalysis } from "./sarvam/mock";
import { MOCK_TRANSCRIPT, transcribe } from "./sarvam/stt";

// Turn raw model output into the response: allow-listed sources only, tone order fixed.
export function finalize(out: LLMOutput, mock: boolean, transcript?: string): AnalyzeResult {
  const replies = TONES.flatMap((t) => out.replies.filter((r) => r.tone === t).slice(0, 1));
  return {
    mock,
    transcript,
    claim: out.claim,
    verdict: out.verdict,
    reasoning: out.reasoning,
    sources: resolveSources(out.source_ids),
    replies,
  };
}

export async function runPipeline(input: AnalyzeInput, audio?: File | null): Promise<AnalyzeResult> {
  const live = hasKey();
  let text = input.text.trim();
  let transcript: string | undefined;

  if (audio && audio.size > 0) {
    transcript = live ? await transcribe(audio) : MOCK_TRANSCRIPT;
    text = text ? `${text}\n${transcript}` : transcript;
  }
  if (!text) throw new Error("Provide a message or a voice note.");

  if (!live) return finalize(mockAnalysis(input.language, input.sender), true, transcript);
  const out = await analyzeWithLLM({ ...input, text });
  return finalize(out, false, transcript);
}
