import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const socialImage = "/E4E6986E-D41A-485B-B3A5-2B22D70D4E26.png";
const brandLogo = "/A95ADB58-28CE-4DB2-B9AE-EB9B0E9AF376.png";

export const metadata: Metadata = {
  title: "VYAJ — Your Journey, Reimagined",
  description: "Discover places you’ll love. Plan smarter, travel your way, and turn your next escape into an unforgettable journey.",
  metadataBase: new URL("https://vyaj.eu"),
  openGraph: {
    title: "VYAJ — Your Journey, Reimagined",
    description: "Discover places you’ll love. Plan smarter, travel your way, and turn your next escape into an unforgettable journey.",
    url: "https://vyaj.eu",
    siteName: "VYAJ",
    type: "website",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "VYAJ — Your Journey, Reimagined. Plan less. Travel more.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VYAJ — Your Journey, Reimagined",
    description: "Discover places you’ll love. Plan smarter, travel your way, and turn your next escape into an unforgettable journey.",
    images: [socialImage],
  },
  icons: {
    icon: [
      { url: brandLogo, type: "image/png", sizes: "512x512" },
    ],
    shortcut: brandLogo,
    apple: [
      { url: brandLogo, sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
