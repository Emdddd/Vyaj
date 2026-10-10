import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "VYAJ — Build your next trip",
  description: "Turn a destination, a budget and a few days into a trip you can picture. Explore the VYAJ interactive trip-planning demo.",
  metadataBase: new URL("https://vyaj.eu"),
  openGraph: {
    title: "VYAJ — Build your next trip",
    description: "Plan your next trip around your time, budget and travel style.",
    url: "https://vyaj.eu",
    siteName: "VYAJ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VYAJ — Build your next trip",
    description: "Plan your next trip around your time, budget and travel style.",
  },
  icons: { icon: "/vyaj-mark.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
