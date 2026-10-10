 "use client";

import { useState, type FormEvent } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, Compass, Globe2, Heart, MapPin, Menu, MessageCircle, Sparkles, Users, X } from "lucide-react";
import { postAction, type Itinerary } from "../lib/api";

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
  const [thinking, setThinking] = useState(false);
  const [activeAction, setActiveAction] = useState("plan-trip");
  const [activePayload, setActivePayload] = useState<Record<string, unknown>>({});
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [plannerError, setPlannerError] = useState("");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistMessage, setWaitlistMessage] = useState("");

  const startPlan = () => {
    setPlannerOpen(true);
    setPlanned(false);
    setThinking(false);
    setActiveAction("plan-trip");
    setPlannerError("");
    setItinerary(null);
  };

  const submitPlan = async (e: FormEvent) => {
    e.preventDefault();
    setPlannerError("");
    if (!destination.trim()) {
      setPlannerError("Add a destination or an idea to get started.");
      return;
    }
    setActiveAction("plan-trip");
    setThinking(true);
    setLoadingPlan(true);
    try {
      const response = await postAction<Itinerary>("plan-trip", {
        destination: destination.trim(),
        duration: days,
        travellers,
        style,
        notes: prompt.trim(),
      });
      if (response.status === "coming_soon") {
        setItinerary(null);
      } else if (response.status === "available" && response.itinerary) {
        setItinerary(response.itinerary);
      } else {
        throw new Error(response.message || "This feature isn't available right now. Please try again.");
      }
      setPlanned(true);
    } catch (error) {
      setPlannerError(error instanceof Error ? error.message : "We couldn't connect just now. Please try again.");
      setThinking(false);
    } finally {
      setLoadingPlan(false);
    }
  };

  const actionCopy: Record<string, { title: string; subtitle: string; resultTitle: string; message: string }> = {
    "decide-for-us": { title: "Decide for us", subtitle: "We’re finding a journey that feels right for you…", resultTitle: "Let VYAJ choose your next adventure.", message: "Our smart decision experience is coming soon. We’ll help you choose without the endless comparing." },
    "surprise-me": { title: "Surprise me", subtitle: "Looking for somewhere you might never have considered…", resultTitle: "A little surprise is on its way.", message: "Personalised travel surprises are coming soon. Get ready to discover somewhere unexpected." },
    "join-waitlist": { title: "Join the waitlist", subtitle: "Getting your early-access request ready…", resultTitle: "Be first to hear from VYAJ.", message: "Waitlist registration is coming soon. Your email has not been saved yet." },
    "view-profile": { title: "Your profile", subtitle: "Preparing your personal travel space…", resultTitle: "Your travel profile is on its way.", message: "Your VYAJ profile and account tools are coming soon." },
    "view-notifications": { title: "Notifications", subtitle: "Checking what’s new for your journeys…", resultTitle: "Your updates are coming soon.", message: "Trip updates and notifications will be available in a future release." },
    "save-trip": { title: "Save this trip", subtitle: "Getting your journey ready to save…", resultTitle: "Your travel collection is coming soon.", message: "Saving and syncing trips requires your VYAJ account, coming soon." },
    "share-trip": { title: "Share this trip", subtitle: "Preparing a way to share your journey…", resultTitle: "Travel together, soon.", message: "Share links and traveller invitations are coming soon." },
    "open-settings": { title: "Settings", subtitle: "Preparing your preferences…", resultTitle: "Your preferences are coming soon.", message: "Account, privacy and travel preferences will be available soon." },
    "login": { title: "Sign in", subtitle: "Preparing your secure sign-in…", resultTitle: "Your VYAJ account is coming soon.", message: "Sign-in and account creation are not available yet." },
    "signup": { title: "Create an account", subtitle: "Preparing your VYAJ account…", resultTitle: "Your VYAJ account is coming soon.", message: "Account creation and secure sign-in are coming soon." },
    "book-trip": { title: "Booking", subtitle: "Checking the next step for your journey…", resultTitle: "Booking tools are coming soon.", message: "VYAJ does not book flights, stays or activities yet." },
    "add-activity": { title: "Add an activity", subtitle: "Preparing your itinerary editor…", resultTitle: "Itinerary editing is coming soon.", message: "Adding and rearranging activities will be available in a future release." },
    "edit-itinerary": { title: "Edit itinerary", subtitle: "Preparing your itinerary editor…", resultTitle: "Your itinerary editor is coming soon.", message: "Custom itinerary editing and adjustments are coming soon." },
    "invite-travelers": { title: "Invite travellers", subtitle: "Preparing your group trip…", resultTitle: "Group travel is coming soon.", message: "Invitations, shared plans and group voting are not available yet." },
    "submit-vote": { title: "Vote on a trip", subtitle: "Preparing your group decision…", resultTitle: "Group voting is coming soon.", message: "Voting on destinations and activities will arrive in a future release." },
    "search-destinations": { title: "Search destinations", subtitle: "Finding a place that fits your idea…", resultTitle: "Destination search is coming soon.", message: "Live destination search and recommendations are being prepared." },
  };

  const runFeatureAction = async (action: string, payload: Record<string, unknown> = {}) => {
    setPlannerOpen(true);
    setPlanned(false);
    setItinerary(null);
    setPlannerError("");
    setActiveAction(action);
    setActivePayload(payload);
    setThinking(true);
    try {
      const response = await postAction(action, payload);
      if (response.status === "coming_soon") {
        setPlanned(true);
      } else if (response.status === "available" && response.itinerary) {
        setItinerary(response.itinerary);
        setPlanned(true);
      } else {
        throw new Error(response.message || "This feature isn't available right now. Please try again.");
      }
    } catch (error) {
      setPlannerError(error instanceof Error ? error.message : "We couldn't connect just now. Please try again.");
      setThinking(false);
    }
  };

  return (
    <main>
      <nav className="nav wrap">
        <a href="#" className="wordmark" aria-label="VYAJ home"><img src="/vyaj-logo.svg" alt="VYAJ — Plan less. Travel more." /></a>
        <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#discover" onClick={() => setMenuOpen(false)}>Discover</a>
          <a href="#why" onClick={() => setMenuOpen(false)}>Why VYAJ</a>
          <button className="nav-mobile-cta" onClick={startPlan}>Plan a trip <ArrowUpRight size={16}/></button>
        </div>
        <div className="nav-product-actions"><button className="nav-icon-action" aria-label="Open profile" onClick={()=>runFeatureAction("view-profile")}><Users size={17}/></button><button className="nav-icon-action" aria-label="View notifications" onClick={()=>runFeatureAction("view-notifications")}><MessageCircle size={17}/></button><button className="nav-cta" onClick={startPlan}>Plan a trip <ArrowUpRight size={16}/></button></div>
        <button className="menu-button" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      </nav>

      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot"/> YOUR NEXT TRIP, MADE PERSONAL</div>
          <h1>Where to <em>next?</em></h1>
          <p className="hero-text">Your AI travel planner. Tell us what you love, and get a thoughtful trip made around you.</p>
          <form className="hero-composer" onSubmit={e=>{e.preventDefault();startPlan();}}>
            <label htmlFor="hero-destination">LET’S START WITH A PLACE OR AN IDEA</label>
            <div className="hero-composer-field"><MapPin size={18}/><input id="hero-destination" value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Italy for 5 days, a quiet beach…" /><button type="submit" aria-label="Start planning" ><ArrowUpRight size={19}/></button></div>
            <div className="hero-suggestions"><span>Try:</span><button type="button" onClick={()=>{setDestination("A long weekend in Italy");setPrompt("A long weekend in Italy");}}>Long weekend in Italy</button><button type="button" onClick={()=>{setDestination("A peaceful beach escape");setPrompt("A peaceful beach escape");}}>Beach escape</button><button type="button" onClick={()=>{setDestination("Surprise me");setPrompt("Surprise me with somewhere unexpected");}}>Surprise me</button></div>
          </form>
          <div className="hero-secondary"><button className="text-link" onClick={startPlan}>Plan a trip <ArrowRight size={16}/></button><button className="text-link" onClick={()=>runFeatureAction("decide-for-us")}>Decide for us <ArrowRight size={16}/></button><button className="text-link" onClick={()=>runFeatureAction("surprise-me")}>Surprise me <ArrowRight size={16}/></button></div>
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
        <div className="section-kicker"><span>01</span> TRAVEL, WITHOUT THE OVERTHINKING</div>
        <div className="intro-grid"><h2>Less planning.<br/><em>More time away.</em></h2><div className="intro-copy"><p>Skip the endless tabs and group-chat debates.</p><p>VYAJ brings ideas and practical plans together, so you can focus on the experience.</p><a href="#how" className="under-link">Here’s how we make it happen <ArrowRight size={16}/></a></div></div>
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
        <div className="center-cta"><button className="button button-lime" onClick={startPlan}>Plan a trip <ArrowUpRight size={17}/></button><span>No perfect plan required.</span></div>
      </div></section>

      <section className="discover section wrap" id="discover">
        <div className="section-kicker"><span>03</span> A LITTLE INSPIRATION</div>
        <div className="discover-heading"><div><h2>The world is calling.<br/><em>What feels like you?</em></h2></div><p>Not just places to pin. Places to experience. Start with a feeling and see where it takes you.</p></div>
        <div className="destination-grid">{places.map((p, i) => <button className={`destination-card destination-${i+1}`} key={p.name} onClick={() => {setDestination(p.name); startPlan();}}><div className="destination-image" style={{backgroundImage:`url(${photo(p.image,900)})`}}/><span className="destination-tag">{p.tag}</span><div className="destination-info"><div><small>{p.country.toUpperCase()}</small><h3>{p.name}</h3><p>{p.note}</p></div><span className="destination-arrow"><ArrowUpRight size={18}/></span></div></button>)}</div>
        <div className="discover-bottom"><span>YOUR WORLD, YOUR WAY.</span><span>THE BEST PLACE TO START IS ANYWHERE <ArrowRight size={14}/></span></div>
      </section>

      <section className="manifesto"><div className="manifesto-bg"/><div className="manifesto-content"><span className="manifesto-star">✳</span><p>Travel isn’t about ticking places off a list.</p><h2>It’s about how<br/>the world makes<br/><em>you feel.</em></h2><span className="manifesto-sign">LET’S MAKE ROOM FOR THAT.</span></div><div className="manifesto-side">A NOTE FROM VYAJ <span>↗</span></div></section>

      <section className="faq-section section wrap"><div className="section-kicker"><span>04</span> GOOD QUESTIONS</div><div className="faq-layout"><div><h2>Wondering<br/>about <em>something?</em></h2><p>We’re making travel feel more human, one thoughtful detail at a time.</p><a href="mailto:hello@vyaj.eu" className="under-link">Ask us anything <ArrowUpRight size={16}/></a></div><div className="faq-list">{faqs.map(([q,a],i)=><div className={`faq-item ${openFaq===i?"faq-active":""}`} key={q}><button onClick={()=>setOpenFaq(openFaq===i?null:i)} aria-expanded={openFaq===i}><span>{q}</span><span className="faq-plus">{openFaq===i?"−":"+"}</span></button>{openFaq===i&&<p>{a}</p>}</div>)}</div></div></section>

      <section className="waitlist wrap" id="waitlist"><div className="waitlist-copy"><span className="section-kicker"><span>05</span> THE JOURNEY STARTS SOON</span><h2>Your next great story<br/>starts <em>here.</em></h2><p>We’re getting VYAJ ready for take-off. Get on the list and be among the first to travel a little differently.</p><form className="waitlist-form" onSubmit={e=>{e.preventDefault();if(!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){setWaitlistMessage("Enter a valid email address.");return;}runFeatureAction("join-waitlist",{email:email.trim()});}}><label className="sr-only" htmlFor="email">Your email address</label><input id="email" type="email" required placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)}/><button type="submit" aria-label="Join the waitlist"><ArrowRight size={19}/></button></form><small className="form-note" aria-live="polite">{waitlistMessage || "No noise. Just a note when it’s time."}</small></div><div className="waitlist-art"><div className="waitlist-image" role="img" aria-label="A peaceful coastal landscape"/><div className="stamp"><span>GO</span><span>FIND</span><span>YOUR</span><span>AWAY</span><i>✳</i></div><span className="waitlist-caption">SOMEWHERE OUT THERE, YOUR NEXT STORY IS WAITING.</span></div></section>

      <footer className="footer wrap"><div className="footer-main"><a href="#" className="wordmark footer-logo"><img src="/vyaj-logo.svg" alt="VYAJ — Plan less. Travel more." /></a><p>Plan less. Travel more.<br/>Make room for the good stuff.</p><a href="mailto:hello@vyaj.eu" className="footer-email">hello@vyaj.eu <ArrowUpRight size={15}/></a></div><div className="footer-bottom"><span>© 2026 VYAJ. MADE FOR THE WAY YOU WANDER.</span><div><a href="#why">Our approach</a><a href="#discover">Find inspiration</a><a href="#waitlist">Join the waitlist</a></div><a href="#" className="back-top">BACK TO TOP ↑</a></div></footer>

      {plannerOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setPlannerOpen(false);}}><div className="planner-modal" role="dialog" aria-modal="true" aria-labelledby="planner-title"><button className="modal-close" aria-label="Close planner" onClick={()=>setPlannerOpen(false)}><X size={20}/></button><div className="planner-kicker"><Sparkles size={15}/> YOUR TRAVEL SIDEKICK</div>{thinking ? <div className="planner-thinking" role="status"><div className="thinking-orbit"><span></span><span></span><Sparkles size={25}/></div><p className="thinking-kicker">VYAJ / YOUR TRAVEL SIDEKICK</p><h2 id="planner-title">THINKING<span className="thinking-ellipsis">...</span></h2><p className="thinking-copy">{actionCopy[activeAction]?.subtitle || "Finding the right journey for you…"}</p><div className="thinking-progress"><span/></div></div> : plannerError && activeAction !== "plan-trip" ? <div className="planner-action-error" role="alert"><div className="result-sparkle"><X size={22}/></div><p className="thinking-kicker">CONNECTION ISSUE</p><h2 id="planner-title">We couldn’t complete that just now.</h2><p className="thinking-copy">{plannerError}</p><button className="button button-dark planner-submit" onClick={()=>runFeatureAction(activeAction,activePayload)}>Try again <ArrowRight size={17}/></button><button className="result-close" onClick={()=>{setPlannerOpen(false);setPlannerError("");}}>Back to VYAJ</button></div> : !planned ? <><h2 id="planner-title">Let’s find your <em>somewhere.</em></h2><p className="planner-intro">A few details are all we need to get your imagination moving.</p><form onSubmit={submitPlan} className="planner-form"><label>Where are you dreaming of?<input value={destination} onChange={e=>setDestination(e.target.value)} placeholder="e.g. Portugal, or surprise me"/></label><div className="planner-fields"><label>How long?<select value={days} onChange={e=>setDays(e.target.value)}><option>Weekend</option><option>3–4 days</option><option>5–7 days</option><option>1–2 weeks</option><option>Two weeks or more</option></select></label><label>Who’s coming?<select value={travellers} onChange={e=>setTravellers(e.target.value)}><option>Just me</option><option>Two of us</option><option>Friends</option><option>Family</option></select></label></div><label>What’s your kind of trip?<select value={style} onChange={e=>setStyle(e.target.value)}><option>A bit of everything</option><option>Food & local culture</option><option>Nature & outdoors</option><option>Rest & recharge</option><option>Art, design & cities</option><option>Adventure & surprises</option></select></label><label>Anything else on your mind? <span className="optional">(optional)</span><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="A place you’ve always wanted to see, a feeling you’re chasing…" rows={3}/></label><button className="button button-dark planner-submit" type="submit" disabled={loadingPlan}>{loadingPlan ? "Dreaming up your trip…" : "Build my itinerary"} {!loadingPlan && <ArrowUpRight size={17}/>}</button>{plannerError && <p className="planner-error" role="alert">{plannerError}</p>}<small className="planner-disclaimer">AI-generated suggestions. Check local details before you travel.</small></form></> : <div className="planner-result">
        <div className="result-sparkle"><Sparkles size={24}/></div>
        {itinerary ? <>
          <p className="result-ready-kicker">✦ YOUR JOURNEY</p>
          <h2 id="planner-title">{itinerary.tripTitle}</h2>
          <p className="result-summary">{itinerary.destination} · {days.toLowerCase()} · {travellers.toLowerCase()}</p>
          <p className="result-overview">{itinerary.overview}</p>
          {itinerary.estimatedBudget && <div className="budget-strip"><span>ESTIMATED BUDGET / PERSON</span><strong>{itinerary.estimatedBudget.perPerson}</strong><small>{itinerary.estimatedBudget.notes}</small></div>}
          <div className="itinerary-days">{itinerary.days.map((day, index) => <article className="itinerary-day" key={day.day || index}><div className="itinerary-day-heading"><span>DAY {day.day || index + 1}</span><h3>{day.title}</h3></div><p>{day.summary}</p><div className="itinerary-activities">{(day.activities || []).map((activity, activityIndex) => <div className="itinerary-activity" key={activity.title + activityIndex}><span className="activity-time">{activity.time || "Explore"}</span><div><strong>{activity.title}</strong><p>{activity.description}</p><small>{activity.location}{activity.estimatedCost ? " · " + activity.estimatedCost : ""}</small></div></div>)}</div></article>)}</div>
          {itinerary.tips?.length ? <div className="planner-extra"><strong>Good to know</strong><ul>{itinerary.tips.map((tip, index) => <li key={index}>{tip}</li>)}</ul></div> : null}
          <p className="result-footnote">AI-generated suggestions. Opening hours, prices and availability are not live-verified.</p><div className="itinerary-actions"><button className="button button-dark" onClick={()=>runFeatureAction("save-trip",{destination:itinerary.destination,itinerary})}>Save trip <Heart size={16}/></button><button className="button button-light" onClick={()=>runFeatureAction("share-trip",{destination:itinerary.destination})}>Share trip <ArrowUpRight size={16}/></button><button className="text-link" onClick={()=>runFeatureAction("edit-itinerary",{destination:itinerary.destination,itinerary})}>Edit itinerary <ArrowRight size={16}/></button><button className="text-link" onClick={()=>runFeatureAction("add-activity",{destination:itinerary.destination,itinerary})}>Add activity <ArrowRight size={16}/></button></div>
        </> : <>
          <p className="result-ready-kicker">✦ YOUR NEXT ADVENTURE</p>
          <h2 id="planner-title">{actionCopy[activeAction]?.resultTitle || "Your journey is getting ready."}</h2>
          <p className="result-summary">{destination || "Your destination"} · {days.toLowerCase()} · {travellers.toLowerCase()}</p>
          <div className="coming-soon-panel"><span>COMING SOON</span><p>{actionCopy[activeAction]?.message || "We’re putting the finishing touches on your VYAJ travel experience. Your next great journey starts here."}</p></div>
        </>}
        <button className="button button-dark planner-submit" onClick={()=>{setPlanned(false);setThinking(false);setPlannerError("");}}>Back to planning <ArrowRight size={17}/></button>
        <button className="result-close" onClick={()=>{setPlannerOpen(false);setPlanned(false);setThinking(false);}}>Back to VYAJ</button>
      </div>}</div></div>}
    </main>
  );
}
