// Curated allow-list. The model may only cite these ids; anything else is dropped.
export type Source = { id: string; name: string; url: string };

export const SOURCES: Source[] = [
  { id: "pib", name: "PIB Fact Check", url: "https://pib.gov.in/factcheck.aspx" },
  { id: "who", name: "WHO Mythbusters", url: "https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters" },
  { id: "rbi", name: "RBI — Be(A)ware", url: "https://rbi.org.in/Scripts/BS_ViewBulletin.aspx" },
  { id: "mohfw", name: "Ministry of Health (MoHFW)", url: "https://www.mohfw.gov.in" },
  { id: "cybercrime", name: "National Cyber Crime Portal", url: "https://cybercrime.gov.in" },
  { id: "whatsapp", name: "WhatsApp Help Center", url: "https://faq.whatsapp.com" },
  { id: "altnews", name: "Alt News", url: "https://www.altnews.in" },
  { id: "boom", name: "BOOM Live Fact Check", url: "https://www.boomlive.in/fact-check" },
];

export function resolveSources(ids: string[]): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const id of ids) {
    const s = SOURCES.find((x) => x.id === id.trim().toLowerCase());
    if (s && !seen.has(s.id)) {
      seen.add(s.id);
      out.push(s);
    }
  }
  return out;
}
