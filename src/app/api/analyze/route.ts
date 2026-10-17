import { AnalyzeInput } from "@/lib/schema";
import { runPipeline } from "@/lib/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_AUDIO_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const parsed = AnalyzeInput.safeParse({
      text: String(form.get("text") ?? ""),
      language: String(form.get("language") ?? "en-IN"),
      sender: String(form.get("sender") ?? "uncle"),
    });
    if (!parsed.success) return Response.json({ error: "Invalid input." }, { status: 400 });

    const audio = form.get("audio");
    const file = audio instanceof File && audio.size > 0 ? audio : null;
    if (file && file.size > MAX_AUDIO_BYTES) {
      return Response.json({ error: "Voice note too large (max 5 MB)." }, { status: 413 });
    }

    const result = await runPipeline(parsed.data, file);
    return Response.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Something went wrong.";
    const status = msg.startsWith("Provide a message") ? 400 : 502;
    console.error("analyze failed:", msg.slice(0, 200));
    return Response.json({ error: status === 400 ? msg : "The AI service failed. Please try again." }, { status });
  }
}
