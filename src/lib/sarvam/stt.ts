import { sarvamFetch } from "./client";

// Saaras speech-to-text (REST, up to 30s of audio).
export async function transcribe(audio: File): Promise<string> {
  const form = new FormData();
  form.append("file", audio, audio.name || "voice-note.ogg");
  form.append("model", "saaras:v4");
  form.append("mode", "transcribe");
  const res = await sarvamFetch("/speech-to-text", { method: "POST", body: form });
  const data = (await res.json()) as { transcript?: string };
  return (data.transcript || "").trim();
}

export const MOCK_TRANSCRIPT =
  "[MOCK transcript] Beta, forward kar do sabko — WhatsApp kal se har mahine ₹99 charge karega, nahi to account band ho jayega.";
