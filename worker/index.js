const corsOrigins = new Set(["https://vyaj.eu","https://www.vyaj.eu","http://localhost:3000","http://127.0.0.1:3000"]);
addEventListener("fetch", event => event.respondWith(handle(event.request, globalThis.GROQ_API_KEY ? {GROQ_API_KEY:globalThis.GROQ_API_KEY} : event.env || {})));
async function handle(request, env) {
  const origin = request.headers.get("Origin");
  const headers = {"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","Vary":"Origin"};
  if (origin && corsOrigins.has(origin)) { headers["Access-Control-Allow-Origin"]=origin; headers["Access-Control-Allow-Methods"]="POST, OPTIONS"; headers["Access-Control-Allow-Headers"]="Content-Type"; headers["Access-Control-Max-Age"]="86400"; }
  const respond=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
  if(request.method==="OPTIONS") return new Response(null,{status:origin&&!corsOrigins.has(origin)?403:204,headers});
  const url=new URL(request.url);
  const actionPaths={"/api/v1/actions/plan-trip":"plan-trip","/api/plan":"plan-trip","/api/v1/actions/decide-for-us":"decide-for-us","/api/v1/actions/surprise-me":"surprise-me","/api/v1/actions/search-destinations":"search-destinations","/api/v1/actions/adjust-itinerary":"adjust-itinerary","/api/v1/actions/invite-travelers":"invite-travelers","/api/v1/actions/submit-vote":"submit-vote","/api/v1/actions/view-notifications":"view-notifications","/api/v1/actions/join-waitlist":"join-waitlist","/api/v1/actions/view-profile":"view-profile","/api/v1/actions/save-trip":"save-trip","/api/v1/actions/share-trip":"share-trip","/api/v1/actions/open-settings":"open-settings","/api/v1/actions/login":"login","/api/v1/actions/signup":"signup","/api/v1/actions/book-trip":"book-trip","/api/v1/actions/add-activity":"add-activity","/api/v1/actions/edit-itinerary":"edit-itinerary"}; const action=actionPaths[url.pathname]; if(!action)return respond({error:"Not found."},404);
  if(request.method!=="POST") return respond({error:"Use POST for this action."},405); if(action!=="plan-trip"){let payload;try{payload=await request.json()}catch{return respond({error:"Please send valid action details."},400)} if(!payload||typeof payload!=="object"||Array.isArray(payload))return respond({error:"Please send valid action details."},400); if(action==="join-waitlist"){const email=payload.email;if(typeof email!=="string"||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))return respond({error:"Enter a valid email address and try again."},400)} return respond({status:"coming_soon",feature:action,message:"This VYAJ feature is not available yet."},200); }
  if(!env.GROQ_API_KEY) return respond({error:"Groq API key is not configured."},503);
  let body; try {const t=await request.text(); if(t.length>12000)return respond({error:"Trip request is too long."},413);body=JSON.parse(t);} catch{return respond({error:"Please send valid trip details."},400);}
  const destination=typeof body.destination==="string"?body.destination.trim().slice(0,120):"";
  if(!destination)return respond({error:"Enter a destination first."},400);
  const departureCity=typeof body.departureCity==="string"?body.departureCity.trim().slice(0,120):"";
  const duration=String(body.duration||"5–7 days").slice(0,40), travellers=String(body.travellers||"Two people").slice(0,40), style=String(body.style||"A bit of everything").slice(0,100), notes=String(body.notes||"None").slice(0,1200);
  const prompt = [
    "You are VYAJ, a thoughtful travel-planning assistant. Return only valid JSON, with no markdown.",
    "Destination: " + destination,
    "Departure city/airport: " + (departureCity || "NOT PROVIDED — do not invent flight costs; mark flights as Not estimated — departure city needed"),
    "Trip length: " + duration,
    "Travellers: " + travellers,
    "Travel style: " + style,
    "Additional wishes and total budget target: " + notes,
    "Return this JSON shape: {tripTitle, destination, overview, days:[{day,title,summary,activities:[{time,title,description,location,estimatedCost}]}], estimatedBudget:{currency:EUR,totalEstimate,perPerson,budgetFit,breakdown:{flights,accommodation,food,localTransport,activities,other},notes}, tips:[strings], assumptions:[strings]}.",
    "Create 2–3 activities per day and one day per trip day where feasible; for trips longer than 7 days provide a useful first 7-day outline and explain in assumptions.",
    "Estimate realistic approximate costs for ALL travellers and give distinct ranges for return flights, accommodation, food, local transport, activities/tickets and other costs. Use destination, duration, traveller count and style. State assumptions, number of nights, accommodation standard, shared/separate rooms, meals and whether values are group totals or per person. Use broad ranges and typical general knowledge only, never pretend costs are live quotes.",
    "The estimatedBudget.totalEstimate and estimatedBudget.perPerson fields are mandatory and must always contain non-empty EUR price ranges for the whole group and per person, respectively. Never return Not estimated for either field just because the departure city is missing; estimate non-flight costs and exclude flights from the total when the origin is unknown. Only breakdown.flights may be Not estimated in that case.",
    "If departure city/airport is missing, set breakdown.flights exactly to Not estimated — departure city needed, exclude flights from totalEstimate, and state this exclusion in notes and budgetFit. If provided, estimate return flights as a broad indicative range and say airfare is not live-checked.",
    "Do not repeat the chosen budget as if it were the estimated cost. Compare the estimate against the budget target; say clearly if over budget and suggest realistic savings. If flights are excluded, state the comparison excludes flights. Ensure categories roughly add up to totalEstimate. Use EUR unless destination strongly requires another currency; specify currency.",
    "Give 3–5 genuinely useful, destination-specific practical travel tips relevant to this destination and itinerary, based on stable knowledge. Avoid generic filler. Never invent rules, scams, closures, safety claims, transport details, prices or hours. If something depends on current rules or conditions, tell the traveller to verify with an official/current source. Return fewer tips rather than inventing.",
    "Never invent exact opening hours, live prices, live availability, transport timetables or reservations. Label costs as estimates, keep routes geographically sensible, include downtime, and do not claim live checks. If the destination is ambiguous, state the assumption."
  ].join("\n");
  try {
    const response=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+env.GROQ_API_KEY},body:JSON.stringify({model:"openai/gpt-oss-120b",messages:[{role:"system",content:"Return only valid JSON, without markdown."},{role:"user",content:prompt}],temperature:0.2,max_tokens:4000,response_format:{type:"json_object"}}),signal:AbortSignal.timeout(30000)});
    if(!response.ok){const detail=await response.text();console.error("Groq API error",response.status,detail.slice(0,500));return respond({error:response.status===429?"The AI planner is busy or its usage limit was reached. Please try again shortly.":"The AI service could not complete this trip. Please try again shortly."},response.status===429?429:502);}
    const result=await response.json(), output=result.choices&&result.choices[0]&&result.choices[0].message?result.choices[0].message.content:"";
    const first=output.indexOf("{"),last=output.lastIndexOf("}");if(first<0||last<=first)throw new Error("Invalid AI JSON");
    const itinerary=JSON.parse(output.slice(first,last+1));if(!itinerary.tripTitle||!Array.isArray(itinerary.days))throw new Error("Invalid itinerary format");
    return respond({status:"available",feature:"plan-trip",itinerary});
  }catch(error){console.error("Trip planning failed",error instanceof Error?error.name+": "+error.message:String(error));return respond({error:"We couldn't build that itinerary just now. Please try again."},502);}
}