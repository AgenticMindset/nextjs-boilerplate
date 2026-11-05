import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "./components/Navigation";
import { SITE_NAME, SITE_URL } from "../lib/site";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["700", "400", "500", "600"],
});

export const metadata: Metadata = {
  // Without this, every relative image above resolves against
  // http://localhost:3000 in production and no crawler can fetch it.
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description:
    "Professional Portfolio",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: SITE_NAME,
    description:
      "Professional Portfolio",
    images: ["/icon-512.png"],
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description:
      "Professional Portfolio",
    images: ["/icon-512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}