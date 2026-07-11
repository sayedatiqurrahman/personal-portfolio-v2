import type { Metadata } from "next";
import TerminalView from "@/components/TerminalView";
import { getProfile, getRoles, getProjects, getSkills, getEducation, getCertificates, getReviews } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terminal",
  description: "Interactive terminal for Sayed Atiqur Rahman's portfolio. Browse projects, skills, and more via command line.",
};

export default async function TerminalPage() {
  const [profile, roles, projects, skills, education, certificates, reviews] = await Promise.all([
    getProfile(),
    getRoles(),
    getProjects(),
    getSkills(),
    getEducation(),
    getCertificates(),
    getReviews(),
  ]);

  return (
    <>
      <div className="terminal-scanlines" />
      <TerminalView
        profile={profile}
        roles={roles}
        projects={projects}
        skills={skills}
        education={education}
        certificates={certificates}
        reviews={reviews}
      />
    </>
  );
}
