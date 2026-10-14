import type { Metadata } from "next";
import { CarFront, Leaf, Menu, Plane, ShieldCheck, Users, X } from "lucide-react";

export const metadata: Metadata = {
  title: "VYAJ Rides — Coming Soon",
  description: "Move better. A new way to move is coming.",
};

export default function RidesPage() {
  return (
    <main className="vyaj-rides-page">
      <section className="vyaj-rides-content" aria-labelledby="vyaj-rides-title">
        <header className="vyaj-rides-header">
          <a className="vyaj-rides-brand" href="/" aria-label="VYAJ Travel home">
            <img
              className="vyaj-rides-logo"
              src="/D0F8F0DA-F8C9-4B07-8ED2-B6B0F1A5D567.png"
              alt="VYAJ"
              width="440"
              height="150"
            />
            <span className="vyaj-rides-brand-label">RIDES</span>
          </a>
          <details className="vyaj-rides-menu">
            <summary aria-label="Open navigation menu"><Menu className="vyaj-rides-menu-open" size={23} strokeWidth={1.8} /><X className="vyaj-rides-menu-close" size={23} strokeWidth={1.8} /></summary>
            <nav aria-label="Rides navigation">
              <a href="/">Travel <Plane size={15} /></a>
              <a href="#rides-coming-soon">VYAJ Rides <CarFront size={15} /></a>
            </nav>
          </details>
        </header>

        <div className="vyaj-rides-intro">
          <h1 className="vyaj-rides-heading" id="vyaj-rides-title">
            Move<br /><span>better.</span>
          </h1>
          <p className="vyaj-rides-kicker">A new way to move is coming.</p>
        </div>

        <div className="vyaj-rides-visual" aria-label="VYAJ Rides hero image">
          <img
            className="vyaj-rides-photo"
            src="/IMG_7721.jpeg"
            alt="A modern silver electric sedan on a scenic open road"
            loading="eager"
          />
        </div>

        <div className="vyaj-rides-values" aria-label="VYAJ values">
          <div className="vyaj-rides-value">
            <span className="vyaj-rides-value-icon"><Leaf size={27} strokeWidth={1.8} /></span>
            <strong>Cleaner</strong>
            <small>TRAVEL</small>
          </div>
          <div className="vyaj-rides-value">
            <span className="vyaj-rides-value-icon"><ShieldCheck size={27} strokeWidth={1.8} /></span>
            <strong>Safer</strong>
            <small>RIDES</small>
          </div>
          <div className="vyaj-rides-value">
            <span className="vyaj-rides-value-icon"><Users size={27} strokeWidth={1.8} /></span>
            <strong>A Better</strong>
            <small>TOMORROW</small>
          </div>
        </div>

        <div className="vyaj-rides-launch-card" id="rides-coming-soon">
          <div className="vyaj-rides-caption-icon"><CarFront size={27} strokeWidth={1.8} /></div>
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
