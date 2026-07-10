"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Profile, Role, Project, Skill, Education, Certificate, Review } from "@/lib/types";

function parseJSON<T>(raw: string): T[] {
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

interface LogEntry {
  input?: string;
  output: React.ReactNode;
}

const ASCII_BANNER = `
    ╔══════════════════════════════════════════════════════════════════════════════╗
    ║  ██████   █████  ██████  ████████ ████████  █████  ██       ██████  █████    ║
    ║  ██   ██ ██   ██ ██   ██    ██    ██       ██   ██ ██         ██   ██   ██   ║
    ║  ██████  ██   ██ ██████     ██    █████    ██   ██ ██         ██   ██   ██   ║
    ║  ██      ██   ██ ██   ██    ██    ██       ██   ██ ██         ██   ██   ██   ║
    ║  ██       █████  ██   ██    ██    ██        █████  ████████ ██████  █████    ║
    ║                                                                              ║
    ║  SAYED ATIQUR RAHMAN                                                         ║
    ║  Full Stack Developer                                                        ║
    ╚══════════════════════════════════════════════════════════════════════════════╝
`;

const COMMANDS = [
  { cmd: "help", desc: "Display available commands" },
  { cmd: "about", desc: "About Sayed Atiqur Rahman" },
  { cmd: "skills", desc: "View technical skills" },
  { cmd: "projects", desc: "List projects" },
  { cmd: "education", desc: "View education history" },
  { cmd: "certificates", desc: "View certificates" },
  { cmd: "reviews", desc: "Read client reviews" },
  { cmd: "contact", desc: "Show contact information" },
  { cmd: "resume", desc: "Download or view resume" },
  { cmd: "whoami", desc: "Display current user" },
  { cmd: "banner", desc: "Show ASCII banner" },
  { cmd: "clear", desc: "Clear terminal" },
  { cmd: "gui", desc: "Return to main site" },
];

export default function TerminalView({
  profile,
  roles,
  projects,
  skills,
  education,
  certificates,
  reviews,
}: {
  profile: Profile;
  roles: Role[];
  projects: Project[];
  skills: Skill[];
  education: Education[];
  certificates: Certificate[];
  reviews: Review[];
}) {
  const router = useRouter();
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIdx, setCmdIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const boot: LogEntry = {
      output: (
        <div className="space-y-2">
          <pre className="text-primary font-code-sm leading-tight select-none">{ASCII_BANNER}</pre>
          <p className="text-on-surface-variant font-code-sm text-xs">
            Type <span className="text-primary font-bold">help</span> for available commands, or click a quick action below.
          </p>
        </div>
      ),
    };
    setHistory([boot]);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;

      setCmdHistory((prev) => [...prev, raw]);
      setCmdIdx(-1);

      let output: React.ReactNode = null;

      switch (cmd) {
        case "help":
          output = (
            <div className="space-y-1">
              <p className="text-secondary font-bold">Available Commands:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                {COMMANDS.map((c) => (
                  <div key={c.cmd} className="font-code-sm text-xs">
                    <span className="text-primary font-bold">{c.cmd}</span>
                    <span className="text-on-surface-variant"> — {c.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          );
          break;

        case "about": {
          const about = parseJSON<string>(profile.about);
          const principles = parseJSON<string>(profile.corePrinciples);
          output = (
            <div className="space-y-3">
              <p className="text-secondary font-bold">About Sayed Atiqur Rahman</p>
              <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-1 font-code-sm text-xs">
                <span className="text-on-surface-variant">Name:</span>
                <span>{profile.name}</span>
                <span className="text-on-surface-variant">Role:</span>
                <span>{roles.map((r) => r.title).join(", ")}</span>
                <span className="text-on-surface-variant">Tagline:</span>
                <span>{profile.tagline}</span>
              </div>
              {profile.bio && (
                <div className="font-code-sm text-xs text-on-surface leading-relaxed">{profile.bio}</div>
              )}
              {about.length > 0 && (
                <div className="space-y-2 font-code-sm text-xs text-on-surface">
                  {about.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}
              {principles.length > 0 && (
                <div>
                  <p className="text-secondary font-bold font-code-sm text-xs mb-1">Core Principles:</p>
                  <ul className="space-y-1 font-code-sm text-xs">
                    {principles.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">&gt;</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
          break;
        }

        case "skills": {
          const grouped: Record<string, Skill[]> = {};
          skills.forEach((s) => {
            if (!grouped[s.category]) grouped[s.category] = [];
            grouped[s.category].push(s);
          });
          output = (
            <div className="space-y-3">
              <p className="text-secondary font-bold">Technical Skills</p>
              <div className="space-y-3">
                {Object.entries(grouped).map(([cat, sk]) => (
                  <div key={cat}>
                    <p className="text-primary font-bold font-code-sm text-xs mb-1">&gt; {cat}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sk.map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 bg-surface-container-low border border-outline-variant rounded font-code-sm text-xs text-on-surface"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          break;
        }

        case "projects":
          output = (
            <div className="space-y-3">
              <p className="text-secondary font-bold">Projects ({projects.length})</p>
              {projects.map((p) => {
                const stack = parseJSON<string>(p.stack);
                return (
                  <div key={p.id} className="p-3 bg-surface-container-low border border-outline-variant rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold text-primary font-code-sm text-xs">{p.title}</span>
                      <span className="font-code-sm text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant">
                        {p.category}
                      </span>
                    </div>
                    <p className="font-code-sm text-xs text-on-surface leading-relaxed">{p.description}</p>
                    {stack.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {stack.map((t) => (
                          <span
                            key={t}
                            className="font-code-sm text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded border border-outline-variant"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 font-code-sm text-xs pt-1">
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-secondary hover:underline">
                          Launch →
                        </a>
                      )}
                      {p.sourceUrl && (
                        <a href={p.sourceUrl} target="_blank" rel="noreferrer" className="text-secondary hover:underline">
                          Source →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
          break;

        case "education":
          output = (
            <div className="space-y-3">
              <p className="text-secondary font-bold">Education</p>
              {education.map((e) => (
                <div key={e.id} className="p-3 bg-surface-container-low border border-outline-variant rounded-xl space-y-1">
                  <p className="font-bold text-primary font-code-sm text-xs">{e.institution}</p>
                  <p className="font-code-sm text-xs text-on-surface">
                    {e.degree} in {e.field}
                  </p>
                  <p className="font-code-sm text-[10px] text-on-surface-variant">
                    {e.startDate} — {e.endDate}
                  </p>
                  {e.description && (
                    <p className="font-code-sm text-xs text-on-surface-variant leading-relaxed">{e.description}</p>
                  )}
                </div>
              ))}
            </div>
          );
          break;

        case "certificates":
          output = (
            <div className="space-y-3">
              <p className="text-secondary font-bold">Certificates</p>
              {certificates.map((c) => (
                <div key={c.id} className="p-3 bg-surface-container-low border border-outline-variant rounded-xl space-y-1">
                  <p className="font-bold text-primary font-code-sm text-xs">{c.name}</p>
                  <p className="font-code-sm text-xs text-on-surface-variant">
                    {c.issuer} — {c.date}
                  </p>
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noreferrer" className="font-code-sm text-xs text-secondary hover:underline">
                      View credential →
                    </a>
                  )}
                </div>
              ))}
            </div>
          );
          break;

        case "reviews":
        case "testimonials":
          output = (
            <div className="space-y-3">
              <p className="text-secondary font-bold">Client Reviews</p>
              {reviews.map((r) => (
                <div key={r.id} className="p-3 bg-surface-container-low border border-outline-variant rounded-xl space-y-1">
                  <div className="text-primary font-code-sm text-xs">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>
                  <p className="font-code-sm text-xs text-on-surface italic">&ldquo;{r.text}&rdquo;</p>
                  <p className="font-code-sm text-[10px] text-on-surface-variant text-right">
                    — {r.clientName}
                    {r.company ? ` (${r.company})` : ""}
                  </p>
                </div>
              ))}
            </div>
          );
          break;

        case "contact":
          output = (
            <div className="space-y-3">
              <p className="text-secondary font-bold">Contact Information</p>
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl space-y-1 font-code-sm text-xs">
                <div>
                  <span className="text-on-surface-variant">Email: </span>
                  <a href={`mailto:${profile.email}`} className="text-secondary hover:underline">
                    {profile.email}
                  </a>
                </div>
                <div>
                  <span className="text-on-surface-variant">GitHub: </span>
                  <a href={profile.github} target="_blank" rel="noreferrer" className="text-secondary hover:underline">
                    {profile.github}
                  </a>
                </div>
                <div>
                  <span className="text-on-surface-variant">LinkedIn: </span>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-secondary hover:underline">
                    {profile.linkedin}
                  </a>
                </div>
              </div>
            </div>
          );
          break;

        case "resume":
          output = (
            <div className="space-y-3">
              <p className="text-secondary font-bold">Resume</p>
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl font-code-sm text-xs space-y-2">
                {profile.resumeUrl && (
                  <div>
                    <span className="text-on-surface-variant">Online: </span>
                    <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-secondary hover:underline">
                      {profile.resumeUrl}
                    </a>
                  </div>
                )}
                {profile.resumeFile && (
                  <div>
                    <span className="text-on-surface-variant">Download: </span>
                    <a href="/api/resume" download className="text-primary hover:underline">
                      {profile.resumeFile}
                    </a>
                  </div>
                )}
                {!profile.resumeUrl && !profile.resumeFile && (
                  <span className="text-on-surface-variant">No resume available yet.</span>
                )}
              </div>
            </div>
          );
          break;

        case "whoami":
          output = <span className="text-primary font-bold">{profile.terminalUser || profile.name}</span>;
          break;

        case "banner":
          output = <pre className="text-primary font-code-sm leading-tight">{ASCII_BANNER}</pre>;
          break;

        case "clear":
          setHistory([]);
          return;

        case "gui":
        case "exit":
          router.push("/");
          return;

        default:
          output = (
            <div className="flex items-center gap-2 font-code-sm text-xs text-error">
              <span>Command not found: <span className="font-bold">{cmd}</span>. Type <span className="text-primary font-bold">help</span> for available commands.</span>
            </div>
          );
      }

      setHistory((prev) => [...prev, { input: raw, output }]);
    },
    [profile, roles, projects, skills, education, certificates, reviews, router],
  );

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = cmdIdx === -1 ? cmdHistory.length - 1 : Math.max(0, cmdIdx - 1);
      setCmdIdx(next);
      setInput(cmdHistory[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdHistory.length === 0 || cmdIdx === -1) return;
      const next = cmdIdx + 1;
      if (next >= cmdHistory.length) {
        setCmdIdx(-1);
        setInput("");
      } else {
        setCmdIdx(next);
        setInput(cmdHistory[next]);
      }
    }
  };

  const quickActions = ["help", "about", "skills", "projects", "education", "certificates", "reviews", "resume", "contact", "gui"];

  return (
    <div className="min-h-screen bg-background text-on-surface" onClick={focusInput}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Terminal header bar */}
        <div className="flex items-center justify-between border-b border-outline-variant pb-4">
          <div className="space-y-1">
            <p className="font-code-sm text-xs text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              Interactive Terminal — Sayed Atiqur Rahman
            </p>
            <h1 className="text-xl font-bold font-code-sm text-on-surface">
              <span className="text-primary">{profile.terminalUser || profile.name}</span>:~$
            </h1>
          </div>
          <button
            onClick={() => router.push("/")}
            className="font-code-sm text-xs text-secondary hover:text-primary bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 transition-all cursor-pointer"
          >
            ← Back to Portfolio
          </button>
        </div>

        {/* Terminal window */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-[0_0_20px_rgba(74,225,118,0.05)]">
          {/* Window dots */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-outline-variant">
            <span className="w-3 h-3 rounded-full bg-error" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="font-code-sm text-[10px] text-on-surface-variant ml-3">terminal — bash</span>
          </div>

          {/* Log area */}
          <div className="p-4 sm:p-6 min-h-[400px] max-h-[520px] overflow-y-auto space-y-4 cursor-text" onClick={focusInput}>
            {history.map((entry, i) => (
              <div key={i} className="space-y-1.5">
                {entry.input !== undefined && (
                  <div className="flex items-center gap-2 font-code-sm text-xs">
                    <span className="text-primary shrink-0">
                      {profile.terminalUser || profile.name}:~$
                    </span>
                    <span className="text-on-surface">{entry.input}</span>
                  </div>
                )}
                <div className="font-code-sm text-xs text-on-surface pl-0">{entry.output}</div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input line */}
          <div className="flex items-center gap-2 border-t border-outline-variant px-4 sm:px-6 py-3">
            <span className="font-code-sm text-xs text-primary shrink-0">
              {profile.terminalUser || profile.name}:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="flex-1 bg-transparent border-none outline-none font-code-sm text-xs text-on-surface placeholder-on-surface-variant/30 caret-primary"
              placeholder="Type a command..."
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 space-y-3">
          <p className="font-code-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
            Quick Actions (click to run)
          </p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  setInput("");
                  run(cmd);
                  inputRef.current?.focus();
                }}
                className="px-3 py-1.5 bg-surface-container border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary font-code-sm text-xs rounded-lg transition-all active:scale-95 cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
