import type { Metadata } from "next";
import Header from "@/components/Header";
import ProjectsArchive from "@/components/ProjectsArchive";
import Footer from "@/components/Footer";
import FAB from "@/components/FAB";
import { getProfile, getProjects } from "@/lib/db";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [profile, projects] = await Promise.all([
    getProfile(),
    getProjects(),
  ]);

  return {
    title: "Projects",
    description: `Browse all ${projects.length} projects by ${profile.name || "the developer"}. Full-stack applications built with modern technologies.`,
    openGraph: {
      title: "Projects | Full Stack Portfolio",
      description: `Browse all ${projects.length} projects. Full-stack applications built with modern technologies.`,
    },
  };
}

export default async function ProjectsPage() {
  const [profile, projects] = await Promise.all([
    getProfile(),
    getProjects(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Projects by ${profile.name || "Developer"}`,
    description: `A collection of ${projects.length} software development projects.`,
    url: "/projects",
    author: {
      "@type": "Person",
      name: profile.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="terminal-scanlines" />
      <Header profile={profile} />
      <main className="pt-24 min-h-screen">
        <ProjectsArchive projects={projects} />
      </main>
      <Footer profile={profile} />
      <FAB />
    </>
  );
}
