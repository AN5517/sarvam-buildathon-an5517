import type { LLMOutput } from "../schema";

// Clearly-labelled canned output used when SARVAM_API_KEY is not set.
export function mockAnalysis(language: string, sender: string): LLMOutput {
  const hi = language !== "en-IN";
  return {
    claim: "WhatsApp will start charging ₹99 per month, or accounts will be deleted.",
    verdict: "false",
    reasoning:
      "[MOCK] WhatsApp has repeatedly stated it is free to use and does not charge subscriptions. Chain messages like this are a common hoax; official announcements come only via WhatsApp's own channels.",
    source_ids: ["whatsapp", "pib"],
    replies: [
      {
        tone: "gentle",
        text: hi
          ? `[MOCK ${language}] Pranam ${sender} ji, maine bhi ye padha tha, par WhatsApp ki official site pe dekha to kahin charge ka zikr nahi tha. Ek baar saath mein check karein?`
          : `[MOCK] Hi ${sender}, I got this one too, but when I checked WhatsApp's own help page there was nothing about charges. Shall we look at it together before forwarding?`,
      },
      {
        tone: "neutral",
        text: hi
          ? `[MOCK ${language}] Ye message purana hoax hai. WhatsApp ne clearly kaha hai ki wo free rahega. Forward karne se pehle official page dekh lena achha rahega.`
          : "[MOCK] This one is an old hoax — WhatsApp has said it stays free. Worth checking the official page before we forward it on.",
      },
      {
        tone: "firm",
        text: hi
          ? `[MOCK ${language}] Please ye message aage forward mat kijiye — ye jhooth hai. WhatsApp koi ₹99 charge nahi leta. Source: WhatsApp Help Center.`
          : "[MOCK] Please don't forward this — it's false. WhatsApp isn't charging ₹99. Source: WhatsApp Help Center.",
      },
    ],
  };
}
