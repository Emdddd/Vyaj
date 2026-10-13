const corsOrigins = new Set(["https://vyaj.eu","https://www.vyaj.eu","http://localhost:3000","http://127.0.0.1:3000"]);
addEventListener("fetch", event => event.respondWith(handle(event.request, {DB:globalThis.DB, GROQ_API_KEY:globalThis.GROQ_API_KEY, SERPAPI_API_KEY:globalThis.SERPAPI_API_KEY, RESEND_API_KEY:globalThis.RESEND_API_KEY, IGNAV_API_KEY:globalThis.IGNAV_API_KEY})));
async function handle(request, env) {
  const origin = request.headers.get("Origin");
  const headers = {"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","Vary":"Origin"};
  if (origin && corsOrigins.has(origin)) { headers["Access-Control-Allow-Origin"]=origin; headers["Access-Control-Allow-Methods"]="POST, OPTIONS"; headers["Access-Control-Allow-Headers"]="Content-Type, Authorization"; headers["Access-Control-Max-Age"]="86400"; }
  const respond=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
  if(request.method==="OPTIONS") return new Response(null,{status:origin&&!corsOrigins.has(origin)?403:204,headers});
  const url=new URL(request.url);
  const actionPaths={"/api/v1/actions/plan-trip":"plan-trip","/api/v1/actions/search-flights":"search-flights","/api/v1/actions/flight-booking-options":"flight-booking-options","/api/plan":"plan-trip","/api/v1/actions/decide-for-us":"decide-for-us","/api/v1/actions/surprise-me":"surprise-me","/api/v1/actions/search-destinations":"search-destinations","/api/v1/actions/adjust-itinerary":"adjust-itinerary","/api/v1/actions/invite-travelers":"invite-travelers","/api/v1/actions/submit-vote":"submit-vote","/api/v1/actions/view-notifications":"view-notifications","/api/v1/actions/join-waitlist":"join-waitlist","/api/v1/actions/view-profile":"view-profile","/api/v1/actions/save-trip":"save-trip","/api/v1/actions/share-trip":"share-trip","/api/v1/actions/open-settings":"open-settings","/api/v1/actions/login":"login","/api/v1/actions/signup":"signup","/api/v1/actions/list-trips":"list-trips","/api/v1/actions/book-trip":"book-trip","/api/v1/actions/add-activity":"add-activity","/api/v1/actions/edit-itinerary":"edit-itinerary"}; const action=actionPaths[url.pathname]; if(!action)return respond({error:"Not found."},404);
  if(request.method!=="POST") return respond({error:"Use POST for this action."},405); if(action!=="plan-trip"){let payload;try{payload=await request.json()}catch{return respond({error:"Please send valid action details."},400)} if(!payload||typeof payload!=="object"||Array.isArray(payload))return respond({error:"Please send valid action details."},400); if(action==="flight-booking-options"){
    const ignavId=typeof payload.bookingToken==="string"&&payload.bookingToken.length<=50000?payload.bookingToken:"";
    if(!ignavId)return respond({error:"This flight has no booking reference. Please search again or choose another flight."},400);
    if(!env.IGNAV_API_KEY)return respond({error:"Live booking links are not configured. Add the IGNAV_API_KEY secret to the Cloudflare Worker."},503);
    try{
      const response=await fetch("https://ignav.com/api/fares/booking-links",{method:"POST",headers:{"X-Api-Key":env.IGNAV_API_KEY,"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({ignav_id:ignavId}),signal:AbortSignal.timeout(30000)});
      const body=await response.json().catch(()=>({}));
      if(!response.ok){console.error("Ignav booking-links failed",response.status,body?.error?.code||body?.error||"");return respond({error:response.status===401||response.status===403?"The flight provider API key was rejected. Check the IGNAV_API_KEY secret.":response.status===402?"The free API allowance may be exhausted. Check your Ignav account billing.":"We couldn't retrieve booking links for this flight. Please try again."},response.status===429?429:502);}
      const options=[];
      const seen=new Set();
      for(const bookingOption of Array.isArray(body.booking_options)?body.booking_options:[]){
        for(const link of Array.isArray(bookingOption?.links)?bookingOption.links:[]){
          const rawUrl=typeof link?.url==="string"?link.url:"";
          const url=rawUrl?( /^https?:\/\//i.test(rawUrl)?rawUrl:"https://"+rawUrl.replace(/^\/+/, "")):"";
          if(!url||seen.has(url))continue;
          seen.add(url);
          const price=link?.price&&Number.isFinite(Number(link.price.amount))?Number(link.price.amount):null;
          options.push({provider:typeof link.provider_name==="string"?link.provider_name:"Booking provider",price,url,priceCurrency:link?.price?.currency||body?.itinerary?.price?.currency||"EUR",specificity:link?.specificity||"unknown",legs:Array.isArray(bookingOption?.legs)?bookingOption.legs:[]});
        }
      }
      return respond({status:options.length?"available":"unavailable",feature:"flight-booking-options",data:{options}},200);
    }catch(error){console.error("Ignav booking-links request failed",error instanceof Error?error.name+":"+error.message:String(error));return respond({error:"We couldn't connect to the flight booking provider. Please try again."},502);}
  }
  if(action==="search-flights"){
    const code=(v)=>typeof v==="string"&&/^[A-Z]{3}$/.test(v)?v:"";
    const origin=code(payload.origin),destination=code(payload.destination);
    const departureDate=typeof payload.departureDate==="string"?payload.departureDate:"";
    const returnDate=typeof payload.returnDate==="string"?payload.returnDate:"";
    const adults=Number(payload.adults);
    const currencyCode=typeof payload.currencyCode==="string"&&/^[A-Z]{3}$/.test(payload.currencyCode)?payload.currencyCode:"EUR";
    const travelClass=typeof payload.travelClass==="string"&&["ECONOMY","PREMIUM_ECONOMY","BUSINESS","FIRST"].includes(payload.travelClass)?payload.travelClass:"ECONOMY";
    const validDate=(v)=>typeof v==="string"&&/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(v)&&!Number.isNaN(Date.parse(v+"T00:00:00Z"));
    if(!origin||!destination||origin===destination||!validDate(departureDate)||!Number.isInteger(adults)||adults<1||adults>9||(returnDate&&(!validDate(returnDate)||returnDate<departureDate)))return respond({error:"Check the airports, dates and number of travellers."},400);
    if(!env.SERPAPI_API_KEY)return respond({error:"Live flight search is not configured yet. Add the SERPAPI_API_KEY secret to the Cloudflare Worker."},503);
    try{
      const params=new URLSearchParams({engine:"google_flights",departure_id:origin,arrival_id:destination,outbound_date:departureDate,type:returnDate?"1":"2",adults:String(adults),currency:currencyCode,travel_class:({"ECONOMY":"1","PREMIUM_ECONOMY":"2","BUSINESS":"3","FIRST":"4"})[travelClass],gl:"mt",hl:"en",deep_search:"true",api_key:env.SERPAPI_API_KEY});
      if(returnDate)params.set("return_date",returnDate);
      const response=await fetch("https://serpapi.com/search.json?"+params.toString(),{method:"GET",headers:{"Accept":"application/json"},signal:AbortSignal.timeout(45000)});
      const body=await response.json().catch(()=>({}));
      if(!response.ok||body?.error){const providerError=typeof body?.error==="string"?body.error:"";console.error("SerpApi flight search failed",response.status,providerError.slice(0,180));return respond({error:response.status===401||response.status===403?"SerpApi rejected the API key. Check the SERPAPI_API_KEY secret.":response.status===429?"Flight search is temporarily rate limited. Please try again shortly.":"We couldn't retrieve flight results right now. Please try again."},response.status===429?429:502);}
      const formatTime=(value)=>typeof value==="string"&&value.length>=16?value.slice(11,16):"—";
      const formatDuration=(value)=>{const n=Number(value);if(!Number.isFinite(n))return "—";const h=Math.floor(n/60),m=n%60;return [h?h+"h":"",m?m+"m":""] .filter(Boolean).join(" ")||"0m";};
      const candidates=[...(Array.isArray(body.best_flights)?body.best_flights:[]),...(Array.isArray(body.other_flights)?body.other_flights:[])];
      const googleQuery="Flights from "+origin+" to "+destination+" on "+departureDate+(returnDate?" returning "+returnDate:" one way")+" with "+adults+" "+(adults===1?"adult":"adults")+" "+({"ECONOMY":"economy","PREMIUM_ECONOMY":"premium economy","BUSINESS":"business class","FIRST":"first class"})[travelClass];
      const bookingUrl="https://www.google.com/travel/flights?"+new URLSearchParams({q:googleQuery,hl:"en-GB",gl:"mt",curr:currencyCode}).toString();
      const data=candidates.map((item,index)=>{
        const segments=Array.isArray(item?.flights)?item.flights:[];
        const first=segments[0]||{};
        const last=segments[segments.length-1]||{};
        const price=Number(item?.price);
        const airlines=segments.map(segment=>segment?.airline).filter(value=>typeof value==="string"&&value.trim()).filter((value,i,all)=>all.indexOf(value)===i);
        const departure=formatTime(first?.departure_airport?.time);
        const arrival=formatTime(last?.arrival_airport?.time);
        const stops=Math.max(0,segments.length-1);
        const id=segments.map(segment=>segment?.flight_number||segment?.departure_airport?.id||"").join("-")||String(index);
        return {id,bookingToken:"",airline:airlines.join(" · ")||"Airline",price:Number.isFinite(price)?String(price):"",currency:currencyCode,departure,arrival,duration:formatDuration(item?.total_duration),stops,bookingUrl};
      }).filter(flight=>flight.price!==""&&flight.departure!=="—"&&flight.arrival!=="—").sort((a,b)=>Number(a.price)-Number(b.price)).slice(0,20);
      return respond({status:data.length?"available":"unavailable",feature:"search-flights",data,provider:"SerpApi / Google Flights"},200);
    }catch(error){console.error("SerpApi flight search failed",error instanceof Error?error.name+":"+error.message:String(error));return respond({error:"We couldn't connect to the flight search provider. Please try again."},502);}
  } if(action==="signup" || action==="login"){
    if(!env.DB)return respond({error:"Account storage is not connected. Please try again later."},503);
    const email=typeof payload.email==="string"?payload.email.trim().toLowerCase():"";
    const password=typeof payload.password==="string"?payload.password:"";
    const displayName=typeof payload.displayName==="string"?payload.displayName.trim().slice(0,80):"";
    if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return respond({error:"Enter a valid email address."},400);
    if(password.length<10||password.length>200)return respond({error:"Password must be between 10 and 200 characters."},400);
    try{
      let user;
      if(action==="signup"){
        if(displayName.length<1)return respond({error:"Enter your name to create an account."},400);
        const salt=crypto.getRandomValues(new Uint8Array(16));
        const passwordHash=await hashPassword(password,salt);
        const id=crypto.randomUUID();
        const now=new Date().toISOString();
        try{await env.DB.prepare("INSERT INTO users (id,email,password_hash,display_name,created_at,updated_at) VALUES (?,?,?,?,?,?)").bind(id,email,bytesToBase64(salt)+"$"+passwordHash,displayName,now,now).run();}
        catch(error){if(String(error?.message||error).toLowerCase().includes("unique"))return respond({error:"An account with this email already exists. Please log in."},409);throw error;}
        user={id,email,display_name:displayName};
      }else{
        const row=await env.DB.prepare("SELECT id,email,password_hash,display_name FROM users WHERE email=? LIMIT 1").bind(email).first();
        if(!row)return respond({error:"Email or password is incorrect."},401);
        const parts=String(row.password_hash||"").split("$");
        if(parts.length!==2||!await verifyPassword(password,parts[0],parts[1]))return respond({error:"Email or password is incorrect."},401);
        user=row;
      }
      const token=bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32)));
      const tokenHash=await sha256Hex(token);
      const now=new Date();
      const expiresAt=new Date(now.getTime()+30*24*60*60*1000).toISOString();
      await env.DB.prepare("INSERT INTO sessions (token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)").bind(tokenHash,user.id,expiresAt,now.toISOString()).run();
      return respond({status:"available",feature:action,data:{token,expiresAt,user:{id:user.id,email:user.email,displayName:user.display_name||""}}},action==="signup"?201:200);
    }catch(error){console.error("Account action failed",action,error instanceof Error?error.message:String(error));return respond({error:"We couldn’t complete your account request. Please try again."},500);}
  }
  if(action==="view-profile" || action==="save-trip" || action==="list-trips"){
    if(!env.DB)return respond({error:"Account storage is not connected. Please try again later."},503);
    const user=await authenticatedUser(request,env.DB);
    if(!user)return respond({error:"Please log in again to continue."},401);
    if(action==="view-profile")return respond({status:"available",feature:action,data:{user:{id:user.id,email:user.email,displayName:user.display_name||""}}});
    if(action==="list-trips"){
      try{const rows=await env.DB.prepare("SELECT id,title,destination,trip_data,created_at,updated_at FROM trips WHERE user_id=? ORDER BY updated_at DESC LIMIT 100").bind(user.id).all();return respond({status:"available",feature:action,data:{trips:(rows.results||[]).map(row=>({id:row.id,title:row.title,destination:row.destination,trip:parseJson(row.trip_data),createdAt:row.created_at,updatedAt:row.updated_at}))}});}
      catch(error){console.error("List trips failed",error instanceof Error?error.message:String(error));return respond({error:"We couldn’t load your saved trips."},500);}
    }
    const trip=payload.trip&&typeof payload.trip==="object"?payload.trip:payload.itinerary&&typeof payload.itinerary==="object"?payload.itinerary:null;
    if(!trip)return respond({error:"Include a trip or itinerary to save."},400);
    let serialized;try{serialized=JSON.stringify(trip);}catch{return respond({error:"This trip could not be saved."},400);}
    if(serialized.length>150000)return respond({error:"This trip is too large to save. Please shorten it and try again."},413);
    const title=String(trip.tripTitle||trip.title||payload.title||trip.destination||"My trip").trim().slice(0,180)||"My trip";
    const destination=String(trip.destination||payload.destination||"").trim().slice(0,180);
    const id=typeof payload.id==="string"&&/^[0-9a-f-]{36}$/i.test(payload.id)?payload.id:crypto.randomUUID();
    const now=new Date().toISOString();
    try{
      const existing=await env.DB.prepare("SELECT id FROM trips WHERE id=? AND user_id=?").bind(id,user.id).first();
      if(existing)await env.DB.prepare("UPDATE trips SET title=?,destination=?,trip_data=?,updated_at=? WHERE id=? AND user_id=?").bind(title,destination,serialized,now,id,user.id).run();
      else await env.DB.prepare("INSERT INTO trips (id,user_id,title,destination,trip_data,created_at,updated_at) VALUES (?,?,?,?,?,?,?)").bind(id,user.id,title,destination,serialized,now,now).run();
      return respond({status:"available",feature:action,data:{trip:{id,title,destination,trip,createdAt:existing?undefined:now,updatedAt:now}}},existing?200:201);
    }catch(error){console.error("Save trip failed",error instanceof Error?error.message:String(error));return respond({error:"We couldn’t save this trip. Please try again."},500);}
  }
  } if(action==="join-waitlist"){
    const email=typeof payload.email==="string"?payload.email.trim().toLowerCase():"";
    if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return respond({error:"Enter a valid email address and try again."},400);
    if(!env.RESEND_API_KEY)return respond({error:"Welcome email service is not configured yet."},503);
    const textBody="Hi there,\\n\\nThanks for joining the VYAJ waitlist.\\n\\nWe’re working on a more thoughtful, personal way to discover and plan your next trip. The experience is still taking shape, and we’re putting care into the details.\\n\\nAs soon as VYAJ is ready for you to try, we’ll send you another email. No need to do anything for now — just keep an eye on your inbox.\\n\\nSee you on the way,\\nThe VYAJ team\\nhello@vyaj.eu";
    const htmlBody='<!doctype html><html><body style="margin:0;padding:0;background:#f4f8fb;font-family:Arial,Helvetica,sans-serif;color:#07172e"><div style="max-width:600px;margin:32px auto;padding:0 16px"><div style="background:#07172e;border-radius:16px;padding:36px 30px;color:#fff"><div style="margin:0 0 26px"><img src="https://raw.githubusercontent.com/Emdddd/Vyaj/main/public/D0F8F0DA-F8C9-4B07-8ED2-B6B0F1A5D567.png" alt="VYAJ" width="112" style="display:block;width:112px;max-width:100%;height:auto;border:0" /></div><p style="margin:0 0 12px;color:#a9c0d1;font-size:12px;letter-spacing:2px;text-transform:uppercase">You’re on the list</p><h1 style="font-size:32px;line-height:1.2;letter-spacing:-1px;margin:0 0 20px">Your next trip starts with an idea.</h1><p style="font-size:16px;line-height:1.8;color:#dce8f0;margin:0 0 16px">Thanks for joining the VYAJ waitlist.</p><p style="font-size:15px;line-height:1.8;color:#dce8f0;margin:0 0 16px">We’re working on a more thoughtful, personal way to discover and plan your next trip. The experience is still taking shape, and we’re putting care into the details.</p><p style="font-size:15px;line-height:1.8;color:#dce8f0;margin:0">As soon as VYAJ is ready for you to try, we’ll send you another email. No need to do anything for now — just keep an eye on your inbox.</p><div style="height:1px;background:#ffffff24;margin:28px 0 20px"></div><p style="font-size:13px;line-height:1.7;color:#9fb5c6;margin:0">See you on the way,<br><strong style="color:#fff">The VYAJ team</strong><br><a href="mailto:hello@vyaj.eu" style="color:#76e7ef;text-decoration:none">hello@vyaj.eu</a></p></div><p style="font-size:11px;line-height:1.6;color:#7b8d9d;text-align:center;margin:16px 0">You’re receiving this because you joined the VYAJ waitlist.</p></div></body></html>';
    try {
      const emailResponse=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({from:"VYAJ <hello@vyaj.eu>",to:[email],subject:"Welcome to the VYAJ waitlist ✨",html:htmlBody,text:textBody,reply_to:"hello@vyaj.eu"}),signal:AbortSignal.timeout(12000)});
      const emailResult=await emailResponse.json().catch(()=>({}));
      if(!emailResponse.ok){console.error("Resend welcome email failed",emailResponse.status,JSON.stringify(emailResult).slice(0,500));return respond({error:"We couldn’t send the welcome email just now. Please try again shortly."},502);}
      return respond({status:"available",feature:"join-waitlist",message:"Welcome email sent.",data:{emailId:emailResult.id||null}},200);
    } catch(error){console.error("Welcome email request failed",error instanceof Error?error.message:String(error));return respond({error:"We couldn’t send the welcome email just now. Please try again shortly."},502);}
  }
  return respond({status:"coming_soon",feature:action,message:"This VYAJ feature is not available yet."},200); }
  if(!env.GROQ_API_KEY) return respond({error:"Groq API key is not configured."},503);
  let body; try {const t=await request.text(); if(t.length>12000)return respond({error:"Trip request is too long."},413);body=JSON.parse(t);} catch{return respond({error:"Please send valid trip details."},400);}
  const destination=typeof body.destination==="string"?body.destination.trim().slice(0,120):"";
  const outputLanguage=body.language==="fr"?"French":body.language==="it"?"Italian":body.language==="de"?"German":body.language==="ar"?"Arabic":"English";
  if(!destination)return respond({error:"Enter a destination first."},400);
  const departureCity=typeof body.departureCity==="string"?body.departureCity.trim().slice(0,120):"";
  const duration=String(body.duration||"5–7 days").slice(0,40), travellers=String(body.travellers||"Two people").slice(0,40), style=String(body.style||"A bit of everything").slice(0,100), notes=String(body.notes||"None").slice(0,1200);
  const prompt = [
    "You are VYAJ, a thoughtful travel-planning assistant. Return only valid JSON, with no markdown.",
    "Write every user-facing field in the itinerary JSON entirely in " + outputLanguage + ", except proper nouns. This includes the trip title, overview, day titles and summaries, activity names and descriptions, budget notes, tips and assumptions. Do not mix languages in ordinary prose. Preserve every city, town, region, country, island, neighbourhood, landmark, airport, street, hotel, venue and attraction name in its official/original spelling and script, regardless of the selected UI language. Never translate or transliterate place names into Arabic, French or Italian. For example, always write “Rome, Italy”, “Valletta, Malta”, “Puteaux, France”, “Gozo”, “Mdina” and “Ponte Vecchio” exactly like that, even when the rest of the itinerary is Arabic. The destination field must exactly match the user-provided destination string: " + JSON.stringify(destination) + ". Keep brand names and airport codes unchanged.",
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
    const upstreamUrl="https://api.groq.com/openai/v1/chat/completions";
    const upstreamOptions={method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+env.GROQ_API_KEY},body:JSON.stringify({model:"openai/gpt-oss-120b",messages:[{role:"system",content:"Return only valid JSON, without markdown."},{role:"user",content:prompt}],temperature:0.2,max_tokens:4000,response_format:{type:"json_object"}}),signal:AbortSignal.timeout(30000)};
    let response=await fetch(upstreamUrl,upstreamOptions);
    if(response.status>=500&&response.status<=599){await new Promise(resolve=>setTimeout(resolve,600));response=await fetch(upstreamUrl,upstreamOptions);}
    if(!response.ok){const detail=await response.text();console.error("Groq API error",response.status,detail.slice(0,500));return respond({error:response.status===429?"The AI planner is busy or its usage limit was reached. Please try again shortly.":"The AI service could not complete this trip. Please try again shortly."},response.status===429?429:502);}
    const result=await response.json(), output=result.choices&&result.choices[0]&&result.choices[0].message?result.choices[0].message.content:"";
    const first=output.indexOf("{"),last=output.lastIndexOf("}");if(first<0||last<=first)throw new Error("Invalid AI JSON");
    const itinerary=JSON.parse(output.slice(first,last+1));if(!itinerary.tripTitle||!Array.isArray(itinerary.days))throw new Error("Invalid itinerary format");
    return respond({status:"available",feature:"plan-trip",itinerary});
  }catch(error){console.error("Trip planning failed",error instanceof Error?error.name+": "+error.message:String(error));return respond({error:"We couldn't build that itinerary just now. Please try again."},502);}
}
function bytesToBase64(bytes){let binary="";for(const byte of bytes)binary+=String.fromCharCode(byte);return btoa(binary);}
function bytesToBase64Url(bytes){return bytesToBase64(bytes).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");}
function base64ToBytes(value){const binary=atob(value);return Uint8Array.from(binary,c=>c.charCodeAt(0));}
async function hashPassword(password,salt){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations:210000,hash:"SHA-256"},key,256);return bytesToBase64(new Uint8Array(bits));}
async function verifyPassword(password,salt,expected){try{const actual=await hashPassword(password,base64ToBytes(salt));const a=base64ToBytes(actual),b=base64ToBytes(expected);if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];return diff===0;}catch{return false;}}
async function sha256Hex(value){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,"0")).join("");}
async function authenticatedUser(request,db){const header=request.headers.get("Authorization")||"";const match=header.match(/^Bearer\s+([A-Za-z0-9_-]{30,100})$/i);if(!match)return null;const tokenHash=await sha256Hex(match[1]);const row=await db.prepare("SELECT u.id,u.email,u.display_name,s.token_hash FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? LIMIT 1").bind(tokenHash,new Date().toISOString()).first();return row?{id:row.id,email:row.email,display_name:row.display_name}:null;}
function parseJson(value){try{return JSON.parse(value);}catch{return null;}}
