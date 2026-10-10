"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Clock3, Compass, MapPin, Menu, Sparkles, Users, X } from "lucide-react";

type TripStyle = "Food & culture" | "Nature & outdoors" | "Slow escape" | "A bit of everything";

const styles: TripStyle[] = ["Food & culture", "Nature & outdoors", "Slow escape", "A bit of everything"];
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
  const [destination, setDestination] = useState("Sicily, Italy");
  const [days, setDays] = useState("4");
  const [budget, setBudget] = useState("€600");
  const [travellers, setTravellers] = useState("2");
  const [style, setStyle] = useState<TripStyle>("Food & culture");
  const [resultReady, setResultReady] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [destinationFocused, setDestinationFocused] = useState(false);

  const tripIdea = useMemo(() => demoIdeas[style], [style]);
  const filteredDestinations = useMemo(() => {
    const query = destination.trim().toLocaleLowerCase();
    const matches = destinationHints.filter(item => !query || item.name.toLocaleLowerCase().includes(query) || item.country.toLocaleLowerCase().includes(query) || item.text.toLocaleLowerCase().includes(query));
    return matches.slice(0, 6);
  }, [destination]);
  const dayCount = Number(days);
  const isSicily = /sicily|sicilia|palermo/i.test(destination);
  const isMalta = /\\bmalta\\b|valletta|mdina|gozo|birgu/i.test(destination);
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
  const generalTitles = ["Arrive & get your bearings", "Explore beyond the obvious", "Make time for local life", "Leave room for a favourite", "A slower day, your way", "One last discovery", "Take the scenic route"];
  const resultDays = Array.from({ length: Math.min(dayCount, 7) }, (_, index) => {
    const locationDays = style === "Food & culture" ? (isMalta ? maltaDays : isSicily ? sicilyDays : cityItineraries[destinationKey] ?? null) : null;
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
        <a href="#top" className="v2-brand" aria-label="VYAJ home"><img src="/D0F8F0DA-F8C9-4B07-8ED2-B6B0F1A5D567.png" alt="VYAJ" /></a>
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
          <div className="v2-field v2-destination-field"><label htmlFor="destination-input"><span>Destination</span></label><div className="v2-destination-input-wrap"><MapPin size={17} aria-hidden="true"/><input id="destination-input" value={destination} onFocus={() => setDestinationFocused(true)} onBlur={() => window.setTimeout(() => setDestinationFocused(false), 140)} onChange={event => { setDestination(event.target.value); setResultReady(false); setError(""); setDestinationFocused(true); }} placeholder="Search any city or destination" autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={destinationFocused && filteredDestinations.length > 0} aria-controls="destination-suggestions" required/><button type="button" className="v2-destination-clear" aria-label="Clear destination" onMouseDown={event => event.preventDefault()} onClick={() => { setDestination(""); setResultReady(false); setDestinationFocused(true); document.getElementById("destination-input")?.focus(); }}>×</button></div>{destinationFocused && filteredDestinations.length > 0 && <div className="v2-destination-suggestions" id="destination-suggestions" role="listbox" aria-label="Popular destinations">{filteredDestinations.map(item => <button type="button" role="option" aria-selected={destination === item.name} className="v2-destination-suggestion" key={item.name} onMouseDown={event => event.preventDefault()} onClick={() => { setDestination(item.name); setResultReady(false); setError(""); setDestinationFocused(false); }}><span className="v2-destination-pin"><MapPin size={15}/></span><span className="v2-destination-copy"><strong>{item.name}</strong><small>{item.text}</small></span><ArrowUpRight size={14} className="v2-destination-arrow"/></button>)}</div>}<small>Choose a suggestion or type any destination. Suggestions are curated examples, not live search results.</small></div>
          <div className="v2-form-grid">
            <label className="v2-field"><span>How many days?</span><select value={days} onChange={event => { setDays(event.target.value); setResultReady(false); }}>{["2","3","4","5","6","7"].map(value => <option key={value} value={value}>{value} days</option>)}</select></label>
            <label className="v2-field"><span>Travellers</span><select value={travellers} onChange={event => { setTravellers(event.target.value); setResultReady(false); }}>{["1","2","3","4","5+"].map(value => <option key={value} value={value}>{value === "1" ? "1 person" : value === "5+" ? "5+ people" : value + " people"}</option>)}</select></label>
          </div>
          <fieldset className="v2-choice-field"><legend>Total budget</legend><div className="v2-budget-options">{["€300","€600","€1,000","Flexible"].map(value => <button type="button" key={value} className={budget === value ? "v2-budget-option v2-selected" : "v2-budget-option"} onClick={() => { setBudget(value); setResultReady(false); }} aria-pressed={budget === value}>{value}</button>)}</div><small>Choose your overall budget. It is a target, not a price quote; costs aren’t live-checked.</small></fieldset>
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
            <p>{resultReady ? "Here’s an illustrative sample shaped around your selections — not a live AI result or a verified travel plan." : "A useful plan is more than a list of places. This sample gives each day a rhythm without pretending prices or availability have been checked."}</p>
          </div>
          {resultReady ? (
            <div className="v2-result-content">
              <div className="v2-trip-summary">
                <div className="v2-summary-icon"><MapPin size={19}/></div><div className="v2-summary-main"><span className="v2-small-label">YOUR SAMPLE TRIP</span><h3>{destination.trim()}</h3><p>{days} days <span>·</span> {travellers} {travellers === "1" ? "traveller" : "travellers"} <span>·</span> {style}</p></div><span className="v2-demo-tag v2-demo-tag-dark">SAMPLE</span>
              </div>
              <div className="v2-result-grid">
                <div className="v2-days-list">{resultDays.map(day => <article className="v2-day-card" key={day.day}><div className="v2-day-top"><span>DAY {String(day.day).padStart(2, "0")}</span><strong>{day.title}</strong></div><p className="v2-day-focus">{day.focus}</p>{day.activities.map(([time, activity]) => <div className="v2-activity" key={time + activity}><PlacePhoto activity={activity} destination={destination}/><span>{time}</span><p>{activity}</p></div>)}</article>)}</div>
                <aside className="v2-result-aside"><span className="v2-small-label">YOUR STATED BUDGET</span><h3>{money(budget)}</h3><p>This is the budget you entered, not a calculated or verified trip cost.</p><div className="v2-budget-metrics"><div><small>Per person · total</small><strong>{budget === "Flexible" ? "Flexible" : travellers === "5+" ? "Varies" : "€" + (Number(budget.replace(/[^0-9]/g, "")) / Number(travellers)).toLocaleString("en-IE", { maximumFractionDigits: 0 })}</strong></div><div><small>Per day · group</small><strong>{budget === "Flexible" ? "Flexible" : "€" + (Number(budget.replace(/[^0-9]/g, "")) / Math.max(dayCount, 1)).toLocaleString("en-IE", { maximumFractionDigits: 2 })}</strong></div></div><p className="v2-budget-caption">Figures above are arithmetic based on your inputs only. Flights, accommodation, food, transport and tickets have not been priced or assumed included.</p><div className="v2-aside-divider"/><span className="v2-small-label">WHY THIS SHAPE?</span><p>{isSicily && style === "Food & culture" ? "Palermo is a practical cultural starting point for this sample, with one optional coastal day in Cefalù. The order is illustrative; confirm transport schedules before committing." : tripIdea.note}</p><div className="v2-assumption"><Sparkles size={15}/><span>Illustrative sample only. No live AI, verified prices, opening hours, transport schedules or availability.</span></div><button className="v2-button v2-button-outline" type="button" onClick={() => { setResultReady(false); document.getElementById("trip-builder")?.scrollIntoView({behavior:"smooth",block:"center"}); }}>Edit your details <ArrowRight size={16}/></button></aside>
              </div>
              <p className="v2-result-disclaimer">This is an illustrative VYAJ prototype, not a live AI-generated itinerary. For Malta and Sicily, this demo includes illustrative destination-specific ideas; other destinations use general travel-planning ideas. None are live AI results or verified travel recommendations. Prices, opening hours, transport schedules and availability have not been verified. Check current details before booking or travelling.</p>
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
        <div className="v2-early-art"><div className="v2-early-image"/><div className="v2-early-stamp" aria-label="VYAJ logo"><img src="/A95ADB58-28CE-4DB2-B9AE-EB9B0E9AF376.png" alt="VYAJ logo"/></div></div>
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
