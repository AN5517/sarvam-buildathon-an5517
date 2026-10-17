import { z } from "zod";

export const VERDICTS = ["true", "misleading", "false", "unverifiable"] as const;
export const TONES = ["gentle", "neutral", "firm"] as const;
export const SENDERS = ["uncle", "aunt", "grandparent", "cousin", "friend"] as const;

export const LANGUAGES = [
  { code: "en-IN", label: "English" },
  { code: "hi-IN", label: "हिन्दी (Hindi)" },
  { code: "mr-IN", label: "मराठी (Marathi)" },
  { code: "ta-IN", label: "தமிழ் (Tamil)" },
  { code: "te-IN", label: "తెలుగు (Telugu)" },
  { code: "bn-IN", label: "বাংলা (Bengali)" },
  { code: "gu-IN", label: "ગુજરાતી (Gujarati)" },
  { code: "kn-IN", label: "ಕನ್ನಡ (Kannada)" },
  { code: "ml-IN", label: "മലയാളം (Malayalam)" },
  { code: "pa-IN", label: "ਪੰਜਾਬੀ (Punjabi)" },
] as const;

export const LLMOutput = z.object({
  claim: z.string().min(1),
  verdict: z.enum(VERDICTS),
  reasoning: z.string().min(1),
  source_ids: z.array(z.string()).default([]),
  replies: z.array(z.object({ tone: z.enum(TONES), text: z.string().min(1) })).min(1),
});
export type LLMOutput = z.infer<typeof LLMOutput>;

export const AnalyzeInput = z.object({
  text: z.string().max(4000).default(""),
  language: z.string().default("en-IN"),
  sender: z.enum(SENDERS).default("uncle"),
});
export type AnalyzeInput = z.infer<typeof AnalyzeInput>;

export type AnalyzeResult = {
  mock: boolean;
  transcript?: string;
  claim: string;
  verdict: (typeof VERDICTS)[number];
  reasoning: string;
  sources: { id: string; name: string; url: string }[];
  replies: { tone: (typeof TONES)[number]; text: string }[];
};
