import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://georgia-gas-deals.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Georgia Gas Deals — Compare Natural Gas Rates",
    template: "%s | Georgia Gas Deals",
  },
  description:
    "Compare natural gas rates from every certified Georgia provider. Sorted by estimated monthly cost — not commissions. No signup required.",
  keywords: [
    "Georgia natural gas rates",
    "compare natural gas Georgia",
    "cheapest natural gas provider Georgia",
    "Gas South rates",
    "Georgia Natural Gas comparison",
    "natural gas marketers Georgia",
    "SCANA Energy rates",
    "SouthStar Energy rates",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Georgia Gas Deals",
    title: "Georgia Gas Deals — Compare Natural Gas Rates",
    description: "Sorted by what you actually pay — not who pays us the most.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Georgia Gas Deals — Compare Natural Gas Rates",
    description: "Sorted by what you actually pay — not who pays us the most.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} font-sans antialiased bg-cream text-navy`}>
        {children}
      </body>
    </html>
  );
}
