import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Certificates from "@/components/Certificates";
import Reviews from "@/components/Reviews";
import About from "@/components/About";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FAB from "@/components/FAB";
import { getProfile, getRoles, getProjects, getSkills, getEducation, getCertificates, getAchievements, getReviews, getTerminalInfo } from "@/lib/db";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await safe(getProfile, null);
  if (!profile) return {};

  const description = profile.tagline || profile.bio || `${profile.name} - Full Stack Developer`;

  return {
    title: `${profile.name || "Portfolio"} | Full Stack Developer`,
    description,
    openGraph: {
      title: `${profile.name || "Portfolio"} | Full Stack Developer`,
      description,
      url: "/",
      images: [{ url: "/api/og", width: 1200, height: 630, alt: profile.name || "Developer" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name || "Portfolio"} | Full Stack Developer`,
      description,
      images: [{ url: "/api/og", width: 1200, height: 630, alt: profile.name || "Developer" }],
    },
  };
}

export default async function Home() {
  const profile = await safe(getProfile, null);
  const roles = await safe(getRoles, []);
  const projects = await safe(getProjects, []);
  const skills = await safe(getSkills, []);
  const education = await safe(getEducation, []);
  const certificates = await safe(getCertificates, []);
  const achievements = await safe(getAchievements, []);
  const reviews = await safe(getReviews, []);
  const terminalInfo = await safe(getTerminalInfo, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name,
    alternateName: profile?.shortName,
    description: profile?.tagline || profile?.bio,
    image: "https://images.pexels.com/photos/38512418/pexels-photo-38512418.jpeg?w=800",
    url: "https://atiq.is-a.dev",
    sameAs: [
      profile?.github,
      profile?.linkedin,
      profile?.twitter,
    ].filter(Boolean),
    email: profile?.email,
    jobTitle: "Full Stack Developer",
    knowsAbout: ["MERN Stack", "TypeScript", "React", "Next.js", "Node.js", "Web Development"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="terminal-scanlines" />
      <Header profile={profile!} />
      <main id="home" className="pt-24 min-h-screen">
        <Hero profile={profile!} roles={roles} terminalInfo={terminalInfo} />
        <About profile={profile!} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Education education={education} />
        <Certificates certificates={certificates} />
        <Achievements achievements={achievements} />
        <Reviews reviews={reviews} />
        <Contact email={profile?.email} />
      </main>
      <Footer profile={profile!} />
      <FAB />
    </>
  );
}
