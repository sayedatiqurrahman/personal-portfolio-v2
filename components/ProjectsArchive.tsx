"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/lib/types";

function parseList(value: string | null | undefined) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function ProjectCard({ project }: { project: Project }) {
  const stack = parseList(project.stack);

  return (
    <article className="terminal-border p-6 bg-surface-container-low relative overflow-hidden h-full">
      <div className="flex justify-between items-center mb-4 border-b border-primary/20 pb-2">
        <span className="text-primary font-headline-md text-headline-md">{project.terminalScript}</span>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-error" />
          <span className="w-2 h-2 rounded-full bg-secondary" />
          <span className="w-2 h-2 rounded-full bg-primary" />
        </div>
      </div>

      <div className="space-y-3 font-code-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-on-surface font-bold">{project.title}</p>
          {project.category && (
            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-primary">
              {project.category}
            </span>
          )}
        </div>
        <p className="text-on-surface-variant">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {stack.map((s: string) => (
            <span key={s} className="text-primary text-xs">[{s}]</span>
          ))}
        </div>
        <div className="flex gap-4 mt-4 pt-4 border-t border-primary/10">
          {project.liveUrl && project.liveUrl !== "#" && (
            <a className="text-primary hover:underline" href={project.liveUrl} target="_blank" rel="noopener">[ LIVE_DEMO ]</a>
          )}
          {project.sourceUrl && project.sourceUrl !== "#" && (
            <a className="text-secondary hover:underline" href={project.sourceUrl} target="_blank" rel="noopener">[ SOURCE_CODE ]</a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsArchive({ projects }: { projects: Project[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const categories = useMemo(() => {
    return Array.from(new Set(projects.map((project) => project.category).filter(Boolean))).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return projects.filter((project) => {
      const categoryMatch = category === "All" || project.category === category;
      if (!categoryMatch) return false;

      if (!normalized) return true;

      const haystack = [
        project.title,
        project.description,
        project.category,
        project.terminalScript,
        project.stack,
        project.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [projects, search, category]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / perPage));
  const visibleProjects = filteredProjects.slice((page - 1) * perPage, page * perPage);

  return (
    <section className="max-w-container-max mx-auto px-6 py-section-padding" id="projects">
      <div className="mb-8 rounded-2xl border border-outline-variant/70 bg-surface-container-lowest/80 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-label-caps text-primary mb-2">archive</p>
            <h1 className="font-headline-md text-headline-md">./exec list_all_projects</h1>
            <p className="mt-2 text-on-surface-variant">Search, filter, and browse the full project catalog.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects"
              className="w-full rounded-full border border-outline-variant bg-surface-container px-4 py-2 text-sm text-on-surface outline-none focus:border-primary sm:w-64"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-full border border-outline-variant bg-surface-container px-4 py-2 text-sm text-on-surface outline-none focus:border-primary"
            >
              <option value="All">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between text-sm text-on-surface-variant">
        <span>{filteredProjects.length} project{filteredProjects.length === 1 ? "" : "s"}</span>
        <span>Page {page} of {totalPages}</span>
      </div>

      {visibleProjects.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest/70 p-10 text-center text-on-surface-variant">
          No projects match this search yet.
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="rounded-full border border-outline-variant px-3 py-2 text-sm text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setPage(number)}
              className={`h-9 w-9 rounded-full text-sm ${page === number ? "bg-primary text-on-primary" : "border border-outline-variant text-on-surface-variant"}`}
            >
              {number}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="rounded-full border border-outline-variant px-3 py-2 text-sm text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
