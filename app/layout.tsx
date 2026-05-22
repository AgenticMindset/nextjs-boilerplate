import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "./components/Navigation";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Álvaro Tomás",
  description:
    "Building at the intersection of Agentic AI and Blockchain",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Álvaro Tomás",
    description:
      "Building at the intersection of Agentic AI and Blockchain",
    images: ["/icon-512.png"],
    siteName: "Álvaro Tomás",
  },
  twitter: {
    card: "summary",
    title: "Álvaro Tomás",
    description:
      "Building at the intersection of Agentic AI and Blockchain",
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