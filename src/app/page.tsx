"use client";

import { useState } from "react";
import { LANGUAGES, SENDERS, type AnalyzeResult } from "@/lib/schema";

const VERDICT_STYLE: Record<string, string> = {
  true: "bg-green-100 text-green-800",
  misleading: "bg-yellow-100 text-yellow-800",
  false: "bg-red-100 text-red-800",
  unverifiable: "bg-stone-200 text-stone-700",
};

const DEMO = "Forward to everyone! WhatsApp will start charging ₹99 per month from tomorrow. Send this to 10 groups or your account will be deleted.";

export default function Home() {
  const [text, setText] = useState("");
  const [audio, setAudio] = useState<File | null>(null);
  const [language, setLanguage] = useState("hi-IN");
  const [sender, setSender] = useState("uncle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [copied, setCopied] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const form = new FormData();
      form.set("text", text);
      form.set("language", language);
      form.set("sender", sender);
      if (audio) form.set("audio", audio);
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function copy(t: string, key: string) {
    try {
      await navigator.clipboard.writeText(t);
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setError("Couldn't copy — select the text and copy manually.");
    }
  }

  const field = "w-full rounded-lg border border-stone-300 bg-white p-2";

  return (
    <main className="mx-auto max-w-2xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold">Family Group Whisperer</h1>
      <p className="mt-1 text-stone-600">
        Got a doubtful forward? Get a fact-check and kind replies in your family&apos;s language. Nothing is posted for you.
      </p>
      <p className="mt-3 rounded-lg bg-amber-100 p-3 text-sm text-amber-900">
        AI-generated check, not an authority. Always open the linked sources before correcting someone. Your message is not stored.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="msg" className="font-medium">Forwarded message</label>
            <button type="button" className="text-sm text-amber-700 underline" onClick={() => setText(DEMO)}>
              Use demo message
            </button>
          </div>
          <textarea id="msg" rows={5} className={field} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the forward here…" />
        </div>
        <div>
          <label htmlFor="voice" className="mb-1 block font-medium">Or a voice note (max 30s, 5 MB)</label>
          <input id="voice" type="file" accept="audio/*" className={field} onChange={(e) => setAudio(e.target.files?.[0] ?? null)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-medium">Reply language
            <select className={`${field} mt-1`} value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">Who sent it?
            <select className={`${field} mt-1`} value={sender} onChange={(e) => setSender(e.target.value)}>
              {SENDERS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <button disabled={loading || (!text.trim() && !audio)} className="w-full rounded-lg bg-amber-600 p-3 font-semibold text-white disabled:opacity-50">
          {loading ? "Checking…" : "Check & draft replies"}
        </button>
      </form>

      {error && <p role="alert" className="mt-4 rounded-lg bg-red-100 p-3 text-red-800">{error}</p>}

      {result && (
        <section className="mt-8 space-y-4" aria-live="polite">
          {result.mock && (
            <p className="rounded-lg bg-purple-100 p-2 text-sm text-purple-900">
              MOCK MODE: no Sarvam API key configured, so this is canned demo output.
            </p>
          )}
          {result.transcript && <p className="text-sm text-stone-600"><b>Transcript:</b> {result.transcript}</p>}
          <div className="rounded-xl bg-white p-4 shadow">
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${VERDICT_STYLE[result.verdict]}`}>
              {result.verdict.toUpperCase()}
            </span>
            <p className="mt-3"><b>Claim:</b> {result.claim}</p>
            <p className="mt-2 text-stone-700">{result.reasoning}</p>
            {result.sources.length > 0 && (
              <ul className="mt-3 list-disc pl-5 text-sm">
                {result.sources.map((s) => (
                  <li key={s.id}><a className="text-amber-700 underline" href={s.url} target="_blank" rel="noreferrer">{s.name}</a></li>
                ))}
              </ul>
            )}
          </div>
          {result.replies.map((r) => (
            <div key={r.tone} className="rounded-xl bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <span className="font-semibold capitalize">{r.tone}</span>
                <button onClick={() => copy(r.text, r.tone)} className="rounded bg-stone-800 px-3 py-1 text-sm text-white">
                  {copied === r.tone ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mt-2 whitespace-pre-wrap">{r.text}</p>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
