"use client";

import { useState, useEffect, useCallback } from "react";

type Tab = "profile" | "roles" | "projects" | "skills" | "terminal" | "education" | "certificates" | "reviews" | "resume";

interface Profile {
  id: number; name: string; shortName: string; headerName: string; terminalPrompt: string;
  terminalUser: string; tagline: string; bio: string; about: string; corePrinciples: string;
  statusLabel: string; profileImage: string; aboutImage: string;
  github: string; linkedin: string; twitter: string; email: string;
  footerText: string; resumeUrl: string; resumeFile: string;
}

interface Role { id: number; title: string; sortOrder: number; }
interface Project { id: number; title: string; category: string; description: string; longDescription: string;
  stack: string; terminalType: string; terminalDesc: string; terminalScript: string;
  tags: string; image: string; liveUrl: string; sourceUrl: string; gridSpan: string; featured: number; sortOrder: number; }
interface Skill { id: number; name: string; icon: string; percent: number; level: string; category: string; sortOrder: number; }
interface Education { id: number; institution: string; degree: string; field: string;
  startDate: string; endDate: string; description: string; sortOrder: number; }
interface Certificate { id: number; name: string; issuer: string; date: string; url: string; image: string; sortOrder: number; }
interface Review { id: number; clientName: string; company: string; rating: number; text: string; date: string; sortOrder: number; }
interface TermInfo { id: number; key: string; label: string; value: string; sortOrder: number; }

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "profile", label: "Profile", icon: "person" },
  { key: "roles", label: "Roles", icon: "badge" },
  { key: "terminal", label: "Terminal Info", icon: "terminal" },
  { key: "projects", label: "Projects", icon: "folder" },
  { key: "skills", label: "Skills", icon: "psychology" },
  { key: "education", label: "Education", icon: "school" },
  { key: "certificates", label: "Certificates", icon: "workspace_premium" },
  { key: "reviews", label: "Reviews", icon: "rate_review" },
  { key: "resume", label: "Resume", icon: "description" },
];

async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  return res.json();
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [termInfo, setTermInfo] = useState<TermInfo[]>([]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, r, pr, s, e, c, rev, t] = await Promise.all([
        api<Profile>("/profile"),
        api<Role[]>("/roles"),
        api<Project[]>("/projects"),
        api<Skill[]>("/skills"),
        api<Education[]>("/education"),
        api<Certificate[]>("/certificates"),
        api<Review[]>("/reviews"),
        api<TermInfo[]>("/terminal-info"),
      ]);
      setProfile(p); setRoles(r); setProjects(pr); setSkills(s);
      setEducation(e); setCertificates(c); setReviews(rev); setTermInfo(t);
    } catch (e) { console.error("Failed to load data:", e); }
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) loadAll(); }, [authed, loadAll]);

  const login = () => {
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASS || "admin123")) setAuthed(true);
  };

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  // ─── Generic CRUD helpers ─────────────────────────────
  async function saveProfile() {
    if (!profile) return;
    await api("/profile", { method: "PUT", body: JSON.stringify(profile) });
    flash();
  }

  async function addRole() {
    const r = await api<Role>("/roles", { method: "POST", body: JSON.stringify({ title: "New Role", sortOrder: roles.length }) });
    setRoles([...roles, r]);
  }
  async function saveRole(r: Role) {
    await api("/roles", { method: "PUT", body: JSON.stringify(r) });
    flash();
  }
  async function removeRole(id: number) {
    await api("/roles", { method: "DELETE", body: JSON.stringify({ id }) });
    setRoles(roles.filter((r) => r.id !== id));
  }

  async function addProject() {
    const p = await api<Project>("/projects", { method: "POST", body: JSON.stringify({ title: "New Project", sortOrder: projects.length }) });
    setProjects([...projects, p]);
  }
  async function saveProject(p: Project) {
    await api("/projects", { method: "PUT", body: JSON.stringify(p) });
    flash();
  }
  async function removeProject(id: number) {
    await api("/projects", { method: "DELETE", body: JSON.stringify({ id }) });
    setProjects(projects.filter((p) => p.id !== id));
  }

  async function addSkill() {
    const s = await api<Skill>("/skills", { method: "POST", body: JSON.stringify({ name: "New Skill", icon: "code", percent: 70, level: "expertise", category: "Backend", sortOrder: skills.length }) });
    setSkills([...skills, s]);
  }
  async function saveSkill(s: Skill) {
    await api("/skills", { method: "PUT", body: JSON.stringify(s) });
    flash();
  }
  async function removeSkill(id: number) {
    await api("/skills", { method: "DELETE", body: JSON.stringify({ id }) });
    setSkills(skills.filter((s) => s.id !== id));
  }

  async function addEducation() {
    const e = await api<Education>("/education", { method: "POST", body: JSON.stringify({ institution: "New Institution", sortOrder: education.length }) });
    setEducation([...education, e]);
  }
  async function saveEducation(e: Education) {
    await api("/education", { method: "PUT", body: JSON.stringify(e) });
    flash();
  }
  async function removeEducation(id: number) {
    await api("/education", { method: "DELETE", body: JSON.stringify({ id }) });
    setEducation(education.filter((e) => e.id !== id));
  }

  async function addCertificate() {
    const c = await api<Certificate>("/certificates", { method: "POST", body: JSON.stringify({ name: "New Certificate", sortOrder: certificates.length }) });
    setCertificates([...certificates, c]);
  }
  async function saveCertificate(c: Certificate) {
    await api("/certificates", { method: "PUT", body: JSON.stringify(c) });
    flash();
  }
  async function removeCertificate(id: number) {
    await api("/certificates", { method: "DELETE", body: JSON.stringify({ id }) });
    setCertificates(certificates.filter((c) => c.id !== id));
  }

  async function addReview() {
    const r = await api<Review>("/reviews", { method: "POST", body: JSON.stringify({ clientName: "New Client", rating: 5, sortOrder: reviews.length }) });
    setReviews([...reviews, r]);
  }
  async function saveReview(r: Review) {
    await api("/reviews", { method: "PUT", body: JSON.stringify(r) });
    flash();
  }
  async function removeReview(id: number) {
    await api("/reviews", { method: "DELETE", body: JSON.stringify({ id }) });
    setReviews(reviews.filter((r) => r.id !== id));
  }

  async function addTermInfo() {
    const t = await api<TermInfo>("/terminal-info", { method: "POST", body: JSON.stringify({ key: "new_key", label: "New Key", value: "", sortOrder: termInfo.length }) });
    setTermInfo([...termInfo, t]);
  }
  async function saveTermInfo(t: TermInfo) {
    await api("/terminal-info", { method: "PUT", body: JSON.stringify(t) });
    flash();
  }
  async function removeTermInfo(id: number) {
    await api("/terminal-info", { method: "DELETE", body: JSON.stringify({ id }) });
    setTermInfo(termInfo.filter((t) => t.id !== id));
  }

  // ─── Login screen ─────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="terminal-window bg-surface-container-lowest p-8 rounded-lg w-full max-w-md font-code-sm">
          <h1 className="text-primary text-lg mb-4">PORTFOLIO ADMIN</h1>
          <div className="text-on-surface-variant mb-6">Enter password to continue:</div>
          <input type="password" className="w-full bg-surface border border-outline-variant rounded p-3 text-primary focus:border-primary outline-none mb-4"
            placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()} />
          <button onClick={login} className="w-full py-3 bg-primary text-on-primary font-bold rounded hover:bg-primary-fixed transition-colors">AUTHENTICATE</button>
          {password && password !== (process.env.NEXT_PUBLIC_ADMIN_PASS || "admin123") && (
            <div className="text-error mt-4 text-sm">ACCESS DENIED</div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-code-sm cursor-blink">Loading database...</div>
      </div>
    );
  }

  // ─── Input helpers ────────────────────────────────────
  const inp = (label: string, val: string, onChange: (v: string) => void, opts?: { multiline?: boolean; placeholder?: string }) => (
    <div>
      <label className="text-xs text-on-surface-variant mb-1 block">{label}</label>
      {opts?.multiline ? (
        <textarea className="w-full bg-surface border border-outline-variant rounded p-2 text-sm focus:border-primary outline-none min-h-[80px]"
          value={val} onChange={(e) => onChange(e.target.value)} placeholder={opts.placeholder} />
      ) : (
        <input className="w-full bg-surface border border-outline-variant rounded p-2 text-sm focus:border-primary outline-none"
          value={val} onChange={(e) => onChange(e.target.value)} placeholder={opts?.placeholder} />
      )}
    </div>
  );

  const numInp = (label: string, val: number, onChange: (v: number) => void) => (
    <div>
      <label className="text-xs text-on-surface-variant mb-1 block">{label}</label>
      <input type="number" className="w-full bg-surface border border-outline-variant rounded p-2 text-sm focus:border-primary outline-none"
        value={val} onChange={(e) => onChange(parseInt(e.target.value) || 0)} />
    </div>
  );

  const SectionHeader = ({ title, onAdd }: { title: string; onAdd: () => void }) => (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-bold text-primary">{title}</h2>
      <div className="flex gap-2">
        <button onClick={onAdd} className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-bold">+ Add</button>
        <button onClick={flash} className="px-4 py-2 bg-surface-variant text-on-surface rounded text-sm font-bold">Saved</button>
      </div>
    </div>
  );

  const categoryOptions = Array.from(new Set(projects.map((p) => p.category).filter(Boolean))).sort();

  // ─── Tab content ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="bg-surface-container border-b border-outline-variant p-4 flex justify-between items-center">
        <h1 className="font-headline-md text-primary">ADMIN // CMS Dashboard</h1>
        <div className="flex gap-4 items-center">
          <a href="/" className="text-on-surface-variant hover:text-primary text-sm">View Site</a>
          {saved && <span className="text-primary text-sm">Saved!</span>}
        </div>
      </header>

      <div className="flex">
        <nav className="w-52 bg-surface-container-low border-r border-outline-variant p-3 space-y-1">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`w-full text-left px-3 py-2 rounded text-sm font-bold transition-colors flex items-center gap-2 ${
                tab === t.key ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-variant"
              }`}>
              <span className="material-symbols-outlined text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 p-8 max-w-5xl overflow-y-auto" style={{ maxHeight: "calc(100vh - 64px)" }}>
          {/* ─── Profile ──────────────────────────────── */}
          {tab === "profile" && profile && (
            <div className="space-y-4">
              <SectionHeader title="Profile Settings" onAdd={saveProfile} />
              <div className="grid grid-cols-2 gap-4">
                {inp("Full Name", profile.name, (v) => setProfile({ ...profile, name: v }))}
                {inp("Short Name", profile.shortName, (v) => setProfile({ ...profile, shortName: v }))}
                {inp("Header Name", profile.headerName, (v) => setProfile({ ...profile, headerName: v }))}
                {inp("Terminal Prompt", profile.terminalPrompt, (v) => setProfile({ ...profile, terminalPrompt: v }))}
                {inp("Terminal User", profile.terminalUser, (v) => setProfile({ ...profile, terminalUser: v }))}
                {inp("Status Label", profile.statusLabel, (v) => setProfile({ ...profile, statusLabel: v }))}
              </div>
              {inp("Tagline", profile.tagline, (v) => setProfile({ ...profile, tagline: v }))}
              {inp("Bio", profile.bio, (v) => setProfile({ ...profile, bio: v }), { multiline: true })}
              {inp("About (JSON array)", profile.about, (v) => setProfile({ ...profile, about: v }), { multiline: true, placeholder: '["Line 1", "Line 2"]' })}
              {inp("Core Principles (JSON array)", profile.corePrinciples, (v) => setProfile({ ...profile, corePrinciples: v }), { multiline: true, placeholder: '["Principle 1", "Principle 2"]' })}
              <div className="grid grid-cols-2 gap-4">
                {inp("Profile Image URL", profile.profileImage, (v) => setProfile({ ...profile, profileImage: v }))}
                {inp("About Image URL", profile.aboutImage, (v) => setProfile({ ...profile, aboutImage: v }))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {inp("GitHub URL", profile.github, (v) => setProfile({ ...profile, github: v }))}
                {inp("LinkedIn URL", profile.linkedin, (v) => setProfile({ ...profile, linkedin: v }))}
                {inp("Twitter URL", profile.twitter, (v) => setProfile({ ...profile, twitter: v }))}
                {inp("Email", profile.email, (v) => setProfile({ ...profile, email: v }))}
              </div>
              {inp("Footer Text", profile.footerText, (v) => setProfile({ ...profile, footerText: v }))}
            </div>
          )}

          {/* ─── Roles ────────────────────────────────── */}
          {tab === "roles" && (
            <div className="space-y-4">
              <SectionHeader title="Roles / Titles (Typewriter)" onAdd={addRole} />
              <p className="text-on-surface-variant text-sm mb-4">These cycle through with a glitch typewriter effect on the hero section.</p>
              {roles.map((r) => (
                <div key={r.id} className="bg-surface border border-outline-variant rounded p-4 flex gap-4 items-end">
                  <div className="flex-1">{inp("Role Title", r.title, (v) => { const n = [...roles]; n[roles.indexOf(r)] = { ...r, title: v }; setRoles(n); })}</div>
                  <div className="w-20">{numInp("Order", r.sortOrder, (v) => { const n = [...roles]; n[roles.indexOf(r)] = { ...r, sortOrder: v }; setRoles(n); })}</div>
                  <div className="flex gap-2 pb-1">
                    <button onClick={() => saveRole(r)} className="text-primary text-xs hover:underline">Save</button>
                    <button onClick={() => removeRole(r.id)} className="text-error text-xs hover:underline">Del</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Terminal Info ────────────────────────── */}
          {tab === "terminal" && (
            <div className="space-y-4">
              <SectionHeader title="Terminal Info Fields" onAdd={addTermInfo} />
              <p className="text-on-surface-variant text-sm mb-4">These values appear in the hero terminal block and can be edited here at any time.</p>
              {termInfo.map((t) => (
                <div key={t.id} className="bg-surface border border-outline-variant rounded p-4 grid grid-cols-[1fr_1fr_2fr_80px] gap-3 items-end">
                  <div>{inp("Key", t.key, (v) => { const n = [...termInfo]; n[termInfo.indexOf(t)] = { ...t, key: v }; setTermInfo(n); })}</div>
                  <div>{inp("Label", t.label, (v) => { const n = [...termInfo]; n[termInfo.indexOf(t)] = { ...t, label: v }; setTermInfo(n); })}</div>
                  <div>{inp("Value", t.value, (v) => { const n = [...termInfo]; n[termInfo.indexOf(t)] = { ...t, value: v }; setTermInfo(n); })}</div>
                  <div className="flex gap-2 pb-1">
                    <button onClick={() => saveTermInfo(t)} className="text-primary text-xs hover:underline">Save</button>
                    <button onClick={() => removeTermInfo(t.id)} className="text-error text-xs hover:underline">Del</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Projects ─────────────────────────────── */}
          {tab === "projects" && (
            <div className="space-y-4">
              <SectionHeader title="Projects" onAdd={addProject} />
              {projects.map((p) => (
                <details key={p.id} className="bg-surface border border-outline-variant rounded">
                  <summary className="p-4 cursor-pointer flex justify-between items-center hover:bg-surface-variant">
                    <span className="font-bold text-primary">{p.title}</span>
                    <div className="flex gap-3">
                      <button onClick={(e) => { e.stopPropagation(); saveProject(p); }} className="text-primary text-xs hover:underline">Save</button>
                      <button onClick={(e) => { e.stopPropagation(); removeProject(p.id); }} className="text-error text-xs hover:underline">Delete</button>
                    </div>
                  </summary>
                  <div className="p-4 space-y-3 border-t border-outline-variant">
                    <div className="grid grid-cols-2 gap-3">
                      {inp("Title", p.title, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, title: v }; setProjects(n); })}
                      <div>
                        <label className="text-xs text-on-surface-variant mb-1 block">Category</label>
                        <input
                          list="project-categories"
                          className="w-full bg-surface border border-outline-variant rounded p-2 text-sm focus:border-primary outline-none"
                          value={p.category}
                          onChange={(e) => {
                            const n = [...projects];
                            n[projects.indexOf(p)] = { ...p, category: e.target.value };
                            setProjects(n);
                          }}
                          placeholder="Select or create a category"
                        />
                        <datalist id="project-categories">
                          {categoryOptions.map((category) => (
                            <option key={category} value={category} />
                          ))}
                        </datalist>
                      </div>
                    </div>
                    {inp("Description", p.description, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, description: v }; setProjects(n); })}
                    {inp("Long Description", p.longDescription, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, longDescription: v }; setProjects(n); }, { multiline: true })}
                    <div className="grid grid-cols-2 gap-3">
                      {inp("Stack (comma-sep)", p.stack, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, stack: v }; setProjects(n); })}
                      {inp("Tags (comma-sep)", p.tags, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, tags: v }; setProjects(n); })}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {inp("Live URL", p.liveUrl, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, liveUrl: v }; setProjects(n); })}
                      {inp("Source URL", p.sourceUrl, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, sourceUrl: v }; setProjects(n); })}
                    </div>
                    {inp("Image URL", p.image, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, image: v }; setProjects(n); })}
                    <div className="grid grid-cols-3 gap-3">
                      {inp("Terminal Type", p.terminalType, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, terminalType: v }; setProjects(n); })}
                      {inp("Terminal Script", p.terminalScript, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, terminalScript: v }; setProjects(n); })}
                      {inp("Grid Span (4/8/12)", p.gridSpan, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, gridSpan: v }; setProjects(n); })}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}

          {/* ─── Skills ───────────────────────────────── */}
          {tab === "skills" && (
            <div className="space-y-4">
              <SectionHeader title="Skills" onAdd={addSkill} />
              {skills.map((s) => (
                <div key={s.id} className="bg-surface border border-outline-variant rounded p-4 space-y-3">
                  <div className="grid grid-cols-[1fr_1fr_100px_120px_120px] gap-3 items-end">
                    <div>{inp("Name", s.name, (v) => { const n = [...skills]; n[skills.indexOf(s)] = { ...s, name: v }; setSkills(n); })}</div>
                    <div>{inp("Icon (Material)", s.icon, (v) => { const n = [...skills]; n[skills.indexOf(s)] = { ...s, icon: v }; setSkills(n); })}</div>
                    <div>{numInp("Percent", s.percent, (v) => { const n = [...skills]; n[skills.indexOf(s)] = { ...s, percent: v }; setSkills(n); })}</div>
                    <div>{inp("Level", s.level, (v) => { const n = [...skills]; n[skills.indexOf(s)] = { ...s, level: v }; setSkills(n); })}</div>
                    <div>{inp("Category", s.category, (v) => { const n = [...skills]; n[skills.indexOf(s)] = { ...s, category: v }; setSkills(n); })}</div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => saveSkill(s)} className="text-primary text-xs hover:underline">Save</button>
                    <button onClick={() => removeSkill(s.id)} className="text-error text-xs hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Education ────────────────────────────── */}
          {tab === "education" && (
            <div className="space-y-4">
              <SectionHeader title="Education" onAdd={addEducation} />
              {education.map((e) => (
                <details key={e.id} className="bg-surface border border-outline-variant rounded">
                  <summary className="p-4 cursor-pointer flex justify-between items-center hover:bg-surface-variant">
                    <span className="font-bold text-primary">{e.institution}</span>
                    <div className="flex gap-3">
                      <button onClick={(ev) => { ev.stopPropagation(); saveEducation(e); }} className="text-primary text-xs hover:underline">Save</button>
                      <button onClick={(ev) => { ev.stopPropagation(); removeEducation(e.id); }} className="text-error text-xs hover:underline">Delete</button>
                    </div>
                  </summary>
                  <div className="p-4 space-y-3 border-t border-outline-variant">
                    <div className="grid grid-cols-2 gap-3">
                      {inp("Institution", e.institution, (v) => { const n = [...education]; n[education.indexOf(e)] = { ...e, institution: v }; setEducation(n); })}
                      {inp("Degree", e.degree, (v) => { const n = [...education]; n[education.indexOf(e)] = { ...e, degree: v }; setEducation(n); })}
                    </div>
                    {inp("Field of Study", e.field, (v) => { const n = [...education]; n[education.indexOf(e)] = { ...e, field: v }; setEducation(n); })}
                    <div className="grid grid-cols-2 gap-3">
                      {inp("Start Date", e.startDate, (v) => { const n = [...education]; n[education.indexOf(e)] = { ...e, startDate: v }; setEducation(n); })}
                      {inp("End Date", e.endDate, (v) => { const n = [...education]; n[education.indexOf(e)] = { ...e, endDate: v }; setEducation(n); })}
                    </div>
                    {inp("Description", e.description, (v) => { const n = [...education]; n[education.indexOf(e)] = { ...e, description: v }; setEducation(n); }, { multiline: true })}
                  </div>
                </details>
              ))}
            </div>
          )}

          {/* ─── Certificates ─────────────────────────── */}
          {tab === "certificates" && (
            <div className="space-y-4">
              <SectionHeader title="Certificates" onAdd={addCertificate} />
              {certificates.map((c) => (
                <div key={c.id} className="bg-surface border border-outline-variant rounded p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">{c.name}</span>
                    <div className="flex gap-3">
                      <button onClick={() => saveCertificate(c)} className="text-primary text-xs hover:underline">Save</button>
                      <button onClick={() => removeCertificate(c.id)} className="text-error text-xs hover:underline">Delete</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {inp("Name", c.name, (v) => { const n = [...certificates]; n[certificates.indexOf(c)] = { ...c, name: v }; setCertificates(n); })}
                    {inp("Issuer", c.issuer, (v) => { const n = [...certificates]; n[certificates.indexOf(c)] = { ...c, issuer: v }; setCertificates(n); })}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {inp("Date", c.date, (v) => { const n = [...certificates]; n[certificates.indexOf(c)] = { ...c, date: v }; setCertificates(n); })}
                    {inp("URL", c.url, (v) => { const n = [...certificates]; n[certificates.indexOf(c)] = { ...c, url: v }; setCertificates(n); })}
                  </div>
                  {inp("Image URL", c.image, (v) => { const n = [...certificates]; n[certificates.indexOf(c)] = { ...c, image: v }; setCertificates(n); })}
                </div>
              ))}
            </div>
          )}

          {/* ─── Reviews ──────────────────────────────── */}
          {tab === "reviews" && (
            <div className="space-y-4">
              <SectionHeader title="Client Reviews" onAdd={addReview} />
              {reviews.map((r) => (
                <details key={r.id} className="bg-surface border border-outline-variant rounded">
                  <summary className="p-4 cursor-pointer flex justify-between items-center hover:bg-surface-variant">
                    <span className="font-bold text-primary">{r.clientName} {r.company && `@ ${r.company}`}</span>
                    <div className="flex gap-3">
                      <button onClick={(e) => { e.stopPropagation(); saveReview(r); }} className="text-primary text-xs hover:underline">Save</button>
                      <button onClick={(e) => { e.stopPropagation(); removeReview(r.id); }} className="text-error text-xs hover:underline">Delete</button>
                    </div>
                  </summary>
                  <div className="p-4 space-y-3 border-t border-outline-variant">
                    <div className="grid grid-cols-3 gap-3">
                      {inp("Client Name", r.clientName, (v) => { const n = [...reviews]; n[reviews.indexOf(r)] = { ...r, clientName: v }; setReviews(n); })}
                      {inp("Company", r.company, (v) => { const n = [...reviews]; n[reviews.indexOf(r)] = { ...r, company: v }; setReviews(n); })}
                      {numInp("Rating (1-5)", r.rating, (v) => { const n = [...reviews]; n[reviews.indexOf(r)] = { ...r, rating: Math.min(5, Math.max(1, v)) }; setReviews(n); })}
                    </div>
                    {inp("Review Text", r.text, (v) => { const n = [...reviews]; n[reviews.indexOf(r)] = { ...r, text: v }; setReviews(n); }, { multiline: true })}
                    {inp("Date", r.date, (v) => { const n = [...reviews]; n[reviews.indexOf(r)] = { ...r, date: v }; setReviews(n); })}
                  </div>
                </details>
              ))}
            </div>
          )}

          {/* ─── Resume ───────────────────────────────── */}
          {tab === "resume" && profile && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary mb-6">Resume / CV</h2>
              <p className="text-on-surface-variant text-sm mb-4">Provide either a URL link or upload a file. Only one will be active at a time.</p>
              {inp("Resume URL (Google Drive, Dropbox, etc.)", profile.resumeUrl, (v) => setProfile({ ...profile, resumeUrl: v }))}
              {profile.resumeFile && (
                <div className="bg-surface border border-outline-variant rounded p-3 flex justify-between items-center">
                  <span className="text-sm text-on-surface">Current file: {profile.resumeFile}</span>
                  <button onClick={() => setProfile({ ...profile, resumeFile: "" })} className="text-error text-xs hover:underline">Remove</button>
                </div>
              )}
              <div>
                <label className="text-xs text-on-surface-variant mb-1 block">Upload PDF</label>
                <input type="file" accept=".pdf,.doc,.docx" className="text-sm text-on-surface-variant" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append("file", file);
                  const res = await fetch("/api/resume", { method: "POST", body: fd });
                  const data = await res.json();
                  if (data.ok) { setProfile({ ...profile, resumeFile: data.filename, resumeUrl: "" }); flash(); }
                }} />
              </div>
              <button onClick={saveProfile} className="px-6 py-2 bg-primary text-on-primary rounded text-sm font-bold">Save Resume Settings</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
