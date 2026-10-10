import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "VYAJ — Plan less. Travel more.",
  description: "A smarter way to plan meaningful trips. Discover places, build flexible itineraries, and make travel decisions together with VYAJ AI.",
  metadataBase: new URL("https://vyaj.eu"),
  openGraph: {
    title: "VYAJ — Plan less. Travel more.",
    description: "Your next great trip starts with one good question.",
    url: "https://vyaj.eu",
    siteName: "VYAJ",
    type: "website",
  },
  icons: { icon: "/vyaj-mark.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
