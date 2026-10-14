import type { Metadata } from "next";
import { ArrowLeft, CarFront, Plane } from "lucide-react";

export const metadata: Metadata = {
  title: "VYAJ Rides — Coming Soon",
  description: "Move better. VYAJ Rides is coming soon.",
};

export default function RidesPage() {
  return (
    <main className="vyaj-rides-page">
      <a className="vyaj-rides-home" href="/" aria-label="Back to VYAJ Travel">
        <ArrowLeft size={16} strokeWidth={1.8} />
        <Plane size={16} strokeWidth={1.8} />
        <span>Travel</span>
      </a>

      <section className="vyaj-rides-content" aria-labelledby="vyaj-rides-title">
        <a className="vyaj-rides-brand" href="/" aria-label="VYAJ home">
          <img
            className="vyaj-rides-logo"
            src="/D0F8F0DA-F8C9-4B07-8ED2-B6B0F1A5D567.png"
            alt="VYAJ"
            width="440"
            height="150"
          />
          <span className="vyaj-rides-brand-label">RIDES</span>
        </a>

        <div className="vyaj-rides-intro">
          
          <h1 className="vyaj-rides-heading" id="vyaj-rides-title">
            Move better.
          </h1>
          <p className="vyaj-rides-kicker">A new way to move is coming.</p>
        </div>

        <div className="vyaj-rides-visual">
          <img
            className="vyaj-rides-photo"
            src="/IMG_7721.jpeg"
            alt="A silver electric sedan driving along a coastal road"
            loading="eager"
          />
          <div className="vyaj-rides-photo-shade" />
        </div>

        <div className="vyaj-rides-below-photo">
          <div className="vyaj-rides-caption-icon"><CarFront size={20} strokeWidth={1.7} /></div>
          <div className="vyaj-rides-below-copy">
            <span className="vyaj-rides-caption-title">VYAJ Rides</span>
            <span className="vyaj-rides-caption-subtitle">A better journey starts here.</span>
          </div>
          <span className="vyaj-rides-coming-soon">Coming soon</span>
        </div>

        
      </section>
    </main>
  );
}
