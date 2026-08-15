const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req) {
  try {
    const { league } = await req.json();
    if (!league) return Response.json({ error: "League required" }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return Response.json({ error: "API key not configured" }, { status: 500 });

    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: `You find upcoming football fixtures. Search for the requested league's upcoming matches within the next 7 days. Return ONLY a JSON array. No text, no markdown, no backticks. Example: [{"home":"Arsenal","away":"Chelsea","date":"Aug 16","time":"15:00"}] ONLY THE JSON ARRAY.`
          }]
        },
        contents: [{
          role: "user",
          parts: [{ text: `Find all upcoming ${league} fixtures in the next 7 days. Today is ${today}.` }]
        }],
        tools: [{ google_search: {} }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4000,
        }
      }),
    });

    const json = await res.json();

    if (json.error) {
      console.error("Gemini error:", json.error);
      return Response.json({ error: json.error.message }, { status: 500 });
    }

    let raw = "";
    const candidates = json.candidates || [];
    for (const c of candidates) {
      for (const part of (c.content?.parts || [])) {
        if (part.text) raw += part.text;
      }
    }

    raw = raw.trim().replace(/```json/g, "").replace(/```/g, "").trim();
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");

    if (start === -1 || end === -1) return Response.json({ fixtures: [] });

    const fixtures = JSON.parse(raw.substring(start, end + 1));
    return Response.json({ fixtures: Array.isArray(fixtures) ? fixtures : [] });
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
