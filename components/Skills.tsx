"use client";

import { useState } from "react";
import type { Skill } from "@/lib/types";

type ViewMode = "npm" | "normal";

const LEVEL_PERCENT: Record<string, number> = {
  expertise: 90,
  comfortable: 75,
  familiar: 60,
};

const LEVEL_CARD: Record<string, string> = {
  expertise: "border-primary/40 bg-primary/[0.04] hover:bg-primary/[0.08] hover:border-primary/60",
  comfortable: "border-secondary/40 bg-secondary/[0.04] hover:bg-secondary/[0.08] hover:border-secondary/60",
  familiar: "border-tertiary/40 bg-tertiary/[0.04] hover:bg-tertiary/[0.08] hover:border-tertiary/60",
};

const LEVEL_BG: Record<string, string> = {
  expertise: "bg-primary/20",
  comfortable: "bg-secondary/20",
  familiar: "bg-tertiary/20",
};

const LEVEL_TEXT: Record<string, string> = {
  expertise: "text-primary",
  comfortable: "text-secondary",
  familiar: "text-tertiary",
};

const LEVEL_BAR: Record<string, string> = {
  expertise: "bg-primary",
  comfortable: "bg-secondary",
  familiar: "bg-tertiary",
};

export default function Skills({ skills }: { skills: Skill[] }) {
  const [view, setView] = useState<ViewMode>("normal");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const categories = [...new Set(skills.map((s) => s.category))].filter(Boolean);
  const levels = [...new Set(skills.map((s) => s.level))];
  const filtered = levelFilter === "all" ? skills : skills.filter((s) => s.level === levelFilter);

  const byCategory = categories.reduce<Record<string, Skill[]>>((acc, cat) => {
    acc[cat] = filtered.filter((s) => s.category === cat);
    return acc;
  }, {});

  return (
    <section className="max-w-container-max mx-auto px-6 py-section-padding" id="skills">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline-md text-headline-md text-primary">
          ./show_expertise{view === "npm" ? " --verbose" : " --list"}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView("normal")}
            className={`px-4 py-1.5 text-xs font-bold rounded border transition-all ${
              view === "normal"
                ? "bg-primary text-on-primary border-primary"
                : "border-outline-variant text-on-surface-variant hover:border-primary"
            }`}
          >
            [ --list ]
          </button>
          <button
            onClick={() => setView("npm")}
            className={`px-4 py-1.5 text-xs font-bold rounded border transition-all ${
              view === "npm"
                ? "bg-primary text-on-primary border-primary"
                : "border-outline-variant text-on-surface-variant hover:border-primary"
            }`}
          >
            [ --verbose ]
          </button>
        </div>
      </div>

      {/* ─── NPM / Pack Mode ──────────────────────────── */}
      {view === "npm" && (
        <div className="terminal-window bg-surface-container-lowest rounded-lg overflow-hidden font-code-sm text-sm">
          <div className="bg-surface-variant px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-label-caps text-on-surface-variant opacity-60 ml-4">
              ./show_expertise --verbose
            </div>
          </div>
          <div className="p-6 space-y-6">
            {categories.map((cat) => {
              const catSkills = skills.filter((s) => s.category === cat);
              if (!catSkills.length) return null;
              return (
                <div key={cat} className="text-primary space-y-2">
                  <p className="text-on-surface-variant opacity-70">// {cat} Stack</p>
                  <p className="text-primary-fixed-dim">
                    npm install --global{" "}
                    {catSkills.map((s) => `@skill/${s.name.toLowerCase().replace(/\s+/g, "-")}`).join(" ")}
                  </p>
                </div>
              );
            })}
            <div className="pt-4 border-t border-primary/20">
              <p className="text-primary cursor-blink">All dependencies satisfied.</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Normal (List) Mode ────────────────────────── */}
      {view === "normal" && (
        <div>
          <div className="flex gap-2 mb-8 flex-wrap">
            {[{ key: "all", label: "ALL" }, ...levels.map((l) => ({ key: l, label: l.toUpperCase() }))].map((l) => (
              <button
                key={l.key}
                onClick={() => setLevelFilter(l.key)}
                className={`px-4 py-1.5 text-xs font-bold rounded border transition-all capitalize ${
                  levelFilter === l.key
                    ? "bg-primary text-on-primary border-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8">
            {categories.map((cat) => {
              const catSkills = byCategory[cat];
              if (!catSkills?.length) return null;
              return (
                  <div key={cat}>
                  <h3 className="text-on-surface-variant text-sm font-code-sm mb-4 opacity-60">
                    {cat.toUpperCase()} STACK
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {catSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className={`border rounded-lg p-4 flex flex-col gap-3 transition-all ${LEVEL_CARD[skill.level] || "border-outline-variant bg-surface-container-low"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${LEVEL_BG[skill.level] || "bg-surface-container"} flex items-center justify-center`}>
                            <span className={`material-symbols-outlined text-xl ${LEVEL_TEXT[skill.level] || "text-primary"}`}>
                              {skill.icon || "code"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-on-surface font-bold text-sm truncate">{skill.name}</p>
                            <span className={`text-xs font-code-sm ${LEVEL_TEXT[skill.level] || "text-primary"}`}>
                              {skill.level}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${LEVEL_BAR[skill.level] || "bg-primary"}`}
                            style={{ width: `${LEVEL_PERCENT[skill.level] || 70}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
