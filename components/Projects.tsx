import Image from "next/image";
import type { Project } from "@/lib/types";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  finished: "bg-primary/10 text-primary border-primary/30",
  ongoing: "bg-secondary/10 text-secondary border-secondary/30",
  staging: "bg-tertiary/10 text-tertiary border-tertiary/30",
  "failed/cancelled": "bg-error/10 text-error border-error/30",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-code-sm px-2 py-0.5 rounded border ${STATUS_STYLES[status] || ""}`}>
      {status}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const stack = (() => { try { return JSON.parse(project.stack); } catch { return []; } })();

  const spanClass =
    project.gridSpan === "4" ? "md:col-span-4"
    : project.gridSpan === "6" ? "md:col-span-6"
    : project.gridSpan === "12" ? "md:col-span-12"
    : "md:col-span-8";

  if (project.gridSpan === "12") {
    return (
      <article className={spanClass}>
        <div className="terminal-border bg-surface-container-low overflow-hidden md:flex">
          {project.image && (
            <div className="relative w-full md:w-[360px] shrink-0 aspect-video md:h-[240px]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 360px"
              />
            </div>
          )}
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-primary/20 pb-2">
              <span className="text-primary font-headline-md text-headline-md">{project.terminalScript}</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-error" />
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="w-2 h-2 rounded-full bg-primary" />
              </div>
            </div>
            <h3 className="text-on-surface font-bold text-lg mb-2 flex items-center gap-3">
              {project.title}
              <StatusBadge status={project.status} />
            </h3>
            <p className="text-on-surface-variant mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {stack.map((s: string) => (
                <span key={s} className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-code-sm text-primary font-code-sm">{s}</span>
              ))}
            </div>
            <div className="flex gap-4 mt-auto">
              {project.liveUrl && project.liveUrl !== "#" && (
                <a className="text-primary hover:underline font-bold" href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} live demo`}>[ LIVE_DEMO ]</a>
              )}
              {project.sourceUrl && project.sourceUrl !== "#" && (
                <a className="text-secondary hover:underline font-bold" href={project.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source code`}>[ SOURCE_CODE ]</a>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={spanClass}>
      <div className="terminal-border bg-surface-container-low overflow-hidden h-full flex flex-col">
        {project.image && (
          <div className="relative w-full aspect-video overflow-hidden border-b border-outline-variant/20">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-center mb-4 border-b border-primary/20 pb-2">
            <span className="text-primary font-headline-md text-headline-md">{project.terminalScript}</span>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-error" />
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="w-2 h-2 rounded-full bg-primary" />
            </div>
          </div>
          <div className="space-y-3 font-code-sm flex-1 flex flex-col">
            <h3 className="text-on-surface font-bold flex items-center gap-2 flex-wrap">
              {project.title}
              <StatusBadge status={project.status} />
            </h3>
            <p className="text-on-surface-variant">{project.description}</p>
            <div className="flex flex-wrap gap-1">
              {stack.map((s: string) => (
                <span key={s} className="text-primary text-xs">[{s}]</span>
              ))}
            </div>
            <div className="flex gap-4 mt-auto pt-4 border-t border-primary/10">
              {project.liveUrl && project.liveUrl !== "#" && (
                <a className="text-primary hover:underline" href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} live demo`}>[ LIVE_DEMO ]</a>
              )}
              {project.sourceUrl && project.sourceUrl !== "#" && (
                <a className="text-secondary hover:underline" href={project.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source code`}>[ SOURCE_CODE ]</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  if (!projects?.length) return null;

  const featuredProjects = projects.filter(p => p.featured > 0).sort((a, b) => a.featured - b.featured);
  const hasMoreProjects = projects.some(p => p.featured === 0);

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
            className="inline-flex items-center gap-2 self-end md:self-auto rounded-full border border-primary/30 bg-surface-container px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <span className="material-symbols-outlined text-base">folder_open</span>
            cd all-projects
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

    </section>
  );
}
