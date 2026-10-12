"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { postAction, type Itinerary } from "../lib/api";
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Compass, MapPin, Menu, Plane, PlaneTakeoff, Sparkles, Users, X } from "lucide-react";

type TripStyle = "Food & culture" | "Nature & outdoors" | "Slow escape" | "A bit of everything";

const styles: TripStyle[] = ["Food & culture", "Nature & outdoors", "Slow escape", "A bit of everything"];

type Language = "en" | "ar" | "fr" | "it";
const translations: Record<Language, Record<string, string>> = {
  en: { "How it works":"How it works","What’s available":"What’s available","Early access":"Early access","Build my trip":"Build my trip","YOUR WORLD IS WAITING":"YOUR WORLD IS WAITING","Find the trip":"Find the trip","Discover my next trip":"Discover my next trip","I know where I’m going":"I know where I’m going","Inspiration first. Your plan next.":"Inspiration first. Your plan next.","Made around you":"Made around you","What are you":"What are you","craving?":"craving?","Plan your trip":"Plan your trip","Build an itinerary":"Build an itinerary","Flight":"Flight","Search flights":"Search flights","VYAJ FLIGHT SEARCH":"VYAJ FLIGHT SEARCH","Find your way there.":"Find your way there.","Flying from":"Flying from","Flying to":"Flying to","Round trip":"Round trip","One way only":"One way only","Departure date":"Departure date","Return date":"Return date","Search cheapest flights":"Search cheapest flights","Plan my trip":"Plan my trip","Destination":"Destination","Total budget":"Total budget","Your kind of trip":"Your kind of trip","Language":"Language" },
  ar: { "How it works":"كيف يعمل","What’s available":"المتاح","Early access":"الوصول المبكر","Build my trip":"خطط رحلتي","YOUR WORLD IS WAITING":"عالمك في انتظارك","Find the trip":"اكتشف الرحلة","Discover my next trip":"اكتشف رحلتي القادمة","I know where I’m going":"أعرف وجهتي","Inspiration first. Your plan next.":"ابدأ بالإلهام، ثم خطط رحلتك","Made around you":"مصممة خصيصًا لك","What are you":"ما الذي","craving?":"تتوق إليه؟","Plan your trip":"خطط رحلتك","Build an itinerary":"أنشئ برنامج رحلة","Flight":"الطيران","Search flights":"ابحث عن رحلات","VYAJ FLIGHT SEARCH":"البحث عن الرحلات","Find your way there.":"ابدأ رحلتك من هنا","Flying from":"المغادرة من","Flying to":"الوجهة","Round trip":"ذهاب وعودة","One way only":"ذهاب فقط","Departure date":"تاريخ المغادرة","Return date":"تاريخ العودة","Search cheapest flights":"ابحث عن أرخص الرحلات","Plan my trip":"خطط رحلتي","Destination":"الوجهة","Total budget":"الميزانية الإجمالية","Your kind of trip":"نوع رحلتك","Language":"اللغة" },
  fr: { "How it works":"Comment ça marche","What’s available":"Disponibilités","Early access":"Accès anticipé","Build my trip":"Planifier mon voyage","YOUR WORLD IS WAITING":"Votre monde vous attend","Find the trip":"Trouvez le voyage","Discover my next trip":"Découvrir mon prochain voyage","I know where I’m going":"Je connais ma destination","Inspiration first. Your plan next.":"L’inspiration d’abord, le plan ensuite.","Made around you":"Pensé pour vous","What are you":"De quoi avez-vous","craving?":"envie ?","Plan your trip":"Planifier votre voyage","Build an itinerary":"Créer un itinéraire","Flight":"Vol","Search flights":"Rechercher des vols","VYAJ FLIGHT SEARCH":"RECHERCHE DE VOLS VYAJ","Find your way there.":"En route vers votre destination.","Flying from":"Départ de","Flying to":"Destination","Round trip":"Aller-retour","One way only":"Aller simple","Departure date":"Date de départ","Return date":"Date de retour","Search cheapest flights":"Rechercher les vols les moins chers","Plan my trip":"Planifier mon voyage","Destination":"Destination","Total budget":"Budget total","Your kind of trip":"Votre style de voyage","Language":"Langue" },
  it: { "How it works":"Come funziona","What’s available":"Disponibilità","Early access":"Accesso anticipato","Build my trip":"Pianifica il viaggio","YOUR WORLD IS WAITING":"Il tuo mondo ti aspetta","Find the trip":"Trova il viaggio","Discover my next trip":"Scopri il prossimo viaggio","I know where I’m going":"So già dove andare","Inspiration first. Your plan next.":"Prima l’ispirazione, poi il piano.","Made around you":"Pensato per te","What are you":"Cosa desideri","craving?":"davvero?","Plan your trip":"Pianifica il viaggio","Build an itinerary":"Crea un itinerario","Flight":"Volo","Search flights":"Cerca voli","VYAJ FLIGHT SEARCH":"RICERCA VOLI VYAJ","Find your way there.":"Trova la strada per partire.","Flying from":"Partenza da","Flying to":"Destinazione","Round trip":"Andata e ritorno","One way only":"Solo andata","Departure date":"Data di partenza","Return date":"Data di ritorno","Search cheapest flights":"Cerca i voli più economici","Plan my trip":"Pianifica il viaggio","Destination":"Destinazione","Total budget":"Budget totale","Your kind of trip":"Il tuo stile di viaggio","Language":"Lingua" }
};

function PlacePhoto({ activity, destination }: { activity: string; destination: string }) {
  const [photo, setPhoto] = useState<{ url: string; title: string; page: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const stopWords = new Set([
      "visit","explore","walk","take","enjoy","have","try","choose","browse","travel","return","start","spend","see","discover","admire","leave","pause","find","and","then","before","after","open","check","current","time","times","ticket","tickets","advance","area","surrounding","historic","local","nearby","relaxed","relax","allows","subject","weather","transport","costs","suit","plan","optional","morning","afternoon","evening","day","lunch","dinner","coffee","cafe","café","restaurant","streets","street","city","neighbourhood","neighborhood","views","view","walkable","outdoors","if","the","for","with","from","towards","through","around","by","your","its","one","another","beautiful","classic","major","small","final","flexible","place","places","time","local"
    ]);
    const words = (value: string) => value
      .normalize("NFKD")
      .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
      .split(/\s+/)
      .map(word => word.toLowerCase())
      .filter(word => word.length > 2 && !stopWords.has(word));
    const destinationWords = words(destination);
    const activityWords = words(activity);
    const meaningfulActivityWords = activityWords.filter(word => !destinationWords.includes(word));
    const searchWords = [...new Set([...meaningfulActivityWords, ...destinationWords])].slice(0, 8);
    if (!searchWords.length) return;

    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: `filetype:bitmap ${searchWords.join(" ")}`,
      gsrnamespace: "6",
      gsrlimit: "20",
      prop: "imageinfo",
      iiprop: "url|mime",
      iiurlwidth: "360",
      format: "json",
      origin: "*",
    });

    fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then(response => {
        if (!response.ok) throw new Error("Image search unavailable");
        return response.json();
      })
      .then(data => {
        const pages = Object.values(data?.query?.pages ?? []) as Array<any>;
        const candidates = pages.map(page => {
          const info = page?.imageinfo?.[0];
          return {
            url: typeof (info?.thumburl || info?.url) === "string" ? (info.thumburl || info.url) : "",
            title: String(page.title || "").replace(/^File:/, ""),
            page: String(info?.descriptionurl || "https://commons.wikimedia.org/"),
            mime: String(info?.mime || ""),
          };
        }).filter(item =>
          item.url &&
          item.mime.startsWith("image/") &&
          !/\.(svg|gif)$/i.test(item.url) &&
          !/logo|map|flag|icon|poster|diagram|coat of arms|collage|drawing|screenshot/i.test(item.title)
        );

        const scored = candidates.map(item => {
          const title = item.title.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}\s]/gu, " ");
          const titleWords = new Set(title.split(/\s+/));
          const destinationHits = destinationWords.filter(word => titleWords.has(word)).length;
          const activityHits = meaningfulActivityWords.filter(word => titleWords.has(word)).length;
          return { ...item, score: activityHits * 3 + destinationHits * 2, destinationHits, activityHits };
        })
          .filter(item => item.activityHits >= 1 && item.score >= 3)
          .sort((a, b) => b.score - a.score);

        // Never fill a missing result with an unrelated stock photo.
        if (!cancelled) setPhoto(scored.length ? scored[0] : null);
      })
      .catch(() => {
        if (!cancelled) setPhoto(null);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [activity, destination]);

  if (!photo) {
    return <div className="v2-activity-photo v2-activity-photo-placeholder" aria-label="No closely matched place photo found"><MapPin size={17}/></div>;
  }

  return (
    <a className="v2-activity-photo-link" href={photo.page} target="_blank" rel="noreferrer" title={`Photo source: Wikimedia Commons — ${photo.title}`}>
      <img
        className="v2-activity-photo"
        src={photo.url}
        alt={photo.title}
        loading="lazy"
        decoding="async"
        onError={() => setPhoto(null)}
      />
    </a>
  );
}

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
  { name: "Sicily, Italy", country: "Italy", text: "Food, coastlines & historic towns" },
  { name: "Rome, Italy", country: "Italy", text: "Ancient history, piazzas & pasta" },
  { name: "Florence, Italy", country: "Italy", text: "Renaissance art & Tuscan food" },
  { name: "Paris, France", country: "France", text: "Museums, cafés & iconic streets" },
  { name: "London, United Kingdom", country: "United Kingdom", text: "Culture, markets & neighbourhoods" },
  { name: "Barcelona, Spain", country: "Spain", text: "Architecture, tapas & the coast" },
  { name: "Lisbon, Portugal", country: "Portugal", text: "Hills, viewpoints & local food" },
  { name: "Amsterdam, Netherlands", country: "Netherlands", text: "Canals, galleries & cycling" },
  { name: "Copenhagen, Denmark", country: "Denmark", text: "Design, coffee & city wandering" },
  { name: "Athens, Greece", country: "Greece", text: "Ancient landmarks & tavernas" },
  { name: "Istanbul, Türkiye", country: "Türkiye", text: "Markets, architecture & food" },
  { name: "Marrakech, Morocco", country: "Morocco", text: "Souks, gardens & Moroccan cuisine" },
  { name: "Dubai, United Arab Emirates", country: "United Arab Emirates", text: "Architecture, dining & desert experiences" },
  { name: "Bangkok, Thailand", country: "Thailand", text: "Street food, temples & markets" },
  { name: "Tokyo, Japan", country: "Japan", text: "Food, design & contrasting districts" },
  { name: "Kyoto, Japan", country: "Japan", text: "Temples, gardens & traditional streets" },
  { name: "New York, United States", country: "United States", text: "Neighbourhoods, museums & food" },
  { name: "Bali, Indonesia", country: "Indonesia", text: "Nature, wellness & island culture" },
  { name: "Malta", country: "Malta", text: "Harbours, history & Mediterranean coast" },
  { name: "Prague, Czechia", country: "Czechia", text: "Old-town streets & Central European culture" }
];

function money(value: string) {
  return value === "Flexible" ? "Flexible budget" : value + " total";
}

export default function Home() {
  const [destination, setDestination] = useState("Paris, France");
  const [departureCity, setDepartureCity] = useState("");
  const [flightPanelOpen, setFlightPanelOpen] = useState(false);
  const [flightOrigin, setFlightOrigin] = useState("Malta");
  const [flightDestination, setFlightDestination] = useState("Paris, France");
  const [flightOriginCode, setFlightOriginCode] = useState("");
  const [flightDestinationCode, setFlightDestinationCode] = useState("");
  const [flightOriginMenuOpen, setFlightOriginMenuOpen] = useState(false);
  const [flightDestinationMenuOpen, setFlightDestinationMenuOpen] = useState(false);
  const [flightDepartureDate, setFlightDepartureDate] = useState("");
  const [flightReturnDate, setFlightReturnDate] = useState("");
  const [flightTripType, setFlightTripType] = useState<"roundtrip" | "oneway">("roundtrip");
  const [flightSearching, setFlightSearching] = useState(false);
  const [flightError, setFlightError] = useState("");
  const [flightResults, setFlightResults] = useState<Array<{ id: string; airline: string; price: string; currency: string; departure: string; arrival: string; duration: string; stops: number; bookingUrl: string }>>([]);
  const [airportList, setAirportList] = useState<Array<{ iata?: string; icao?: string; name?: string; city?: string; country?: string }>>([]);
  const [airportSearch, setAirportSearch] = useState("");
  const [airportMenuOpen, setAirportMenuOpen] = useState(false);
  const [airportLoading, setAirportLoading] = useState(false);
  const [airportLoadError, setAirportLoadError] = useState("");
  const [days, setDays] = useState("4");
  const [budget, setBudget] = useState("€600");
  const [travellers, setTravellers] = useState("2");
  const [style, setStyle] = useState<TripStyle>("Food & culture");
  const [resultReady, setResultReady] = useState(false);
  const [aiItinerary, setAiItinerary] = useState<Itinerary | null>(null);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [destinationFocused, setDestinationFocused] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const t = (value: string) => translations[language][value] || value;

  useEffect(() => {
    if (!noticeOpen) return;
    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusTimer = window.setTimeout(() => document.getElementById("waitlist-email")?.focus(), 0);
    const handleModalKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNoticeOpen(false);
    };
    document.addEventListener("keydown", handleModalKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleModalKeyDown);
      previousActive?.focus();
    };
  }, [noticeOpen]);

  async function submitWaitlist(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (waitlistStatus === "submitting") return;
    setWaitlistStatus("submitting");
    try {
      const response = await fetch("https://formspree.io/f/xgaozoeg", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(event.currentTarget)
      });
      if (!response.ok) throw new Error("Waitlist submission failed");
      const emailResponse = await fetch("https://vyaj-travel-api.kholymad.workers.dev/api/v1/actions/join-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: waitlistEmail.trim() }),
      });
      const emailResult = await emailResponse.json().catch(() => ({}));
      if (!emailResponse.ok || emailResult.status !== "available") {
        throw new Error(emailResult.error || "Welcome email could not be sent");
      }
      setWaitlistStatus("success");
      setWaitlistEmail("");
    } catch {
      setWaitlistStatus("error");
    }
  }

  const tripIdea = useMemo(() => demoIdeas[style], [style]);
  const airportAutocompleteOpen = airportMenuOpen || flightOriginMenuOpen || flightDestinationMenuOpen;
  useEffect(() => {
    if (!airportAutocompleteOpen || airportList.length || airportLoading) return;
    let cancelled = false;
    setAirportLoading(true);
    setAirportLoadError("");
    fetch("https://aerocodes.org/data/airports.json")
      .then(response => {
        if (!response.ok) throw new Error("Airport list unavailable");
        return response.json();
      })
      .then((data: unknown) => {
        if (cancelled) return;
        const rows = Array.isArray(data) ? data : [];
        const airports = rows.filter((item): item is { iata?: string; icao?: string; name?: string; city?: string; country?: string } =>
          Boolean(item && typeof item === "object" && typeof (item as { iata?: unknown }).iata === "string" && typeof (item as { name?: unknown }).name === "string")
        );
        setAirportList(airports);
      })
      .catch(() => {
        if (!cancelled) setAirportLoadError("Couldn’t load the airport list. Check your connection and try again.");
      })
      .finally(() => {
        if (!cancelled) setAirportLoading(false);
      });
    return () => { cancelled = true; };
  }, [airportAutocompleteOpen, airportList.length]);

  const filteredAirports = useMemo(() => {
    const query = airportSearch.trim().toLowerCase();
    const matching = airportList.filter(airport => {
      const haystack = [airport.iata, airport.icao, airport.name, airport.city, airport.country].filter(Boolean).join(" ").toLowerCase();
      return !query || haystack.includes(query);
    });
    return matching.slice(0, 30);
  }, [airportList, airportSearch]);

  const filterAirportOptions = (query: string) => {
    const normalized = query.trim().toLowerCase();
    return airportList.filter(airport => {
      const haystack = [airport.iata, airport.icao, airport.name, airport.city, airport.country].filter(Boolean).join(" ").toLowerCase();
      return !normalized || haystack.includes(normalized);
    }).slice(0, 8);
  };
  const flightOriginAirports = useMemo(() => filterAirportOptions(flightOriginMenuOpen ? flightOrigin : ""), [airportList, flightOrigin, flightOriginMenuOpen]);
  const flightDestinationAirports = useMemo(() => filterAirportOptions(flightDestinationMenuOpen ? flightDestination : ""), [airportList, flightDestination, flightDestinationMenuOpen]);

  const filteredDestinations = useMemo(() => {
    const query = destination.trim().toLocaleLowerCase();
    const matches = destinationHints.filter(item => !query || item.name.toLocaleLowerCase().includes(query) || item.country.toLocaleLowerCase().includes(query) || item.text.toLocaleLowerCase().includes(query));
    return matches.slice(0, 6);
  }, [destination]);
  const dayCount = Number(days);
  const isSicily = /sicily|sicilia|palermo/i.test(destination);
  const isMalta = /\bmalta\b|valletta|mdina|gozo|birgu/i.test(destination);
  const maltaDays = [
    { title: "Valletta: history & first flavours", focus: "Explore Malta’s capital on foot, from grand architecture to local food.", activities: [["09:30", "Walk Republic Street and explore Valletta’s historic centre"], ["12:30", "Visit St John’s Co-Cathedral if open; check ticket details before visiting"], ["18:00", "Enjoy harbour views from the Upper Barrakka Gardens, then try a Maltese dinner"]] },
    { title: "Mdina & Rabat: the old island", focus: "Medieval lanes, historic sights and traditional Maltese tastes.", activities: [["09:00", "Explore Mdina’s quiet streets and bastions"], ["12:00", "Walk into Rabat and choose a local café for lunch"], ["15:00", "Visit St Paul’s Catacombs or another local heritage site if open"], ["18:00", "Return at a relaxed pace and leave the evening flexible"]] },
    { title: "Gozo: a change of pace", focus: "A countryside and coastal day, subject to ferry schedules and weather.", activities: [["08:30", "Travel to Ċirkewwa and check current ferry times and fares for Gozo"], ["10:30", "Explore Victoria and the Citadel"], ["13:00", "Have lunch in Victoria or a nearby village"], ["15:00", "Choose a coastal viewpoint such as Dwejra if transport and time allow; check the return ferry"]] },
    { title: "The Three Cities & the waterfront", focus: "Maritime history, colourful streets and a final taste of island life.", activities: [["09:30", "Explore Birgu (Vittoriosa) and its historic lanes"], ["12:30", "Enjoy a waterfront lunch around Birgu Marina"], ["14:00", "Take a harbour ferry if operating, checking the timetable first"], ["16:00", "Leave time for a final pastizz or coffee before departure"]] }
  ];
  const sicilyDays = [
    { title: "Palermo: first tastes", focus: "Historic streets, market flavours and an easy first evening.", activities: [["09:30", "Walk Palermo’s historic centre and take in its layered architecture"], ["13:00", "Explore Ballarò market if open; choose a casual Sicilian street-food lunch"], ["18:30", "Take an unhurried evening walk and choose a neighbourhood trattoria"]] },
    { title: "Palermo: culture & cuisine", focus: "A deeper look at the city’s landmarks and food traditions.", activities: [["09:30", "Visit Palermo Cathedral and explore the surrounding old streets"], ["13:00", "Pause at a local café, then choose one cultural landmark to explore"], ["18:30", "Try a classic Sicilian dish; check restaurant menus and prices first"]] },
    { title: "Cefalù: a coastal day", focus: "A change of pace with a historic seaside town.", activities: [["09:00", "Travel to Cefalù if current transport times and costs suit your plan"], ["12:30", "Explore the old town and cathedral square, then find a relaxed lunch"], ["16:00", "Walk by the waterfront before returning to Palermo, subject to the timetable"]] },
    { title: "A slower Sicilian finish", focus: "Local flavours, small discoveries and room for departure plans.", activities: [["09:30", "Start with coffee and a pastry at a local café"], ["11:00", "Browse a market or independent food shops for regional specialities"], ["13:00", "Try cannoli or another Sicilian treat, then leave a flexible buffer for departure"]] }
  ];
  const cityItineraries: Record<string, typeof sicilyDays> = {
    rome: [
      { title: "Ancient Rome", focus: "The city’s defining ruins and lively piazzas.", activities: [["09:00", "Explore the Colosseum area; check timed-entry tickets in advance"], ["12:30", "Lunch around Monti and wander its small streets"], ["16:00", "Walk through the Roman Forum viewpoints and Piazza Venezia"]] },
      { title: "Vatican & riverside", focus: "Art, monumental architecture and a walk along the Tiber.", activities: [["08:30", "Visit the Vatican Museums or St Peter’s Basilica; check entry rules"], ["13:00", "Lunch in Prati"], ["16:00", "Walk across Ponte Sant’Angelo towards the historic centre"]] },
      { title: "Fountains & neighbourhoods", focus: "Classic landmarks mixed with local street life.", activities: [["09:00", "Visit the Trevi Fountain early and continue to the Pantheon"], ["12:30", "Explore Campo de’ Fiori and nearby lanes"], ["18:00", "Dinner in Trastevere; choose a restaurant after checking current menus"]] },
      { title: "A slower Roman morning", focus: "Green space, viewpoints and one final local meal.", activities: [["09:30", "Walk through Villa Borghese gardens"], ["12:00", "Visit Piazza del Popolo and the surrounding streets"], ["15:00", "Leave time for a café stop and departure"]] }
    ],
    florence: [
      { title: "Renaissance Florence", focus: "The Duomo and the city’s historic heart.", activities: [["09:00", "Explore Piazza del Duomo and the cathedral exterior"], ["12:30", "Try Tuscan lunch near Mercato Centrale"], ["15:00", "Walk Piazza della Signoria and the Arno riverfront"]] },
      { title: "Art & the Arno", focus: "Choose a major gallery and leave room to enjoy the city.", activities: [["09:00", "Visit the Uffizi or Accademia with a pre-booked time slot"], ["13:00", "Lunch in Oltrarno"], ["16:00", "Cross Ponte Vecchio and explore artisan streets"]] },
      { title: "Oltrarno & viewpoints", focus: "Craft workshops, gardens and a panoramic view.", activities: [["09:30", "Explore Santo Spirito and local artisan streets"], ["12:30", "Have a relaxed Tuscan lunch"], ["17:00", "Walk up to Piazzale Michelangelo for the view"]] },
      { title: "Markets & last discoveries", focus: "A relaxed finish with food and neighbourhood wandering.", activities: [["09:00", "Browse San Lorenzo market if open"], ["11:30", "Visit a small museum or church of interest"], ["14:00", "Coffee and time for departure"]] }
    ],
    paris: [
      { title: "Paris icons", focus: "Landmarks and a gentle first walk along the Seine.", activities: [["09:00", "Explore the Eiffel Tower area; check ticket availability if going up"], ["12:30", "Lunch at a neighbourhood café"], ["16:00", "Walk along the Seine towards Trocadéro or the river islands"]] },
      { title: "Art & the historic centre", focus: "Museum time balanced with old Paris streets.", activities: [["09:00", "Choose the Louvre or Musée d’Orsay and check timed-entry tickets"], ["13:00", "Explore the Tuileries and nearby streets"], ["17:00", "Walk around Île de la Cité and Notre-Dame’s exterior"]] },
      { title: "Montmartre & café culture", focus: "Village-like lanes, views and a slower afternoon.", activities: [["09:00", "Explore Montmartre and Sacré-Cœur"], ["12:30", "Lunch around Rue des Abbesses"], ["16:00", "Choose a café and wander nearby streets"]] },
      { title: "Markets & the Marais", focus: "Boutiques, food shops and a flexible final day.", activities: [["09:30", "Walk Le Marais and Place des Vosges"], ["12:30", "Try a bakery or casual lunch spot"], ["15:00", "Browse local shops before departure"]] }
    ],
    london: [
      { title: "Westminster & the river", focus: "London’s best-known landmarks on foot.", activities: [["09:00", "Walk Westminster Bridge, Big Ben and Parliament Square"], ["12:30", "Lunch around Covent Garden"], ["15:00", "Walk the South Bank if weather allows"]] },
      { title: "Museums & Kensington", focus: "A museum-led day with time for green space.", activities: [["10:00", "Choose the British Museum or Natural History Museum; check hours"], ["13:00", "Lunch in the surrounding neighbourhood"], ["15:30", "Walk Kensington Gardens or Hyde Park"]] },
      { title: "Markets & neighbourhoods", focus: "Street food, independent shops and city character.", activities: [["09:30", "Explore Borough Market when open"], ["12:00", "Walk the riverside towards Tower Bridge"], ["16:00", "Browse Covent Garden or Soho"]] },
      { title: "A London local day", focus: "A flexible mix of parks, streets and a final meal.", activities: [["09:30", "Explore Notting Hill and its colourful streets"], ["12:30", "Lunch in the area"], ["15:00", "Choose a gallery, park or final neighbourhood walk"]] }
    ],
    barcelona: [
      { title: "Gaudí & the Eixample", focus: "Modernist architecture and Catalan flavours.", activities: [["09:00", "Visit Sagrada Família with a timed ticket if entering"], ["12:30", "Lunch in Eixample"], ["15:30", "Walk Passeig de Gràcia and admire its architecture"]] },
      { title: "Gothic Quarter & old town", focus: "Historic lanes and lively squares.", activities: [["09:00", "Explore the Gothic Quarter on foot"], ["12:30", "Find tapas around El Born"], ["15:00", "Visit the waterfront and Port Vell"]] },
      { title: "Park Güell & Gràcia", focus: "Park views and an easygoing local neighbourhood.", activities: [["09:00", "Visit Park Güell; check entry times and tickets"], ["12:30", "Lunch in Gràcia"], ["16:00", "Explore its squares and independent shops"]] },
      { title: "Montjuïc & the coast", focus: "Views, gardens and a flexible seaside finish.", activities: [["09:30", "Explore Montjuïc viewpoints and gardens"], ["12:30", "Lunch near Poble-sec"], ["15:30", "Take a walk along Barceloneta if time allows"]] }
    ],
    lisbon: [
      { title: "Baixa & Alfama", focus: "Hillside lanes, tiled façades and Portuguese flavours.", activities: [["09:00", "Explore Praça do Comércio and Baixa"], ["12:00", "Walk Alfama’s lanes and viewpoints"], ["18:00", "Try a Portuguese dinner; check menus and prices"]] },
      { title: "Belém by the river", focus: "Monuments, gardens and a classic pastry stop.", activities: [["09:00", "Visit Belém Tower’s surrounding area and riverside"], ["12:00", "See Jerónimos Monastery from outside or visit if open"], ["15:00", "Try a pastel de nata and walk the waterfront"]] },
      { title: "Chiado & Bairro Alto", focus: "Bookshops, cafés and city viewpoints.", activities: [["09:30", "Explore Chiado and its historic cafés"], ["12:30", "Lunch near Mercado da Ribeira or a nearby street"], ["17:00", "Find a viewpoint before dinner"]] },
      { title: "Sintra or a slow city day", focus: "Choose a day trip only if transit and entry times fit.", activities: [["09:00", "Option A: travel to Sintra after checking train and palace tickets"], ["12:30", "Explore the old town and have lunch"], ["16:00", "Return to Lisbon or keep the day local if preferred"]] }
    ],
    amsterdam: [
      { title: "Canals & old centre", focus: "Waterfront streets and the historic core.", activities: [["09:00", "Walk the canal belt and Dam Square"], ["12:00", "Lunch around Jordaan"], ["15:00", "Take a canal cruise only after checking times and price"]] },
      { title: "Art & Museumplein", focus: "A museum visit with time outdoors.", activities: [["09:30", "Choose the Rijksmuseum or Van Gogh Museum and book if needed"], ["13:00", "Lunch near Museumplein"], ["15:00", "Walk Vondelpark"]] },
      { title: "Jordaan & local food", focus: "Independent shops, markets and a relaxed pace.", activities: [["09:30", "Explore Jordaan’s side streets"], ["12:00", "Browse a market if open"], ["15:00", "Try Dutch snacks and explore the Nine Streets"]] },
      { title: "North or a final canal walk", focus: "A different view of the city before departure.", activities: [["10:00", "Take the free ferry to Amsterdam Noord if operating"], ["12:30", "Lunch in the area"], ["15:00", "Return for a final canal-side stroll"]] }
    ],
    copenhagen: [
      { title: "Harbour & old Copenhagen", focus: "Colourful waterfronts and the historic centre.", activities: [["09:00", "Walk Nyhavn and the harbour"], ["12:00", "Lunch in the city centre"], ["15:00", "Explore Amalienborg’s exterior and nearby streets"]] },
      { title: "Design & museums", focus: "Danish design, art and a calm city rhythm.", activities: [["10:00", "Visit Designmuseum Danmark or another museum; check opening hours"], ["13:00", "Lunch around the city centre"], ["15:00", "Walk the King’s Garden"]] },
      { title: "Food halls & neighbourhoods", focus: "Casual local food and independent shops.", activities: [["09:30", "Explore Torvehallerne when open"], ["12:00", "Walk Nørrebro’s streets and shops"], ["17:00", "Choose a casual dinner spot"]] },
      { title: "Canals & green space", focus: "A relaxed finish with waterfront views.", activities: [["09:30", "Walk Christianshavn and its canals"], ["12:30", "Lunch near the waterfront"], ["15:00", "Visit a park or browse a final neighbourhood before departure"]] }
    ],
    athens: [
      { title: "Ancient Athens", focus: "The Acropolis and the historic centre.", activities: [["08:00", "Visit the Acropolis early; check tickets and seasonal hours"], ["12:00", "Lunch in Plaka"], ["15:00", "Walk around the Ancient Agora area"]] },
      { title: "Museums & Plaka", focus: "Archaeology and old-town lanes.", activities: [["09:30", "Visit the Acropolis Museum"], ["12:30", "Explore Plaka and choose a taverna"], ["16:00", "Walk Anafiotika’s lanes respectfully"]] },
      { title: "Markets & local neighbourhoods", focus: "Everyday Athens, food and city life.", activities: [["09:30", "Browse Varvakios Central Market if open"], ["12:30", "Explore Monastiraki"], ["17:00", "Head to a viewpoint such as Filopappou Hill"]] },
      { title: "Coastal change of pace", focus: "A sea-facing option if transit time suits.", activities: [["09:30", "Explore the National Garden or a favourite central area"], ["12:30", "Lunch in the city"], ["15:00", "Consider the Athens Riviera only after checking transit and return time"]] }
    ],
    istanbul: [
      { title: "Sultanahmet highlights", focus: "Imperial architecture and the old city.", activities: [["09:00", "Visit the Blue Mosque and nearby historic squares"], ["12:30", "Lunch in Sultanahmet"], ["14:00", "Explore Hagia Sophia’s visitor information before entry"]] },
      { title: "Bazaars & flavours", focus: "Markets, spices and traditional food.", activities: [["09:30", "Explore the Grand Bazaar during opening hours"], ["12:30", "Visit the Spice Bazaar area and try local snacks"], ["16:00", "Walk Eminönü’s waterfront"]] },
      { title: "Across the Bosphorus", focus: "Neighbourhood life on the Asian side.", activities: [["09:30", "Take a ferry after checking current services"], ["11:00", "Explore Kadıköy market streets"], ["15:00", "Enjoy a relaxed waterfront walk before returning"]] },
      { title: "Galata & the waterfront", focus: "Historic lanes, views and a final Turkish meal.", activities: [["09:30", "Explore Galata’s streets and tower exterior"], ["12:30", "Walk Karaköy and stop for lunch"], ["16:00", "Choose a Bosphorus viewpoint and leave time for departure"]] }
    ],
    marrakech: [
      { title: "Medina & Jemaa el-Fnaa", focus: "Historic lanes and the city’s central square.", activities: [["09:00", "Explore the medina with a map or trusted guide"], ["12:30", "Try Moroccan dishes at a place you’ve checked"], ["17:00", "Experience Jemaa el-Fnaa as the square comes alive"]] },
      { title: "Palaces & gardens", focus: "Architecture and green spaces.", activities: [["09:00", "Visit Bahia Palace if open"], ["12:00", "Lunch in the medina"], ["15:00", "Explore a garden such as Jardin Majorelle after checking tickets"]] },
      { title: "Souks & craftsmanship", focus: "Traditional crafts and local shopping.", activities: [["09:30", "Browse the souks at a relaxed pace"], ["12:30", "Pause for mint tea and lunch"], ["15:00", "Explore artisan quarters and small museums if open"]] },
      { title: "A slower Moroccan day", focus: "Food, courtyards and flexible exploration.", activities: [["09:30", "Enjoy a traditional breakfast"], ["11:00", "Choose a museum or neighbourhood walk"], ["16:00", "Leave time for a hammam or café only if booked and suitable"]] }
    ],
    dubai: [
      { title: "Downtown Dubai", focus: "Modern landmarks and the city centre.", activities: [["09:30", "Explore Downtown and the Burj Khalifa area"], ["12:30", "Lunch at a venue that fits your budget"], ["16:00", "Walk Dubai Mall’s public areas and the surrounding waterfront"]] },
      { title: "Old Dubai & the Creek", focus: "Historic trading districts and traditional markets.", activities: [["09:00", "Explore Al Fahidi Historical Neighbourhood"], ["12:00", "Cross Dubai Creek by abra if services are running"], ["14:00", "Browse the Gold and Spice Souk areas"]] },
      { title: "Beach & design districts", focus: "Coastal downtime and contemporary neighbourhoods.", activities: [["09:30", "Walk a public beach such as JBR, respecting local conditions"], ["12:30", "Lunch around Jumeirah or Dubai Marina"], ["16:00", "Explore Alserkal Avenue if galleries are open"]] },
      { title: "A desert or city finale", focus: "Choose an excursion only after checking the full cost.", activities: [["09:30", "Keep the morning flexible around your interests"], ["12:30", "Have lunch and prepare for the afternoon"], ["15:00", "Optional desert tour with a reputable operator, booked and priced in advance"]] }
    ],
    bangkok: [
      { title: "Riverside temples", focus: "Temples and river life in the old city.", activities: [["08:30", "Visit Wat Pho and check local dress requirements"], ["11:30", "Take a river ferry if running and visit the Wat Arun area"], ["16:00", "Explore riverside lanes and choose a Thai dinner"]] },
      { title: "Palace & old Bangkok", focus: "Royal history and traditional neighbourhoods.", activities: [["08:30", "Visit the Grand Palace if open; confirm dress rules and tickets"], ["12:30", "Lunch in the old city"], ["15:00", "Explore nearby historic streets at a relaxed pace"]] },
      { title: "Markets & street food", focus: "Local flavours and lively neighbourhoods.", activities: [["09:00", "Explore a market that operates on your travel day"], ["12:00", "Try street food from a busy, well-reviewed stall"], ["16:00", "Explore Chinatown’s lanes before the evening rush"]] },
      { title: "Green space & modern Bangkok", focus: "A contrast of parks and contemporary city life.", activities: [["09:30", "Walk Lumphini Park"], ["12:30", "Lunch near a transit station"], ["15:00", "Explore a modern shopping or art district before departure"]] }
    ],
    tokyo: [
      { title: "Asakusa & old Tokyo", focus: "Traditional streets, temples and Japanese snacks.", activities: [["09:00", "Visit Sensō-ji and explore Nakamise shopping street"], ["12:30", "Try a local lunch in Asakusa"], ["15:00", "Walk the Sumida riverside if weather allows"]] },
      { title: "Meiji Shrine & Shibuya", focus: "Green sanctuary and modern city energy.", activities: [["09:00", "Walk through Meiji Jingu’s forested approach"], ["12:30", "Explore Harajuku and choose lunch"], ["15:30", "Visit Shibuya Crossing and nearby streets"]] },
      { title: "Food & culture in the city", focus: "Markets, gardens and a neighbourhood of your choice.", activities: [["09:00", "Explore Tsukiji Outer Market; check current stall hours"], ["12:00", "Visit a garden or museum that interests you"], ["17:00", "Try a ramen or izakaya-style meal after checking options"]] },
      { title: "Choose your Tokyo", focus: "A flexible final day based on your interests.", activities: [["09:30", "Explore Ueno Park and its museums or another district"], ["12:30", "Lunch near your chosen neighbourhood"], ["15:00", "Leave buffer time for shopping and onward travel"]] }
    ],
    kyoto: [
      { title: "Fushimi Inari & southern Kyoto", focus: "Torii gates and historic streets.", activities: [["07:30", "Visit Fushimi Inari early to avoid the busiest periods"], ["11:30", "Lunch around the station area"], ["14:00", "Explore a nearby temple or traditional street"]] },
      { title: "Higashiyama & Gion", focus: "Temple paths, old lanes and traditional architecture.", activities: [["09:00", "Explore Kiyomizu-dera if open and suitable for your plans"], ["12:30", "Walk Ninenzaka and Sannenzaka and find lunch"], ["16:00", "Pass through Gion respectfully; avoid restricted private lanes"]] },
      { title: "Arashiyama & the river", focus: "Bamboo, gardens and a riverside walk.", activities: [["08:30", "Walk the Arashiyama bamboo grove early"], ["11:00", "Choose a garden or temple and check entry details"], ["14:00", "Explore the river area and nearby streets"]] },
      { title: "Markets & quieter Kyoto", focus: "Food, craft shops and a gentle finish.", activities: [["09:30", "Browse Nishiki Market during operating hours"], ["12:30", "Try Kyoto-style dishes nearby"], ["15:00", "Visit a smaller temple or leave time for departure"]] }
    ],
    "new york": [
      { title: "Lower Manhattan", focus: "Landmarks, waterfront views and city history.", activities: [["09:00", "Walk around the 9/11 Memorial area respectfully"], ["12:30", "Lunch in the Financial District"], ["15:00", "Explore Battery Park and the harbour views"]] },
      { title: "Central Park & museums", focus: "Green space and a world-class museum choice.", activities: [["09:00", "Walk Central Park"], ["12:00", "Choose the Met or American Museum of Natural History; check tickets"], ["16:00", "Explore the Upper West Side or Upper East Side"]] },
      { title: "Brooklyn & the bridge", focus: "Neighbourhood food and skyline views.", activities: [["09:00", "Walk across Brooklyn Bridge if conditions allow"], ["11:30", "Explore DUMBO and Brooklyn Bridge Park"], ["14:00", "Lunch and a neighbourhood walk in Brooklyn"]] },
      { title: "Midtown & neighbourhoods", focus: "Iconic streets with room for personal interests.", activities: [["09:30", "Explore Bryant Park and the New York Public Library exterior"], ["12:30", "Lunch near your next stop"], ["15:00", "Choose a museum, gallery or neighbourhood before departure"]] }
    ],
    bali: [
      { title: "Ubud & local culture", focus: "Art, markets and a slower inland day.", activities: [["09:00", "Explore central Ubud and local craft shops"], ["12:30", "Try Indonesian food at a place you’ve checked"], ["15:00", "Visit a nearby cultural site only after checking access rules"]] },
      { title: "Rice terraces & nature", focus: "Green landscapes and a mindful pace.", activities: [["08:00", "Visit a rice terrace area early and respect local paths"], ["11:30", "Lunch in the surrounding area"], ["14:00", "Choose a waterfall or nature walk after checking conditions and transport"]] },
      { title: "Temples & the coast", focus: "Cultural sites and coastal scenery.", activities: [["09:00", "Visit a temple with appropriate dress and behaviour"], ["12:30", "Lunch near the coast"], ["16:00", "Watch sunset from a public beach if weather permits"]] },
      { title: "A flexible island day", focus: "Choose between wellness, crafts or a coastal outing.", activities: [["09:30", "Start slowly with breakfast"], ["11:00", "Choose a local workshop or market"], ["15:00", "Leave enough time for traffic and onward travel"]] }
    ],
    prague: [
      { title: "Old Town & the river", focus: "Historic squares and classic Prague views.", activities: [["09:00", "Explore Old Town Square and the Astronomical Clock area"], ["12:30", "Lunch in a side street away from the busiest square"], ["15:00", "Walk Charles Bridge and the riverside"]] },
      { title: "Castle district", focus: "Architecture, gardens and panoramic views.", activities: [["09:00", "Explore Prague Castle grounds; check visitor access and tickets"], ["12:30", "Lunch in Malá Strana"], ["15:00", "Walk Nerudova Street and nearby gardens if open"]] },
      { title: "Jewish Quarter & cafés", focus: "History, museums and an unhurried afternoon.", activities: [["09:30", "Visit the Jewish Quarter sites with respect and check opening days"], ["12:30", "Choose a café or Czech lunch"], ["15:00", "Explore the river islands or nearby galleries"]] },
      { title: "Local neighbourhoods", focus: "A relaxed final day beyond the main sights.", activities: [["09:30", "Explore Letná Park and its viewpoints"], ["12:30", "Lunch in a local neighbourhood"], ["15:00", "Browse shops or leave time for departure"]] }
    ]
  };
  const destinationKey = destination.toLocaleLowerCase().includes("new york") ? "new york"
    : destination.toLocaleLowerCase().includes("rome") ? "rome"
    : destination.toLocaleLowerCase().includes("florence") ? "florence"
    : destination.toLocaleLowerCase().includes("paris") ? "paris"
    : destination.toLocaleLowerCase().includes("london") ? "london"
    : destination.toLocaleLowerCase().includes("barcelona") ? "barcelona"
    : destination.toLocaleLowerCase().includes("lisbon") ? "lisbon"
    : destination.toLocaleLowerCase().includes("amsterdam") ? "amsterdam"
    : destination.toLocaleLowerCase().includes("copenhagen") ? "copenhagen"
    : destination.toLocaleLowerCase().includes("athens") ? "athens"
    : destination.toLocaleLowerCase().includes("istanbul") ? "istanbul"
    : destination.toLocaleLowerCase().includes("marrakech") ? "marrakech"
    : destination.toLocaleLowerCase().includes("dubai") ? "dubai"
    : destination.toLocaleLowerCase().includes("bangkok") ? "bangkok"
    : destination.toLocaleLowerCase().includes("tokyo") ? "tokyo"
    : destination.toLocaleLowerCase().includes("kyoto") ? "kyoto"
    : /bali|indonesia/i.test(destination) ? "bali"
    : /prague|praha/i.test(destination) ? "prague"
    : "";
  const puteauxDays = [
    { title: "Arrive & settle into Puteaux", focus: "A gentle start in the quieter streets just west of central Paris.", activities: [["09:30", "Ease into the day with coffee at a local café near the town centre"], ["11:00", "Take an unhurried walk through the town’s streets and local squares"], ["15:00", "Leave the afternoon open for rest, reading, or a relaxed café stop"]] },
    { title: "Seine-side breathing space", focus: "A slower day built around the river and time outdoors.", activities: [["09:30", "Start with a relaxed breakfast close to your stay"], ["11:00", "Walk along the Seine quays and enjoy the riverside views"], ["16:00", "Take a quiet break in a nearby green space before dinner"]] },
    { title: "Green corners & local life", focus: "Small discoveries without a packed schedule.", activities: [["10:00", "Explore the landscaped Esplanade de l’Hôtel de Ville"], ["12:30", "Choose a local bistro or café for a leisurely lunch"], ["15:00", "Browse local shops or return to your favourite spot for downtime"]] },
    { title: "A gentle Paris-area finish", focus: "Keep the final day flexible, with the option to visit Paris if you feel like it.", activities: [["09:30", "Enjoy one last slow breakfast in Puteaux"], ["11:00", "Take a final walk by the river or through the neighbourhood"], ["14:00", "Optional: head towards La Défense or central Paris, checking transport times before leaving"]] }
  ];
  const generalTitles = ["Arrive & get your bearings", "Explore beyond the obvious", "Make time for local life", "Leave room for a favourite", "A slower day, your way", "One last discovery", "Take the scenic route"];
  const resultDays = Array.from({ length: Math.min(dayCount, 7) }, (_, index) => {
    const isPuteaux = /puteaux/i.test(destination);
    const locationDays = isPuteaux ? puteauxDays : style === "Food & culture" ? (isMalta ? maltaDays : isSicily ? sicilyDays : cityItineraries[destinationKey] ?? null) : null;
    const locationDay = locationDays && index < locationDays.length ? locationDays[index] : null;
    return {
      day: index + 1,
      title: locationDay?.title ?? generalTitles[index],
      focus: locationDay?.focus ?? tripIdea.note,
      activities: locationDay?.activities ?? [
        ["09:30", tripIdea.morning],
        ["13:00", tripIdea.afternoon],
        ["18:30", tripIdea.evening]
      ]
    };
  });

  async function buildTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!destination.trim()) {
      setError("Add a destination to plan your trip.");
      setResultReady(false);
      setAiItinerary(null);
      return;
    }
    setError("");
    setPlannerLoading(true);
    setResultReady(false);
    setAiItinerary(null);
    try {
      const response = await postAction<Itinerary>("plan-trip", {
        destination: destination.trim(),
        departureCity: departureCity.trim(),
        duration: `${days} days`,
        travellers: travellers === "1" ? "1 traveller" : travellers === "5+" ? "5 or more travellers" : `${travellers} travellers`,
        style,
        notes: `Total budget: ${budget}. Please treat this as a planning target, not a verified quote. Departure city: ${departureCity.trim() || "not provided; do not invent flight estimates"}.`,
      });
      if (response.status === "available" && response.itinerary) {
        const raw = response.itinerary as unknown as Record<string, unknown>;
        const safeText = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;
        const safeList = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
        const safeDays = Array.isArray(raw.days) ? raw.days.map((item, index) => {
          const day = item && typeof item === "object" ? item as Record<string, unknown> : {};
          const activities = Array.isArray(day.activities) ? day.activities.map((entry) => {
            const activity = entry && typeof entry === "object" ? entry as Record<string, unknown> : {};
            return {
              time: safeText(activity.time, "Flexible"),
              title: safeText(activity.title, "Explore at your own pace"),
              description: safeText(activity.description),
              location: safeText(activity.location),
              estimatedCost: safeText(activity.estimatedCost),
            };
          }) : [];
          return {
            day: typeof day.day === "number" ? day.day : index + 1,
            title: safeText(day.title, `Day ${index + 1}`),
            summary: safeText(day.summary),
            activities,
          };
        }) : [];
        const budgetData = raw.estimatedBudget && typeof raw.estimatedBudget === "object" ? raw.estimatedBudget as Record<string, unknown> : {};
        const budgetFromUser = budget;
        const budgetValue = safeText(
          budgetData.totalEstimate,
          safeText(
            budgetData.perPerson,
            typeof raw.estimatedBudget === "string" && raw.estimatedBudget.trim()
              ? raw.estimatedBudget
              : "Not estimated"
          )
        );
        const perPersonValue = safeText(budgetData.perPerson, budgetValue);
        const budgetFit = safeText(budgetData.budgetFit, "Compare this estimate with your selected budget before booking.");
        const breakdownRaw = budgetData.breakdown && typeof budgetData.breakdown === "object" ? budgetData.breakdown as Record<string, unknown> : {};
        const budgetBreakdown = {
          flights: safeText(breakdownRaw.flights, departureCity.trim() ? "Not estimated" : "Not estimated — add a departure city"),
          accommodation: safeText(breakdownRaw.accommodation, "Not estimated"),
          food: safeText(breakdownRaw.food, "Not estimated"),
          localTransport: safeText(breakdownRaw.localTransport, "Not estimated"),
          activities: safeText(breakdownRaw.activities, "Not estimated"),
          other: safeText(breakdownRaw.other, "Not estimated"),
        };
        const budgetNotes = safeText(
          budgetData.notes,
          budgetFromUser
            ? `Your selected budget is ${budgetFromUser}. This is a planning target, not a verified cost estimate; check prices before booking.`
            : "Costs are estimates and should be checked before booking."
        );
        const hasCategoryEstimates = [
          budgetBreakdown.accommodation,
          budgetBreakdown.food,
          budgetBreakdown.localTransport,
          budgetBreakdown.activities,
          budgetBreakdown.other,
        ].some(value => value.trim() && !/^not estimated/i.test(value.trim()));
        const totalEstimateDisplay = /^not estimated/i.test(budgetValue.trim()) && hasCategoryEstimates
          ? "See breakdown below"
          : budgetValue;
        const budgetNotesDisplay = totalEstimateDisplay === "See breakdown below"
          ? `${budgetNotes} The AI did not return a reliable total; review the category ranges below.`
          : budgetNotes;
        const normalized: Itinerary = {
          tripTitle: safeText(raw.tripTitle, destination),
          destination: safeText(raw.destination, destination),
          overview: safeText(raw.overview),
          days: safeDays,
          estimatedBudget: {
            currency: safeText(budgetData.currency, "EUR"),
            perPerson: perPersonValue,
            totalEstimate: totalEstimateDisplay,
            budgetFit,
            breakdown: budgetBreakdown,
            notes: budgetNotesDisplay,
          },
          tips: safeList(raw.tips),
          assumptions: safeList(raw.assumptions),
        };
        if (!normalized.days.length) {
          setError("The planner returned an incomplete itinerary. Please try again.");
          return;
        }
        setAiItinerary(normalized);
        setResultReady(true);
        window.setTimeout(() => document.getElementById("sample-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      } else if (response.status === "coming_soon") {
        setError(response.message || "AI trip planning is coming soon.");
      } else {
        setError(response.message || "The trip planner is not available right now. Please try again later.");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We couldn't connect to the trip planner. Please try again.");
    } finally {
      setPlannerLoading(false);
    }
  }

  function pickDestination(value: string) {
    setDestination(value);
    setResultReady(false);
    document.getElementById("trip-builder")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function chooseMood(value: string, nextStyle: TripStyle) {
    setSelectedMood(value);
    setDestination(value);
    setStyle(nextStyle);
    setResultReady(false);
    setAiItinerary(null);
    setError("");
    setDestinationFocused(false);
    setMenuOpen(false);
    document.getElementById("trip-builder")?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      const input = document.getElementById("destination-input");
      if (input instanceof HTMLInputElement) input.focus({ preventScroll: true });
    }, 450);
  }

  return (
    <main className="v2-site" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
      <header className="v2-header">
        <a href="#top" className="v2-brand" aria-label="VYAJ home"><img src="/D0F8F0DA-F8C9-4B07-8ED2-B6B0F1A5D567.png" alt="VYAJ" /></a>
        <button type="button" className="v2-menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
        <nav className={menuOpen ? "v2-nav v2-nav-open" : "v2-nav"} aria-label="Main navigation">
          <label className="v2-language-picker"><span>{t("Language")}</span><select aria-label={t("Language")} value={language} onChange={event => setLanguage(event.target.value as Language)}><option value="en">English</option><option value="ar">العربية</option><option value="fr">Français</option><option value="it">Italiano</option></select></label>
          <a href="#how" onClick={() => setMenuOpen(false)}>{t("How it works")}</a>
          <a href="#availability" onClick={() => setMenuOpen(false)}>{t("What’s available")}</a>
          <a href="#early-access" onClick={() => setMenuOpen(false)}>{t("Early access")}</a>
          <a href="#trip-builder" className="v2-nav-cta" onClick={() => setMenuOpen(false)}>{t("Build my trip")} <ArrowUpRight size={15}/></a>
        </nav>
      </header>

      <section className="v2-hero" id="top">
        <div className="v2-hero-image" aria-hidden="true" />
        <div className="v2-hero-overlay" aria-hidden="true" />
        <div className="v2-hero-grain" aria-hidden="true" />
        <div className="v2-hero-content">
          <div className="v2-eyebrow v2-eyebrow-light"><span className="v2-status-dot" /> {t("YOUR WORLD IS WAITING")}</div>
          <h1>Find the trip<br/>you didn’t know<br/><span>you needed.</span></h1>
          <p className="v2-hero-lead">Tell VYAJ what you’re craving. Discover a trip that feels like you — then turn it into a plan.</p>
          <div className="v2-hero-actions">
            <a className="v2-button v2-button-bright" href="#discover">{t("Discover my next trip")} <ArrowUpRight size={17}/></a>
            <a className="v2-hero-secondary" href="#trip-builder">{t("I know where I’m going")} <ArrowDown size={15}/></a>
          </div>
          <div className="v2-hero-foot"><span><Sparkles size={14}/> Inspiration first. Your plan next.</span><span className="v2-hero-proof"><span className="v2-proof-line"/> Made around you</span></div>
        </div>
        <div className="v2-hero-card" aria-label="A preview of the VYAJ trip planning experience">
          <div className="v2-hero-card-top"><span className="v2-card-kicker">YOUR NEXT POSSIBILITY</span><span className="v2-hero-live-dot" /> <span className="v2-hero-live-label">READY TO DISCOVER</span></div>
          <div className="v2-hero-mini-destination"><div className="v2-hero-mini-icon"><Compass size={18}/></div><div><strong>Not just a destination.</strong><span>A feeling, turned into a journey.</span></div></div>
          <div className="v2-hero-mini-route"><span /><span /><span /></div>
          <div className="v2-hero-mini-stats"><div><span>01</span><small>Discover</small></div><div><span>02</span><small>Personalise</small></div><div><span>03</span><small>Go</small></div></div>
        </div>
      </section>

      <section className="v2-discovery v2-section" id="discover" aria-labelledby="v2-discovery-title">
        <div className="v2-discovery-heading">
          <div><div className="v2-eyebrow"><span>01</span><i/> FIND YOUR KIND OF ESCAPE</div><h2 id="v2-discovery-title">What are you<br/><em>craving?</em></h2></div>
          <p>You don’t need a destination yet. Start with a feeling — VYAJ will help you find the rest.</p>
        </div>
        <div className="v2-discovery-grid">
          <button type="button" className={selectedMood === "Puteaux, France" ? "v2-discovery-card v2-discovery-coast v2-discovery-card-selected" : "v2-discovery-card v2-discovery-coast"} aria-pressed={selectedMood === "Puteaux, France"} onClick={() => chooseMood("Puteaux, France", "Slow escape")} aria-label="Find your kind of escape in Puteaux, France">
            <span className="v2-discovery-card-image" aria-hidden="true"/><span className="v2-discovery-shade" aria-hidden="true"/><span className="v2-discovery-index">01 / SLOW DOWN</span>
            <span className="v2-discovery-card-copy"><strong>Find your kind of escape.</strong><span className="v2-discovery-place">Puteaux, France</span><small>Step away from the noise, slow down, and give yourself space to feel the magic.</small><span className="v2-discovery-link">Explore this feeling <ArrowUpRight size={15}/></span></span>
          </button>
          <button type="button" className={selectedMood === "Valletta, Malta" ? "v2-discovery-card v2-discovery-wild v2-discovery-card-selected" : "v2-discovery-card v2-discovery-wild"} aria-pressed={selectedMood === "Valletta, Malta"} onClick={() => chooseMood("Valletta, Malta", "Food & culture")} aria-label="Discover the history and coastal charm of Valletta, Malta">
            <span className="v2-discovery-card-image" aria-hidden="true"/><span className="v2-discovery-shade" aria-hidden="true"/><span className="v2-discovery-index">02 / ISLAND STORIES</span>
            <span className="v2-discovery-card-copy"><strong>Find your island rhythm.</strong><span className="v2-discovery-place">Valletta, Malta</span><small>Golden streets, sea views, and the easy rhythm of Mediterranean life.</small><span className="v2-discovery-link">Explore this feeling <ArrowUpRight size={15}/></span></span>
          </button>
          <button type="button" className={selectedMood === "Rome, Italy" ? "v2-discovery-card v2-discovery-culture v2-discovery-card-selected" : "v2-discovery-card v2-discovery-culture"} aria-pressed={selectedMood === "Rome, Italy"} onClick={() => chooseMood("Rome, Italy", "Food & culture")} aria-label="Discover the food and culture of Rome, Italy">
            <span className="v2-discovery-card-image" aria-hidden="true"/><span className="v2-discovery-shade" aria-hidden="true"/><span className="v2-discovery-index">03 / GET LOST IN CULTURE</span>
            <span className="v2-discovery-card-copy"><strong>Get lost in history.</strong><span className="v2-discovery-place">Rome, Italy</span><small>Ancient wonders, lively piazzas, and unforgettable Italian flavours.</small><span className="v2-discovery-link">Explore this feeling <ArrowUpRight size={15}/></span></span>
          </button>
        </div>
        <p className="v2-discovery-note"><Sparkles size={14}/> Pick a feeling to start a personalised trip plan.</p>
      </section>

      <section className="v2-builder v2-section" id="trip-builder">
        <div className="v2-section-intro">
          <div className="v2-eyebrow"><span>01</span><i/> START WITH THE BASICS</div>
          <h2>Build a trip<br/><em>that fits.</em></h2>
          <p>Set the essentials. We’ll show you how a more considered itinerary could come together.</p>
          <div className="v2-mini-proof"><span><Check size={15}/></span> No perfect prompt required.</div>
        </div>
        <form className="v2-builder-card" onSubmit={buildTrip}>
          <div className="v2-planner-tabs" role="tablist" aria-label="Trip planning mode">
            <button type="button" role="tab" aria-selected={!flightPanelOpen} className={!flightPanelOpen ? "v2-planner-tab v2-planner-tab-active" : "v2-planner-tab"} onClick={() => setFlightPanelOpen(false)}>
              <Compass size={17} /><span><strong>{t("Plan your trip")}</strong><small>{t("Build an itinerary")}</small></span>
            </button>
            <button type="button" role="tab" aria-selected={flightPanelOpen} className={flightPanelOpen ? "v2-planner-tab v2-planner-tab-active" : "v2-planner-tab"} onClick={() => setFlightPanelOpen(true)}>
              <PlaneTakeoff size={17} /><span><strong>{t("Flight")}</strong><small>{t("Search flights")}</small></span>
            </button>
          </div>
          <div className="v2-flight-entry">
            {flightPanelOpen && <div className="v2-flight-panel" id="v2-flight-search">
              <div className="v2-flight-panel-heading"><div><span className="v2-small-label">{t("VYAJ FLIGHT SEARCH")}</span><h4>{t("Find your way there.")}</h4></div><Plane size={21}/></div>
              <p className="v2-flight-intro">Compare live flight offers by price, airline, travel time and stops. Choose an option to continue to a booking search.</p>
              <div className="v2-form-grid">
                <div className="v2-field v2-airport-field"><label htmlFor="flight-origin-input"><span>{t("Flying from")}</span></label><input id="flight-origin-input" value={flightOrigin} onFocus={() => setFlightOriginMenuOpen(true)} onBlur={() => window.setTimeout(() => setFlightOriginMenuOpen(false), 160)} onChange={event => { setFlightOrigin(event.target.value); setFlightOriginCode(""); setFlightOriginMenuOpen(true); setFlightResults([]); setFlightError(""); }} placeholder="Search any airport or city" autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={flightOriginMenuOpen} aria-controls="flight-origin-options" required />{flightOriginMenuOpen && <div className="v2-destination-suggestions v2-airport-suggestions" id="flight-origin-options" role="listbox" aria-label="Departure airports">{airportLoading && <p className="v2-airport-status">Loading worldwide airports…</p>}{airportLoadError && <p className="v2-airport-status">{airportLoadError}</p>}{!airportLoading && !airportLoadError && flightOriginAirports.map((airport,index) => { const code=airport.iata || ""; const label=[airport.city,airport.country].filter(Boolean).join(", "); return <button type="button" role="option" aria-selected={flightOriginCode===code} className="v2-destination-suggestion" key={code || airport.name || index} onMouseDown={event=>event.preventDefault()} onClick={()=>{setFlightOrigin([label,airport.name].filter(Boolean).join(" · ") + (code ? " ("+code+")" : ""));setFlightOriginCode(code);setFlightOriginMenuOpen(false);setFlightResults([]);setFlightError("");}}><span className="v2-destination-pin"><PlaneTakeoff size={14}/></span><span className="v2-destination-copy"><strong>{airport.name}</strong><small>{label || airport.country || "Airport"}{code ? " · "+code : ""}</small></span></button>;})}{!airportLoading && !airportLoadError && airportList.length>0 && flightOriginAirports.length===0 && <p className="v2-airport-status">No matching airport. Try a city, airport name or IATA code.</p>}</div>}</div>
                <div className="v2-field v2-airport-field"><label htmlFor="flight-destination-input"><span>{t("Flying to")}</span></label><input id="flight-destination-input" value={flightDestination} onFocus={() => setFlightDestinationMenuOpen(true)} onBlur={() => window.setTimeout(() => setFlightDestinationMenuOpen(false), 160)} onChange={event => { setFlightDestination(event.target.value); setFlightDestinationCode(""); setFlightDestinationMenuOpen(true); setFlightResults([]); setFlightError(""); }} placeholder="Search any airport or city" autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={flightDestinationMenuOpen} aria-controls="flight-destination-options" required />{flightDestinationMenuOpen && <div className="v2-destination-suggestions v2-airport-suggestions" id="flight-destination-options" role="listbox" aria-label="Arrival airports">{airportLoading && <p className="v2-airport-status">Loading worldwide airports…</p>}{airportLoadError && <p className="v2-airport-status">{airportLoadError}</p>}{!airportLoading && !airportLoadError && flightDestinationAirports.map((airport,index) => { const code=airport.iata || ""; const label=[airport.city,airport.country].filter(Boolean).join(", "); return <button type="button" role="option" aria-selected={flightDestinationCode===code} className="v2-destination-suggestion" key={code || airport.name || index} onMouseDown={event=>event.preventDefault()} onClick={()=>{setFlightDestination([label,airport.name].filter(Boolean).join(" · ") + (code ? " ("+code+")" : ""));setFlightDestinationCode(code);setDestination([label,airport.name].filter(Boolean).join(", ") || label);setFlightDestinationMenuOpen(false);setFlightResults([]);setFlightError("");}}><span className="v2-destination-pin"><PlaneTakeoff size={14}/></span><span className="v2-destination-copy"><strong>{airport.name}</strong><small>{label || airport.country || "Airport"}{code ? " · "+code : ""}</small></span></button>;})}{!airportLoading && !airportLoadError && airportList.length>0 && flightDestinationAirports.length===0 && <p className="v2-airport-status">No matching airport. Try a city, airport name or IATA code.</p>}</div>}</div>
              </div>
              <div className="v2-flight-trip-type" role="group" aria-label="Trip type">
                <button type="button" className={flightTripType === "roundtrip" ? "v2-trip-type-option v2-trip-type-option-active" : "v2-trip-type-option"} onClick={() => { setFlightTripType("roundtrip"); setFlightReturnDate(""); }}>{t("Round trip")}</button>
                <button type="button" className={flightTripType === "oneway" ? "v2-trip-type-option v2-trip-type-option-active" : "v2-trip-type-option"} onClick={() => { setFlightTripType("oneway"); setFlightReturnDate(""); setFlightResults([]); }}>{t("One way only")}</button>
              </div>
              <div className="v2-form-grid v2-flight-date-grid">
                <label className="v2-field v2-flight-date-field"><span>{t("Departure date")}</span><input id="flight-departure-date" type="date" value={flightDepartureDate} min={new Date().toLocaleDateString("en-CA")} onChange={event => { const value = event.target.value; setFlightDepartureDate(value); setFlightResults([]); if (flightReturnDate && value > flightReturnDate) setFlightReturnDate("");  }} required /></label>
                {flightTripType === "roundtrip" && <label className="v2-field v2-flight-date-field"><span>{t("Return date")}</span><input id="flight-return-date" type="date" value={flightReturnDate} min={flightDepartureDate || new Date().toLocaleDateString("en-CA")} onChange={event => { setFlightReturnDate(event.target.value); setFlightResults([]); }} required /></label>}
              </div>
              <div className="v2-flight-note"><CalendarDays size={15}/><span>{flightReturnDate ? "Round trip" : "One way"} · {travellers === "5+" ? "5+ travellers" : travellers + (travellers === "1" ? " traveller" : " travellers")} · Economy · EUR</span></div>
              <button className="v2-button v2-button-dark v2-flight-search-button" type="button" onClick={() => {
                setFlightError("");
                if (!flightOrigin.trim() || !flightDestination.trim() || !flightDepartureDate) { setFlightError("Enter your departure city, destination and departure date."); return; }
                if (flightTripType === "roundtrip" && !flightReturnDate) { setFlightError("Choose a return date or select One way only."); return; }
                if (flightReturnDate && flightReturnDate < flightDepartureDate) { setFlightError("Return date must be after departure."); return; }
                const from = flightOrigin.trim();
                const to = flightDestination.trim();
                const origin = flightOriginCode || (from.toLowerCase() === "malta" ? "MLA" : "");
                const destination = flightDestinationCode || (/^paris(?:,|$)/i.test(to) ? "CDG" : "");
                const passengerCount = travellers === "5+" ? 5 : Number(travellers) || 1;
                // Google Flights stores a full flight search in its tfs protobuf URL parameter.
                const varint = (value: number): number[] => { const bytes: number[] = []; do { let byte = value & 127; value = Math.floor(value / 128); if (value) byte |= 128; bytes.push(byte); } while (value); return bytes; };
                const field = (number: number, bytes: number[]): number[] => [...varint(number * 8 + 2), ...varint(bytes.length), ...bytes];
                const str = (number: number, value: string): number[] => field(number, Array.from(new TextEncoder().encode(value)));
                const airport = (code: string): number[] => [...varint(8), ...varint(1), ...str(2, code)];
                const leg = (date: string, start: string, end: string): number[] => field(3, [...str(2, date), ...field(13, airport(start)), ...field(14, airport(end))]);
                if (origin && destination) {
                  const roundTrip = flightTripType === "roundtrip";
                  const bytes = [8, 0, ...leg(flightDepartureDate, origin, destination), ...(roundTrip ? leg(flightReturnDate, destination, origin) : []), ...Array.from({ length: passengerCount }, () => [64, 1]).flat(), 72, 1, 152, 1, roundTrip ? 1 : 2];
                  const tfs = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
                  window.location.href = `https://www.google.com/travel/flights/search?${new URLSearchParams({ tfs, hl: "en", curr: "EUR", gl: "mt", tfu: "EgQIABABIgA" })}`;
                } else {
                  // For a city typed without selecting an airport, let Google Flights resolve the city name.
                  const dates = flightTripType === "roundtrip" ? `on ${flightDepartureDate} returning ${flightReturnDate}` : `on ${flightDepartureDate} one way`;
                  const q = `Flights from ${from} to ${to} ${dates} ${passengerCount} adults economy`;
                  window.location.href = `https://www.google.com/travel/flights?${new URLSearchParams({ q, hl: "en", curr: "EUR", gl: "mt" })}`;
                }
              }}><PlaneTakeoff size={16}/> Search cheapest flights <ArrowUpRight size={16}/></button>
              {flightError && <p className="v2-form-error" role="alert">{flightError}</p>}
              <small className="v2-flight-disclaimer">You’ll continue to Google Flights to compare current fares and book with the airline or travel provider. Prices and availability are confirmed by the provider.</small>
            </div>}
          </div>
          {!flightPanelOpen && <>
          <div className="v2-builder-top"><div><span className="v2-small-label">VYAJ TRIP BUILDER</span><h3>Where to next?</h3></div><span className="v2-demo-tag">DEMO</span></div>
          <div className="v2-field v2-destination-field"><label htmlFor="destination-input"><span>Destination</span></label><div className="v2-destination-input-wrap"><MapPin size={17} aria-hidden="true"/><input id="destination-input" value={destination} onFocus={() => setDestinationFocused(true)} onBlur={() => window.setTimeout(() => setDestinationFocused(false), 140)} onChange={event => { setDestination(event.target.value); setResultReady(false); setAiItinerary(null); setError(""); setDestinationFocused(true); }} placeholder="Search any city or destination" autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={destinationFocused && filteredDestinations.length > 0} aria-controls="destination-suggestions" required/><button type="button" className="v2-destination-clear" aria-label="Clear destination" onMouseDown={event => event.preventDefault()} onClick={() => { setDestination(""); setResultReady(false); setAiItinerary(null); setDestinationFocused(true); document.getElementById("destination-input")?.focus(); }}>×</button></div>{destinationFocused && filteredDestinations.length > 0 && <div className="v2-destination-suggestions" id="destination-suggestions" role="listbox" aria-label="Popular destinations">{filteredDestinations.map(item => <button type="button" role="option" aria-selected={destination === item.name} className="v2-destination-suggestion" key={item.name} onMouseDown={event => event.preventDefault()} onClick={() => { setDestination(item.name); setResultReady(false); setError(""); setDestinationFocused(false); }}><span className="v2-destination-pin"><MapPin size={15}/></span><span className="v2-destination-copy"><strong>{item.name}</strong><small>{item.text}</small></span><ArrowUpRight size={14} className="v2-destination-arrow"/></button>)}</div>}<small>Choose a suggestion or type any destination. Suggestions are curated examples, not live search results.</small></div>
          <div className="v2-field v2-airport-field">
            <label htmlFor="departure-city-input"><span>Flying from</span></label>
            <input
              id="departure-city-input"
              value={airportMenuOpen ? airportSearch : departureCity}
              onFocus={() => { setAirportSearch(""); setAirportMenuOpen(true); }}
              onChange={event => { setAirportSearch(event.target.value); setDepartureCity(""); setAirportMenuOpen(true); setResultReady(false); setAiItinerary(null); }}
              onBlur={() => window.setTimeout(() => setAirportMenuOpen(false), 160)}
              placeholder="Search airport or city"
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={airportMenuOpen}
              aria-controls="departure-airport-suggestions"
            />
            {airportMenuOpen && <div className="v2-destination-suggestions v2-airport-suggestions" id="departure-airport-suggestions" role="listbox" aria-label="Worldwide departure airports">
              {airportLoading && <p className="v2-airport-status">Loading worldwide airport list…</p>}
              {!airportLoading && airportLoadError && <p className="v2-airport-status">{airportLoadError}</p>}
              {!airportLoading && !airportLoadError && airportList.length > 0 && filteredAirports.map((airport, index) => {
                const label = [airport.city, airport.country].filter(Boolean).join(", ");
                const value = [label || airport.name, airport.iata ? "(" + airport.iata + ")" : "", airport.name && airport.name !== label ? "— " + airport.name : ""].filter(Boolean).join(" ");
                return <button type="button" role="option" aria-selected={departureCity === value} className="v2-destination-suggestion" key={(airport.iata || airport.icao || airport.name || "airport") + "-" + index} onMouseDown={event => event.preventDefault()} onClick={() => { setDepartureCity(value); setAirportSearch(""); setAirportMenuOpen(false); setResultReady(false); setAiItinerary(null); }}>
                  <span className="v2-destination-pin"><MapPin size={15}/></span><span className="v2-destination-copy"><strong>{label || airport.name} {airport.iata ? "· " + airport.iata : ""}</strong><small>{airport.name}{airport.icao ? " · " + airport.icao : ""}</small></span><ArrowUpRight size={14} className="v2-destination-arrow"/>
                </button>;
              })}
              {!airportLoading && !airportLoadError && airportList.length > 0 && filteredAirports.length === 0 && <p className="v2-airport-status">No matching airports. Try a city name or airport code.</p>}
              {!airportLoading && !airportLoadError && airportList.length === 0 && <p className="v2-airport-status">Start typing to search airports around the world.</p>}
            </div>}
            <small>Optional · add your departure airport for a flight estimate.</small>
          </div>
          <div className="v2-form-grid">
            <label className="v2-field"><span>How many days?</span><select value={days} onChange={event => { setDays(event.target.value); setResultReady(false); setAiItinerary(null); }}>{["2","3","4","5","6","7"].map(value => <option key={value} value={value}>{value} days</option>)}</select></label>
            <label className="v2-field"><span>Travellers</span><select value={travellers} onChange={event => { setTravellers(event.target.value); setResultReady(false); setAiItinerary(null); }}>{["1","2","3","4","5+"].map(value => <option key={value} value={value}>{value === "1" ? "1 person" : value === "5+" ? "5+ people" : value + " people"}</option>)}</select></label>
          </div>
          <fieldset className="v2-choice-field"><legend>Total budget</legend><div className="v2-budget-options">{["€300","€600","€1,000","Flexible"].map(value => <button type="button" key={value} className={budget === value ? "v2-budget-option v2-selected" : "v2-budget-option"} onClick={() => { setBudget(value); setResultReady(false); setAiItinerary(null); }} aria-pressed={budget === value}>{value}</button>)}</div><small>Choose your overall budget. It is a target, not a price quote; costs aren’t live-checked.</small></fieldset>
          <fieldset className="v2-choice-field"><legend>Your kind of trip</legend><div className="v2-style-options">{styles.map(value => <button type="button" key={value} className={style === value ? "v2-style-option v2-selected" : "v2-style-option"} onClick={() => { setStyle(value); setResultReady(false); setAiItinerary(null); }} aria-pressed={style === value}>{value}</button>)}</div></fieldset>
          {error && <p className="v2-form-error" role="alert">{error}</p>}
          <button className="v2-button v2-button-dark v2-submit" type="submit" disabled={plannerLoading}>{plannerLoading ? <><Sparkles size={16} className="v2-loading-sparkle"/> Thinking…</> : <>{t("Plan my trip")} <ArrowUpRight size={17}/></>}</button>
          <p className="v2-form-note"><Sparkles size={13}/> AI-generated starter plan · Estimates only, no bookings</p>
          </>}
        </form>
      </section>

      <section className="v2-result-section" id="sample-result" aria-live="polite">
        <div className="v2-result-wrap">
          <div className="v2-result-heading">
            <div><div className="v2-eyebrow v2-eyebrow-light"><span>02</span><i/> A FIRST LOOK</div><h2>A trip you<br/><em>can picture.</em></h2></div>
            <p>{resultReady && aiItinerary ? "Your AI-generated starter itinerary is ready. Refine it around your preferences and verify details before travelling." : plannerLoading ? "VYAJ is shaping your itinerary around your destination and travel style." : "Start with a destination and a few preferences. VYAJ will turn them into a practical first itinerary."}</p>
          </div>
          {resultReady && aiItinerary ? (
            <div className="v2-result-content">
              <div className="v2-trip-summary">
                <div className="v2-summary-icon"><MapPin size={19}/></div>
                <div className="v2-summary-main"><span className="v2-small-label">YOUR VYAJ ITINERARY</span><h3>{aiItinerary.tripTitle || aiItinerary.destination || destination}</h3><p>{aiItinerary.destination || destination} <span>·</span> {days} days <span>·</span> {travellers} travellers <span>·</span> {style}</p></div>
                <span className="v2-demo-tag v2-demo-tag-dark">AI PLAN</span>
              </div>
              <p className="v2-day-focus">{aiItinerary.overview}</p>
              <div className="v2-result-grid">
                <div className="v2-days-list">{aiItinerary.days.map(day => <article className="v2-day-card" key={day.day}>
                  <div className="v2-day-top"><span>DAY {String(day.day).padStart(2, "0")}</span><strong>{day.title}</strong></div>
                  <p className="v2-day-focus">{day.summary}</p>
                  {day.activities.map((activity, index) => <div className="v2-activity" key={`${day.day}-${index}-${activity.title}`}>
                    <span>{activity.time || "Flexible"}</span><div><strong>{activity.title}</strong><p>{activity.description}</p>{activity.location && <small>{activity.location}</small>}{activity.estimatedCost && <small> · {activity.estimatedCost}</small>}</div>
                  </div>)}
                </article>)}</div>
                <aside className="v2-result-aside"><span className="v2-small-label">ESTIMATED TRIP COST</span><h3>{aiItinerary.estimatedBudget?.totalEstimate || aiItinerary.estimatedBudget?.perPerson || "Not estimated"}</h3><p>{aiItinerary.estimatedBudget?.budgetFit || ""} {aiItinerary.estimatedBudget?.notes || "Costs are estimates and should be checked before booking."}</p>
                  {aiItinerary.estimatedBudget?.breakdown && <div className="v2-budget-breakdown"><span className="v2-small-label">APPROXIMATE COST BREAKDOWN</span>{([{key:"flights",label:"Flights"},{key:"accommodation",label:"Hotel / accommodation"},{key:"food",label:"Food & drinks"},{key:"localTransport",label:"Local transport"},{key:"activities",label:"Activities & tickets"},{key:"other",label:"Other costs"}] as const).map(item => <div className="v2-budget-row" key={item.key}><span>{item.label}</span><strong>{aiItinerary.estimatedBudget?.breakdown?.[item.key] || "Not estimated"}</strong></div>)}</div>}
                  {aiItinerary.tips?.length ? <><div className="v2-aside-divider"/><span className="v2-small-label">TRAVEL TIPS</span><ul>{aiItinerary.tips.map((tip, index) => <li key={index}>{tip}</li>)}</ul></> : null}
                  {aiItinerary.assumptions?.length ? <><div className="v2-aside-divider"/><span className="v2-small-label">ASSUMPTIONS TO CHECK</span><ul>{aiItinerary.assumptions.map((assumption, index) => <li key={index}>{assumption}</li>)}</ul></> : null}
                  <div className="v2-assumption"><Sparkles size={15}/><span>AI-generated starter plan. Prices, opening hours, transport and availability are not live-verified.</span></div>
                  <button className="v2-button v2-button-outline" type="button" onClick={() => { setResultReady(false); setAiItinerary(null); document.getElementById("trip-builder")?.scrollIntoView({behavior:"smooth",block:"center"}); }}>Adjust your trip <ArrowRight size={16}/></button>
                </aside>
              </div>
              <p className="v2-result-disclaimer">Use this itinerary as a starting point, not a booking confirmation. Verify current opening hours, transport schedules, prices and availability before travelling.</p>
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
        <div className="v2-steps v2-steps-timeline">
          <article><div className="v2-step-rail"><div className="v2-step-icon"><MapPin size={21}/></div><span className="v2-step-number">01</span></div><div className="v2-step-copy"><span className="v2-step-kicker">STEP 01</span><h3>Set the essentials</h3><p>Choose your destination, dates and a budget you’re comfortable with.</p></div></article>
          <article><div className="v2-step-rail"><div className="v2-step-icon"><Sparkles size={21}/></div><span className="v2-step-number">02</span></div><div className="v2-step-copy"><span className="v2-step-kicker">STEP 02</span><h3>Shape your days</h3><p>Explore a sample itinerary shaped around your travel style.</p></div></article>
          <article><div className="v2-step-rail"><div className="v2-step-icon"><Compass size={21}/></div><span className="v2-step-number">03</span></div><div className="v2-step-copy"><span className="v2-step-kicker">STEP 03</span><h3>Make it your own</h3><p>Adjust your choices and discover a direction that feels right.</p></div></article>
        </div>
      </section>

      <section className="v2-availability" id="availability">
        <div className="v2-availability-inner">
          <div className="v2-eyebrow v2-eyebrow-light"><span>04</span><i/> CLEAR FROM DAY ONE</div>
          <div className="v2-availability-heading"><h2>Useful now.<br/><em>More to come.</em></h2><p>We’d rather be clear about what’s ready than promise features that aren’t connected yet.</p></div>
          <div className="v2-feature-status">
            <div className="v2-status-row"><span className="v2-status-icon v2-status-ready"><Check size={17}/></span><div><strong>Interactive trip preview</strong><small>Works in this demo using your choices.</small></div><span className="v2-status-label">AVAILABLE</span></div>
            <div className="v2-status-row"><span className="v2-status-icon v2-status-ready"><Sparkles size={17}/></span><div><strong>AI-generated itineraries</strong><small>Starter plans are generated by AI; prices and availability aren’t live-verified.</small></div><span className="v2-status-label">AVAILABLE</span></div>
            <div className="v2-status-row"><span className="v2-status-icon"><Compass size={17}/></span><div><strong>Live prices & route times</strong><small>No live travel data is connected.</small></div><span className="v2-status-label v2-status-soon">COMING SOON</span></div>
            <div className="v2-status-row"><span className="v2-status-icon"><Users size={17}/></span><div><strong>Save, share & book</strong><small>Planned for a later release.</small></div><span className="v2-status-label v2-status-soon">COMING SOON</span></div>
          </div>
        </div>
      </section>

      <section className="v2-early-access v2-section" id="early-access">
        <div className="v2-early-art"><div className="v2-early-image"/><div className="v2-early-stamp" aria-label="VYAJ logo"><img src="/D0F8F0DA-F8C9-4B07-8ED2-B6B0F1A5D567.png" alt="VYAJ logo"/></div></div>
        <div className="v2-early-copy"><div className="v2-eyebrow"><span>05</span><i/> THE NEXT CHAPTER</div><h2>Be first to plan<br/>with <em>VYAJ.</em></h2><p>Join the free waitlist for early-access invitations and launch updates. Be among the first to try VYAJ as new features roll out.</p><button type="button" className="v2-button v2-button-dark" onClick={() => { setWaitlistStatus("idle"); setNoticeOpen(true); }}>Get early access <ArrowUpRight size={17}/></button><small>Free to join. No commitment — just updates and early access.</small></div>
      </section>

      <footer className="v2-footer">
        <a href="#top" className="v2-brand"><img src="/vyaj-wordmark.svg" alt="VYAJ"/></a>
        <span>PLAN LESS. TRAVEL MORE.</span>
        <div><a href="#trip-builder">Try the demo</a><a href="mailto:hello@vyaj.eu">Contact</a></div>
        <small>© {new Date().getFullYear()} VYAJ. Made for the journeys ahead.</small>
      </footer>

      {noticeOpen && <div className="v2-notice-backdrop" role="presentation" onClick={() => setNoticeOpen(false)}><div className="v2-notice" role="dialog" aria-modal="true" aria-labelledby="v2-notice-title" aria-describedby="v2-notice-description" onClick={event => event.stopPropagation()}><button type="button" className="v2-notice-close" aria-label="Close" onClick={() => setNoticeOpen(false)}><X size={18}/></button><div className="v2-notice-icon"><Sparkles size={21}/></div><span className="v2-small-label">VYAJ / EARLY ACCESS</span><h2 id="v2-notice-title">Be first to try VYAJ.</h2><p id="v2-notice-description">Add your email for early-access invitations and launch updates. It’s free, and you can unsubscribe at any time.</p>{waitlistStatus === "success" ? <div className="v2-waitlist-message v2-waitlist-success" role="status"><Check size={17}/> You’re on the list. We’ll keep you updated.</div> : <form className="v2-waitlist-form" onSubmit={submitWaitlist}><label htmlFor="waitlist-email">Email address</label><input id="waitlist-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={waitlistEmail} onChange={event => { setWaitlistEmail(event.target.value); if (waitlistStatus === "error") setWaitlistStatus("idle"); }} required/><input type="hidden" name="_subject" value="New VYAJ waitlist signup"/><button className="v2-button v2-button-dark" type="submit" disabled={waitlistStatus === "submitting"}>{waitlistStatus === "submitting" ? "Joining…" : "Get early access"} <ArrowUpRight size={16}/></button>{waitlistStatus === "error" && <p className="v2-waitlist-message v2-waitlist-error" role="alert">Something went wrong. Please try again.</p>}<small>By joining, you agree to receive VYAJ launch updates by email.</small></form>}<button type="button" className="v2-button v2-button-outline" onClick={() => setNoticeOpen(false)}>Close</button></div></div>}
    </main>
  );
}
