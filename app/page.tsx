"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { postAction, type Itinerary } from "../lib/api";
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Compass, MapPin, Menu, Plane, PlaneTakeoff, Sparkles, Users, X } from "lucide-react";

type TripStyle = "Food & culture" | "Nature & outdoors" | "Slow escape" | "A bit of everything";

const styles: TripStyle[] = ["Food & culture", "Nature & outdoors", "Slow escape", "A bit of everything"];

type Language = "en" | "ar" | "fr" | "it" | "de";
const pageCopy: Record<Language, Record<string, string>> = {
en: {},
de: {"Find the trip":"Entdecke die Reise","you didn’t know":"die du noch nicht kanntest","you needed.":"und die dir gefehlt hat.","Tell VYAJ what you’re craving. Discover a trip that feels like you — then turn it into a plan.":"Verrate VYAJ, worauf du Lust hast. Entdecke eine Reise, die zu dir passt, und mach daraus einen Plan.","YOUR WORLD IS WAITING":"Dein nächstes Abenteuer wartet","YOUR NEXT POSSIBILITY":"Deine nächste Möglichkeit","READY TO DISCOVER":"Bereit, Neues zu entdecken","Not just a destination.":"Mehr als nur ein Reiseziel.","A feeling, turned into a journey.":"Aus einem Gefühl wird eine Reise.","Discover":"Entdecken","Personalise":"Individuell gestalten","Go":"Los geht’s","Inspiration first. Your plan next.":"Erst die Inspiration. Dann dein Reiseplan.","Made around you":"Für dich gemacht","What are you":"Worauf hast du","craving?":"Lust?","FIND YOUR KIND OF ESCAPE":"Finde deine Auszeit","You don’t need a destination yet. Start with a feeling — VYAJ will help you find the rest.":"Du musst dich noch nicht für ein Reiseziel entscheiden. Wähle zuerst die Stimmung, die du suchst – VYAJ hilft dir beim Rest.","SLOW DOWN":"Nimm dir Zeit","Find your kind of escape.":"Finde deine perfekte Auszeit.","Step away from the noise, slow down, and give yourself space to feel the magic.":"Lass den Alltag hinter dir, komm zur Ruhe und genieße neue Eindrücke.","ISLAND STORIES":"Inselgeschichten","Find your island rhythm.":"Finde deinen Inselrhythmus.","Golden streets, sea views, and the easy rhythm of Mediterranean life.":"Schöne Gassen, Ausblicke aufs Meer und das entspannte Lebensgefühl des Mittelmeers.","GET LOST IN CULTURE":"Kultur entdecken","Get lost in history.":"Tauche in die Geschichte ein.","Ancient wonders, lively piazzas, and unforgettable Italian flavours.":"Beeindruckende antike Bauwerke, lebendige Plätze und unvergessliche italienische Küche.","Explore this feeling":"Entdecke dieses Reisegefühl","Pick a feeling to start a personalised trip plan.":"Wähle eine Stimmung und beginne mit deinem persönlichen Reiseplan.","START WITH THE BASICS":"Beginne mit den Grundlagen","Build a trip":"Plane eine Reise","that fits.":"die zu dir passt.","Set the essentials. We’ll show you how a more considered itinerary could come together.":"Lege die wichtigsten Angaben fest. Wir zeigen dir einen Reiseplan, der zu deiner Zeit und deinen Interessen passt.","No perfect prompt required.":"Du brauchst keinen perfekten Prompt.","VYAJ TRIP BUILDER":"VYAJ-Reiseplaner","Where to next?":"Wohin soll es gehen?","DEMO":"DEMO","Language":"Sprache","How it works":"So funktioniert’s","What’s available":"Was verfügbar ist","Early access":"Früher Zugang","Build my trip":"Meine Reise planen","Plan your trip":"Plane deine Reise","Build an itinerary":"Erstelle einen Reiseplan","Flight":"Flüge","Search flights":"Flüge suchen","VYAJ FLIGHT SEARCH":"VYAJ-FLUGSUCHE","Find your way there.":"Finde den passenden Weg.","Flying from":"Abflug von","Flying to":"Flugziel","Round trip":"Hin- und Rückflug","One way only":"Nur Hinflug","Departure date":"Abflugdatum","Return date":"Rückflugdatum","Search cheapest flights":"Günstige Flüge suchen","Plan my trip":"Meine Reise planen","Destination":"Reiseziel","Total budget":"Gesamtbudget","Your kind of trip":"Deine Art zu reisen","A FIRST LOOK":"EIN ERSTER EINBLICK","A trip you":"Eine Reise, die du","can picture.":"dir vorstellen kannst.","Your AI-generated starter itinerary is ready. Refine it around your preferences and verify details before travelling.":"Dein erster KI-Reiseplan ist fertig. Passe ihn an deine Wünsche an und prüfe alle Angaben vor der Reise.","YOUR VYAJ ITINERARY":"DEIN VYAJ-REISEPLAN","travellers":"Reisende","AI PLAN":"KI-REISEPLAN","DAY":"TAG","ESTIMATED TRIP COST":"GESCHÄTZTE REISEKOSTEN","Not estimated":"Nicht geschätzt","APPROXIMATE COST BREAKDOWN":"GESCHÄTZTE KOSTENÜBERSICHT","Flights":"Flüge","Hotel / accommodation":"Hotel / Unterkunft","Food & drinks":"Essen und Getränke","Local transport":"Nahverkehr","Activities & tickets":"Aktivitäten und Eintrittskarten","Other costs":"Sonstige Kosten","TRAVEL TIPS":"REISETIPPS","ASSUMPTIONS TO CHECK":"ANGABEN ZUR PRÜFUNG","AI-generated starter plan. Prices, opening hours, transport and availability are not live-verified.":"Erster KI-Reiseplan. Preise, Öffnungszeiten, Verkehr und Verfügbarkeit werden nicht live überprüft.","Adjust your trip":"Passe deine Reise an","Use this itinerary as a starting point, not a booking confirmation. Verify current opening hours, transport schedules, prices and availability before travelling.":"Nutze diesen Reiseplan als Ausgangspunkt, nicht als Buchungsbestätigung. Prüfe Öffnungszeiten, Fahrpläne, Preise und Verfügbarkeit vor der Reise.","Arrive & settle in":"Ankommen und orientieren","Get your bearings, without rushing.":"Verschaffe dir in Ruhe einen ersten Überblick.","Explore with intention":"Bewusst entdecken","One anchor activity. Space around it.":"Eine Hauptaktivität und genug Zeit dazwischen.","Leave room for a surprise":"Lass Platz für Überraschungen","Local finds and time to wander.":"Lokale Entdeckungen und Zeit zum Schlendern.","A BETTER KIND OF ITINERARY":"EIN BESSERER REISEPLAN","Structure, not a schedule to obey.":"Eine klare Struktur, kein starrer Zeitplan.","Preview a sample plan built around your destination, time and travel style.":"Sieh dir einen Beispielplan an, der zu deinem Ziel, deiner Zeit und deinem Reisestil passt.","Try your own details":"Eigene Angaben ausprobieren","HOW IT WORKS":"SO FUNKTIONIERT’S","From “somewhere”":"Von „irgendwo“","to":"bis","let’s go.":"los geht’s.","Keep the decisions simple. Make the trip feel like yours.":"Halte die Entscheidungen einfach und gestalte die Reise nach deinen Vorstellungen.","STEP 01":"SCHRITT 01","STEP 02":"SCHRITT 02","STEP 03":"SCHRITT 03","Set the essentials":"Lege die Grundlagen fest","Choose your destination, dates and a budget you’re comfortable with.":"Wähle dein Reiseziel, deine Reisedaten und ein passendes Budget.","Shape your days":"Gestalte deine Tage","Explore a sample itinerary shaped around your travel style.":"Entdecke einen Beispielplan, der zu deinem Reisestil passt.","Make it your own":"Mach die Reise zu deiner","Adjust your choices and discover a direction that feels right.":"Passe deine Auswahl an und finde heraus, was zu dir passt.","CLEAR FROM DAY ONE":"VON ANFANG AN TRANSPARENT","Useful now.":"Schon jetzt nützlich.","More to come.":"Weitere Funktionen folgen.","We’d rather be clear about what’s ready than promise features that aren’t connected yet.":"Wir zeigen klar, was bereits funktioniert, statt Funktionen zu versprechen, die noch nicht verfügbar sind.","Interactive trip preview":"Interaktive Reisevorschau","Works in this demo using your choices.":"Funktioniert in dieser Demo auf Grundlage deiner Auswahl.","AI-generated itineraries":"KI-generierte Reisepläne","Starter plans are generated by AI; prices and availability aren’t live-verified.":"Die ersten Reisepläne werden von KI erstellt; Preise und Verfügbarkeit werden nicht live geprüft.","Live prices & route times":"Aktuelle Preise und Fahrzeiten","No live travel data is connected.":"Es sind keine Live-Reisedaten angebunden.","Save, share & book":"Speichern, teilen und buchen","Planned for a later release.":"Für eine spätere Version geplant.","AVAILABLE":"VERFÜGBAR","COMING SOON":"DEMNÄCHST","THE NEXT CHAPTER":"WAS ALS NÄCHSTES KOMMT","Be first to plan":"Plane als Erste:r","with":"mit","Join the free waitlist for early-access invitations and launch updates. Be among the first to try VYAJ as new features roll out.":"Trage dich kostenlos in die Warteliste ein, erhalte Einladungen zum frühen Zugang und Neuigkeiten zum Start. Probiere VYAJ aus, sobald neue Funktionen verfügbar sind.","Get early access":"Frühen Zugang erhalten","Free to join. No commitment — just updates and early access.":"Kostenlos und unverbindlich – mit Neuigkeiten und frühem Zugang.","PLAN LESS. TRAVEL MORE.":"WENIGER PLANEN. MEHR ERLEBEN.","Try the demo":"Demo ausprobieren","Contact":"Kontakt","Made for the journeys ahead.":"Für die Reisen, die vor dir liegen.","Be first to try VYAJ.":"Sei unter den Ersten, die VYAJ testen.","Add your email for early-access invitations and launch updates. It’s free, and you can unsubscribe at any time.":"Gib deine E-Mail-Adresse ein, um Einladungen und Neuigkeiten zum Start zu erhalten. Kostenlos; du kannst dich jederzeit abmelden.","You’re on the list. We’ll keep you updated.":"Du stehst auf der Liste. Wir halten dich auf dem Laufenden.","Email address":"E-Mail-Adresse","Joining…":"Wird eingetragen…","Something went wrong. Please try again.":"Etwas ist schiefgelaufen. Bitte versuche es erneut.","By joining, you agree to receive VYAJ launch updates by email.":"Mit deiner Anmeldung stimmst du zu, Neuigkeiten zum VYAJ-Start per E-Mail zu erhalten.","Close":"Schließen","Add a destination to plan your trip.":"Gib ein Reiseziel ein, um deine Reise zu planen.","The planner returned an incomplete itinerary. Please try again.":"Der Reiseplan ist unvollständig. Bitte versuche es erneut.","AI trip planning is coming soon.":"KI-Reiseplanung ist bald verfügbar.","The trip planner is not available right now. Please try again later.":"Der Reiseplaner ist gerade nicht verfügbar. Bitte versuche es später erneut.","We couldn't connect to the trip planner. Please try again.":"Die Verbindung zum Reiseplaner ist fehlgeschlagen. Bitte versuche es erneut.","Thinking…":"Wird verarbeitet…","people":"Personen","traveller":"Reisende:r","Food & culture":"Essen und Kultur","Nature & outdoors":"Natur und Aktivitäten im Freien","Slow escape":"Entspannte Auszeit","A bit of everything":"Von allem etwas","Search any city or destination":"Stadt oder Reiseziel suchen","Choose a suggestion or type any destination. Suggestions are curated examples, not live search results.":"Wähle einen Vorschlag oder gib ein Reiseziel ein. Die Vorschläge sind Beispiele und keine Live-Suchergebnisse.","Search airport or city":"Flughafen oder Stadt suchen","Loading worldwide airport list…":"Flughafenliste wird geladen…","No matching airports. Try a city name or airport code.":"Kein passender Flughafen gefunden. Versuche einen Stadtnamen oder Flughafencode.","Start typing to search airports around the world.":"Gib einen Namen ein, um weltweit nach Flughäfen zu suchen.","Optional · add your departure airport for a flight estimate.":"Optional · gib deinen Abflughafen für eine Flugkostenschätzung ein.","Choose your overall budget. It is a target, not a price quote; costs aren’t live-checked.":"Lege dein ungefähres Gesamtbudget fest. Es ist ein Richtwert, kein Angebot; Preise werden nicht live geprüft.","AI-generated starter plan · Estimates only, no bookings":"Erster KI-Reiseplan · Nur Schätzungen, keine Buchungen","VYAJ is shaping your itinerary around your destination and travel style.":"VYAJ erstellt einen Reiseplan passend zu deinem Ziel und Reisestil.","Start with a destination and a few preferences. VYAJ will turn them into a practical first itinerary.":"Wähle ein Reiseziel und einige Vorlieben. VYAJ erstellt daraus einen ersten praktischen Reiseplan.","Costs are estimates and should be checked before booking.":"Die Kosten sind Schätzungen und sollten vor der Buchung überprüft werden.","You’ll continue to Google Flights to compare current fares and book with the airline or travel provider. Prices and availability are confirmed by the provider.":"Du wirst zu Google Flights weitergeleitet, um aktuelle Preise zu vergleichen und bei der Fluggesellschaft oder einem Anbieter zu buchen. Preise und Verfügbarkeit bestätigt der jeweilige Anbieter.","days":"Tage","person":"Person","Search any airport or city":"Flughafen oder Stadt suchen"},
fr: {"you didn’t know":"que vous ne connaissiez pas","you needed.":"et dont vous aviez besoin","Tell VYAJ what you’re craving. Discover a trip that feels like you — then turn it into a plan.":"Dites à VYAJ ce qui vous fait envie. Découvrez un voyage qui vous ressemble, puis transformez-le en itinéraire.","YOUR NEXT POSSIBILITY":"VOTRE PROCHAINE POSSIBILITÉ","READY TO DISCOVER":"PRÊT À DÉCOUVRIR","Not just a destination.":"Plus qu’une destination.","A feeling, turned into a journey.":"Une envie transformée en voyage.","Discover":"Découvrir","Personalise":"Personnaliser","Go":"Partir","START WITH THE BASICS":"COMMENCEZ PAR L’ESSENTIEL","Build a trip":"Créez un voyage","that fits.":"qui vous ressemble.","Set the essentials. We’ll show you how a more considered itinerary could come together.":"Définissez l’essentiel. Découvrez comment construire un itinéraire plus réfléchi.","No perfect prompt required.":"Aucune demande parfaite n’est nécessaire.","Compare live flight offers by price, airline, travel time and stops. Choose an option to continue to a booking search.":"Comparez les vols selon le prix, la compagnie, la durée et les escales. Choisissez une option pour poursuivre la recherche.","Search any airport or city":"Rechercher un aéroport ou une ville","VYAJ TRIP BUILDER":"PLANIFICATEUR DE VOYAGE VYAJ","Where to next?":"Quelle sera votre prochaine destination ?","DEMO":"DÉMO","Search any city or destination":"Rechercher une ville ou une destination","How many days?":"Combien de jours ?","Travellers":"Voyageurs","days":"jours","person":"personne","people":"personnes","Find the trip":"Trouvez le voyage","YOUR WORLD IS WAITING":"VOTRE PROCHAINE AVENTURE VOUS ATTEND","Inspiration first. Your plan next.":"Une idée d’abord, votre itinéraire ensuite","Made around you":"Pensé selon vos envies","Find your kind of escape.":"Trouvez votre parenthèse idéale.","Step away from the noise, slow down, and give yourself space to feel the magic.":"Éloignez-vous du bruit, ralentissez et laissez place à la magie.","Find your island rhythm.":"Adoptez le rythme de l’île.","Golden streets, sea views, and the easy rhythm of Mediterranean life.":"Des ruelles dorées, des vues sur la mer et la douceur de la Méditerranée.","Get lost in history.":"Plongez dans l’histoire.","Ancient wonders, lively piazzas, and unforgettable Italian flavours.":"Des merveilles antiques, des places animées et des saveurs italiennes inoubliables.","Explore this feeling":"Explorez cette ambiance","Pick a feeling to start a personalised trip plan.":"Choisissez une ambiance pour créer un itinéraire personnalisé.","What are you":"Qu’est-ce qui vous","craving?":"fait envie ?","You don’t need a destination yet. Start with a feeling — VYAJ will help you find the rest.":"Vous n’avez pas encore besoin d’une destination. Partez d’une envie : VYAJ vous aidera à trouver la suite.","Plan your trip":"Planifiez votre voyage","Build an itinerary":"Créer un itinéraire","Flight":"Vols","Search flights":"Rechercher des vols","VYAJ FLIGHT SEARCH":"RECHERCHE DE VOLS VYAJ","Find your way there.":"Trouvez le meilleur moyen d’y aller.","Loading worldwide airports…":"Chargement des aéroports du monde…","No matching airport. Try a city, airport name or IATA code.":"Aucun aéroport correspondant. Essayez une ville, un nom d’aéroport ou un code IATA.","Departure airports":"Aéroports de départ","Arrival airports":"Aéroports d’arrivée","Trip planning mode":"Mode de planification","Trip type":"Type de voyage","Round trip":"Aller-retour","One way only":"Aller simple","Departure date":"Date de départ","Return date":"Date de retour","One way":"Aller simple","Economy":"Économique","Enter your departure city, destination and departure date.":"Indiquez votre ville de départ, votre destination et la date de départ.","Choose a return date or select One way only.":"Choisissez une date de retour ou sélectionnez « Aller simple ».","Return date must be after departure.":"La date de retour doit être postérieure à la date de départ.","Search cheapest flights":"Rechercher les vols les moins chers","Plan my trip":"Planifier mon voyage","Destination":"Destination","Total budget":"Budget total","Your kind of trip":"Votre style de voyage","traveller":"voyageur","travellers":"voyageurs","Add a destination to plan your trip.":"Ajoutez une destination pour planifier votre voyage.","The planner returned an incomplete itinerary. Please try again.":"L’outil a renvoyé un itinéraire incomplet. Veuillez réessayer.","AI trip planning is coming soon.":"La planification de voyage par IA arrive bientôt.","The trip planner is not available right now. Please try again later.":"Le planificateur est indisponible pour le moment. Réessayez plus tard.","We couldn't connect to the trip planner. Please try again.":"Impossible de se connecter au planificateur. Veuillez réessayer.","Thinking…":"Réflexion en cours…","Be first to plan":"Soyez parmi les premiers à planifier","with":"avec","Join the free waitlist for early-access invitations and launch updates. Be among the first to try VYAJ as new features roll out.":"Inscrivez-vous gratuitement à la liste d’attente pour recevoir une invitation en avant-première et les actualités du lancement. Soyez parmi les premiers à essayer VYAJ.","Free to join. No commitment — just updates and early access.":"Inscription gratuite, sans engagement : actualités et accès anticipé.","Try the demo":"Essayer la démo","Contact":"Contact","Made for the journeys ahead.":"Pensé pour les voyages à venir.","Be first to try VYAJ.":"Soyez parmi les premiers à essayer VYAJ.","Email address":"Adresse e-mail","Something went wrong. Please try again.":"Une erreur s’est produite. Veuillez réessayer.","Close":"Fermer","You’re on the list. We’ll keep you updated.":"Vous êtes sur la liste. Nous vous tiendrons au courant.","By joining, you agree to receive VYAJ launch updates by email.":"En vous inscrivant, vous acceptez de recevoir les actualités de lancement de VYAJ par e-mail.","VYAJ / EARLY ACCESS":"VYAJ / ACCÈS ANTICIPÉ","Joining…":"Inscription…","Get early access":"Accéder en avant-première","you@example.com":"you@example.com","Choose a suggestion or type any destination. Suggestions are curated examples, not live search results.":"Choisissez une suggestion ou saisissez une destination. Ces suggestions sont des exemples sélectionnés, pas des résultats en direct.","Search airport or city":"Rechercher un aéroport ou une ville","Loading worldwide airport list…":"Chargement de la liste des aéroports…","No matching airports. Try a city name or airport code.":"Aucun aéroport trouvé. Essayez une ville ou un code d’aéroport.","Start typing to search airports around the world.":"Commencez à saisir pour rechercher des aéroports dans le monde entier.","Optional · add your departure airport for a flight estimate.":"Facultatif · ajoutez votre aéroport de départ pour estimer le coût du vol.","Choose your overall budget. It is a target, not a price quote; costs aren’t live-checked.":"Indiquez votre budget cible. Il ne s’agit pas d’un devis et les prix ne sont pas vérifiés en direct.","AI-generated starter plan · Estimates only, no bookings":"Première proposition générée par l’IA · Estimations uniquement, sans réservation","Your AI-generated starter itinerary is ready. Refine it around your preferences and verify details before travelling.":"Votre première proposition d’itinéraire est prête. Personnalisez-la et vérifiez les détails avant de partir.","VYAJ is shaping your itinerary around your destination and travel style.":"VYAJ prépare un itinéraire selon votre destination et votre style de voyage.","Start with a destination and a few preferences. VYAJ will turn them into a practical first itinerary.":"Choisissez une destination et quelques préférences. VYAJ créera une première proposition d’itinéraire.","Not estimated":"Non estimé","Costs are estimates and should be checked before booking.":"Les coûts sont estimatifs et doivent être vérifiés avant réservation.","You’ll continue to Google Flights to compare current fares and book with the airline or travel provider. Prices and availability are confirmed by the provider.":"Vous allez continuer sur Google Flights pour comparer les tarifs et réserver auprès de la compagnie ou du prestataire. Les prix et disponibilités sont confirmés par celui-ci.","Discover my next trip":"Découvrir mon prochain voyage","I know where I’m going":"Je connais ma destination","Food & culture":"Gastronomie et culture","Nature & outdoors":"Nature et plein air","Slow escape":"Séjour détente","A bit of everything":"Un peu de tout","Airport":"Aéroport","A trip you":"Un voyage que vous","can picture.":"pouvez imaginer.","AI-generated starter plan. Prices, opening hours, transport and availability are not live-verified.":"Ce premier itinéraire est généré par l’IA. Les prix, horaires d’ouverture, transports et disponibilités ne sont pas vérifiés en temps réel.","Use this itinerary as a starting point, not a booking confirmation. Verify current opening hours, transport schedules, prices and availability before travelling.":"Considérez cet itinéraire comme un point de départ, et non comme une réservation confirmée. Vérifiez les horaires, les transports, les prix et les disponibilités avant de partir.","Get your bearings, without rushing.":"Prenez vos repères sans vous presser.","One anchor activity. Space around it.":"Une activité principale, avec du temps libre autour.","Local finds and time to wander.":"Des découvertes locales et du temps pour flâner.","A BETTER KIND OF ITINERARY":"UNE AUTRE FAÇON DE VOYAGER","Structure, not a schedule to obey.":"Un cadre souple, pas un programme à suivre à la lettre.","Preview a sample plan built around your destination, time and travel style.":"Découvrez un exemple d’itinéraire adapté à votre destination, à votre durée de séjour et à votre style de voyage.","Try your own details":"Essayez avec vos informations","From “somewhere”":"D’une envie vague","to":"à","let’s go.":"un vrai départ.","Keep the decisions simple. Make the trip feel like yours.":"Simplifiez vos choix et créez un voyage qui vous ressemble.","STEP 01":"ÉTAPE 01","Choose your destination, dates and a budget you’re comfortable with.":"Choisissez votre destination, vos dates et un budget adapté à vos moyens.","STEP 02":"ÉTAPE 02","Explore a sample itinerary shaped around your travel style.":"Découvrez un exemple d’itinéraire adapté à votre style de voyage.","STEP 03":"ÉTAPE 03","Adjust your choices and discover a direction that feels right.":"Ajustez vos choix et trouvez le voyage qui vous convient.","We’d rather be clear about what’s ready than promise features that aren’t connected yet.":"Nous préférons être transparents sur les fonctions disponibles plutôt que de promettre celles qui ne sont pas encore prêtes.","Works in this demo using your choices.":"Disponible dans cette démo à partir de vos choix.","Starter plans are generated by AI; prices and availability aren’t live-verified.":"Les premiers itinéraires sont générés par l’IA ; les prix et disponibilités ne sont pas vérifiés en temps réel.","Live prices & route times":"Prix en direct et durées des trajets","No live travel data is connected.":"Aucune donnée de voyage en temps réel n’est connectée.","Save, share & book":"Enregistrer, partager et réserver","Planned for a later release.":"Prévu pour une prochaine version.","PLAN LESS. TRAVEL MORE.":"MOINS PLANIFIER. PLUS VOYAGER.","Add your email for early-access invitations and launch updates. It’s free, and you can unsubscribe at any time.":"Indiquez votre adresse e-mail pour recevoir une invitation en avant-première et les actualités du lancement. C’est gratuit et vous pouvez vous désinscrire à tout moment.","DAY":"JOUR","English":"English","Français":"Français","Italiano":"Italiano","FIND YOUR KIND OF ESCAPE":"TROUVEZ VOTRE PARENTHÈSE IDÉALE","SLOW DOWN":"RALENTISSEZ LE RYTHME","ISLAND STORIES":"ESPRIT INSULAIRE","GET LOST IN CULTURE":"PLONGEZ DANS LA CULTURE"},it: {"you didn’t know":"che non sapevi","you needed.":"di cui avevi bisogno.","Tell VYAJ what you’re craving. Discover a trip that feels like you — then turn it into a plan.":"Racconta a VYAJ cosa desideri. Scopri un viaggio che ti somiglia e trasformalo in un piano.","YOUR NEXT POSSIBILITY":"LA TUA PROSSIMA POSSIBILITÀ","READY TO DISCOVER":"PRONTO A SCOPRIRE","Not just a destination.":"Non solo una destinazione.","A feeling, turned into a journey.":"Un’emozione che diventa un viaggio.","Discover":"Scopri","Personalise":"Personalizza","Go":"Parti","START WITH THE BASICS":"PARTI DALLE BASI","Build a trip":"Crea un viaggio","that fits.":"su misura per te.","Set the essentials. We’ll show you how a more considered itinerary could come together.":"Definisci l’essenziale e scopri come creare un itinerario più curato.","No perfect prompt required.":"Non serve un prompt perfetto.","Compare live flight offers by price, airline, travel time and stops. Choose an option to continue to a booking search.":"Confronta i voli per prezzo, compagnia, durata e scali. Scegli un’opzione per continuare la ricerca.","Search any airport or city":"Cerca un aeroporto o una città","VYAJ TRIP BUILDER":"PIANIFICATORE DI VIAGGIO VYAJ","Where to next?":"Dove vuoi andare?","DEMO":"DEMO","Search any city or destination":"Cerca una città o destinazione","How many days?":"Quanti giorni?","Travellers":"Viaggiatori","days":"giorni","person":"persona","people":"persone","Find the trip":"Trova il viaggio","YOUR WORLD IS WAITING":"IL TUO MONDO TI ASPETTA","Inspiration first. Your plan next.":"Prima l’ispirazione, poi il tuo itinerario.","Made around you":"Pensato per te","Find your kind of escape.":"Trova la tua fuga ideale.","Step away from the noise, slow down, and give yourself space to feel the magic.":"Allontanati dal rumore, rallenta e concediti lo spazio per vivere la magia.","Find your island rhythm.":"Segui il ritmo dell’isola.","Golden streets, sea views, and the easy rhythm of Mediterranean life.":"Strade dorate, panorami sul mare e il ritmo rilassato della vita mediterranea.","Get lost in history.":"Perditi nella storia.","Ancient wonders, lively piazzas, and unforgettable Italian flavours.":"Meraviglie antiche, piazze vivaci e sapori italiani indimenticabili.","Explore this feeling":"Esplora questa atmosfera","Pick a feeling to start a personalised trip plan.":"Scegli un’atmosfera per iniziare a creare il tuo viaggio.","What are you":"Che cosa ti","craving?":"ispira?","You don’t need a destination yet. Start with a feeling — VYAJ will help you find the rest.":"Non ti serve ancora una destinazione. Parti da una sensazione: VYAJ ti aiuterà a trovare il resto.","Plan your trip":"Pianifica il viaggio","Build an itinerary":"Crea un itinerario","Flight":"Voli","Search flights":"Cerca voli","VYAJ FLIGHT SEARCH":"RICERCA VOLI VYAJ","Find your way there.":"Trova il modo migliore per arrivarci.","Loading worldwide airports…":"Caricamento degli aeroporti nel mondo…","No matching airport. Try a city, airport name or IATA code.":"Nessun aeroporto corrispondente. Prova una città, un aeroporto o un codice IATA.","Departure airports":"Aeroporti di partenza","Arrival airports":"Aeroporti di arrivo","Trip planning mode":"Modalità di pianificazione","Trip type":"Tipo di viaggio","Round trip":"Andata e ritorno","One way only":"Solo andata","Departure date":"Data di partenza","Return date":"Data di ritorno","One way":"Solo andata","Economy":"Economica","Enter your departure city, destination and departure date.":"Inserisci città di partenza, destinazione e data di partenza.","Choose a return date or select One way only.":"Scegli una data di ritorno o seleziona «Solo andata».","Return date must be after departure.":"La data di ritorno deve essere successiva a quella di partenza.","Search cheapest flights":"Cerca i voli più economici","Plan my trip":"Pianifica il mio viaggio","Destination":"Destinazione","Total budget":"Budget totale","Your kind of trip":"Il tuo stile di viaggio","traveller":"viaggiatore","travellers":"viaggiatori","Add a destination to plan your trip.":"Aggiungi una destinazione per pianificare il viaggio.","The planner returned an incomplete itinerary. Please try again.":"Il pianificatore ha restituito un itinerario incompleto. Riprova.","AI trip planning is coming soon.":"La pianificazione di viaggi con IA arriverà presto.","The trip planner is not available right now. Please try again later.":"Il pianificatore non è disponibile al momento. Riprova più tardi.","We couldn't connect to the trip planner. Please try again.":"Impossibile connettersi al pianificatore. Riprova.","Thinking…":"Sto elaborando…","Be first to plan":"Sii tra i primi a pianificare","with":"con","Join the free waitlist for early-access invitations and launch updates. Be among the first to try VYAJ as new features roll out.":"Iscriviti gratuitamente alla lista d’attesa per ricevere inviti in anteprima e aggiornamenti sul lancio. Sii tra i primi a provare VYAJ.","Free to join. No commitment — just updates and early access.":"L’iscrizione è gratuita e senza impegno: aggiornamenti e accesso anticipato.","Try the demo":"Prova la demo","Contact":"Contatti","Made for the journeys ahead.":"Pensato per i viaggi che verranno.","Be first to try VYAJ.":"Sii tra i primi a provare VYAJ.","Email address":"Indirizzo e-mail","Something went wrong. Please try again.":"Si è verificato un errore. Riprova.","Close":"Chiudi","You’re on the list. We’ll keep you updated.":"Sei nella lista. Ti terremo aggiornato.","By joining, you agree to receive VYAJ launch updates by email.":"Iscrivendoti, accetti di ricevere via e-mail gli aggiornamenti sul lancio di VYAJ.","VYAJ / EARLY ACCESS":"VYAJ / ACCESSO ANTICIPATO","Joining…":"Iscrizione…","Get early access":"Ottieni accesso anticipato","you@example.com":"you@example.com","Choose a suggestion or type any destination. Suggestions are curated examples, not live search results.":"Scegli una destinazione suggerita oppure scrivine una. I suggerimenti sono esempi selezionati, non risultati in tempo reale.","Search airport or city":"Cerca un aeroporto o una città","Loading worldwide airport list…":"Caricamento dell’elenco degli aeroporti…","No matching airports. Try a city name or airport code.":"Nessun aeroporto trovato. Prova con una città o un codice aeroportuale.","Start typing to search airports around the world.":"Inizia a digitare per cercare aeroporti in tutto il mondo.","Optional · add your departure airport for a flight estimate.":"Facoltativo · aggiungi l’aeroporto di partenza per stimare il costo del volo.","Choose your overall budget. It is a target, not a price quote; costs aren’t live-checked.":"Indica il budget che desideri rispettare. È un obiettivo, non un preventivo; i prezzi non sono verificati in tempo reale.","AI-generated starter plan · Estimates only, no bookings":"Prima proposta generata dall’IA · Solo stime, nessuna prenotazione","Your AI-generated starter itinerary is ready. Refine it around your preferences and verify details before travelling.":"La prima proposta di itinerario è pronta. Personalizzala secondo le tue preferenze e verifica i dettagli prima di partire.","VYAJ is shaping your itinerary around your destination and travel style.":"VYAJ sta preparando un itinerario in base alla destinazione e al tuo stile di viaggio.","Start with a destination and a few preferences. VYAJ will turn them into a practical first itinerary.":"Scegli una destinazione e alcune preferenze: VYAJ creerà una prima proposta di itinerario.","Not estimated":"Non stimato","Costs are estimates and should be checked before booking.":"I costi sono stime e vanno verificati prima della prenotazione.","You’ll continue to Google Flights to compare current fares and book with the airline or travel provider. Prices and availability are confirmed by the provider.":"Continuerai su Google Flights per confrontare le tariffe e prenotare con la compagnia aerea o il fornitore. Prezzi e disponibilità sono confermati dal fornitore.","Discover my next trip":"Scopri il mio prossimo viaggio","I know where I’m going":"So già dove andare","Language":"Lingua","Food & culture":"Cibo e cultura","Nature & outdoors":"Natura e attività all’aperto","Slow escape":"Fuga rilassante","A bit of everything":"Un po’ di tutto"},
ar: {"you didn’t know":"لم تكن تعرف أنك تبحث عنها","you needed.":"وتناسبك فعلًا","Tell VYAJ what you’re craving. Discover a trip that feels like you — then turn it into a plan.":"قل لنا ما الذي تحبّه في السفر، وسنساعدك على اكتشاف رحلة تناسب ذوقك وتحويلها إلى خطة واضحة.","YOUR NEXT POSSIBILITY":"فكرتك التالية للسفر","READY TO DISCOVER":"مستعد للاكتشاف","Not just a destination.":"أكثر من مجرد وجهة","A feeling, turned into a journey.":"إحساس جميل يتحوّل إلى رحلة","Discover":"اكتشف","Personalise":"خصص","Go":"انطلق","START WITH THE BASICS":"ابدأ بالأساسيات","Build a trip":"خطّط لرحلة","that fits.":"تناسبك فعلًا","Set the essentials. We’ll show you how a more considered itinerary could come together.":"أدخل التفاصيل الأساسية، وسنقترح لك برنامج رحلة يناسب وقتك واهتماماتك.","No perfect prompt required.":"لا تحتاج إلى كتابة طلب مثالي.","Compare live flight offers by price, airline, travel time and stops. Choose an option to continue to a booking search.":"قارن عروض الرحلات حسب السعر وشركة الطيران ومدة السفر والتوقفات.","Search any airport or city":"ابحث عن أي مطار أو مدينة","VYAJ TRIP BUILDER":"مخطط الرحلات من VYAJ","Where to next?":"إلى أين تريد السفر؟","DEMO":"تجريبي","Search any city or destination":"ابحث عن أي مدينة أو وجهة","How many days?":"كم يومًا؟","Travellers":"المسافرون","days":"أيام","person":"شخص","people":"أشخاص","Find the trip":"اكتشف رحلة","YOUR WORLD IS WAITING":"رحلتك القادمة تبدأ هنا","Inspiration first. Your plan next.":"ابدأ بفكرة، ثم حوّلها إلى خطة","Made around you":"مصممة على ذوقك","Find your kind of escape.":"اكتشف ملاذك المثالي","Step away from the noise, slow down, and give yourself space to feel the magic.":"ابتعد عن ضغوط الحياة وخذ وقتك في مكان يمنحك الهدوء وتجربة مختلفة.","Find your island rhythm.":"عِش أجواء الجزيرة","Golden streets, sea views, and the easy rhythm of Mediterranean life.":"شوارع جميلة وإطلالات بحرية وأجواء متوسطية هادئة.","Get lost in history.":"اكتشف حكايات التاريخ","Ancient wonders, lively piazzas, and unforgettable Italian flavours.":"آثار تاريخية مبهرة وساحات حيوية وأطباق إيطالية لا تُنسى.","Explore this feeling":"اكتشف هذه الأجواء","Pick a feeling to start a personalised trip plan.":"اختر الأجواء التي تناسبك لبدء تخطيط رحلة مخصصة.","FIND YOUR KIND OF ESCAPE":"اكتشف الرحلة التي تناسبك","GET LOST IN CULTURE":"انغمس في الثقافة","ISLAND STORIES":"حكايات الجزيرة","SLOW DOWN":"تمهّل واستمتع","VYAJ / EARLY ACCESS":"VYAJ / الوصول المبكر","Add your email for early-access invitations and launch updates. It’s free, and you can unsubscribe at any time.":"أضف بريدك الإلكتروني لتلقي دعوات الوصول المبكر وآخر أخبار الإطلاق. الاشتراك مجاني ويمكنك إلغاء الاشتراك في أي وقت.","you@example.com":"you@example.com","Joining…":"جارٍ التسجيل…","Get early access":"احصل على وصول مبكر","By joining, you agree to receive VYAJ launch updates by email.":"بالتسجيل، توافق على تلقي تحديثات إطلاق VYAJ عبر البريد الإلكتروني.","Made for the journeys ahead.":"صُمّم للرحلات القادمة.","What are you":"ما الذي","craving?":"ترغب فيه؟","You don’t need a destination yet. Start with a feeling — VYAJ will help you find the rest.":"ليس عليك اختيار الوجهة من البداية. حدّد الأجواء التي تحبها، وسنساعدك في العثور على المكان المناسب.","Discover the history and coastal charm of Valletta, Malta":"اكتشف تاريخ فاليتا وسحرها الساحلي، مالطا","Find your kind of escape in Puteaux, France":"اكتشف ملاذك المثالي في بوتو، فرنسا","Discover the food and culture of Rome, Italy":"اكتشف الطعام والثقافة في روما، إيطاليا","Plan your trip":"خطّط لرحلتك","Build an itinerary":"أنشئ برنامج الرحلة","Flight":"الطيران","Search flights":"ابحث عن رحلات طيران","VYAJ FLIGHT SEARCH":"البحث عن رحلات الطيران من VYAJ","Find your way there.":"اعثر على رحلة الوصول المناسبة.","Loading worldwide airports…":"جارٍ تحميل المطارات حول العالم…","Airport":"مطار","No matching airport. Try a city, airport name or IATA code.":"لا توجد مطارات مطابقة. جرّب اسم مدينة أو مطار أو رمز IATA.","Departure airports":"مطارات المغادرة","Arrival airports":"مطارات الوصول","Trip planning mode":"طريقة تخطيط الرحلة","Trip type":"نوع الرحلة","Round trip":"ذهاب وعودة","One way only":"ذهاب فقط","Departure date":"تاريخ المغادرة","Return date":"تاريخ العودة","One way":"اتجاه واحد","Economy":"اقتصادي","Enter your departure city, destination and departure date.":"أدخل مدينة المغادرة والوجهة وتاريخ المغادرة.","Choose a return date or select One way only.":"اختر تاريخ العودة أو حدّد «ذهاب فقط».","Return date must be after departure.":"يجب أن يكون تاريخ العودة بعد تاريخ المغادرة.","Search cheapest flights":"ابحث عن أرخص الرحلات","Plan my trip":"خطّط لرحلتي","Destination":"الوجهة","Total budget":"الميزانية الإجمالية","Your kind of trip":"نوع الرحلة التي تفضّلها","traveller":"مسافر","travellers":"مسافرون","Add a destination to plan your trip.":"أضف وجهة لتخطيط رحلتك.","The planner returned an incomplete itinerary. Please try again.":"عاد مخطّط الرحلات ببرنامج غير مكتمل. حاول مرة أخرى.","AI trip planning is coming soon.":"سيُتاح تخطيط الرحلات بالذكاء الاصطناعي قريبًا.","The trip planner is not available right now. Please try again later.":"مخطّط الرحلات غير متاح حاليًا. حاول لاحقًا.","We couldn't connect to the trip planner. Please try again.":"تعذّر الاتصال بمخطّط الرحلات. حاول مرة أخرى.","Thinking…":"جارٍ التفكير…","Be first to plan":"كن من أوائل من يخططون","with":"مع","Join the free waitlist for early-access invitations and launch updates. Be among the first to try VYAJ as new features roll out.":"انضم مجانًا إلى قائمة الانتظار للحصول على دعوة وصول مبكر وتحديثات الإطلاق، وكن من أوائل من يجرّبون VYAJ عند إطلاق الميزات الجديدة.","Free to join. No commitment — just updates and early access.":"الانضمام مجاني ولا يلزمك بشيء؛ فقط تحديثات ووصول مبكر.","Try the demo":"جرّب النسخة التجريبية","Contact":"تواصل معنا","Be first to try VYAJ.":"كن من أوائل من يجرّبون VYAJ.","Email address":"البريد الإلكتروني","Something went wrong. Please try again.":"حدث خطأ ما. حاول مرة أخرى.","Close":"إغلاق","You’re on the list. We’ll keep you updated.":"أصبحت ضمن القائمة. سنبقيك على اطلاع.","How it works":"كيف يعمل","What’s available":"المتاح حاليًا","Early access":"الوصول المبكر","Build my trip":"خطّط لرحلتي","Language":"اللغة","Discover my next trip":"اكتشف رحلتي القادمة","I know where I’m going":"أعرف وجهتي","Choose a suggestion or type any destination. Suggestions are curated examples, not live search results.":"اختر وجهة مقترحة أو اكتب أي وجهة تريدها. الاقتراحات أمثلة مختارة وليست نتائج بحث مباشرة.","Search airport or city":"ابحث عن مطار أو مدينة","Loading worldwide airport list…":"جارٍ تحميل قائمة المطارات حول العالم…","No matching airports. Try a city name or airport code.":"لم نعثر على مطار مطابق. جرّب اسم مدينة أو رمز مطار.","Start typing to search airports around the world.":"ابدأ بالكتابة للبحث عن مطارات حول العالم.","Optional · add your departure airport for a flight estimate.":"اختياري · أضف مطار المغادرة للحصول على تقدير لتكلفة الطيران.","Choose your overall budget. It is a target, not a price quote; costs aren’t live-checked.":"حدّد ميزانيتك التقريبية. هذا هدف للإنفاق وليس عرض سعر، ولا يتم التحقق من الأسعار مباشرة.","AI-generated starter plan · Estimates only, no bookings":"برنامج أولي بالذكاء الاصطناعي · التكاليف تقديرية ولا يشمل حجوزات","Your AI-generated starter itinerary is ready. Refine it around your preferences and verify details before travelling.":"برنامج رحلتك الأولي جاهز. عدّله حسب تفضيلاتك وتحقق من التفاصيل قبل السفر.","VYAJ is shaping your itinerary around your destination and travel style.":"يجري VYAJ إعداد برنامج يناسب وجهتك وأسلوب سفرك.","Start with a destination and a few preferences. VYAJ will turn them into a practical first itinerary.":"اختر وجهة وحدّد بعض التفضيلات، وسيحوّلها VYAJ إلى برنامج رحلة مبدئي قابل للتعديل.","Not estimated":"غير متاح تقديره","Costs are estimates and should be checked before booking.":"التكاليف تقديرية ويجب التحقق منها قبل الحجز.","You’ll continue to Google Flights to compare current fares and book with the airline or travel provider. Prices and availability are confirmed by the provider.":"ستنتقل إلى Google Flights لمقارنة الأسعار الحالية ومتابعة الحجز مع شركة الطيران أو مزوّد الخدمة. الأسعار والتوافر يؤكدهما المزوّد.","Food & culture":"الطعام والثقافة","Nature & outdoors":"الطبيعة والأنشطة الخارجية","Slow escape":"رحلة للاسترخاء","A bit of everything":"مزيج من كل شيء"}
};

const germanPageCopy: Record<string, string> = {"Find the trip":"Entdecke die Reise","you didn’t know":"die du noch nicht kanntest","you needed.":"und die dir gefehlt hat.","Tell VYAJ what you’re craving. Discover a trip that feels like you — then turn it into a plan.":"Verrate VYAJ, worauf du Lust hast. Entdecke eine Reise, die zu dir passt, und mach daraus einen Plan.","YOUR WORLD IS WAITING":"Dein nächstes Abenteuer wartet","YOUR NEXT POSSIBILITY":"Deine nächste Möglichkeit","READY TO DISCOVER":"Bereit, Neues zu entdecken","Not just a destination.":"Mehr als nur ein Reiseziel.","A feeling, turned into a journey.":"Aus einem Gefühl wird eine Reise.","Discover":"Entdecken","Personalise":"Individuell gestalten","Go":"Los geht’s","Inspiration first. Your plan next.":"Erst die Inspiration. Dann dein Reiseplan.","Made around you":"Für dich gemacht","What are you":"Worauf hast du","craving?":"Lust?","FIND YOUR KIND OF ESCAPE":"Finde deine Auszeit","You don’t need a destination yet. Start with a feeling — VYAJ will help you find the rest.":"Du musst dich noch nicht für ein Reiseziel entscheiden. Wähle zuerst die Stimmung, die du suchst – VYAJ hilft dir beim Rest.","SLOW DOWN":"Nimm dir Zeit","Find your kind of escape.":"Finde deine perfekte Auszeit.","Step away from the noise, slow down, and give yourself space to feel the magic.":"Lass den Alltag hinter dir, komm zur Ruhe und genieße neue Eindrücke.","ISLAND STORIES":"Inselgeschichten","Find your island rhythm.":"Finde deinen Inselrhythmus.","Golden streets, sea views, and the easy rhythm of Mediterranean life.":"Schöne Gassen, Ausblicke aufs Meer und das entspannte Lebensgefühl des Mittelmeers.","GET LOST IN CULTURE":"Kultur entdecken","Get lost in history.":"Tauche in die Geschichte ein.","Ancient wonders, lively piazzas, and unforgettable Italian flavours.":"Beeindruckende antike Bauwerke, lebendige Plätze und unvergessliche italienische Küche.","Explore this feeling":"Entdecke dieses Reisegefühl","Pick a feeling to start a personalised trip plan.":"Wähle eine Stimmung und beginne mit deinem persönlichen Reiseplan.","START WITH THE BASICS":"Beginne mit den Grundlagen","Build a trip":"Plane eine Reise","that fits.":"die zu dir passt.","Set the essentials. We’ll show you how a more considered itinerary could come together.":"Lege die wichtigsten Angaben fest. Wir zeigen dir einen Reiseplan, der zu deiner Zeit und deinen Interessen passt.","No perfect prompt required.":"Du brauchst keinen perfekten Prompt.","VYAJ TRIP BUILDER":"VYAJ-Reiseplaner","Where to next?":"Wohin soll es gehen?","DEMO":"DEMO","Language":"Sprache","How it works":"So funktioniert’s","What’s available":"Was verfügbar ist","Early access":"Früher Zugang","Build my trip":"Meine Reise planen","Plan your trip":"Plane deine Reise","Build an itinerary":"Erstelle einen Reiseplan","Flight":"Flüge","Search flights":"Flüge suchen","VYAJ FLIGHT SEARCH":"VYAJ-FLUGSUCHE","Find your way there.":"Finde den passenden Weg.","Flying from":"Abflug von","Flying to":"Flugziel","Round trip":"Hin- und Rückflug","One way only":"Nur Hinflug","Departure date":"Abflugdatum","Return date":"Rückflugdatum","Search cheapest flights":"Günstige Flüge suchen","Plan my trip":"Meine Reise planen","Destination":"Reiseziel","Total budget":"Gesamtbudget","Your kind of trip":"Deine Art zu reisen","A FIRST LOOK":"EIN ERSTER EINBLICK","A trip you":"Eine Reise, die du","can picture.":"dir vorstellen kannst.","Your AI-generated starter itinerary is ready. Refine it around your preferences and verify details before travelling.":"Dein erster KI-Reiseplan ist fertig. Passe ihn an deine Wünsche an und prüfe alle Angaben vor der Reise.","YOUR VYAJ ITINERARY":"DEIN VYAJ-REISEPLAN","travellers":"Reisende","AI PLAN":"KI-REISEPLAN","DAY":"TAG","ESTIMATED TRIP COST":"GESCHÄTZTE REISEKOSTEN","Not estimated":"Nicht geschätzt","APPROXIMATE COST BREAKDOWN":"GESCHÄTZTE KOSTENÜBERSICHT","Flights":"Flüge","Hotel / accommodation":"Hotel / Unterkunft","Food & drinks":"Essen und Getränke","Local transport":"Nahverkehr","Activities & tickets":"Aktivitäten und Eintrittskarten","Other costs":"Sonstige Kosten","TRAVEL TIPS":"REISETIPPS","ASSUMPTIONS TO CHECK":"ANGABEN ZUR PRÜFUNG","AI-generated starter plan. Prices, opening hours, transport and availability are not live-verified.":"Erster KI-Reiseplan. Preise, Öffnungszeiten, Verkehr und Verfügbarkeit werden nicht live überprüft.","Adjust your trip":"Passe deine Reise an","Use this itinerary as a starting point, not a booking confirmation. Verify current opening hours, transport schedules, prices and availability before travelling.":"Nutze diesen Reiseplan als Ausgangspunkt, nicht als Buchungsbestätigung. Prüfe Öffnungszeiten, Fahrpläne, Preise und Verfügbarkeit vor der Reise.","Arrive & settle in":"Ankommen und orientieren","Get your bearings, without rushing.":"Verschaffe dir in Ruhe einen ersten Überblick.","Explore with intention":"Bewusst entdecken","One anchor activity. Space around it.":"Eine Hauptaktivität und genug Zeit dazwischen.","Leave room for a surprise":"Lass Platz für Überraschungen","Local finds and time to wander.":"Lokale Entdeckungen und Zeit zum Schlendern.","A BETTER KIND OF ITINERARY":"EIN BESSERER REISEPLAN","Structure, not a schedule to obey.":"Eine klare Struktur, kein starrer Zeitplan.","Preview a sample plan built around your destination, time and travel style.":"Sieh dir einen Beispielplan an, der zu deinem Ziel, deiner Zeit und deinem Reisestil passt.","Try your own details":"Eigene Angaben ausprobieren","HOW IT WORKS":"SO FUNKTIONIERT’S","From “somewhere”":"Von „irgendwo“","to":"bis","let’s go.":"los geht’s.","Keep the decisions simple. Make the trip feel like yours.":"Halte die Entscheidungen einfach und gestalte die Reise nach deinen Vorstellungen.","STEP 01":"SCHRITT 01","STEP 02":"SCHRITT 02","STEP 03":"SCHRITT 03","Set the essentials":"Lege die Grundlagen fest","Choose your destination, dates and a budget you’re comfortable with.":"Wähle dein Reiseziel, deine Reisedaten und ein passendes Budget.","Shape your days":"Gestalte deine Tage","Explore a sample itinerary shaped around your travel style.":"Entdecke einen Beispielplan, der zu deinem Reisestil passt.","Make it your own":"Mach die Reise zu deiner","Adjust your choices and discover a direction that feels right.":"Passe deine Auswahl an und finde heraus, was zu dir passt.","CLEAR FROM DAY ONE":"VON ANFANG AN TRANSPARENT","Useful now.":"Schon jetzt nützlich.","More to come.":"Weitere Funktionen folgen.","We’d rather be clear about what’s ready than promise features that aren’t connected yet.":"Wir zeigen klar, was bereits funktioniert, statt Funktionen zu versprechen, die noch nicht verfügbar sind.","Interactive trip preview":"Interaktive Reisevorschau","Works in this demo using your choices.":"Funktioniert in dieser Demo auf Grundlage deiner Auswahl.","AI-generated itineraries":"KI-generierte Reisepläne","Starter plans are generated by AI; prices and availability aren’t live-verified.":"Die ersten Reisepläne werden von KI erstellt; Preise und Verfügbarkeit werden nicht live geprüft.","Live prices & route times":"Aktuelle Preise und Fahrzeiten","No live travel data is connected.":"Es sind keine Live-Reisedaten angebunden.","Save, share & book":"Speichern, teilen und buchen","Planned for a later release.":"Für eine spätere Version geplant.","AVAILABLE":"VERFÜGBAR","COMING SOON":"DEMNÄCHST","THE NEXT CHAPTER":"WAS ALS NÄCHSTES KOMMT","Be first to plan":"Plane als Erste:r","with":"mit","Join the free waitlist for early-access invitations and launch updates. Be among the first to try VYAJ as new features roll out.":"Trage dich kostenlos in die Warteliste ein, erhalte Einladungen zum frühen Zugang und Neuigkeiten zum Start. Probiere VYAJ aus, sobald neue Funktionen verfügbar sind.","Get early access":"Frühen Zugang erhalten","Free to join. No commitment — just updates and early access.":"Kostenlos und unverbindlich – mit Neuigkeiten und frühem Zugang.","PLAN LESS. TRAVEL MORE.":"WENIGER PLANEN. MEHR ERLEBEN.","Try the demo":"Demo ausprobieren","Contact":"Kontakt","Made for the journeys ahead.":"Für die Reisen, die vor dir liegen.","Be first to try VYAJ.":"Sei unter den Ersten, die VYAJ testen.","Add your email for early-access invitations and launch updates. It’s free, and you can unsubscribe at any time.":"Gib deine E-Mail-Adresse ein, um Einladungen und Neuigkeiten zum Start zu erhalten. Kostenlos; du kannst dich jederzeit abmelden.","You’re on the list. We’ll keep you updated.":"Du stehst auf der Liste. Wir halten dich auf dem Laufenden.","Email address":"E-Mail-Adresse","Joining…":"Wird eingetragen…","Something went wrong. Please try again.":"Etwas ist schiefgelaufen. Bitte versuche es erneut.","By joining, you agree to receive VYAJ launch updates by email.":"Mit deiner Anmeldung stimmst du zu, Neuigkeiten zum VYAJ-Start per E-Mail zu erhalten.","Close":"Schließen","Add a destination to plan your trip.":"Gib ein Reiseziel ein, um deine Reise zu planen.","The planner returned an incomplete itinerary. Please try again.":"Der Reiseplan ist unvollständig. Bitte versuche es erneut.","AI trip planning is coming soon.":"KI-Reiseplanung ist bald verfügbar.","The trip planner is not available right now. Please try again later.":"Der Reiseplaner ist gerade nicht verfügbar. Bitte versuche es später erneut.","We couldn't connect to the trip planner. Please try again.":"Die Verbindung zum Reiseplaner ist fehlgeschlagen. Bitte versuche es erneut.","Thinking…":"Wird verarbeitet…","people":"Personen","traveller":"Reisende:r","Food & culture":"Essen und Kultur","Nature & outdoors":"Natur und Aktivitäten im Freien","Slow escape":"Entspannte Auszeit","A bit of everything":"Von allem etwas","Search any city or destination":"Stadt oder Reiseziel suchen","Choose a suggestion or type any destination. Suggestions are curated examples, not live search results.":"Wähle einen Vorschlag oder gib ein Reiseziel ein. Die Vorschläge sind Beispiele und keine Live-Suchergebnisse.","Search airport or city":"Flughafen oder Stadt suchen","Loading worldwide airport list…":"Flughafenliste wird geladen…","No matching airports. Try a city name or airport code.":"Kein passender Flughafen gefunden. Versuche einen Stadtnamen oder Flughafencode.","Start typing to search airports around the world.":"Gib einen Namen ein, um weltweit nach Flughäfen zu suchen.","Optional · add your departure airport for a flight estimate.":"Optional · gib deinen Abflughafen für eine Flugkostenschätzung ein.","Choose your overall budget. It is a target, not a price quote; costs aren’t live-checked.":"Lege dein ungefähres Gesamtbudget fest. Es ist ein Richtwert, kein Angebot; Preise werden nicht live geprüft.","AI-generated starter plan · Estimates only, no bookings":"Erster KI-Reiseplan · Nur Schätzungen, keine Buchungen","VYAJ is shaping your itinerary around your destination and travel style.":"VYAJ erstellt einen Reiseplan passend zu deinem Ziel und Reisestil.","Start with a destination and a few preferences. VYAJ will turn them into a practical first itinerary.":"Wähle ein Reiseziel und einige Vorlieben. VYAJ erstellt daraus einen ersten praktischen Reiseplan.","Costs are estimates and should be checked before booking.":"Die Kosten sind Schätzungen und sollten vor der Buchung überprüft werden.","You’ll continue to Google Flights to compare current fares and book with the airline or travel provider. Prices and availability are confirmed by the provider.":"Du wirst zu Google Flights weitergeleitet, um aktuelle Preise zu vergleichen und bei der Fluggesellschaft oder einem Anbieter zu buchen. Preise und Verfügbarkeit bestätigt der jeweilige Anbieter.","days":"Tage","person":"Person","Search any airport or city":"Flughafen oder Stadt suchen","Discover my next trip":"Entdecke meine nächste Reise","I know where I’m going":"Ich kenne mein Reiseziel"
};

const translations: Record<Language, Record<string, string>> = {
  en: { "How it works":"How it works","What’s available":"What’s available","Early access":"Early access","Build my trip":"Build my trip","YOUR WORLD IS WAITING":"YOUR NEXT ADVENTURE AWAITS","Find the trip":"Discover the trip","Discover my next trip":"Discover my next trip","I know where I’m going":"I know where I’m going","Inspiration first. Your plan next.":"Start with inspiration. Then make your plan.","Made around you":"Made for you","What are you":"What are you","craving?":"in the mood for?","Plan your trip":"Plan your trip","Build an itinerary":"Build an itinerary","Flight":"Flight","Search flights":"Search flights","VYAJ FLIGHT SEARCH":"VYAJ FLIGHT SEARCH","Find your way there.":"Find your way there.","Flying from":"Flying from","Flying to":"Flying to","Round trip":"Round trip","One way only":"One way only","Departure date":"Departure date","Return date":"Return date","Search cheapest flights":"Search cheapest flights","Plan my trip":"Plan my trip","Destination":"Destination","Total budget":"Total budget","Your kind of trip":"Your kind of trip","Language":"Language", "A FIRST LOOK":"A FIRST LOOK", "A trip you":"A trip you", "can picture.":"can picture.", "Your AI-generated starter itinerary is ready. Refine it around your preferences and verify details before travelling.":"Your AI-generated starter itinerary is ready. Refine it around your preferences and verify details before travelling.", "YOUR VYAJ ITINERARY":"YOUR VYAJ ITINERARY", "travellers":"travellers", "AI PLAN":"AI PLAN", "DAY":"DAY", "ESTIMATED TRIP COST":"ESTIMATED TRIP COST", "Not estimated":"Not estimated", "APPROXIMATE COST BREAKDOWN":"APPROXIMATE COST BREAKDOWN", "Flights":"Flights", "Hotel / accommodation":"Hotel / accommodation", "Food & drinks":"Food & drinks", "Local transport":"Local transport", "Activities & tickets":"Activities & tickets", "Other costs":"Other costs", "TRAVEL TIPS":"TRAVEL TIPS", "ASSUMPTIONS TO CHECK":"ASSUMPTIONS TO CHECK", "AI-generated starter plan. Prices, opening hours, transport and availability are not live-verified.":"AI-generated starter plan. Prices, opening hours, transport and availability are not live-verified.", "Adjust your trip":"Adjust your trip", "Use this itinerary as a starting point, not a booking confirmation. Verify current opening hours, transport schedules, prices and availability before travelling.":"Use this itinerary as a starting point, not a booking confirmation. Verify current opening hours, transport schedules, prices and availability before travelling.", "Arrive & settle in":"Arrive & settle in", "Get your bearings, without rushing.":"Get your bearings, without rushing.", "Explore with intention":"Explore with intention", "One anchor activity. Space around it.":"One anchor activity. Space around it.", "Leave room for a surprise":"Leave room for a surprise", "Local finds and time to wander.":"Local finds and time to wander.", "A BETTER KIND OF ITINERARY":"A BETTER KIND OF ITINERARY", "Structure, not a schedule to obey.":"Structure, not a schedule to obey.", "Preview a sample plan built around your destination, time and travel style.":"Preview a sample plan built around your destination, time and travel style.", "Try your own details":"Try your own details", "HOW IT WORKS":"HOW IT WORKS", "From “somewhere”":"From “somewhere”", "to":"to", "let’s go.":"let’s go.", "Keep the decisions simple. Make the trip feel like yours.":"Keep the decisions simple. Make the trip feel like yours.", "STEP 01":"STEP 01", "STEP 02":"STEP 02", "STEP 03":"STEP 03", "Set the essentials":"Set the essentials", "Choose your destination, dates and a budget you’re comfortable with.":"Choose your destination, dates and a budget you’re comfortable with.", "Shape your days":"Shape your days", "Explore a sample itinerary shaped around your travel style.":"Explore a sample itinerary shaped around your travel style.", "Make it your own":"Make it your own", "Adjust your choices and discover a direction that feels right.":"Adjust your choices and discover a direction that feels right.", "CLEAR FROM DAY ONE":"CLEAR FROM DAY ONE", "Useful now.":"Useful now.", "More to come.":"More to come.", "We’d rather be clear about what’s ready than promise features that aren’t connected yet.":"We’d rather be clear about what’s ready than promise features that aren’t connected yet.", "Interactive trip preview":"Interactive trip preview", "Works in this demo using your choices.":"Works in this demo using your choices.", "AI-generated itineraries":"AI-generated itineraries", "Starter plans are generated by AI; prices and availability aren’t live-verified.":"Starter plans are generated by AI; prices and availability aren’t live-verified.", "Live prices & route times":"Live prices & route times", "No live travel data is connected.":"No live travel data is connected.", "Save, share & book":"Save, share & book", "Planned for a later release.":"Planned for a later release.", "AVAILABLE":"AVAILABLE", "COMING SOON":"COMING SOON", "THE NEXT CHAPTER":"THE NEXT CHAPTER", "Be first to plan":"Be first to plan", "with":"with", "Join the free waitlist for early-access invitations and launch updates. Be among the first to try VYAJ as new features roll out.":"Join the free waitlist for early-access invitations and launch updates. Be among the first to try VYAJ as new features roll out.", "Get early access":"Get early access", "Free to join. No commitment — just updates and early access.":"Free to join. No commitment — just updates and early access.", "PLAN LESS. TRAVEL MORE.":"PLAN LESS. TRAVEL MORE.", "Try the demo":"Try the demo", "Contact":"Contact", "Made for the journeys ahead.":"Made for the journeys ahead.", "Be first to try VYAJ.":"Be first to try VYAJ.", "Add your email for early-access invitations and launch updates. It’s free, and you can unsubscribe at any time.":"Add your email for early-access invitations and launch updates. It’s free, and you can unsubscribe at any time.", "You’re on the list. We’ll keep you updated.":"You’re on the list. We’ll keep you updated.", "Email address":"Email address", "Joining…":"Joining…", "Something went wrong. Please try again.":"Something went wrong. Please try again.", "By joining, you agree to receive VYAJ launch updates by email.":"By joining, you agree to receive VYAJ launch updates by email.", "Close":"Close", "Add a destination to plan your trip.":"Add a destination to plan your trip.", "The planner returned an incomplete itinerary. Please try again.":"The planner returned an incomplete itinerary. Please try again.", "AI trip planning is coming soon.":"AI trip planning is coming soon.", "The trip planner is not available right now. Please try again later.":"The trip planner is not available right now. Please try again later.", "We couldn't connect to the trip planner. Please try again.":"We couldn't connect to the trip planner. Please try again.", "Thinking…":"Thinking…", "people":"people", "traveller":"traveller", "Food & culture":"Food & culture", "Nature & outdoors":"Nature & outdoors", "Slow escape":"Slow escape", "A bit of everything":"A bit of everything" },
  ar: { "How it works":"كيف يعمل","What’s available":"المتاح","Early access":"الوصول المبكر","Build my trip":"خطط رحلتي","YOUR WORLD IS WAITING":"عالمك في انتظارك","Find the trip":"اكتشف الرحلة","Discover my next trip":"اكتشف رحلتي القادمة","I know where I’m going":"أعرف وجهتي","Inspiration first. Your plan next.":"ابدأ بالإلهام، ثم خطط رحلتك","Made around you":"مصممة خصيصًا لك","What are you":"ما الذي","craving?":"تتوق إليه؟","Plan your trip":"خطط رحلتك","Build an itinerary":"أنشئ برنامج رحلة","Flight":"الطيران","Search flights":"ابحث عن رحلات","VYAJ FLIGHT SEARCH":"البحث عن الرحلات","Find your way there.":"ابدأ رحلتك من هنا","Flying from":"المغادرة من","Flying to":"الوجهة","Round trip":"ذهاب وعودة","One way only":"ذهاب فقط","Departure date":"تاريخ المغادرة","Return date":"تاريخ العودة","Search cheapest flights":"ابحث عن أرخص الرحلات","Plan my trip":"خطط رحلتي","Destination":"الوجهة","Total budget":"الميزانية الإجمالية","Your kind of trip":"نوع رحلتك","Language":"اللغة", "A FIRST LOOK":"نظرة أولى", "A trip you":"رحلة يمكنك", "can picture.":"تخيّلها.", "Your AI-generated starter itinerary is ready. Refine it around your preferences and verify details before travelling.":"برنامج رحلتك الأول المُنشأ بالذكاء الاصطناعي جاهز. عدّله حسب تفضيلاتك وتأكد من التفاصيل قبل السفر.", "YOUR VYAJ ITINERARY":"برنامج رحلتك من VYAJ", "travellers":"مسافرون", "AI PLAN":"خطة بالذكاء الاصطناعي", "DAY":"اليوم", "ESTIMATED TRIP COST":"التكلفة التقديرية للرحلة", "Not estimated":"غير محدد", "APPROXIMATE COST BREAKDOWN":"تفصيل تقريبي للتكاليف", "Flights":"الطيران", "Hotel / accommodation":"الفندق / الإقامة", "Food & drinks":"الطعام والمشروبات", "Local transport":"المواصلات المحلية", "Activities & tickets":"الأنشطة والتذاكر", "Other costs":"تكاليف أخرى", "TRAVEL TIPS":"نصائح السفر", "ASSUMPTIONS TO CHECK":"تفاصيل يجب التحقق منها", "AI-generated starter plan. Prices, opening hours, transport and availability are not live-verified.":"خطة أولية بالذكاء الاصطناعي. الأسعار ومواعيد العمل والمواصلات والتوافر لم يتم التحقق منها لحظيًا.", "Adjust your trip":"عدّل رحلتك", "Use this itinerary as a starting point, not a booking confirmation. Verify current opening hours, transport schedules, prices and availability before travelling.":"استخدم هذا البرنامج كنقطة بداية وليس كتأكيد حجز. تحقق من مواعيد العمل والمواصلات والأسعار والتوافر قبل السفر.", "Arrive & settle in":"الوصول والاستقرار", "Get your bearings, without rushing.":"تعرّف على المكان دون استعجال.", "Explore with intention":"استكشف بتأنٍ", "One anchor activity. Space around it.":"نشاط رئيسي واحد مع وقت للراحة.", "Leave room for a surprise":"اترك مساحة للمفاجآت", "Local finds and time to wander.":"اكتشافات محلية ووقت للتجول.", "A BETTER KIND OF ITINERARY":"برنامج رحلة أفضل", "Structure, not a schedule to obey.":"تنظيم مرن، لا جدول صارم.", "Preview a sample plan built around your destination, time and travel style.":"شاهد نموذجًا لخطة تناسب وجهتك ووقتك وأسلوب سفرك.", "Try your own details":"جرّب بياناتك", "HOW IT WORKS":"كيف يعمل", "From “somewhere”":"من فكرة «مكان ما»", "to":"إلى", "let’s go.":"هيا ننطلق.", "Keep the decisions simple. Make the trip feel like yours.":"اجعل القرارات بسيطة واجعل الرحلة تناسبك.", "STEP 01":"الخطوة ١", "STEP 02":"الخطوة ٢", "STEP 03":"الخطوة ٣", "Set the essentials":"حدّد الأساسيات", "Choose your destination, dates and a budget you’re comfortable with.":"اختر وجهتك ومواعيدك والميزانية المناسبة لك.", "Shape your days":"رتّب أيامك", "Explore a sample itinerary shaped around your travel style.":"استكشف برنامج رحلة يناسب أسلوب سفرك.", "Make it your own":"اجعلها رحلتك", "Adjust your choices and discover a direction that feels right.":"عدّل اختياراتك وحدد ما يناسبك.", "CLEAR FROM DAY ONE":"وضوح من البداية", "Useful now.":"مفيد الآن.", "More to come.":"والمزيد قريبًا.", "We’d rather be clear about what’s ready than promise features that aren’t connected yet.":"نوضح لك ما هو متاح فعلًا بدلًا من الوعد بميزات لم تجهز بعد.", "Interactive trip preview":"معاينة تفاعلية للرحلة", "Works in this demo using your choices.":"تعمل في هذه النسخة التجريبية وفق اختياراتك.", "AI-generated itineraries":"برامج رحلات بالذكاء الاصطناعي", "Starter plans are generated by AI; prices and availability aren’t live-verified.":"يُنشئ الذكاء الاصطناعي خططًا أولية، لكن الأسعار والتوافر غير مؤكدة لحظيًا.", "Live prices & route times":"الأسعار وأوقات التنقل المباشرة", "No live travel data is connected.":"لا توجد بيانات سفر مباشرة متصلة حاليًا.", "Save, share & book":"الحفظ والمشاركة والحجز", "Planned for a later release.":"مخطط لها في إصدار لاحق.", "AVAILABLE":"متاح", "COMING SOON":"قريبًا", "THE NEXT CHAPTER":"الخطوة التالية", "Be first to plan":"كن أول من يخطط", "with":"مع", "Join the free waitlist for early-access invitations and launch updates. Be among the first to try VYAJ as new features roll out.":"انضم مجانًا إلى قائمة الانتظار للحصول على دعوة الوصول المبكر وآخر أخبار الإطلاق، وكن من أوائل مستخدمي VYAJ.", "Get early access":"احصل على وصول مبكر", "Free to join. No commitment — just updates and early access.":"الانضمام مجاني، دون التزام؛ فقط تحديثات ووصول مبكر.", "PLAN LESS. TRAVEL MORE.":"خطّط أقل. سافر أكثر.", "Try the demo":"جرّب النسخة التجريبية", "Contact":"اتصل بنا", "Made for the journeys ahead.":"مصمم للرحلات القادمة.", "Be first to try VYAJ.":"كن أول من يجرّب VYAJ.", "Add your email for early-access invitations and launch updates. It’s free, and you can unsubscribe at any time.":"أضف بريدك الإلكتروني لتلقي دعوات الوصول المبكر وتحديثات الإطلاق. الخدمة مجانية ويمكنك إلغاء الاشتراك في أي وقت.", "You’re on the list. We’ll keep you updated.":"تمت إضافتك إلى القائمة. سنبقيك على اطلاع.", "Email address":"البريد الإلكتروني", "Joining…":"جارٍ الانضمام…", "Something went wrong. Please try again.":"حدث خطأ. حاول مرة أخرى.", "By joining, you agree to receive VYAJ launch updates by email.":"بانضمامك، توافق على تلقي تحديثات إطلاق VYAJ عبر البريد الإلكتروني.", "Close":"إغلاق", "Add a destination to plan your trip.":"أضف وجهة لتخطيط رحلتك.", "The planner returned an incomplete itinerary. Please try again.":"عاد مخطط الرحلة بنتيجة غير مكتملة. حاول مرة أخرى.", "AI trip planning is coming soon.":"تخطيط الرحلات بالذكاء الاصطناعي قريبًا.", "The trip planner is not available right now. Please try again later.":"مخطط الرحلات غير متاح حاليًا. حاول لاحقًا.", "We couldn't connect to the trip planner. Please try again.":"تعذر الاتصال بمخطط الرحلات. حاول مرة أخرى.", "Thinking…":"جارٍ التفكير…", "people":"أشخاص", "traveller":"مسافر", "Food & culture":"الطعام والثقافة", "Nature & outdoors":"الطبيعة والأنشطة الخارجية", "Slow escape":"رحلة هادئة", "A bit of everything":"مزيج من كل شيء" },
  fr: { "How it works":"Comment ça marche","What’s available":"Disponibilités","Early access":"Accès anticipé","Build my trip":"Planifier mon voyage","YOUR WORLD IS WAITING":"Votre monde vous attend","Find the trip":"Trouvez le voyage","Discover my next trip":"Découvrir mon prochain voyage","I know where I’m going":"Je connais ma destination","Inspiration first. Your plan next.":"L’inspiration d’abord, le plan ensuite.","Made around you":"Pensé pour vous","What are you":"De quoi avez-vous","craving?":"envie ?","Plan your trip":"Planifier votre voyage","Build an itinerary":"Créer un itinéraire","Flight":"Vol","Search flights":"Rechercher des vols","VYAJ FLIGHT SEARCH":"RECHERCHE DE VOLS VYAJ","Find your way there.":"En route vers votre destination.","Flying from":"Départ de","Flying to":"Destination","Round trip":"Aller-retour","One way only":"Aller simple","Departure date":"Date de départ","Return date":"Date de retour","Search cheapest flights":"Rechercher les vols les moins chers","Plan my trip":"Planifier mon voyage","Destination":"Destination","Total budget":"Budget total","Your kind of trip":"Votre style de voyage","Language":"Langue", "A FIRST LOOK":"UN PREMIER APERÇU", "YOUR VYAJ ITINERARY":"VOTRE ITINÉRAIRE VYAJ", "travellers":"voyageurs", "AI PLAN":"PLAN IA", "DAY":"JOUR", "ESTIMATED TRIP COST":"COÛT ESTIMÉ DU VOYAGE", "Not estimated":"Non estimé", "APPROXIMATE COST BREAKDOWN":"DÉTAIL APPROXIMATIF DES COÛTS", "Flights":"Vols", "Hotel / accommodation":"Hôtel / hébergement", "Food & drinks":"Repas et boissons", "Local transport":"Transports locaux", "Activities & tickets":"Activités et billets", "Other costs":"Autres coûts", "TRAVEL TIPS":"CONSEILS DE VOYAGE", "ASSUMPTIONS TO CHECK":"POINTS À VÉRIFIER", "Adjust your trip":"Modifier votre voyage", "Arrive & settle in":"Arrivée et installation", "Explore with intention":"Explorer à votre rythme", "Leave room for a surprise":"Garder une place à la surprise", "HOW IT WORKS":"COMMENT ÇA MARCHE", "Set the essentials":"Définir l’essentiel", "Shape your days":"Organiser vos journées", "Make it your own":"Personnaliser votre voyage", "CLEAR FROM DAY ONE":"CLAIR DÈS LE DÉBUT", "Useful now.":"Utile dès maintenant.", "More to come.":"D’autres nouveautés arrivent.", "Interactive trip preview":"Aperçu interactif du voyage", "AI-generated itineraries":"Itinéraires générés par IA", "COMING SOON":"BIENTÔT", "AVAILABLE":"DISPONIBLE", "THE NEXT CHAPTER":"LA SUITE", "Get early access":"Accès anticipé", "Try the demo":"Essayer la démo", "Contact":"Contact", "Email address":"Adresse e-mail", "Close":"Fermer", "Thinking…":"Réflexion…", "Add a destination to plan your trip.":"Ajoutez une destination pour planifier votre voyage.", "Food & culture":"Gastronomie et culture", "Nature & outdoors":"Nature et plein air", "Slow escape":"Escapade tranquille", "A bit of everything":"Un peu de tout" },
  it: { "How it works":"Come funziona","What’s available":"Disponibilità","Early access":"Accesso anticipato","Build my trip":"Pianifica il viaggio","YOUR WORLD IS WAITING":"Il tuo mondo ti aspetta","Find the trip":"Trova il viaggio","Discover my next trip":"Scopri il prossimo viaggio","I know where I’m going":"So già dove andare","Inspiration first. Your plan next.":"Prima l’ispirazione, poi il piano.","Made around you":"Pensato per te","What are you":"Cosa desideri","craving?":"davvero?","Plan your trip":"Pianifica il viaggio","Build an itinerary":"Crea un itinerario","Flight":"Volo","Search flights":"Cerca voli","VYAJ FLIGHT SEARCH":"RICERCA VOLI VYAJ","Find your way there.":"Trova la strada per partire.","Flying from":"Partenza da","Flying to":"Destinazione","Round trip":"Andata e ritorno","One way only":"Solo andata","Departure date":"Data di partenza","Return date":"Data di ritorno","Search cheapest flights":"Cerca i voli più economici","Plan my trip":"Pianifica il viaggio","Destination":"Destinazione","Total budget":"Budget totale","Your kind of trip":"Il tuo stile di viaggio","Language":"Lingua" },
  de: { ...germanPageCopy, "How it works":"So funktioniert es","What’s available":"Verfügbare Funktionen","Early access":"Früher Zugang","Build my trip":"Meine Reise planen","Language":"Sprache","YOUR WORLD IS WAITING":"Dein nächstes Abenteuer wartet","Find the trip":"Entdecke die Reise","you didn’t know":"die du noch nicht kanntest","you needed.":"und die dir gefehlt hat.","Tell VYAJ what you’re craving. Discover a trip that feels like you — then turn it into a plan.":"Verrate VYAJ, worauf du Lust hast. Entdecke eine Reise, die zu dir passt, und mach daraus einen Plan.","Discover my next trip":"Meine nächste Reise entdecken","I know where I’m going":"Ich weiß schon, wohin ich möchte","YOUR NEXT POSSIBILITY":"Deine nächste Möglichkeit","READY TO DISCOVER":"Bereit, Neues zu entdecken","Not just a destination.":"Mehr als nur ein Reiseziel.","A feeling, turned into a journey.":"Aus einem Gefühl wird eine Reise.","START WITH THE BASICS":"Beginne mit den Grundlagen","Build a trip":"Plane eine Reise","that fits.":"die zu dir passt.","Set the essentials. We’ll show you how a more considered itinerary could come together.":"Lege die wichtigsten Details fest. Wir zeigen dir einen Reiseplan, der zu dir passt.","No perfect prompt required.":"Du brauchst keine perfekte Eingabe.","Trip planning mode":"Reiseplanung","Plan your trip":"Reise planen","Build an itinerary":"Reiseplan erstellen","Flight":"Flüge","Search flights":"Flüge suchen","VYAJ FLIGHT SEARCH":"VYAJ FLUGSUCHE","Flying from":"Abflug von","Flying to":"Ankunft in","Round trip":"Hin- und Rückflug","One way only":"Nur Hinflug","Departure date":"Abflugdatum","Return date":"Rückflugdatum","Search cheapest flights":"Günstigste Flüge suchen","VYAJ TRIP BUILDER":"VYAJ-Reiseplaner","Where to next?":"Wohin soll es als Nächstes gehen?","Destination":"Reiseziel","Search any city or destination":"Stadt oder Reiseziel suchen","Search airport or city":"Flughafen oder Stadt suchen","Loading worldwide airport list…":"Flughäfen weltweit werden geladen …","Loading worldwide airports…":"Flughäfen weltweit werden geladen …","How many days?":"Wie viele Tage?","days":"Tage","Travellers":"Reisende","person":"Person","people":"Personen","Total budget":"Gesamtbudget","Your kind of trip":"Deine Art zu reisen","Thinking…":"Einen Moment …","Plan my trip":"Meine Reise planen","AI-generated starter plan · Estimates only, no bookings":"Erster KI-Reiseplan · Nur Schätzungen, keine Buchungen","YOUR VYAJ ITINERARY":"DEIN VYAJ-REISEPLAN","travellers":"Reisende","AI PLAN":"KI-PLAN","DAY":"TAG","ESTIMATED TRIP COST":"GESCHÄTZTE REISEKOSTEN","Not estimated":"Noch nicht geschätzt","Flights":"Flüge","Hotel / accommodation":"Hotel / Unterkunft","Food & drinks":"Essen & Getränke","Local transport":"Nahverkehr","Activities & tickets":"Aktivitäten & Eintrittskarten","Other costs":"Sonstige Kosten","TRAVEL TIPS":"REISETIPPS","ASSUMPTIONS TO CHECK":"ANGABEN ZUR PRÜFUNG","FIND YOUR KIND OF ESCAPE":"Finde deine Art der Auszeit","What are you":"Wonach ist dir","craving?":"gerade?","SLOW DOWN":"Tempo rausnehmen","Find your kind of escape.":"Finde deine perfekte Auszeit.","ISLAND STORIES":"Inselgeschichten","GET LOST IN CULTURE":"Kultur entdecken","Get lost in history.":"Tauche in die Geschichte ein.","HOW IT WORKS":"So funktioniert es","STEP 01":"SCHRITT 01","Set the essentials":"Lege die Grundlagen fest","STEP 02":"SCHRITT 02","Shape your days":"Gestalte deine Reisetage","STEP 03":"SCHRITT 03","Make it your own":"Mach es zu deiner Reise","AVAILABLE":"VERFÜGBAR","COMING SOON":"DEMNÄCHST","Save, share & book":"Speichern, teilen und buchen","Get early access":"Frühen Zugang erhalten","PLAN LESS. TRAVEL MORE.":"WENIGER PLANEN. MEHR REISEN.","Try the demo":"Demo ausprobieren","Contact":"Kontakt","Close":"Schließen","Email address":"E-Mail-Adresse","Joining…":"Wird eingetragen …","Something went wrong. Please try again.":"Etwas ist schiefgelaufen. Bitte versuche es erneut.","Made for the journeys ahead.":"Für deine kommenden Reisen gemacht.","traveller":"Reisende:r","Food & culture":"Essen & Kultur","Nature & outdoors":"Natur & Aktivitäten im Freien","Slow escape":"Entspannte Auszeit","A bit of everything":"Von allem etwas","English":"Englisch","Français":"Französisch","Italiano":"Italienisch","Add a destination to plan your trip.":"Gib ein Reiseziel ein, um deine Reise zu planen.","The planner returned an incomplete itinerary. Please try again.":"Der Reiseplan ist unvollständig. Bitte versuche es erneut.","AI trip planning is coming soon.":"Die KI-Reiseplanung kommt bald.","The trip planner is not available right now. Please try again later.":"Der Reiseplaner ist momentan nicht verfügbar. Bitte versuche es später erneut.","We couldn't connect to the trip planner. Please try again.":"Die Verbindung zum Reiseplaner ist fehlgeschlagen. Bitte versuche es erneut.","Compare live flight offers by price, airline, travel time and stops. Choose an option to continue to a booking search.":"Vergleiche Flugoptionen nach Preis, Airline, Reisedauer und Zwischenstopps. Wähle eine Option, um die Buchungssuche fortzusetzen.","Discover the history and coastal charm of Valletta, Malta":"Entdecke die Geschichte und den Küstencharme von Valletta auf Malta","Find your kind of escape in Puteaux, France":"Finde deine passende Auszeit in Puteaux, Frankreich","Discover the food and culture of Rome, Italy":"Entdecke Küche und Kultur in Rom, Italien","Flexible budget":"Flexibles Budget","1 traveller":"1 Reisende:r","5 or more travellers":"5 oder mehr Reisende","See breakdown below":"Siehe Kostenaufschlüsselung unten","Close navigation":"Navigation schließen","5+ travellers":"5+ Reisende" }
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
      headers: { Accept: "application/json", "A FIRST LOOK":"UNA PRIMA ANTEPRIMA", "YOUR VYAJ ITINERARY":"IL TUO ITINERARIO VYAJ", "travellers":"viaggiatori", "AI PLAN":"PIANO IA", "DAY":"GIORNO", "ESTIMATED TRIP COST":"COSTO STIMATO DEL VIAGGIO", "Not estimated":"Non stimato", "APPROXIMATE COST BREAKDOWN":"DETTAGLIO APPROSSIMATIVO DEI COSTI", "Flights":"Voli", "Hotel / accommodation":"Hotel / alloggio", "Food & drinks":"Cibo e bevande", "Local transport":"Trasporti locali", "Activities & tickets":"Attività e biglietti", "Other costs":"Altri costi", "TRAVEL TIPS":"CONSIGLI DI VIAGGIO", "ASSUMPTIONS TO CHECK":"DA VERIFICARE", "Adjust your trip":"Modifica il viaggio", "Arrive & settle in":"Arrivo e sistemazione", "Explore with intention":"Esplora con calma", "Leave room for a surprise":"Lascia spazio alle sorprese", "HOW IT WORKS":"COME FUNZIONA", "Set the essentials":"Definisci l’essenziale", "Shape your days":"Organizza le giornate", "Make it your own":"Personalizza il viaggio", "CLEAR FROM DAY ONE":"CHIARO FIN DALL’INIZIO", "Useful now.":"Utile da subito.", "More to come.":"Altre novità in arrivo.", "Interactive trip preview":"Anteprima interattiva del viaggio", "AI-generated itineraries":"Itinerari generati dall’IA", "COMING SOON":"PROSSIMAMENTE", "AVAILABLE":"DISPONIBILE", "THE NEXT CHAPTER":"IL PROSSIMO PASSO", "Get early access":"Ottieni accesso anticipato", "Try the demo":"Prova la demo", "Contact":"Contatti", "Email address":"Indirizzo e-mail", "Close":"Chiudi", "Thinking…":"Sto pensando…", "Add a destination to plan your trip.":"Aggiungi una destinazione per pianificare il viaggio.", "Food & culture":"Cibo e cultura", "Nature & outdoors":"Natura e attività all’aperto", "Slow escape":"Fuga rilassante", "A bit of everything":"Un po’ di tutto" },
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
  const [flightResults, setFlightResults] = useState<Array<{ id: string; bookingToken: string; airline: string; price: string; currency: string; departure: string; arrival: string; duration: string; stops: number; bookingUrl: string }>>([]);
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
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [destinationFocused, setDestinationFocused] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const t = (value: string) => pageCopy[language][value] || translations[language][value] || value;

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      const header = headerRef.current;
      if (header && !event.composedPath().includes(header)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [menuOpen]);

  useEffect(() => {
    const updateHeader = () => setHeaderScrolled(window.scrollY > 12);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
  }, [language]);

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
      // Formspree is the source of truth for waitlist registration. A welcome-email
      // provider outage must not tell a user their already-saved registration failed.
      try {
        const emailResponse = await fetch("https://vyaj-travel-api.kholymad.workers.dev/api/v1/actions/join-waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email: waitlistEmail.trim() }),
        });
        const emailResult = await emailResponse.json().catch(() => ({}));
        if (!emailResponse.ok || emailResult.status !== "available") {
          console.warn("Waitlist was saved, but the welcome email could not be sent.", emailResult.error || emailResponse.status);
        }
      } catch (emailError) {
        console.warn("Waitlist was saved, but the welcome email request failed.", emailError);
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
      setError(t("Add a destination to plan your trip."));
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
        language,
        notes: `Respond entirely in ${language === "ar" ? "Arabic (Modern Standard Arabic; all titles, descriptions, activity names, tips, assumptions and budget notes must be Arabic)" : language === "fr" ? "French (all itinerary content must be French)" : language === "it" ? "Italian (all itinerary content must be Italian)" : language === "de" ? "German (all itinerary content must be German)" : "English"}. Do not mix languages. Total budget: ${budget}. Please treat this as a planning target, not a verified quote. Departure city: ${departureCity.trim() || "not provided; do not invent flight estimates"}.`,
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
          setError(t("The planner returned an incomplete itinerary. Please try again."));
          return;
        }
        setAiItinerary(normalized);
        setResultReady(true);
        window.setTimeout(() => document.getElementById("sample-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      } else if (response.status === "coming_soon") {
        setError(response.message || t("AI trip planning is coming soon."));
      } else {
        setError(response.message || t("The trip planner is not available right now. Please try again later."));
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("We couldn't connect to the trip planner. Please try again."));
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

  async function openFlightBooking(flight: { id: string; bookingToken: string; airline: string; price: string; currency: string; bookingUrl: string }) {
    setFlightError("");
    try {
      if (flight.bookingUrl && /^https?:\/\//i.test(flight.bookingUrl)) {
        window.location.assign(flight.bookingUrl);
        return;
      }
      if (!flight.bookingToken) throw new Error("The provider did not return a booking token for this flight. Search again or choose another flight.");
      setFlightError("Finding the booking page for your selected flight…");
      const response = await postAction<{ options: Array<{ provider: string; price: number | null; url: string }> }>("flight-booking-options", { bookingToken: flight.bookingToken, currencyCode: flight.currency || "EUR", origin: flightOriginCode || (flightOrigin.trim().toLowerCase() === "malta" ? "MLA" : ""), destination: flightDestinationCode || (/^paris(?:,|$)/i.test(flightDestination.trim()) ? "CDG" : ""), departureDate: flightDepartureDate, ...(flightTripType === "roundtrip" ? { returnDate: flightReturnDate } : {}), adults: travellers === "5+" ? 5 : Number(travellers) || 1 });
      const option = response.data?.options?.find(item => typeof item.url === "string" && /^https?:\/\//i.test(item.url));
      if (!option) throw new Error("The provider has no direct booking link for this exact flight right now. Please choose another flight.");
      window.location.assign(option.url);
    } catch (error) {
      setFlightError(error instanceof Error ? error.message : "We couldn't open the booking page for this flight. Please try another option.");
    }
  }

  return (
    <main className={`v2-site v2-lang-${language}`} lang={language} dir="ltr">
      <header ref={headerRef} className={headerScrolled ? "v2-header v2-header-scrolled" : "v2-header"}>
        <a href="#top" className="v2-brand" aria-label="VYAJ home"><img src="/D0F8F0DA-F8C9-4B07-8ED2-B6B0F1A5D567.png" alt="VYAJ" /></a>
        <button type="button" className="v2-menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
        <nav className={menuOpen ? "v2-nav v2-nav-open" : "v2-nav"} aria-label="Main navigation">
          
          <a href="#how" onClick={() => setMenuOpen(false)}>{t("How it works")}</a>
          <a href="#availability" onClick={() => setMenuOpen(false)}>{t("What’s available")}</a>
          <a href="#early-access" onClick={() => setMenuOpen(false)}>{t("Early access")}</a>
          <a href="#trip-builder" className="v2-nav-cta" onClick={() => setMenuOpen(false)}>{t("Build my trip")} <ArrowUpRight size={15}/></a>
          <label className="v2-language-picker"><span>{t("Language")}</span><select aria-label={t("Language")} value={language} onChange={event => setLanguage(event.target.value as Language)}><option value="en">English</option><option value="ar">العربية</option><option value="fr">Français</option><option value="it">Italiano</option><option value="de">Deutsch</option></select></label>
        </nav>
      </header>

      <section className="v2-hero" id="top">
        <div className="v2-hero-image" aria-hidden="true" />
        <div className="v2-hero-overlay" aria-hidden="true" />
        <div className="v2-hero-grain" aria-hidden="true" />
        <div className="v2-hero-content">
          <div className="v2-eyebrow v2-eyebrow-light"><span className="v2-status-dot" /> {t("YOUR WORLD IS WAITING")}</div>
          <h1>{t("Find the trip")}<br/>{t("you didn’t know")}<br/><span>{t("you needed.")}</span></h1>
          <p className="v2-hero-lead">{t("Tell VYAJ what you’re craving. Discover a trip that feels like you — then turn it into a plan.")}</p>
          <div className="v2-hero-actions">
            <a className="v2-button v2-button-bright" href="#discover">{t("Discover my next trip")} <ArrowUpRight size={17}/></a>
            <a className="v2-hero-secondary" href="#trip-builder">{t("I know where I’m going")} <ArrowDown size={15}/></a>
          </div>
          <div className="v2-hero-foot"><span><Sparkles size={14}/> {t("Inspiration first. Your plan next.")}</span><span className="v2-hero-proof"><span className="v2-proof-line"/> {t("Made around you")}</span></div>
        </div>
        <div className="v2-hero-card" aria-label="A preview of the VYAJ trip planning experience">
          <div className="v2-hero-card-top"><span className="v2-card-kicker">{t("YOUR NEXT POSSIBILITY")}</span><span className="v2-hero-live-dot" /> <span className="v2-hero-live-label">{t("READY TO DISCOVER")}</span></div>
          <div className="v2-hero-mini-destination"><div className="v2-hero-mini-icon"><Compass size={18}/></div><div><strong>{t("Not just a destination.")}</strong><span>{t("A feeling, turned into a journey.")}</span></div></div>
          <div className="v2-hero-mini-route"><span /><span /><span /></div>
          <div className="v2-hero-mini-stats"><div><span>01</span><small>{t("Discover")}</small></div><div><span>02</span><small>{t("Personalise")}</small></div><div><span>03</span><small>{t("Go")}</small></div></div>
        </div>
      </section>



      <section className="v2-builder v2-section" id="trip-builder">
        <div className="v2-section-intro">
          <div className="v2-eyebrow"><span>01</span><i/> {t("START WITH THE BASICS")}</div>
          <h2>{language === "ar" ? <>خطّط لرحلة<br/><em>تناسبك فعلًا</em></> : <>{t("Build a trip")}<br/><em>{t("that fits.")}</em></>}</h2>
          <p>{t("Set the essentials. We’ll show you how a more considered itinerary could come together.")}</p>
          <div className="v2-mini-proof"><span><Check size={15}/></span> {t("No perfect prompt required.")}</div>
        </div>
        <form className="v2-builder-card" onSubmit={buildTrip}>
          <div className="v2-planner-tabs" role="tablist" aria-label={t("Trip planning mode")}>
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
              <p className="v2-flight-intro">{t("Compare live flight offers by price, airline, travel time and stops. Choose an option to continue to a booking search.")}</p>
              <div className="v2-form-grid">
                <div className="v2-field v2-airport-field"><label htmlFor="flight-origin-input"><span>{t("Flying from")}</span></label><input id="flight-origin-input" value={flightOrigin} onFocus={() => setFlightOriginMenuOpen(true)} onBlur={() => window.setTimeout(() => setFlightOriginMenuOpen(false), 160)} onChange={event => { setFlightOrigin(event.target.value); setFlightOriginCode(""); setFlightOriginMenuOpen(true); setFlightResults([]); setFlightError(""); }} placeholder={t("Search any airport or city")} autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={flightOriginMenuOpen} aria-controls="flight-origin-options" required />{flightOriginMenuOpen && <div className="v2-destination-suggestions v2-airport-suggestions" id="flight-origin-options" role="listbox" aria-label={t("Departure airports")}>{airportLoading && <p className="v2-airport-status">{t("Loading worldwide airports…")}</p>}{airportLoadError && <p className="v2-airport-status">{airportLoadError}</p>}{!airportLoading && !airportLoadError && flightOriginAirports.map((airport,index) => { const code=airport.iata || ""; const label=[airport.city,airport.country].filter(Boolean).join(", "); return <button type="button" role="option" aria-selected={flightOriginCode===code} className="v2-destination-suggestion" key={code || airport.name || index} onMouseDown={event=>event.preventDefault()} onClick={()=>{setFlightOrigin([label,airport.name].filter(Boolean).join(" · ") + (code ? " ("+code+")" : ""));setFlightOriginCode(code);setFlightOriginMenuOpen(false);setFlightResults([]);setFlightError("");}}><span className="v2-destination-pin"><PlaneTakeoff size={14}/></span><span className="v2-destination-copy"><strong>{airport.name}</strong><small>{label || airport.country || t("Airport")}{code ? " · "+code : ""}</small></span></button>;})}{!airportLoading && !airportLoadError && airportList.length>0 && flightOriginAirports.length===0 && <p className="v2-airport-status">{t("No matching airport. Try a city, airport name or IATA code.")}</p>}</div>}</div>
                <div className="v2-field v2-airport-field"><label htmlFor="flight-destination-input"><span>{t("Flying to")}</span></label><input id="flight-destination-input" value={flightDestination} onFocus={() => setFlightDestinationMenuOpen(true)} onBlur={() => window.setTimeout(() => setFlightDestinationMenuOpen(false), 160)} onChange={event => { setFlightDestination(event.target.value); setFlightDestinationCode(""); setFlightDestinationMenuOpen(true); setFlightResults([]); setFlightError(""); }} placeholder={t("Search any airport or city")} autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={flightDestinationMenuOpen} aria-controls="flight-destination-options" required />{flightDestinationMenuOpen && <div className="v2-destination-suggestions v2-airport-suggestions" id="flight-destination-options" role="listbox" aria-label={t("Arrival airports")}>{airportLoading && <p className="v2-airport-status">{t("Loading worldwide airports…")}</p>}{airportLoadError && <p className="v2-airport-status">{airportLoadError}</p>}{!airportLoading && !airportLoadError && flightDestinationAirports.map((airport,index) => { const code=airport.iata || ""; const label=[airport.city,airport.country].filter(Boolean).join(", "); return <button type="button" role="option" aria-selected={flightDestinationCode===code} className="v2-destination-suggestion" key={code || airport.name || index} onMouseDown={event=>event.preventDefault()} onClick={()=>{setFlightDestination([label,airport.name].filter(Boolean).join(" · ") + (code ? " ("+code+")" : ""));setFlightDestinationCode(code);setDestination([label,airport.name].filter(Boolean).join(", ") || label);setFlightDestinationMenuOpen(false);setFlightResults([]);setFlightError("");}}><span className="v2-destination-pin"><PlaneTakeoff size={14}/></span><span className="v2-destination-copy"><strong>{airport.name}</strong><small>{label || airport.country || "Airport"}{code ? " · "+code : ""}</small></span></button>;})}{!airportLoading && !airportLoadError && airportList.length>0 && flightDestinationAirports.length===0 && <p className="v2-airport-status">{t("No matching airport. Try a city, airport name or IATA code.")}</p>}</div>}</div>
              </div>
              <div className="v2-flight-trip-type" role="group" aria-label={t("Trip type")}>
                <button type="button" className={flightTripType === "roundtrip" ? "v2-trip-type-option v2-trip-type-option-active" : "v2-trip-type-option"} onClick={() => { setFlightTripType("roundtrip"); setFlightReturnDate(""); }}>{t("Round trip")}</button>
                <button type="button" className={flightTripType === "oneway" ? "v2-trip-type-option v2-trip-type-option-active" : "v2-trip-type-option"} onClick={() => { setFlightTripType("oneway"); setFlightReturnDate(""); setFlightResults([]); }}>{t("One way only")}</button>
              </div>
              <div className="v2-form-grid v2-flight-date-grid">
                <label className="v2-field v2-flight-date-field"><span>{t("Departure date")}</span><input id="flight-departure-date" type="date" value={flightDepartureDate} min={new Date().toLocaleDateString("en-CA")} onChange={event => { const value = event.target.value; setFlightDepartureDate(value); setFlightResults([]); if (flightReturnDate && value > flightReturnDate) setFlightReturnDate("");  }} required /></label>
                {flightTripType === "roundtrip" && <label className="v2-field v2-flight-date-field"><span>{t("Return date")}</span><input id="flight-return-date" type="date" value={flightReturnDate} min={flightDepartureDate || new Date().toLocaleDateString("en-CA")} onChange={event => { setFlightReturnDate(event.target.value); setFlightResults([]); }} required /></label>}
              </div>
              <div className="v2-flight-note"><CalendarDays size={15}/><span>{flightReturnDate ? t("Round trip") : t("One way")} · {travellers === "5+" ? "5+ travellers" : travellers + (travellers === "1" ? " traveller" : " travellers")} · Economy · EUR</span></div>
              <button className="v2-button v2-button-dark v2-flight-search-button" type="button" disabled={flightSearching} onClick={async () => {
                setFlightError(""); setFlightResults([]);
                if (!flightOrigin.trim() || !flightDestination.trim() || !flightDepartureDate) { setFlightError(t("Enter your departure city, destination and departure date.")); return; }
                if (flightTripType === "roundtrip" && !flightReturnDate) { setFlightError(t("Choose a return date or select One way only.")); return; }
                if (flightReturnDate && flightReturnDate < flightDepartureDate) { setFlightError(t("Return date must be after departure.")); return; }
                const origin = flightOriginCode || (flightOrigin.trim().toLowerCase() === "malta" ? "MLA" : "");
                const destination = flightDestinationCode || (/^paris(?:,|$)/i.test(flightDestination.trim()) ? "CDG" : "");
                if (!origin || !destination) { setFlightError(t("Choose an airport from the suggestions for both departure and destination.")); return; }
                setFlightSearching(true);
                try {
                  const response = await postAction<Array<{ id: string; bookingToken: string; airline: string; price: string; currency: string; departure: string; arrival: string; duration: string; stops: number; bookingUrl: string }>>("search-flights", {
                    origin, destination, departureDate: flightDepartureDate,
                    ...(flightTripType === "roundtrip" ? { returnDate: flightReturnDate } : {}),
                    adults: travellers === "5+" ? 5 : Number(travellers) || 1, currencyCode: "EUR", travelClass: "ECONOMY"
                  });
                  if (response.status !== "available" || !response.data) throw new Error(response.message || t("Live flight search is not configured yet."));
                  setFlightResults(response.data);
                  if (!response.data.length) setFlightError(t("No flights were found for those dates. Try different dates or airports."));
                } catch (error) {
                  setFlightError(error instanceof Error ? error.message : t("We couldn't load flights right now. Please try again."));
                } finally { setFlightSearching(false); }
              }}><PlaneTakeoff size={16}/> {flightSearching ? t("Searching live fares…") : t("Search cheapest flights")} <ArrowRight size={16}/></button>
              {flightError && <p className="v2-form-error" role="alert">{flightError}</p>}
              {flightSearching && <div className="v2-flight-loading" role="status"><span className="v2-flight-spinner"/> {t("Checking live flight offers…")}</div>}
              {!!flightResults.length && <div className="v2-flight-results" aria-live="polite">
                <div className="v2-flight-results-heading"><strong>{t("Live flight results")}</strong><span>{flightResults.length} {t("options")} · EUR</span></div>
                {flightResults.map((flight) => <article className="v2-flight-result-card" key={flight.id}>
                  <div className="v2-flight-result-main"><div className="v2-flight-airline"><Plane size={16}/><strong>{flight.airline}</strong></div><div className="v2-flight-times"><div><strong>{flight.departure}</strong><small>{flightOriginCode || (flightOrigin.trim().toLowerCase() === "malta" ? "MLA" : flightOrigin)}</small></div><span className="v2-flight-route-line"><i/></span><div><strong>{flight.arrival}</strong><small>{flightDestinationCode || (/^paris(?:,|$)/i.test(flightDestination.trim()) ? "CDG" : flightDestination)}</small></div></div><div className="v2-flight-meta"><span>{flight.duration}</span><span>{flight.stops === 0 ? t("Direct") : `${flight.stops} ${t("stops")}`}</span></div></div>
                  <div className="v2-flight-result-price"><a className="v2-flight-price-link" href="#flight-booking" onClick={event => { event.preventDefault(); void openFlightBooking(flight); }} aria-label={`${t("Continue to booking")} — ${flight.airline}, ${flight.price} ${flight.currency || "EUR"}`}><strong>{new Intl.NumberFormat("en-IE", {style:"currency",currency:flight.currency || "EUR",maximumFractionDigits:0}).format(Number(flight.price))}</strong><ArrowRight size={16}/></a><small>{t("per traveller")}</small><span>{t("Fare from provider")}</span><a href="#flight-booking" onClick={event => { event.preventDefault(); void openFlightBooking(flight); }}>{t("View booking options")} <ArrowRight size={12}/></a></div>
                </article>)}
                <p className="v2-flight-disclaimer">{t("Prices and availability can change until confirmed. Booking and ticket issuance are not yet available directly inside VYAJ.")}</p>
              </div>}
              {!flightResults.length && !flightSearching && <small className="v2-flight-disclaimer">{t("Search real flight offers without leaving VYAJ. Final prices and availability must be reconfirmed before booking.")}</small>}
            </div>}
          </div>
          {!flightPanelOpen && <>
          <div className="v2-builder-top"><div><span className="v2-small-label">{t("VYAJ TRIP BUILDER")}</span><h3>{t("Where to next?")}</h3></div><span className="v2-demo-tag">{t("DEMO")}</span></div>
          <div className="v2-field v2-destination-field"><label htmlFor="destination-input"><span>{t("Destination")}</span></label><div className="v2-destination-input-wrap"><MapPin size={17} aria-hidden="true"/><input id="destination-input" value={destination} onFocus={() => setDestinationFocused(true)} onBlur={() => window.setTimeout(() => setDestinationFocused(false), 140)} onChange={event => { setDestination(event.target.value); setResultReady(false); setAiItinerary(null); setError(""); setDestinationFocused(true); }} placeholder={t("Search any city or destination")} autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={destinationFocused && filteredDestinations.length > 0} aria-controls="destination-suggestions" required/><button type="button" className="v2-destination-clear" aria-label="Clear destination" onMouseDown={event => event.preventDefault()} onClick={() => { setDestination(""); setResultReady(false); setAiItinerary(null); setDestinationFocused(true); document.getElementById("destination-input")?.focus(); }}>×</button></div>{destinationFocused && filteredDestinations.length > 0 && <div className="v2-destination-suggestions" id="destination-suggestions" role="listbox" aria-label="Popular destinations">{filteredDestinations.map(item => <button type="button" role="option" aria-selected={destination === item.name} className="v2-destination-suggestion" key={item.name} onMouseDown={event => event.preventDefault()} onClick={() => { setDestination(item.name); setResultReady(false); setError(""); setDestinationFocused(false); }}><span className="v2-destination-pin"><MapPin size={15}/></span><span className="v2-destination-copy"><strong>{item.name}</strong><small>{item.text}</small></span><ArrowUpRight size={14} className="v2-destination-arrow"/></button>)}</div>}<small>{t("Choose a suggestion or type any destination. Suggestions are curated examples, not live search results.")}</small></div>
          <div className="v2-field v2-airport-field">
            <label htmlFor="departure-city-input"><span>{t("Flying from")}</span></label>
            <input
              id="departure-city-input"
              value={airportMenuOpen ? airportSearch : departureCity}
              onFocus={() => { setAirportSearch(""); setAirportMenuOpen(true); }}
              onChange={event => { setAirportSearch(event.target.value); setDepartureCity(""); setAirportMenuOpen(true); setResultReady(false); setAiItinerary(null); }}
              onBlur={() => window.setTimeout(() => setAirportMenuOpen(false), 160)}
              placeholder={t("Search airport or city")}
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={airportMenuOpen}
              aria-controls="departure-airport-suggestions"
            />
            {airportMenuOpen && <div className="v2-destination-suggestions v2-airport-suggestions" id="departure-airport-suggestions" role="listbox" aria-label="Worldwide departure airports">
              {airportLoading && <p className="v2-airport-status">{t("Loading worldwide airport list…")}</p>}
              {!airportLoading && airportLoadError && <p className="v2-airport-status">{airportLoadError}</p>}
              {!airportLoading && !airportLoadError && airportList.length > 0 && filteredAirports.map((airport, index) => {
                const label = [airport.city, airport.country].filter(Boolean).join(", ");
                const value = [label || airport.name, airport.iata ? "(" + airport.iata + ")" : "", airport.name && airport.name !== label ? "— " + airport.name : ""].filter(Boolean).join(" ");
                return <button type="button" role="option" aria-selected={departureCity === value} className="v2-destination-suggestion" key={(airport.iata || airport.icao || airport.name || "airport") + "-" + index} onMouseDown={event => event.preventDefault()} onClick={() => { setDepartureCity(value); setAirportSearch(""); setAirportMenuOpen(false); setResultReady(false); setAiItinerary(null); }}>
                  <span className="v2-destination-pin"><MapPin size={15}/></span><span className="v2-destination-copy"><strong>{label || airport.name} {airport.iata ? "· " + airport.iata : ""}</strong><small>{airport.name}{airport.icao ? " · " + airport.icao : ""}</small></span><ArrowUpRight size={14} className="v2-destination-arrow"/>
                </button>;
              })}
              {!airportLoading && !airportLoadError && airportList.length > 0 && filteredAirports.length === 0 && <p className="v2-airport-status">{t("No matching airports. Try a city name or airport code.")}</p>}
              {!airportLoading && !airportLoadError && airportList.length === 0 && <p className="v2-airport-status">{t("Start typing to search airports around the world.")}</p>}
            </div>}
            <small>{t("Optional · add your departure airport for a flight estimate.")}</small>
          </div>
          <div className="v2-form-grid">
            <label className="v2-field"><span>{t("How many days?")}</span><select value={days} onChange={event => { setDays(event.target.value); setResultReady(false); setAiItinerary(null); }}>{["2","3","4","5","6","7"].map(value => <option key={value} value={value}>{value} {t("days")}</option>)}</select></label>
            <label className="v2-field"><span>{t("Travellers")}</span><select value={travellers} onChange={event => { setTravellers(event.target.value); setResultReady(false); setAiItinerary(null); }}>{["1","2","3","4","5+"].map(value => <option key={value} value={value}>{value === "1" ? "1 " + t("person") : value === "5+" ? "5+ " + t("people") : value + " " + t("people")}</option>)}</select></label>
          </div>
          <fieldset className="v2-choice-field"><legend>{t("Total budget")}</legend><div className="v2-budget-options">{["€300","€600","€1,000","Flexible"].map(value => <button type="button" key={value} className={budget === value ? "v2-budget-option v2-selected" : "v2-budget-option"} onClick={() => { setBudget(value); setResultReady(false); setAiItinerary(null); }} aria-pressed={budget === value}>{value}</button>)}</div><small>{t("Choose your overall budget. It is a target, not a price quote; costs aren’t live-checked.")}</small></fieldset>
          <fieldset className="v2-choice-field"><legend>{t("Your kind of trip")}</legend><div className="v2-style-options">{styles.map(value => <button type="button" key={value} className={style === value ? "v2-style-option v2-selected" : "v2-style-option"} onClick={() => { setStyle(value); setResultReady(false); setAiItinerary(null); }} aria-pressed={style === value}>{t(value)}</button>)}</div></fieldset>
          {error && <p className="v2-form-error" role="alert">{error}</p>}
          <button className="v2-button v2-button-dark v2-submit" type="submit" disabled={plannerLoading}>{plannerLoading ? <><Sparkles size={16} className="v2-loading-sparkle"/> {t("Thinking…")}</> : <>{t("Plan my trip")} <ArrowUpRight size={17}/></>}</button>
          <p className="v2-form-note"><Sparkles size={13}/> {t("AI-generated starter plan · Estimates only, no bookings")}</p>
          </>}
        </form>
      </section>

      <section className="v2-result-section" id="sample-result" aria-live="polite">
        <div className="v2-result-wrap">
          <div className="v2-result-heading">
            <div><div className="v2-eyebrow v2-eyebrow-light"><span>02</span><i/> {t("A FIRST LOOK")}</div><h2>{t("A trip you")}<br/><em>{t("can picture.")}</em></h2></div>
            <p>{resultReady && aiItinerary ? t("Your AI-generated starter itinerary is ready. Refine it around your preferences and verify details before travelling.") : plannerLoading ? t("VYAJ is shaping your itinerary around your destination and travel style.") : t("Start with a destination and a few preferences. VYAJ will turn them into a practical first itinerary.")}</p>
          </div>
          {resultReady && aiItinerary ? (
            <div className="v2-result-content">
              <div className="v2-trip-summary">
                <div className="v2-summary-icon"><MapPin size={19}/></div>
                <div className="v2-summary-main"><span className="v2-small-label">{t("YOUR VYAJ ITINERARY")}</span><h3>{aiItinerary.tripTitle || destination}</h3><p>{destination} <span>·</span> {days} {t("days")} <span>·</span> {travellers} {t("travellers")} <span>·</span> {t(style)}</p></div>
                <span className="v2-demo-tag v2-demo-tag-dark">{t("AI PLAN")}</span>
              </div>
              <p className="v2-day-focus">{aiItinerary.overview}</p>
              <div className="v2-result-grid">
                <div className="v2-days-list">{aiItinerary.days.map(day => <article className="v2-day-card" key={day.day}>
                  <div className="v2-day-top"><span>{t("DAY")} {String(day.day).padStart(2, "0")}</span><strong>{day.title}</strong></div>
                  <p className="v2-day-focus">{day.summary}</p>
                  {day.activities.map((activity, index) => <div className="v2-activity" key={`${day.day}-${index}-${activity.title}`}>
                    <span>{activity.time || "Flexible"}</span><div><strong>{activity.title}</strong><p>{activity.description}</p>{activity.location && <small>{activity.location}</small>}{activity.estimatedCost && <small> · {activity.estimatedCost}</small>}</div>
                  </div>)}
                </article>)}</div>
                <aside className="v2-result-aside"><span className="v2-small-label">{t("ESTIMATED TRIP COST")}</span><h3>{aiItinerary.estimatedBudget?.totalEstimate || aiItinerary.estimatedBudget?.perPerson || t("Not estimated")}</h3><p>{aiItinerary.estimatedBudget?.budgetFit || ""} {aiItinerary.estimatedBudget?.notes || t("Costs are estimates and should be checked before booking.")}</p>
                  {aiItinerary.estimatedBudget?.breakdown && <div className="v2-budget-breakdown"><span className="v2-small-label">{t("APPROXIMATE COST BREAKDOWN")}</span>{([{key:"flights",label:t("Flights")},{key:"accommodation",label:t("Hotel / accommodation")},{key:"food",label:t("Food & drinks")},{key:"localTransport",label:t("Local transport")},{key:"activities",label:t("Activities & tickets")},{key:"other",label:t("Other costs")}] as const).map(item => <div className="v2-budget-row" key={item.key}><span>{item.label}</span><strong>{aiItinerary.estimatedBudget?.breakdown?.[item.key] || t("Not estimated")}</strong></div>)}</div>}
                  {aiItinerary.tips?.length ? <><div className="v2-aside-divider"/><span className="v2-small-label">{t("TRAVEL TIPS")}</span><ul>{aiItinerary.tips.map((tip, index) => <li key={index}>{tip}</li>)}</ul></> : null}
                  {aiItinerary.assumptions?.length ? <><div className="v2-aside-divider"/><span className="v2-small-label">{t("ASSUMPTIONS TO CHECK")}</span><ul>{aiItinerary.assumptions.map((assumption, index) => <li key={index}>{assumption}</li>)}</ul></> : null}
                  <div className="v2-assumption"><Sparkles size={15}/><span>{t("AI-generated starter plan. Prices, opening hours, transport and availability are not live-verified.")}</span></div>
                  <button className="v2-button v2-button-outline" type="button" onClick={() => { setResultReady(false); setAiItinerary(null); document.getElementById("trip-builder")?.scrollIntoView({behavior:"smooth",block:"center"}); }}>{t("Adjust your trip")} <ArrowRight size={16}/></button>
                </aside>
              </div>
              <p className="v2-result-disclaimer">{t("Use this itinerary as a starting point, not a booking confirmation. Verify current opening hours, transport schedules, prices and availability before travelling.")}</p>
            </div>
          ) : (
            <div className="v2-result-preview">
              <div className="v2-preview-days"><div className="v2-preview-day"><span>{t("DAY")} 01</span><i/><div><b>{t("Arrive & settle in")}</b><small>{t("Get your bearings, without rushing.")}</small></div></div><div className="v2-preview-day"><span>{t("DAY")} 02</span><i/><div><b>{t("Explore with intention")}</b><small>{t("One anchor activity. Space around it.")}</small></div></div><div className="v2-preview-day"><span>{t("DAY")} 03</span><i/><div><b>{t("Leave room for a surprise")}</b><small>{t("Local finds and time to wander.")}</small></div></div></div>
              <div className="v2-preview-aside"><div className="v2-preview-orbit"><Compass size={34}/><span/><i/></div><span className="v2-small-label">{t("A BETTER KIND OF ITINERARY")}</span><h3>{t("Structure, not a schedule to obey.")}</h3><p>{t("Preview a sample plan built around your destination, time and travel style.")}</p><button className="v2-text-button" type="button" onClick={() => document.getElementById("trip-builder")?.scrollIntoView({behavior:"smooth",block:"center"})}>{t("Try your own details")} <ArrowRight size={15}/></button></div>
            </div>
          )}
        </div>
      </section>

      <section className="v2-discovery v2-section" id="discover" aria-labelledby="v2-discovery-title">
        <div className="v2-discovery-heading">
          <div><div className="v2-eyebrow"><span>03</span><i/> {t("FIND YOUR KIND OF ESCAPE")}</div><h2 id="v2-discovery-title">{language === "ar" ? "ما نوع الرحلة التي ترغب فيها؟" : <>{t("What are you")}<br/><em>{t("craving?")}</em></>}</h2></div>
          <p>{t("You don’t need a destination yet. Start with a feeling — VYAJ will help you find the rest.")}</p>
        </div>
        <div className="v2-discovery-grid">
          <button type="button" className={selectedMood === "Puteaux, France" ? "v2-discovery-card v2-discovery-coast v2-discovery-card-selected" : "v2-discovery-card v2-discovery-coast"} aria-pressed={selectedMood === "Puteaux, France"} onClick={() => chooseMood("Puteaux, France", "Slow escape")} aria-label="Find your kind of escape in Puteaux, France">
            <span className="v2-discovery-card-image" aria-hidden="true"/><span className="v2-discovery-shade" aria-hidden="true"/><span className="v2-discovery-index">01 / {t("SLOW DOWN")}</span>
            <span className="v2-discovery-card-copy"><strong>{t("Find your kind of escape.")}</strong><span className="v2-discovery-place">Puteaux, France</span><small>{t("Step away from the noise, slow down, and give yourself space to feel the magic.")}</small><span className="v2-discovery-link">{t("Explore this feeling")} <ArrowUpRight size={15}/></span></span>
          </button>
          <button type="button" className={selectedMood === "Valletta, Malta" ? "v2-discovery-card v2-discovery-wild v2-discovery-card-selected" : "v2-discovery-card v2-discovery-wild"} aria-pressed={selectedMood === "Valletta, Malta"} onClick={() => chooseMood("Valletta, Malta", "Food & culture")} aria-label="Discover the history and coastal charm of Valletta, Malta">
            <span className="v2-discovery-card-image" aria-hidden="true"/><span className="v2-discovery-shade" aria-hidden="true"/><span className="v2-discovery-index">02 / {t("ISLAND STORIES")}</span>
            <span className="v2-discovery-card-copy"><strong>{t("Find your island rhythm.")}</strong><span className="v2-discovery-place">Valletta, Malta</span><small>{t("Golden streets, sea views, and the easy rhythm of Mediterranean life.")}</small><span className="v2-discovery-link">{t("Explore this feeling")} <ArrowUpRight size={15}/></span></span>
          </button>
          <button type="button" className={selectedMood === "Rome, Italy" ? "v2-discovery-card v2-discovery-culture v2-discovery-card-selected" : "v2-discovery-card v2-discovery-culture"} aria-pressed={selectedMood === "Rome, Italy"} onClick={() => chooseMood("Rome, Italy", "Food & culture")} aria-label="Discover the food and culture of Rome, Italy">
            <span className="v2-discovery-card-image" aria-hidden="true"/><span className="v2-discovery-shade" aria-hidden="true"/><span className="v2-discovery-index">03 / {t("GET LOST IN CULTURE")}</span>
            <span className="v2-discovery-card-copy"><strong>{t("Get lost in history.")}</strong><span className="v2-discovery-place">Rome, Italy</span><small>{t("Ancient wonders, lively piazzas, and unforgettable Italian flavours.")}</small><span className="v2-discovery-link">{t("Explore this feeling")} <ArrowUpRight size={15}/></span></span>
          </button>
        </div>
        <p className="v2-discovery-note"><Sparkles size={14}/> {t("Pick a feeling to start a personalised trip plan.")}</p>
      </section>

      <section className="v2-how v2-section" id="how">
        <div className="v2-how-heading"><div className="v2-eyebrow"><span>04</span><i/> {t("HOW IT WORKS")}</div><h2>{language === "ar" ? <>من فكرة بسيطة<br/><em>إلى رحلة تستحقها</em></> : <>{t("From “somewhere”")}<br/>{t("to")} <em>{t("let’s go.")}</em></>}</h2><p>{t("Keep the decisions simple. Make the trip feel like yours.")}</p></div>
        <div className="v2-steps v2-steps-timeline">
          <article><div className="v2-step-rail"><div className="v2-step-icon"><MapPin size={21}/></div><span className="v2-step-number">01</span></div><div className="v2-step-copy"><span className="v2-step-kicker">{t("STEP 01")}</span><h3>{t("Set the essentials")}</h3><p>{t("Choose your destination, dates and a budget you’re comfortable with.")}</p></div></article>
          <article><div className="v2-step-rail"><div className="v2-step-icon"><Sparkles size={21}/></div><span className="v2-step-number">02</span></div><div className="v2-step-copy"><span className="v2-step-kicker">{t("STEP 02")}</span><h3>{t("Shape your days")}</h3><p>{t("Explore a sample itinerary shaped around your travel style.")}</p></div></article>
          <article><div className="v2-step-rail"><div className="v2-step-icon"><Compass size={21}/></div><span className="v2-step-number">03</span></div><div className="v2-step-copy"><span className="v2-step-kicker">{t("STEP 03")}</span><h3>{t("Make it your own")}</h3><p>{t("Adjust your choices and discover a direction that feels right.")}</p></div></article>
        </div>
      </section>

      <section className="v2-availability" id="availability">
        <div className="v2-availability-inner">
          <div className="v2-eyebrow v2-eyebrow-light"><span>05</span><i/> {t("CLEAR FROM DAY ONE")}</div>
          <div className="v2-availability-heading"><h2>{t("Useful now.")}<br/><em>{t("More to come.")}</em></h2><p>{t("We’d rather be clear about what’s ready than promise features that aren’t connected yet.")}</p></div>
          <div className="v2-feature-status">
            <div className="v2-status-row"><span className="v2-status-icon v2-status-ready"><Check size={17}/></span><div><strong>{t("Interactive trip preview")}</strong><small>{t("Works in this demo using your choices.")}</small></div><span className="v2-status-label">{t("AVAILABLE")}</span></div>
            <div className="v2-status-row"><span className="v2-status-icon v2-status-ready"><Sparkles size={17}/></span><div><strong>{t("AI-generated itineraries")}</strong><small>{t("Starter plans are generated by AI; prices and availability aren’t live-verified.")}</small></div><span className="v2-status-label">{t("AVAILABLE")}</span></div>
            <div className="v2-status-row"><span className="v2-status-icon"><Compass size={17}/></span><div><strong>{t("Live prices & route times")}</strong><small>{t("No live travel data is connected.")}</small></div><span className="v2-status-label v2-status-soon">{t("COMING SOON")}</span></div>
            <div className="v2-status-row"><span className="v2-status-icon"><Users size={17}/></span><div><strong>{t("Save, share & book")}</strong><small>{t("Planned for a later release.")}</small></div><span className="v2-status-label v2-status-soon">{t("COMING SOON")}</span></div>
          </div>
        </div>
      </section>

      <section className="v2-early-access v2-section" id="early-access">
        <div className="v2-early-art"><div className="v2-early-image"/><div className="v2-early-stamp" aria-label="VYAJ logo"><img src="/D0F8F0DA-F8C9-4B07-8ED2-B6B0F1A5D567.png" alt="VYAJ logo"/></div></div>
        <div className="v2-early-copy"><div className="v2-eyebrow"><span>05</span><i/> {t("THE NEXT CHAPTER")}</div><h2>{t("Be first to plan")}<br/>{t("with")} <em>VYAJ.</em></h2><p>{t("Join the free waitlist for early-access invitations and launch updates. Be among the first to try VYAJ as new features roll out.")}</p><button type="button" className="v2-button v2-button-dark" onClick={() => { setWaitlistStatus("idle"); setNoticeOpen(true); }}>{t("Get early access")} <ArrowUpRight size={17}/></button><small>{t("Free to join. No commitment — just updates and early access.")}</small></div>
      </section>

      <footer className="v2-footer">
        <a href="#top" className="v2-brand"><img src="/vyaj-wordmark.svg" alt="VYAJ"/></a>
        <span>{t("PLAN LESS. TRAVEL MORE.")}</span>
        <div><a href="#trip-builder">{t("Try the demo")}</a><a href="mailto:hello@vyaj.eu">{t("Contact")}</a></div>
        <small>© {new Date().getFullYear()} VYAJ. Made for the journeys ahead.</small>
      </footer>

      {noticeOpen && <div className="v2-notice-backdrop" role="presentation" onClick={() => setNoticeOpen(false)}><div className="v2-notice" role="dialog" aria-modal="true" aria-labelledby="v2-notice-title" aria-describedby="v2-notice-description" onClick={event => event.stopPropagation()}><button type="button" className="v2-notice-close" aria-label={t("Close")} onClick={() => setNoticeOpen(false)}><X size={18}/></button><div className="v2-notice-icon"><Sparkles size={21}/></div><span className="v2-small-label">{t("VYAJ / EARLY ACCESS")}</span><h2 id="v2-notice-title">{t("Be first to try VYAJ.")}</h2><p id="v2-notice-description">{t("Add your email for early-access invitations and launch updates. It’s free, and you can unsubscribe at any time.")}</p>{waitlistStatus === "success" ? <div className="v2-waitlist-message v2-waitlist-success" role="status"><Check size={17}/> {t("You’re on the list. We’ll keep you updated.")}</div> : <form className="v2-waitlist-form" onSubmit={submitWaitlist}><label htmlFor="waitlist-email">{t("Email address")}</label><input id="waitlist-email" name="email" type="email" autoComplete="email" placeholder={t("you@example.com")} value={waitlistEmail} onChange={event => { setWaitlistEmail(event.target.value); if (waitlistStatus === "error") setWaitlistStatus("idle"); }} required/><input type="hidden" name="_subject" value="New VYAJ waitlist signup"/><button className="v2-button v2-button-dark" type="submit" disabled={waitlistStatus === "submitting"}>{waitlistStatus === "submitting" ? t("Joining…") : t("Get early access")} <ArrowUpRight size={16}/></button>{waitlistStatus === "error" && <p className="v2-waitlist-message v2-waitlist-error" role="alert">{t("Something went wrong. Please try again.")}</p>}<small>{t("By joining, you agree to receive VYAJ launch updates by email.")}</small></form>}<button type="button" className="v2-button v2-button-outline" onClick={() => setNoticeOpen(false)}>{t("Close")}</button></div></div>}
      </main>
  );
}
