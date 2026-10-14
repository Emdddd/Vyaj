import type { Metadata } from "next";
import { ArrowLeft, CarFront, House } from "lucide-react";

export const metadata: Metadata = {
  title: "VYAJ Rides — Coming Soon",
  description: "VYAJ Rides is on its way. A better way to move, coming soon.",
};

export default function RidesPage() {
  return (
    <main className="vyaj-rides-page">
      <a className="vyaj-rides-home" href="/" aria-label="Back to VYAJ Travel"><ArrowLeft size={16} strokeWidth={1.8}/><House size={16} strokeWidth={1.8}/><span>Travel</span></a>
      <section className="vyaj-rides-content" aria-labelledby="vyaj-rides-title">
        <a href="/" aria-label="VYAJ home">
          <img
            className="vyaj-rides-logo"
            src="/D0F8F0DA-F8C9-4B07-8ED2-B6B0F1A5D567.png"
            alt="VYAJ"
            width="440"
            height="150"
          />
        </a>
        <h1 className="vyaj-rides-heading" id="vyaj-rides-title">Coming soon</h1>
        <p className="vyaj-rides-kicker">A better way to move is on its way.</p>
        <div className="vyaj-rides-motion" role="img" aria-label="A car moving along a road">
          <span className="vyaj-rides-car"><CarFront size={34} strokeWidth={1.7} /></span>
        </div>
      </section>
    </main>
  );
}
