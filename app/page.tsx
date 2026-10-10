 "use client";

import { useState, type FormEvent } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, Compass, Globe2, Heart, MapPin, Menu, MessageCircle, Sparkles, Users, X } from "lucide-react";

const places = [
  { name: "Amalfi Coast", country: "Italy", note: "Sea air, slow lunches, hidden coves", image: "photo-1533105079780-92b9be482077", tag: "For the slow days" },
  { name: "Copenhagen", country: "Denmark", note: "Design, bakeries, and bike lanes", image: "photo-1513622470522-26c3c8a854bc", tag: "For curious minds" },
  { name: "Madeira", country: "Portugal", note: "Wild trails and Atlantic horizons", image: "photo-1510414842594-a61c69b5ae57", tag: "For the outdoorsy" },
  { name: "Kyoto", country: "Japan", note: "Quiet temples and little discoveries", image: "photo-1493976040374-85c8e12f0c0e", tag: "For the culture seekers" },
];
const faqs = [
  ["What exactly is VYAJ?", "VYAJ is an AI-powered travel planner that helps you turn a few ideas into a thoughtful, realistic trip—built around your interests, time, and travel style."],
  ["Can I plan a trip with friends?", "That is part of the vision. VYAJ is being designed to help groups share ideas, compare options, vote on plans, and find a trip everyone feels good about."],
  ["Does VYAJ book flights and hotels?", "The current experience is focused on trip planning and inspiration. Booking integrations are planned for a later release."],
  ["Is VYAJ free?", "We are building the first experience now. Join the waitlist to hear when it is ready and how early access will work."],
];
const photo = (id: string, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("5–7 days");
  const [travellers, setTravellers] = useState("Two of us");
  const [style, setStyle] = useState("A bit of everything");
  const [prompt, setPrompt] = useState("");
  const [planned, setPlanned] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [plannerError, setPlannerError] = useState("");
  const [itinerary, setItinerary] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const startPlan = () => {
    setPlannerOpen(true);
    setPlanned(false);
    setPlannerError("");
    setItinerary(null);
  };

  const submitPlan = async (e: FormEvent) => {
    e.preventDefault();
    setPlannerError("");
    setLoadingPlan(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_VYAJ_API_URL;
      if (!apiBase) throw new Error("The AI service is not connected yet. The backend needs to be deployed and its URL added to the GitHub Actions variable NEXT_PUBLIC_VYAJ_API_URL.");
      const response = await fetch(apiBase.replace(/\\/$/, "") + "/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: destination.trim() || "Surprise me", duration: days, travellers, style, notes: prompt }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "The planner could not complete your request.");
      if (!payload?.itinerary?.days?.length) throw new Error("The AI response was incomplete. Please try again.");
      setItinerary(payload.itinerary);
      setPlanned(true);
    } catch (error) {
      setPlannerError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <main>
      <nav className="nav wrap">
        <a href="#" className="wordmark" aria-label="VYAJ home"><span className="brand-icon">v</span> vyaj<span className="brand-dot">.</span></a>
        <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#discover" onClick={() => setMenuOpen(false)}>Discover</a>
          <a href="#why" onClick={() => setMenuOpen(false)}>Why VYAJ</a>
          <button className="nav-mobile-cta" onClick={startPlan}>Plan a trip <ArrowUpRight size={16}/></button>
        </div>
        <button className="nav-cta" onClick={startPlan}>Plan a trip <ArrowUpRight size={16}/></button>
        <button className="menu-button" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      </nav>

      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot"/> YOUR NEXT CHAPTER STARTS HERE</div>
          <h1>Less planning.<br/><em>More feeling.</em></h1>
          <p className="hero-text">The world is too big for another spreadsheet. Tell VYAJ what you love, and let’s find the kind of trip you’ll talk about for years.</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={startPlan}>Plan my trip <ArrowUpRight size={17}/></button>
            <a className="text-link" href="#how">Get to know us <ArrowDownRight size={16}/></a>
          </div>
          <div className="hero-foot"><div className="avatar-stack"><span>✦</span><span>✺</span><span>◒</span></div><span>Made for the way <strong>you</strong> travel.</span><span className="hero-foot-line"/></div>
        </div>
        <div className="hero-art">
          <div className="hero-photo" role="img" aria-label="A sunlit Mediterranean coastline" />
          <div className="photo-label"><span className="label-mark">✳</span><div><strong>Somewhere unforgettable</strong><small>Find your kind of away.</small></div></div>
          <div className="floating-note"><span className="note-icon"><Sparkles size={16}/></span><div><small>A little less overwhelm</small><strong>A lot more wonder.</strong></div></div>
          <div className="hero-index">01 <span/> THE ART OF GETTING AWAY</div>
        </div>
        <div className="hero-scroll"><span>SCROLL TO EXPLORE</span><div/></div>
      </section>

      <section className="ticker" aria-label="VYAJ values"><div className="ticker-track"><span>GO SOMEWHERE</span><i>✳</i><span>FEEL SOMETHING</span><i>✳</i><span>MAKE IT YOURS</span><i>✳</i><span>GO SOMEWHERE</span><i>✳</i><span>FEEL SOMETHING</span><i>✳</i></div></section>

      <section className="intro section wrap" id="why">
        <div className="section-kicker"><span>01</span> A DIFFERENT WAY TO GET AWAY</div>
        <div className="intro-grid"><h2>Your trip should feel like <em>you.</em><br/>Not another to-do list.</h2><div className="intro-copy"><p>Too many tabs. Too many opinions. Too much time planning the trip instead of looking forward to it.</p><p>VYAJ brings the inspiration, decisions, and little details into one thoughtful place—so the good part starts before you leave.</p><a href="#how" className="under-link">Here’s how we make it happen <ArrowRight size={16}/></a></div></div>
        <div className="value-strip"><div><span className="value-number">01</span><Compass/><h3>Made around you</h3><p>Your pace, your people, your kind of adventure.</p></div><div><span className="value-number">02</span><Sparkles/><h3>Smart, not complicated</h3><p>Useful AI that makes decisions feel lighter.</p></div><div><span className="value-number">03</span><Heart/><h3>Room for real life</h3><p>Flexible plans that leave space for the unexpected.</p></div></div>
      </section>

      <section className="how-section" id="how"><div className="wrap section">
        <div className="section-kicker"><span>02</span> YOUR TRAVEL SIDEKICK</div>
        <div className="how-heading"><h2>From “we should go”<br/>to <em>“remember when?”</em></h2><p>A better trip begins with a better starting point. VYAJ helps you get there, one good decision at a time.</p></div>
        <div className="steps">
          <article className="step-card step-one"><div className="step-top"><span>01 / TELL US</span><MessageCircle size={19}/></div><div className="chat-preview"><div className="chat-bubble">I want somewhere by the sea, amazing food, and no rushing around.</div><div className="chat-response"><Sparkles size={14}/> Got a few places in mind for you…</div></div><h3>Start with a feeling.</h3><p>Tell VYAJ what matters to you. No perfect prompt needed—just your kind of trip.</p></article>
          <article className="step-card step-two"><div className="step-top"><span>02 / SHAPE IT</span><Globe2 size={19}/></div><div className="mini-itinerary"><div className="mini-day">DAY 02 <span>COAST & CULTURE</span></div><div className="mini-row"><span className="mini-dot lime"/>Slow morning by the water <small>09:30</small></div><div className="mini-row"><span className="mini-dot"/>Lunch in a local trattoria <small>12:45</small></div><div className="mini-row"><span className="mini-dot sand"/>Golden-hour viewpoint <small>18:10</small></div></div><h3>A plan with breathing room.</h3><p>Get a thoughtful itinerary that balances the must-sees with the joy of wandering.</p></article>
          <article className="step-card step-three"><div className="step-top"><span>03 / MAKE IT YOURS</span><Users size={19}/></div><div className="vote-preview"><span className="vote-label">THE GROUP CHAT, SORTED</span><strong>Where should we go for dinner?</strong><div className="vote-options"><div><span className="vote-thumb" style={{backgroundImage:`url(${photo("photo-1414235077428-338989a2e8c0",180)})`}}/><span>Little local spot</span><b>4 votes</b></div><div><span className="vote-thumb" style={{backgroundImage:`url(${photo("photo-1517248135467-4c7edcad34c4",180)})`}}/><span>Rooftop terrace</span><b>2 votes</b></div></div></div><h3>Better, together.</h3><p>Bring everyone into the plan. Compare ideas and make choices without the 86-message thread.</p></article>
        </div>
        <div className="center-cta"><button className="button button-lime" onClick={startPlan}>Give it a try <ArrowUpRight size={17}/></button><span>No perfect plan required.</span></div>
      </div></section>

      <section className="discover section wrap" id="discover">
        <div className="section-kicker"><span>03</span> A LITTLE INSPIRATION</div>
        <div className="discover-heading"><div><h2>The world is calling.<br/><em>What feels like you?</em></h2></div><p>Not just places to pin. Places to experience. Start with a feeling and see where it takes you.</p></div>
        <div className="destination-grid">{places.map((p, i) => <button className={`destination-card destination-${i+1}`} key={p.name} onClick={() => {setDestination(p.name); startPlan();}}><div className="destination-image" style={{backgroundImage:`url(${photo(p.image,900)})`}}/><span className="destination-tag">{p.tag}</span><div className="destination-info"><div><small>{p.country.toUpperCase()}</small><h3>{p.name}</h3><p>{p.note}</p></div><span className="destination-arrow"><ArrowUpRight size={18}/></span></div></button>)}</div>
        <div className="discover-bottom"><span>YOUR WORLD, YOUR WAY.</span><span>THE BEST PLACE TO START IS ANYWHERE <ArrowRight size={14}/></span></div>
      </section>

      <section className="manifesto"><div className="manifesto-bg"/><div className="manifesto-content"><span className="manifesto-star">✳</span><p>Travel isn’t about ticking places off a list.</p><h2>It’s about how<br/>the world makes<br/><em>you feel.</em></h2><span className="manifesto-sign">LET’S MAKE ROOM FOR THAT.</span></div><div className="manifesto-side">A NOTE FROM VYAJ <span>↗</span></div></section>

      <section className="faq-section section wrap"><div className="section-kicker"><span>04</span> GOOD QUESTIONS</div><div className="faq-layout"><div><h2>Wondering<br/>about <em>something?</em></h2><p>We’re making travel feel more human, one thoughtful detail at a time.</p><a href="mailto:hello@vyaj.eu" className="under-link">Ask us anything <ArrowUpRight size={16}/></a></div><div className="faq-list">{faqs.map(([q,a],i)=><div className={`faq-item ${openFaq===i?"faq-active":""}`} key={q}><button onClick={()=>setOpenFaq(openFaq===i?null:i)} aria-expanded={openFaq===i}><span>{q}</span><span className="faq-plus">{openFaq===i?"−":"+"}</span></button>{openFaq===i&&<p>{a}</p>}</div>)}</div></div></section>

      <section className="waitlist wrap" id="waitlist"><div className="waitlist-copy"><span className="section-kicker"><span>05</span> THE JOURNEY STARTS SOON</span><h2>Your next great story<br/>starts <em>here.</em></h2><p>We’re getting VYAJ ready for take-off. Get on the list and be among the first to travel a little differently.</p><form className="waitlist-form" onSubmit={e=>{e.preventDefault();setJoined(true);}}><label className="sr-only" htmlFor="email">Your email address</label><input id="email" type="email" required placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)}/><button type="submit" aria-label="Join the waitlist"><ArrowRight size={19}/></button></form><small className="form-note">{joined?<><Check size={14}/> You’re on our local demo list. We’ll be in touch when the waitlist is connected.</>:"No noise. Just a note when it’s time."}</small></div><div className="waitlist-art"><div className="waitlist-image" role="img" aria-label="A peaceful coastal landscape"/><div className="stamp"><span>GO</span><span>FIND</span><span>YOUR</span><span>AWAY</span><i>✳</i></div><span className="waitlist-caption">SOMEWHERE OUT THERE, YOUR NEXT STORY IS WAITING.</span></div></section>

      <footer className="footer wrap"><div className="footer-main"><a href="#" className="wordmark footer-logo"><span className="brand-icon">v</span> vyaj<span className="brand-dot">.</span></a><p>Plan less. Travel more.<br/>Make room for the good stuff.</p><a href="mailto:hello@vyaj.eu" className="footer-email">hello@vyaj.eu <ArrowUpRight size={15}/></a></div><div className="footer-bottom"><span>© 2026 VYAJ. MADE FOR THE WAY YOU WANDER.</span><div><a href="#why">Our approach</a><a href="#discover">Find inspiration</a><a href="#waitlist">Join the waitlist</a></div><a href="#" className="back-top">BACK TO TOP ↑</a></div></footer>

      {plannerOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setPlannerOpen(false);}}><div className="planner-modal" role="dialog" aria-modal="true" aria-labelledby="planner-title"><button className="modal-close" aria-label="Close planner" onClick={()=>setPlannerOpen(false)}><X size={20}/></button><div className="planner-kicker"><Sparkles size={15}/> YOUR TRAVEL SIDEKICK</div>{!planned ? <><h2 id="planner-title">Let’s find your <em>somewhere.</em></h2><p className="planner-intro">A few details are all we need to get your imagination moving.</p><form onSubmit={submitPlan} className="planner-form"><label>Where are you dreaming of?<input value={destination} onChange={e=>setDestination(e.target.value)} placeholder="e.g. Portugal, or surprise me"/></label><div className="planner-fields"><label>How long?<select value={days} onChange={e=>setDays(e.target.value)}><option>Weekend</option><option>3–4 days</option><option>5–7 days</option><option>1–2 weeks</option><option>Two weeks or more</option></select></label><label>Who’s coming?<select value={travellers} onChange={e=>setTravellers(e.target.value)}><option>Just me</option><option>Two of us</option><option>Friends</option><option>Family</option></select></label></div><label>What’s your kind of trip?<select value={style} onChange={e=>setStyle(e.target.value)}><option>A bit of everything</option><option>Food & local culture</option><option>Nature & outdoors</option><option>Rest & recharge</option><option>Art, design & cities</option><option>Adventure & surprises</option></select></label><label>Anything else on your mind? <span className="optional">(optional)</span><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="A place you’ve always wanted to see, a feeling you’re chasing…" rows={3}/></label><button className="button button-dark planner-submit" type="submit" disabled={loadingPlan}>{loadingPlan ? "Dreaming up your trip…" : "Build my itinerary"} {!loadingPlan && <ArrowUpRight size={17}/>}</button>{plannerError && <p className="planner-error" role="alert">{plannerError}</p>}<small className="planner-disclaimer">AI-generated suggestions. Check local details before you travel.</small></form></> : <div className="planner-result"><div className="result-sparkle"><Sparkles size={24}/></div><h2 id="planner-title">{itinerary?.tripTitle || "Your trip, thoughtfully planned."}</h2><p className="result-summary">{itinerary?.destination || destination || "Your destination"} · {days.toLowerCase()} · {travellers.toLowerCase()}</p><p className="result-overview">{itinerary?.overview}</p>{itinerary?.estimatedBudget && <div className="budget-strip"><span>ESTIMATED BUDGET / PERSON</span><strong>{itinerary.estimatedBudget.perPerson}</strong><small>{itinerary.estimatedBudget.notes}</small></div>}<div className="itinerary-days">{(itinerary?.days || []).map((day: any, index: number) => <article className="itinerary-day" key={String(day.day || index)}><div className="itinerary-day-heading"><span>DAY {day.day || index + 1}</span><h3>{day.title}</h3></div><p>{day.summary}</p><div className="itinerary-activities">{(day.activities || []).map((activity: any, activityIndex: number) => <div className="itinerary-activity" key={activity.title + activityIndex}><span className="activity-time">{activity.time || "Explore"}</span><div><strong>{activity.title}</strong><p>{activity.description}</p><small>{activity.location}{activity.estimatedCost ? " · " + activity.estimatedCost : ""}</small></div></div>)}</div></article>)}</div>{Array.isArray(itinerary?.tips) && itinerary.tips.length > 0 && <div className="planner-extra"><strong>Good to know</strong><ul>{itinerary.tips.map((tip: string, index: number) => <li key={index}>{tip}</li>)}</ul></div>}{Array.isArray(itinerary?.assumptions) && itinerary.assumptions.length > 0 && <p className="result-footnote">Planning notes: {itinerary.assumptions.join(" ")}</p>}<p className="result-footnote">AI-generated planning suggestions, not live-verified opening hours, prices, transport schedules, or bookings. Check important details before you go.</p><button className="button button-dark planner-submit" onClick={()=>{setPlanned(false);setPlannerError("");}}>Adjust my idea <ArrowRight size={17}/></button><button className="result-close" onClick={()=>setPlannerOpen(false)}>Close planner</button></div>}</div></div>}
    </main>
  );
}
