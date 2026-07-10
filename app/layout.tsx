import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://personal-portfolio-v2.vercel.app";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sayed Atiqur Rahman | Full Stack Developer",
    template: "%s | Sayed Atiqur Rahman",
  },
  description:
    "MERN Stack Developer specializing in TypeScript, React, Next.js, Node.js, and modern web architectures. Building high-performance applications with clean code and human-centric design.",
  keywords: [
    "Sayed Atiqur Rahman",
    "Full Stack Developer",
    "MERN Stack",
    "TypeScript",
    "React Developer",
    "Next.js",
    "Node.js",
    "Web Developer",
    "Portfolio",
    "Bangladesh Developer",
  ],
  authors: [{ name: "Sayed Atiqur Rahman" }],
  creator: "Sayed Atiqur Rahman",
  publisher: "Sayed Atiqur Rahman",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sayed Atiqur Rahman Portfolio",
    title: "Sayed Atiqur Rahman | Full Stack Developer",
    description:
      "MERN Stack Developer specializing in TypeScript, React, Next.js, Node.js, and modern web architectures.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sayed Atiqur Rahman | Full Stack Developer",
    description:
      "MERN Stack Developer specializing in TypeScript, React, Next.js, Node.js, and modern web architectures.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-body-md selection:bg-primary/30 selection:text-primary binary-bg">
        {children}
      </body>
    </html>
  );
}
