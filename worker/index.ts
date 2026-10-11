interface Env {
  GEMINI_API_KEY: string;
  GROQ_API_KEY: string;
}

const allowedOrigins = new Set([
  "https://vyaj.eu",
  "https://www.vyaj.eu",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

const headersFor = (origin: string | null) => {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  });
  if (origin && allowedOrigins.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Access-Control-Max-Age", "86400");
  }
  return headers;
};

function json(data: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(data), { status, headers: headersFor(origin) });
}

function extractText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  const parts: string[] = [];
  for (const step of payload?.steps ?? []) {
    if (step?.type === "model_output") {
      for (const item of step?.content ?? []) {
        if (item?.type === "text" && typeof item?.text === "string") parts.push(item.text);
      }
    }
  }
  return parts.join("\n");
}

function parseJson(text: string) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first < 0 || last <= first) throw new Error("The AI did not return a JSON itinerary.");
  return JSON.parse(text.slice(first, last + 1));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const corsHeaders = headersFor(origin);

    if (request.method === "OPTIONS") {
      if (origin && !allowedOrigins.has(origin)) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    const url = new URL(request.url);
    const actionPaths: Record<string, string> = {
      "/api/v1/actions/plan-trip": "plan-trip",
      "/api/plan": "plan-trip",
      "/api/v1/actions/decide-for-us": "decide-for-us",
      "/api/v1/actions/surprise-me": "surprise-me",
      "/api/v1/actions/search-destinations": "search-destinations",
      "/api/v1/actions/adjust-itinerary": "adjust-itinerary",
      "/api/v1/actions/invite-travelers": "invite-travelers",
      "/api/v1/actions/submit-vote": "submit-vote",
      "/api/v1/actions/view-notifications": "view-notifications",
      "/api/v1/actions/join-waitlist": "join-waitlist",
      "/api/v1/actions/view-profile": "view-profile",
      "/api/v1/actions/save-trip": "save-trip",
      "/api/v1/actions/share-trip": "share-trip",
      "/api/v1/actions/open-settings": "open-settings",
      "/api/v1/actions/login": "login",
      "/api/v1/actions/signup": "signup",
      "/api/v1/actions/book-trip": "book-trip",
      "/api/v1/actions/add-activity": "add-activity",
      "/api/v1/actions/edit-itinerary": "edit-itinerary",
    };
    const action = actionPaths[url.pathname];
    if (!action) return json({ error: "Not found." }, 404, origin);
    if (request.method !== "POST") return json({ error: "Use POST for this action." }, 405, origin);
    if (origin && !allowedOrigins.has(origin)) return json({ error: "Origin not allowed." }, 403, origin);

    // These features have explicit contracts but are not implemented yet.
    // Return a truthful feature state instead of pretending the operation succeeded.
    if (action !== "plan-trip") {
      const contentLength = Number(request.headers.get("Content-Length") || 0);
      if (contentLength > 12_000) return json({ error: "That request is too long. Please shorten it and try again." }, 413, origin);
      let payload: unknown;
      try {
        payload = await request.json();
      } catch {
        return json({ error: "Please send valid action details." }, 400, origin);
      }
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return json({ error: "Please send valid action details." }, 400, origin);
      }
      if (action === "join-waitlist") {
        const email = (payload as { email?: unknown }).email;
        if (typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          return json({ error: "Enter a valid email address and try again." }, 400, origin);
        }
      }
      return json({
        status: "coming_soon",
        feature: action,
        message: "This VYAJ feature is not available yet.",
      }, 200, origin);
    }
    if (origin && !allowedOrigins.has(origin)) return json({ error: "Origin not allowed." }, 403, origin);
    if (!env.GROQ_API_KEY && !env.GEMINI_API_KEY) return json({ error: "The travel planner is being prepared. Please try again later." }, 503, origin);

    const contentLength = Number(request.headers.get("Content-Length") || 0);
    if (contentLength > 12_000) return json({ error: "Your trip request is too long. Please shorten it and try again." }, 413, origin);

    let body: any;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Please send valid trip details." }, 400, origin);
    }

    const destination = typeof body?.destination === "string" ? body.destination.trim().slice(0, 120) : "";
    const departureCity = typeof body?.departureCity === "string" ? body.departureCity.trim().slice(0, 120) : "";
    const duration = typeof body?.duration === "string" ? body.duration.slice(0, 40) : "5–7 days";
    const travellers = typeof body?.travellers === "string" ? body.travellers.slice(0, 40) : "Two of us";
    const style = typeof body?.style === "string" ? body.style.slice(0, 100) : "A bit of everything";
    const notes = typeof body?.notes === "string" ? body.notes.trim().slice(0, 1200) : "";
    if (!destination) return json({ error: "Tell us where you would like to go, or enter 'Surprise me'." }, 400, origin);

    const prompt = "You are VYAJ, a thoughtful travel-planning assistant. Create a useful, realistic starter itinerary based on these traveller details.\\n" +
      "Destination: " + destination + "\\nDeparture city/airport: " + (departureCity || "NOT PROVIDED — do not invent or estimate flight cost; mark flights as needing departure city") + "\\nTrip length: " + duration + "\\nTravellers: " + travellers +
      "\\nTravel style: " + style + "\\nAdditional wishes: " + (notes || "None provided") + "\\n\\n" +
      "Return ONLY valid JSON, with no markdown and no text outside JSON, using exactly this shape: " +
      '{"tripTitle":"Short evocative title","destination":"Destination","overview":"2–3 sentence trip overview","days":[{"day":1,"title":"Day theme","summary":"Short explanation of the day","activities":[{"time":"09:30","title":"Activity name","description":"What to do and why it fits","location":"Place or neighbourhood","estimatedCost":"€0–€15 per person"}]}],"estimatedBudget":{"currency":"EUR","totalEstimate":"€X–€Y approximate total for all travellers","perPerson":"€X–€Y per person","budgetFit":"Compare estimated total with selected budget","breakdown":{"flights":"€X–€Y total or Not estimated — departure city needed","accommodation":"€X–€Y total","food":"€X–€Y total","localTransport":"€X–€Y total","activities":"€X–€Y total","other":"€X–€Y total or €0–€0"},"notes":"State assumptions, duration basis, accommodation standard, what is included/excluded, and that all costs are approximate"},"tips":["Destination-specific practical tip"],"assumptions":["Important uncertainty"]}' +
      "\\nGenerate 2–3 activities per day and one day object per trip day where feasible; for very long trips, give a useful first 7-day outline and say so in assumptions. Estimate a realistic approximate total trip cost for ALL listed travellers and return a breakdown with separate ranges for flights, accommodation, food, local transport, activities/tickets, and other costs. Use destination, duration, traveller count, and travel style. State assumptions such as budget/mid-range accommodation, number of nights, meals per day, and whether prices are per person or group totals. Use typical general knowledge only, not fabricated live quotes; use ranges rather than false precision. If a departure city/airport is provided, estimate return flights from that origin as a broad indicative range and say airfare is not live-checked. If no departure city/airport is provided, set breakdown.flights to exactly "Not estimated — departure city needed", exclude flights from totalEstimate, and state that exclusion in notes. Make clear whether accommodation assumes shared rooms or separate rooms if possible. Compare the total estimate with the selected total budget in Additional wishes; if flights are excluded because the origin is missing, clearly say the comparison excludes flights. If the estimate exceeds the budget, propose realistic savings and clearly say it is over budget; if it fits, explain briefly why. Do not simply repeat the selected budget as the estimated cost. Keep total estimate, per-person estimate, each category range, and budget-fit explanation distinct. Ensure the category ranges roughly add up to the total estimate and activity costs are broadly consistent. Write 3–5 destination-specific, genuinely useful travel tips based on stable knowledge about the actual destination and this itinerary. Tips must be specific and relevant, not generic filler; never invent local rules, scams, closures, safety claims, transport details, prices, or opening hours. If a tip depends on current conditions or rules, clearly tell the traveller to verify it with an official/current source rather than stating it as confirmed. If you cannot provide a reliable specific tip, return fewer tips instead of making one up. Never invent exact opening hours, current prices, live availability, transport timetables, or reservations. Label costs as estimates. If the destination is ambiguous, state your assumption. Keep travel geographically sensible, avoid impossible schedules, include downtime, and don't claim you checked live information. Use concise, specific descriptions.";

    try {
      let outputText = "";
      let provider = "groq";
      if (env.GROQ_API_KEY) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25_000);
        try {
          const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + env.GROQ_API_KEY,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                { role: "system", content: "Return only valid JSON. Do not use markdown." },
                { role: "user", content: prompt },
              ],
              temperature: 0.2,
              max_tokens: 3000,
              response_format: { type: "json_object" },
            }),
            signal: controller.signal,
          });
          const raw = await upstream.text();
          if (upstream.ok) {
            const payload = JSON.parse(raw);
            outputText = payload?.choices?.[0]?.message?.content ?? "";
          } else {
            console.error("Groq API returned", upstream.status, raw.slice(0, 400));
          }
        } finally {
          clearTimeout(timeout);
        }
      }

      if (!outputText && env.GEMINI_API_KEY) {
        provider = "gemini";
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 35_000);
        try {
          const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": env.GEMINI_API_KEY,
            },
            body: JSON.stringify({ model: "gemini-3.8-flash", input: prompt }),
            signal: controller.signal,
          });
          const raw = await upstream.text();
          if (!upstream.ok) {
            console.error("Gemini fallback returned", upstream.status, raw.slice(0, 400));
            if (upstream.status === 429) return json({ error: "The AI planner is busy or its usage limit was reached. Please try again later." }, 429, origin);
            return json({ error: "The AI service could not complete this trip. Please try again shortly." }, 502, origin);
          }
          outputText = extractText(JSON.parse(raw));
        } finally {
          clearTimeout(timeout);
        }
      }

      const itinerary = parseJson(outputText);
      if (!itinerary?.tripTitle || !Array.isArray(itinerary?.days)) throw new Error("Unexpected itinerary shape");
      return json({ status: "available", feature: "plan-trip", itinerary, provider }, 200, origin);
    } catch (error) {
      console.error("Trip planning failed", error instanceof Error ? error.message : String(error));
      if (error instanceof Error && error.name === "AbortError") return json({ error: "The planner took too long. Please try again." }, 504, origin);
      return json({ error: "We couldn't build that itinerary just now. Please try again." }, 502, origin);
    }
  },
};
