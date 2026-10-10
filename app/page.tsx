"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Clock3, Compass, MapPin, Menu, Sparkles, Users, X } from "lucide-react";

type TripStyle = "Food & culture" | "Nature & outdoors" | "Slow escape" | "A bit of everything";

const styles: TripStyle[] = ["Food & culture", "Nature & outdoors", "Slow escape", "A bit of everything"];

const demoIdeas: Record<TripStyle, { morning: string; afternoon: string; evening: string; note: string }> = {
  "Food & culture": {
    morning: "Explore the historic centre on foot",
    afternoon: "Visit a local market or cultural landmark",
    evening: "Find a neighbourhood spot for dinner",
    note: "A little history, a lot of local flavour, and enough time to enjoy both."
  },
  "Nature & outdoors": {
    morning: "Start with a scenic walk or coastal viewpoint",
    afternoon: "Spend time outdoors at an unhurried pace",
    evening: "Watch the light change over the landscape",
    note: "Fresh air and open space, with room to adapt to the weather."
  },
  "Slow escape": {
    morning: "Take a relaxed breakfast close to your stay",
    afternoon: "Choose one beautiful place and stay awhile",
    evening: "Enjoy a quiet dinner and an easy stroll",
    note: "Fewer stops, softer timings, and no pressure to see everything."
  },
  "A bit of everything": {
    morning: "Discover a landmark or a walkable old town",
    afternoon: "Mix a local experience with time to explore",
    evening: "End with a memorable view and a relaxed meal",
    note: "A balanced mix of discovery, downtime, and good food."
  }
};

const destinationHints = [
  { name: "Sicily, Italy", text: "Food, coastlines & historic towns", image: "photo-1533105079780-92b9be482077" },
  { name: "Lisbon, Portugal", text: "Colourful streets & easygoing days", image: "photo-1555881400-74d7acaacd8b" },
  { name: "Copenhagen, Denmark", text: "Design, coffee & city wandering", image: "photo-1513622470522-26c3c8a854bc" }
];

function money(value: string) {
  return value === "Flexible" ? "Flexible budget" : value + " total";
}

export default function Home() {
  const [destination, setDestination] = useState("Sicily, Italy");
  const [days, setDays] = useState("4");
  const [budget, setBudget] = useState("€600");
  const [travellers, setTravellers] = useState("2");
  const [style, setStyle] = useState<TripStyle>("Food & culture");
  const [resultReady, setResultReady] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  const tripIdea = useMemo(() => demoIdeas[style], [style]);
  const dayCount = Number(days);
  const resultDays = Array.from({ length: Math.min(dayCount, 7) }, (_, index) => ({
    day: index + 1,
    title: [
      "Arrive & get your bearings",
      "Explore beyond the obvious",
      "Make time for local life",
      "Leave room for a favourite",
      "A slower day, your way",
      "One last discovery",
      "Take the scenic route"
    ][index],
    activities: [
      ["09:30", tripIdea.morning],
      ["13:00", tripIdea.afternoon],
      ["18:30", tripIdea.evening]
    ]
  }));

  function buildTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!destination.trim()) {
      setError("Add a destination to preview your trip.");
      setResultReady(false);
      return;
    }
    setError("");
    setResultReady(true);
    window.setTimeout(() => document.getElementById("sample-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  function pickDestination(value: string) {
    setDestination(value);
    setResultReady(false);
    document.getElementById("trip-builder")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <main className="v2-site">
      <header className="v2-header">
        <a href="#top" className="v2-brand" aria-label="VYAJ home"><img src="/vyaj-wordmark.svg" alt="VYAJ" /></a>
        <button className="v2-menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
        <nav className={menuOpen ? "v2-nav v2-nav-open" : "v2-nav"} aria-label="Main navigation">
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#availability" onClick={() => setMenuOpen(false)}>What’s available</a>
          <a href="#early-access" onClick={() => setMenuOpen(false)}>Early access</a>
          <a href="#trip-builder" className="v2-nav-cta" onClick={() => setMenuOpen(false)}>Build my trip <ArrowUpRight size={15}/></a>
        </nav>
      </header>

      <section className="v2-hero" id="top">
        <div className="v2-hero-image" aria-hidden="true" />
        <div className="v2-hero-overlay" aria-hidden="true" />
        <div className="v2-hero-content">
          <div className="v2-eyebrow v2-eyebrow-light"><span className="v2-status-dot" /> YOUR NEXT TRIP, MADE CLEARER</div>
          <h1>Less planning.<br/><span>More going.</span></h1>
          <p className="v2-hero-lead">Turn a destination, a budget and a few days into a trip you can picture.</p>
          <a className="v2-button v2-button-bright" href="#trip-builder">Build my trip <ArrowUpRight size={17}/></a>
          <div className="v2-hero-foot"><span><Sparkles size={14}/> A simpler way to shape your next getaway</span><a href="#trip-builder">Try the interactive demo <ArrowDown size={14}/></a></div>
        </div>
        <div className="v2-hero-card">
          <span className="v2-card-kicker">YOUR TRIP STARTS WITH</span>
          <div><MapPin size={16}/><span>A place you want to see</span></div>
          <div><Compass size={16}/><span>A budget that feels right</span></div>
          <div><Clock3 size={16}/><span>Time to make it yours</span></div>
        </div>
      </section>

      <section className="v2-builder v2-section" id="trip-builder">
        <div className="v2-section-intro">
          <div className="v2-eyebrow"><span>01</span><i/> START WITH THE BASICS</div>
          <h2>Build a trip<br/><em>that fits.</em></h2>
          <p>Set the essentials. We’ll show you how a more considered itinerary could come together.</p>
          <div className="v2-mini-proof"><span><Check size={15}/></span> No perfect prompt required.</div>
        </div>
        <form className="v2-builder-card" onSubmit={buildTrip}>
          <div className="v2-builder-top"><div><span className="v2-small-label">VYAJ TRIP BUILDER</span><h3>Where to next?</h3></div><span className="v2-demo-tag">DEMO</span></div>
          <label className="v2-field"><span>Destination</span><input value={destination} onChange={event => { setDestination(event.target.value); setResultReady(false); }} placeholder="e.g. Sicily, Italy" required/><small>Have a place in mind? Start there.</small></label>
          <div className="v2-form-grid">
            <label className="v2-field"><span>How many days?</span><select value={days} onChange={event => { setDays(event.target.value); setResultReady(false); }}>{["2","3","4","5","6","7"].map(value => <option key={value} value={value}>{value} days</option>)}</select></label>
            <label className="v2-field"><span>Travellers</span><select value={travellers} onChange={event => { setTravellers(event.target.value); setResultReady(false); }}>{["1","2","3","4","5+"].map(value => <option key={value} value={value}>{value === "1" ? "1 person" : value === "5+" ? "5+ people" : value + " people"}</option>)}</select></label>
          </div>
          <fieldset className="v2-choice-field"><legend>Total budget</legend><div className="v2-budget-options">{["€300","€600","€1,000","Flexible"].map(value => <button type="button" key={value} className={budget === value ? "v2-budget-option v2-selected" : "v2-budget-option"} onClick={() => { setBudget(value); setResultReady(false); }} aria-pressed={budget === value}>{value}</button>)}</div><small>Choose your overall budget. Costs aren’t live-checked.</small></fieldset>
          <fieldset className="v2-choice-field"><legend>Your kind of trip</legend><div className="v2-style-options">{styles.map(value => <button type="button" key={value} className={style === value ? "v2-style-option v2-selected" : "v2-style-option"} onClick={() => { setStyle(value); setResultReady(false); }} aria-pressed={style === value}>{value}</button>)}</div></fieldset>
          {error && <p className="v2-form-error" role="alert">{error}</p>}
          <button className="v2-button v2-button-dark v2-submit" type="submit">Preview my trip <ArrowUpRight size={17}/></button>
          <p className="v2-form-note"><Sparkles size={13}/> Interactive sample · No booking or live AI connection</p>
        </form>
      </section>

      <section className="v2-result-section" id="sample-result" aria-live="polite">
        <div className="v2-result-wrap">
          <div className="v2-result-heading">
            <div><div className="v2-eyebrow v2-eyebrow-light"><span>02</span><i/> A FIRST LOOK</div><h2>A trip you<br/><em>can picture.</em></h2></div>
            <p>{resultReady ? "Here’s a sample structure shaped around your selections. It’s a concept preview, not a verified travel plan." : "A useful plan is more than a list of places. It gives each day a rhythm, without filling every minute."}</p>
          </div>
          {resultReady ? (
            <div className="v2-result-content">
              <div className="v2-trip-summary">
                <div className="v2-summary-icon"><MapPin size={19}/></div><div className="v2-summary-main"><span className="v2-small-label">YOUR SAMPLE TRIP</span><h3>{destination.trim()}</h3><p>{days} days <span>·</span> {travellers} {travellers === "1" ? "traveller" : "travellers"} <span>·</span> {style}</p></div><span className="v2-demo-tag v2-demo-tag-dark">SAMPLE</span>
              </div>
              <div className="v2-result-grid">
                <div className="v2-days-list">{resultDays.map(day => <article className="v2-day-card" key={day.day}><div className="v2-day-top"><span>DAY {String(day.day).padStart(2, "0")}</span><strong>{day.title}</strong></div>{day.activities.map(([time, activity]) => <div className="v2-activity" key={time}><span>{time}</span><p>{activity}</p></div>)}</article>)}</div>
                <aside className="v2-result-aside"><span className="v2-small-label">YOUR STARTING POINT</span><h3>{money(budget)}</h3><p>Budget entered by you. This demo does not calculate or verify real travel costs.</p><div className="v2-aside-divider"/><span className="v2-small-label">WHY THIS SHAPE?</span><p>{tripIdea.note}</p><div className="v2-assumption"><Sparkles size={15}/><span>Sample suggestions only. Check opening times, transport, availability and prices before travelling.</span></div><button className="v2-button v2-button-outline" type="button" onClick={() => { setResultReady(false); document.getElementById("trip-builder")?.scrollIntoView({behavior:"smooth",block:"center"}); }}>Edit your details <ArrowRight size={16}/></button></aside>
              </div>
              <p className="v2-result-disclaimer">Illustrative content generated in your browser. No live AI, map routing, booking, or pricing data is connected.</p>
            </div>
          ) : (
            <div className="v2-result-preview">
              <div className="v2-preview-days"><div className="v2-preview-day"><span>DAY 01</span><i/><div><b>Arrive & settle in</b><small>Get your bearings, without rushing.</small></div></div><div className="v2-preview-day"><span>DAY 02</span><i/><div><b>Explore with intention</b><small>One anchor activity. Space around it.</small></div></div><div className="v2-preview-day"><span>DAY 03</span><i/><div><b>Leave room for a surprise</b><small>Local finds and time to wander.</small></div></div></div>
              <div className="v2-preview-aside"><div className="v2-preview-orbit"><Compass size={34}/><span/><i/></div><span className="v2-small-label">A BETTER KIND OF ITINERARY</span><h3>Structure, not a schedule to obey.</h3><p>Preview a sample plan built around your destination, time and travel style.</p><button className="v2-text-button" type="button" onClick={() => document.getElementById("trip-builder")?.scrollIntoView({behavior:"smooth",block:"center"})}>Try your own details <ArrowRight size={15}/></button></div>
            </div>
          )}
        </div>
      </section>

      <section className="v2-how v2-section" id="how">
        <div className="v2-how-heading"><div className="v2-eyebrow"><span>03</span><i/> HOW IT WORKS</div><h2>From “somewhere”<br/>to <em>let’s go.</em></h2><p>Keep the decisions simple. Make the trip feel like yours.</p></div>
        <div className="v2-steps">
          <article><span className="v2-step-number">01</span><div className="v2-step-icon"><MapPin size={21}/></div><h3>Set the essentials</h3><p>Choose a destination, the time you have and a budget you’re comfortable with.</p></article>
          <article><span className="v2-step-number">02</span><div className="v2-step-icon"><Sparkles size={21}/></div><h3>Shape your days</h3><p>See a sample rhythm for your trip, with ideas matched to the kind of experience you want.</p></article>
          <article><span className="v2-step-number">03</span><div className="v2-step-icon"><Compass size={21}/></div><h3>Make it your own</h3><p>Adjust your inputs and preview a different direction. Real AI planning is a future step.</p></article>
        </div>
      </section>

      <section className="v2-availability" id="availability">
        <div className="v2-availability-inner">
          <div className="v2-eyebrow v2-eyebrow-light"><span>04</span><i/> CLEAR FROM DAY ONE</div>
          <div className="v2-availability-heading"><h2>Useful now.<br/><em>More to come.</em></h2><p>We’d rather be clear about what’s ready than promise features that aren’t connected yet.</p></div>
          <div className="v2-feature-status">
            <div className="v2-status-row"><span className="v2-status-icon v2-status-ready"><Check size={17}/></span><div><strong>Interactive trip preview</strong><small>Works in this demo using your choices.</small></div><span className="v2-status-label">AVAILABLE</span></div>
            <div className="v2-status-row"><span className="v2-status-icon"><Sparkles size={17}/></span><div><strong>AI-generated itineraries</strong><small>Needs a connected planning service.</small></div><span className="v2-status-label v2-status-soon">COMING SOON</span></div>
            <div className="v2-status-row"><span className="v2-status-icon"><Compass size={17}/></span><div><strong>Live prices & route times</strong><small>No live travel data is connected.</small></div><span className="v2-status-label v2-status-soon">COMING SOON</span></div>
            <div className="v2-status-row"><span className="v2-status-icon"><Users size={17}/></span><div><strong>Save, share & book</strong><small>Planned for a later release.</small></div><span className="v2-status-label v2-status-soon">COMING SOON</span></div>
          </div>
        </div>
      </section>

      <section className="v2-early-access v2-section" id="early-access">
        <div className="v2-early-art"><div className="v2-early-image"/><div className="v2-early-stamp"><img src="/vyaj-v-symbol.svg" alt=""/><span>PLAN LESS.<br/>TRAVEL MORE.</span></div></div>
        <div className="v2-early-copy"><div className="v2-eyebrow"><span>05</span><i/> THE NEXT CHAPTER</div><h2>Your next trip<br/>starts with <em>an idea.</em></h2><p>VYAJ is being built to make trip planning feel lighter, clearer and more personal. Try the demo today; the full planning experience is still on its way.</p><button className="v2-button v2-button-dark" onClick={() => setNoticeOpen(true)}>Get early access updates <ArrowUpRight size={17}/></button><small>Early-access sign-up is not connected yet.</small></div>
      </section>

      <footer className="v2-footer">
        <a href="#top" className="v2-brand"><img src="/vyaj-wordmark.svg" alt="VYAJ"/></a>
        <span>PLAN LESS. TRAVEL MORE.</span>
        <div><a href="#trip-builder">Try the demo</a><a href="mailto:hello@vyaj.eu">Contact</a></div>
        <small>© {new Date().getFullYear()} VYAJ. Made for the journeys ahead.</small>
      </footer>

      {noticeOpen && <div className="v2-notice-backdrop" role="presentation" onClick={() => setNoticeOpen(false)}><div className="v2-notice" role="dialog" aria-modal="true" aria-labelledby="v2-notice-title" onClick={event => event.stopPropagation()}><button className="v2-notice-close" aria-label="Close" onClick={() => setNoticeOpen(false)}><X size={18}/></button><div className="v2-notice-icon"><Sparkles size={21}/></div><span className="v2-small-label">VYAJ / EARLY ACCESS</span><h2 id="v2-notice-title">We’re getting things ready.</h2><p>The early-access form isn’t connected yet, so we haven’t collected your details. Email <a href="mailto:hello@vyaj.eu">hello@vyaj.eu</a> if you’d like to get in touch.</p><button className="v2-button v2-button-dark" onClick={() => setNoticeOpen(false)}>Got it <Check size={16}/></button></div></div>}
    </main>
  );
}
