import { beforeEach, describe, expect, it } from "vitest";
import { parseLLMJson, buildPrompt } from "../src/lib/sarvam/llm";
import { finalize, runPipeline } from "../src/lib/pipeline";
import { resolveSources } from "../src/lib/sources";
import { GET as health } from "../src/app/api/health/route";
import { POST as analyze } from "../src/app/api/analyze/route";

beforeEach(() => {
  delete process.env.SARVAM_API_KEY; // force mock mode
});

const sample = {
  claim: "c",
  verdict: "false",
  reasoning: "r",
  source_ids: ["pib", "made-up", "PIB"],
  replies: [
    { tone: "firm", text: "f" },
    { tone: "gentle", text: "g" },
    { tone: "neutral", text: "n" },
  ],
};

describe("core logic", () => {
  it("parses JSON wrapped in code fences and prose", () => {
    const out = parseLLMJson("Sure!\n```json\n" + JSON.stringify(sample) + "\n```");
    expect(out.verdict).toBe("false");
  });

  it("rejects an invalid verdict", () => {
    expect(() => parseLLMJson(JSON.stringify({ ...sample, verdict: "maybe" }))).toThrow();
  });

  it("drops non-allow-listed sources and de-duplicates", () => {
    expect(resolveSources(sample.source_ids).map((s) => s.id)).toEqual(["pib"]);
  });

  it("orders replies gentle, neutral, firm", () => {
    const r = finalize(parseLLMJson(JSON.stringify(sample)), false);
    expect(r.replies.map((x) => x.tone)).toEqual(["gentle", "neutral", "firm"]);
  });

  it("prompt names the language and sender", () => {
    const p = buildPrompt({ text: "hi", language: "mr-IN", sender: "uncle" });
    expect(p.system).toContain("Marathi");
    expect(p.system).toContain("uncle");
  });

  it("pipeline runs in mock mode without a key", async () => {
    const r = await runPipeline({ text: "WhatsApp charges", language: "hi-IN", sender: "aunt" });
    expect(r.mock).toBe(true);
    expect(r.replies).toHaveLength(3);
  });
});

describe("smoke: API routes", () => {
  it("GET /api/health reports mock mode", async () => {
    const body = await health().json();
    expect(body).toEqual({ ok: true, mode: "mock" });
  });

  it("POST /api/analyze returns verdict + 3 replies; rejects empty input", async () => {
    const f = new FormData();
    f.set("text", "WhatsApp will charge ₹99");
    f.set("language", "mr-IN");
    const ok = await analyze(new Request("http://x/api/analyze", { method: "POST", body: f }));
    expect(ok.status).toBe(200);
    const data = await ok.json();
    expect(data.mock).toBe(true);
    expect(data.replies).toHaveLength(3);

    const bad = await analyze(new Request("http://x/api/analyze", { method: "POST", body: new FormData() }));
    expect(bad.status).toBe(400);
  });
});
