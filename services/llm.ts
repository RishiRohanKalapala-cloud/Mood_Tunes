import { MoodInput, Track } from "@/types";

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image"; image: string };

type CoreMessage =
  | { role: "system"; content: string | Array<ContentPart> }
  | { role: "user"; content: string | Array<ContentPart> }
  | { role: "assistant"; content: string | Array<ContentPart> };

type LLMResponse = { completion: string };

export async function generatePlaylist(mood: MoodInput): Promise<Track[]> {
  const prompt = buildPrompt(mood);
  const messages: CoreMessage[] = [
    { role: "system", content: "You are a helpful music curator. Always reply with compact JSON only." },
    {
      role: "user",
      content: [
        { type: "text", text: prompt }
      ],
    },
  ];

  try {
    const res = await fetch("https://toolkit.rork.com/text/llm/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      console.log("LLM http error", res.status);
      return fallbackTracks();
    }

    const data = (await res.json()) as LLMResponse;
    const parsed = parseTracks(data.completion);
    return parsed.length > 0 ? parsed : fallbackTracks();
  } catch (e) {
    console.log("LLM req error", e);
    return fallbackTracks();
  }
}

function buildPrompt(mood: MoodInput): string {
  const hr = typeof mood.heartRate === "number" ? `Heart rate: ${mood.heartRate} bpm.` : "No heart rate.";
  return `
Given this mood:
- Emoji: ${mood.emoji}
- Journal: ${mood.journal ?? ""}
- Energy (0-100): ${mood.energy}
- Valence/happiness (0-100): ${mood.valence}
- ${hr}

Return JSON array named "tracks" with 12 items. Each item has:
{id: string, title: string, artist: string, durationSec: number}

Only return JSON. No commentary.
`.trim();
}

function parseTracks(raw: string): Track[] {
  try {
    const cleaned = raw.trim().replace(/```json|```/g, "");
    const obj = JSON.parse(cleaned) as { tracks?: Track[] } | Track[];
    if (Array.isArray(obj)) return norm(obj);
    if (obj && Array.isArray(obj.tracks)) return norm(obj.tracks);
    return [];
  } catch (e) {
    console.log("parse error", e);
    return [];
  }
}

function norm(arr: Track[]): Track[] {
  return arr
    .filter((t) => Boolean(t && t.title && t.artist))
    .map((t, idx) => ({
      id: t.id ?? `t-${Date.now()}-${idx}`,
      title: t.title,
      artist: t.artist,
      durationSec: typeof t.durationSec === "number" ? t.durationSec : 180 + (idx % 60),
    }));
}

function fallbackTracks(): Track[] {
  const base = [
    { title: "Skyline Dreams", artist: "Nova Echo" },
    { title: "Soft Sunrise", artist: "Lumen Bay" },
    { title: "Neon Breeze", artist: "City Lights" },
    { title: "Ocean Letters", artist: "Blue Hour" },
    { title: "Velvet Night", artist: "Amber Waves" },
    { title: "Paper Planes", artist: "Kite Kids" },
    { title: "Honey Drift", artist: "Golden Tide" },
    { title: "Glass Garden", artist: "Iris Bloom" },
    { title: "Cloud Runner", artist: "Sky Arc" },
    { title: "Quiet Rivers", artist: "Meadow Line" },
    { title: "Echo Park", artist: "North Star" },
    { title: "Afterglow", artist: "Solstice" },
  ];
  return base.map((b, i) => ({
    id: `fb-${i}`,
    title: b.title,
    artist: b.artist,
    durationSec: 160 + (i % 70),
  }));
}