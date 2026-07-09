import Header from "@/components/Header";
import ProjectsArchive from "@/components/ProjectsArchive";
import Footer from "@/components/Footer";
import FAB from "@/components/FAB";
import { getProfile, getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);

  return (
    <>
      <div className="terminal-scanlines" />
      <Header profile={profile!} />
      <main className="pt-24 min-h-screen">
        <ProjectsArchive projects={projects} />
      </main>
      <Footer profile={profile!} />
      <FAB />
    </>
  );
}
