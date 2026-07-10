import type { Project } from "@/lib/types";
import Link from "next/link";

function ProjectCard({ project }: { project: Project }) {
  const stack = (() => { try { return JSON.parse(project.stack); } catch { return []; } })();

  const spanClass =
    project.gridSpan === "4" ? "md:col-span-4"
    : project.gridSpan === "12" ? "md:col-span-12"
    : "md:col-span-8";

  if (project.gridSpan === "12") {
    return (
      <article className={`${spanClass}`}>
        <div className="terminal-border p-6 bg-surface-container-low relative overflow-hidden">
          <div className="md:flex gap-12 items-center">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4 border-b border-primary/20 pb-2">
                <span className="text-primary font-headline-md text-headline-md">{project.terminalScript}</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-error" />
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
              </div>
              <h3 className="text-on-surface font-bold text-lg mb-2">{project.title}</h3>
              <p className="text-on-surface-variant mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {stack.map((s: string) => (
                  <span key={s} className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-code-sm text-primary font-code-sm">{s}</span>
                ))}
              </div>
              <div className="flex gap-4">
                {project.liveUrl && project.liveUrl !== "#" && (
                  <a className="text-primary hover:underline font-bold" href={project.liveUrl} target="_blank" rel="noopener noreferrer">[ LIVE_DEMO ]</a>
                )}
                {project.sourceUrl && project.sourceUrl !== "#" && (
                  <a className="text-secondary hover:underline font-bold" href={project.sourceUrl} target="_blank" rel="noopener noreferrer">[ SOURCE_CODE ]</a>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`${spanClass}`}>
      <div className="terminal-border p-6 bg-surface-container-low relative overflow-hidden h-full">
        <div className="flex justify-between items-center mb-4 border-b border-primary/20 pb-2">
          <span className="text-primary font-headline-md text-headline-md">{project.terminalScript}</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-error" />
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span className="w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>
        <div className="space-y-3 font-code-sm">
          <h3 className="text-on-surface font-bold">{project.title}</h3>
          <p className="text-on-surface-variant">{project.description}</p>
          <div className="flex flex-wrap gap-1">
            {stack.map((s: string) => (
              <span key={s} className="text-primary text-xs">[{s}]</span>
            ))}
          </div>
          <div className="flex gap-4 mt-4 pt-4 border-t border-primary/10">
            {project.liveUrl && project.liveUrl !== "#" && (
              <a className="text-primary hover:underline" href={project.liveUrl} target="_blank" rel="noopener noreferrer">[ LIVE_DEMO ]</a>
            )}
            {project.sourceUrl && project.sourceUrl !== "#" && (
              <a className="text-secondary hover:underline" href={project.sourceUrl} target="_blank" rel="noopener noreferrer">[ SOURCE_CODE ]</a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects({ projects, limit = 3 }: { projects: Project[]; limit?: number }) {
  const visibleProjects = projects.filter(p => p.featured > 0).sort((a, b) => a.featured - b.featured).slice(0, limit);
  const hasMoreProjects = projects.length > limit;

  return (
    <section className="max-w-container-max mx-auto px-6 py-section-padding" id="projects">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-headline-md text-headline-md text-primary mb-2">
            ./exec list_projects
          </h2>
          <p className="text-on-surface-variant max-w-md">
            Technical solutions built with the modern stack.
          </p>
        </div>

        {hasMoreProjects && (
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 self-start rounded-full border border-primary/30 bg-surface-container px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <span className="material-symbols-outlined text-base">folder_open</span>
            cd all-projects
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

    </section>
  );
}
