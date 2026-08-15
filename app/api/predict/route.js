const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const CAT_PROMPTS = {
  multigoals: "MULTIGOALS MARKETS: Match Multigoals (1-2, 1-3, 1-4, 2-3, 2-4, 3-5 ranges), Home Team Multigoals (1-2, 1-3, No goal), Away Team Multigoals (1-2, 1-3, No goal), 1st Half Multigoals (No goal, 1-2, 1-3), Multiscores (grouped correct scores). Give 8-12 predictions.",
  main: "MAIN MARKETS: 1X2, Double Chance, Draw No Bet, Asian Handicap, GG/NG, Correct Score, HT/FT, Winning Margin, Odd/Even, 1st Goal, Last Goal. Give 8-12 predictions.",
  goals: "GOALS MARKETS: Over/Under 0.5/1.5/2.5/3.5, BTTS, Home/Away Clean Sheet, Home/Away Goals O/U 0.5/1.5, Goal Bounds, Exact Goals. Give 8-12 predictions.",
  half: "HALF MARKETS: 1st Half 1X2, 1H O/U 0.5, 1H Double Chance, 1H GG/NG, 1H Correct Score, 2nd Half 1X2, 2H O/U 0.5, 2H GG/NG, Home/Away Score Both Halves. Give 8-12 predictions.",
  bookings: "BOOKINGS: Cards O/U 3.5/4.5, Bookings 1X2, 1st Booking, Booking Points O/U, Home/Away Cards O/U 1.5. Give 6-8 predictions.",
  corners: "CORNERS: Corners O/U 8.5/9.5/10.5, Corners 1X2, 1st Corner, Corner Handicap, Home/Away Corners O/U 3.5, 1H Corners O/U 4.5. Give 6-8 predictions.",
  combo: "COMBO: 1X2 and O/U 2.5, 1X2 and GG/NG, DC and O/U 2.5, DC and GG/NG, Win to Nil, O/U and GG/NG, Win From Behind. Give 6-8 predictions.",
  teams: "TEAMS: Home/Away Shots O/U 4.5, Home/Away SOT O/U 2.5, Home/Away Fouls O/U 10.5, Home/Away Offsides O/U 1.5. Give 6-8 predictions.",
  match: "MATCH: Total Cards O/U, Shots 1X2, SOT 1X2, Penalty Scored Yes/No, Goal by Sub Yes/No. Give 4-6 predictions.",
};

var SYSTEM = "You are the prediction engine for Ase Football AI. Analyze using 17 factors: 1. Recent Form (25%) 2. Home/Away (15%) 3. H2H (10%) 4. Goal Stats (15%) 5. League Position (10%) 6. Key Players (10%) 7. Fixture Congestion (8%) 8. Motivation (7%) 9. Weather (3%) 10. Referee (3%) 11. Tactics (5%) 12. Transfers (3%) 13. Derby (2%) 14. Travel (2%) 15. Scoring Timing (3%) 16. Clean Sheet (3%) 17. xG (5%). CRITICAL: Search web for REAL data. Be HONEST with confidence (most 40-75%, only obvious 80+). Use actual team names. RESPOND ONLY JSON OBJECT (no markdown, no backticks): {\"category_predictions\": [{\"market\":\"Name\",\"pick\":\"Selection\",\"confidence\":72,\"rating\":\"GOOD\",\"odds_hint\":\"~1.65\",\"reasoning\":\"2-3 sentences with real stats.\",\"key_factors\":[\"Factor1\",\"Factor2\"]}], \"top_5_overall\": [{\"rank\":1,\"market\":\"Best Pick\",\"pick\":\"Selection\",\"confidence\":88,\"rating\":\"STRONG\",\"odds_hint\":\"~1.20\",\"category\":\"Goals\",\"reasoning\":\"Why this is the best pick.\",\"key_factors\":[\"Factor1\",\"Factor2\"]}]} top_5_overall = 5 BEST predictions across ALL categories ranked 1-5. Rating: 80+=STRONG, 65-79=GOOD, 50-64=FAIR, below 50=RISKY. ONLY THE JSON OBJECT.";

export async function POST(req) {
  try {
    var body = await req.json();
    var home = body.home;
    var away = body.away;
    var league = body.league;
    var category = body.category;
    if (!home || !away || !league || !category)
      return Response.json({ error: "Missing fields" }, { status: 400 });

    var apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return Response.json({ error: "API key not configured" }, { status: 500 });

    var catPrompt = CAT_PROMPTS[category] || CAT_PROMPTS.main;

    var res = await fetch(GEMINI_URL + "?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM }]
        },
        contents: [{
          role: "user",
          parts: [{
            text: "Analyze this football match:\n\nMatch: " + home + " (HOME) vs " + away + " (AWAY)\nLeague: " + league + "\n\nSearch for real data:\n- " + home + " last 5 match results and current form\n- " + away + " last 5 match results and current form\n- " + home + " vs " + away + " head to head recent results\n- " + league + " current standings\n- " + home + " team news and injuries\n- " + away + " team news and injuries\n\nREQUESTED CATEGORY TO PREDICT:\n" + catPrompt + "\n\nALSO: Generate top_5_overall across ALL market categories. Ranked 1 to 5.\n\nApply all 17 prediction factors using the real data you found. Output ONLY the JSON object."
          }]
        }],
        tools: [{ google_search: {} }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 8000,
        }
      }),
    });

    var json = await res.json();

    if (json.error) {
      console.error("Gemini error:", json.error);
      return Response.json({ error: json.error.message }, { status: 500 });
    }

    var raw = "";
    var candidates = json.candidates || [];
    for (var i = 0; i < candidates.length; i++) {
      var parts = candidates[i].content?.parts || [];
      for (var j = 0; j < parts.length; j++) {
        if (parts[j].text) raw += parts[j].text;
      }
    }

    raw = raw.trim().replace(/```json/g, "").replace(/```/g, "").trim();

    var objStart = raw.indexOf("{");
    var objEnd = raw.lastIndexOf("}");
    var arrStart = raw.indexOf("[");
    var arrEnd = raw.lastIndexOf("]");

    var data;
    if (objStart !== -1 && (arrStart === -1 || objStart < arrStart)) {
      data = JSON.parse(raw.substring(objStart, objEnd + 1));
    } else if (arrStart !== -1) {
      data = { category_predictions: JSON.parse(raw.substring(arrStart, arrEnd + 1)), top_5_overall: [] };
    } else {
      return Response.json({ error: "Could not parse AI response. Try again." }, { status: 500 });
    }

    return Response.json(data);
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
