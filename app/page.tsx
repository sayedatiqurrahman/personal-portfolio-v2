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
import Footer from "@/components/Footer";
import FAB from "@/components/FAB";
import { getProfile, getRoles, getProjects, getSkills, getEducation, getCertificates, getAchievements, getReviews, getTerminalInfo } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  if (!profile) return {};

  const description = profile.tagline || profile.bio || `${profile.name} - Full Stack Developer`;

  return {
    title: `${profile.name} | Full Stack Developer`,
    description,
    openGraph: {
      title: `${profile.name} | Full Stack Developer`,
      description,
      url: "/",
      images: profile.profileImage ? [{ url: profile.profileImage, width: 800, height: 1000, alt: profile.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} | Full Stack Developer`,
      description,
      images: profile.profileImage ? [profile.profileImage] : [],
    },
  };
}

export default async function Home() {
  const [profile, roles, projects, skills, education, certificates, achievements, reviews, terminalInfo] = await Promise.all([
    getProfile(), getRoles(), getProjects(), getSkills(),
    getEducation(), getCertificates(), getAchievements(), getReviews(), getTerminalInfo(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name,
    alternateName: profile?.shortName,
    description: profile?.tagline || profile?.bio,
    image: profile?.profileImage,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://personal-portfolio-v2.vercel.app",
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
      </main>
      <Footer profile={profile!} />
      <FAB />
    </>
  );
}
