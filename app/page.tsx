import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Certificates from "@/components/Certificates";
import Reviews from "@/components/Reviews";
import About from "@/components/About";
import Footer from "@/components/Footer";
import FAB from "@/components/FAB";
import { getProfile, getRoles, getProjects, getSkills, getEducation, getCertificates, getReviews, getTerminalInfo } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, roles, projects, skills, education, certificates, reviews, terminalInfo] = await Promise.all([
    getProfile(), getRoles(), getProjects(), getSkills(),
    getEducation(), getCertificates(), getReviews(), getTerminalInfo(),
  ]);

  return (
    <>
      <div className="terminal-scanlines" />
      <Header profile={profile!} />
      <main className="pt-24 min-h-screen">
        <Hero profile={profile!} roles={roles} terminalInfo={terminalInfo} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Education education={education} />
        <Certificates certificates={certificates} />
        <Reviews reviews={reviews} />
        <About profile={profile!} />
      </main>
      <Footer profile={profile!} />
      <FAB />
    </>
  );
}
