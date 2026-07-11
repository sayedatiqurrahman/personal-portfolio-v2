import type { Metadata } from "next";
import TerminalView from "@/components/TerminalView";
import { getProfile, getRoles, getProjects, getSkills, getEducation, getCertificates, getReviews } from "@/lib/db";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terminal",
  description: "Interactive terminal for Sayed Atiqur Rahman's portfolio. Browse projects, skills, and more via command line.",
};

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function TerminalPage() {
  const profile = await safe(getProfile, null);
  const roles = await safe(getRoles, []);
  const projects = await safe(getProjects, []);
  const skills = await safe(getSkills, []);
  const education = await safe(getEducation, []);
  const certificates = await safe(getCertificates, []);
  const reviews = await safe(getReviews, []);

  return (
    <>
      <div className="terminal-scanlines" />
      <TerminalView
        profile={profile!}
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
