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
          <p className="vyaj-rides-eyebrow"><span /> A NEW WAY TO MOVE</p>
          <h1 className="vyaj-rides-heading" id="vyaj-rides-title">
            Move better.
          </h1>
          <p className="vyaj-rides-kicker">A better way to move is on its way.</p>
        </div>

        <div className="vyaj-rides-visual">
          <img
            className="vyaj-rides-photo"
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=85"
            alt="A modern car photographed in a premium automotive setting"
            loading="eager"
          />
          <div className="vyaj-rides-photo-shade" />
          <div className="vyaj-rides-photo-caption">
            <div className="vyaj-rides-caption-icon"><CarFront size={20} strokeWidth={1.7} /></div>
            <div>
              <span className="vyaj-rides-caption-title">VYAJ Rides</span>
              <span className="vyaj-rides-caption-subtitle">A new journey begins.</span>
            </div>
            <span className="vyaj-rides-coming-soon">Coming soon</span>
          </div>
        </div>

        <p className="vyaj-rides-footer">A BETTER WAY TO MOVE</p>
      </section>
    </main>
  );
}
