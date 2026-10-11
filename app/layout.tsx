import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

const socialImage = "/E4E6986E-D41A-485B-B3A5-2B22D70D4E26.png";

export const metadata: Metadata = {
  title: "VYAJ — Discover your next escape",
  description: "Discover a trip that feels like you. Explore inspiring escapes, personalise your journey and turn the feeling into a plan with VYAJ.",
  metadataBase: new URL("https://vyaj.eu"),
  openGraph: {
    title: "VYAJ — Discover your next escape",
    description: "Find your next escape, then shape a journey around your time, budget and travel style.",
    url: "https://vyaj.eu",
    siteName: "VYAJ",
    type: "website",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "VYAJ — Plan less. Travel more.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VYAJ — Build your next trip",
    description: "Plan your next trip around your time, budget and travel style.",
    images: [socialImage],
  },
  icons: { icon: "/vyaj-mark.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
