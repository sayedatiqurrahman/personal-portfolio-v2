import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getProfile } from "@/lib/db";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const siteUrl = "https://atiq.is-a.dev";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Sayed Atiqur Rahman | Full Stack Developer",
      template: "%s | Sayed Atiqur Rahman",
    },
    description:
      "Sayed Atiqur Rahman (also known as Atiq, Atiqur) — Full Stack Developer and MERN Stack specialist. Building high-performance web applications with TypeScript, React, Next.js, Node.js, and modern architectures.",
    keywords: [
      "Sayed Atiqur Rahman",
      "Atiqur Rahman",
      "Atiqur",
      "Atiq",
      "Atik",
      "Full Stack Developer",
      "MERN Stack Developer",
      "TypeScript Developer",
      "React Developer",
      "Next.js Developer",
      "Node.js Developer",
      "Web Developer",
      "Portfolio",
      "Bangladesh Developer",
      "Frontend Developer",
      "Backend Developer",
    ],
    authors: [{ name: "Sayed Atiqur Rahman" }],
    creator: "Sayed Atiqur Rahman",
    publisher: "Sayed Atiqur Rahman",
    icons: [{ rel: "icon", url: "https://images.pexels.com/photos/38512418/pexels-photo-38512418.jpeg?w=64", type: "image/jpeg" }],
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Sayed Atiqur Rahman Portfolio",
      title: "Sayed Atiqur Rahman | Full Stack Developer",
      description:
        "Sayed Atiqur Rahman (Atiq) — Full Stack Developer specializing in MERN Stack, TypeScript, React, Next.js, and Node.js.",
      url: siteUrl,
      images: [{ url: "https://images.pexels.com/photos/38513711/pexels-photo-38513711.jpeg", width: 1200, height: 630, alt: "Sayed Atiqur Rahman - Full Stack Developer Portfolio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sayed Atiqur Rahman | Full Stack Developer",
      description:
        "Sayed Atiqur Rahman (Atiq) — Full Stack Developer specializing in MERN Stack, TypeScript, React, Next.js, and Node.js.",
      images: [{ url: "https://images.pexels.com/photos/38513711/pexels-photo-38513711.jpeg", width: 1200, height: 630, alt: "Sayed Atiqur Rahman - Full Stack Developer Portfolio" }],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="google-site-verification" content="k7Ur54qXxwt1876m7XP-8fCAGIRaLwYE-3WuhVswxbI" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
        />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var a=localStorage.getItem("accent");if(a)document.documentElement.setAttribute("data-accent",a)}catch(e){}}())`
        }} />
      </head>
      <body className="bg-background text-on-surface font-body-md selection:bg-primary/30 selection:text-primary binary-bg">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
