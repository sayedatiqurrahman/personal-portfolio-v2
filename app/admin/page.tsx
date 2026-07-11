"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

type Tab = "profile" | "roles" | "projects" | "skills" | "categories" | "terminal" | "education" | "certificates" | "achievements" | "reviews" | "resume";

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
  tags: string; image: string; liveUrl: string; sourceUrl: string; gridSpan: string; featured: number; sortOrder: number; status: string; }
interface Skill { id: number; name: string; icon: string; percent: number; level: string; category: string; sortOrder: number; }
interface Education { id: number; institution: string; degree: string; field: string;
  startDate: string; endDate: string; description: string; sortOrder: number; }
interface Certificate { id: number; name: string; issuer: string; date: string; url: string; image: string; gridSpan: string; sortOrder: number; }
interface Achievement { id: number; title: string; issuer: string; date: string; description: string; url: string; image: string; sortOrder: number; }
interface Review { id: number; clientName: string; company: string; rating: number; text: string; date: string; sortOrder: number; }
interface TermInfo { id: number; key: string; label: string; value: string; sortOrder: number; }
interface Category { id: number; name: string; type: string; sortOrder: number; }

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "profile", label: "Profile", icon: "person" },
  { key: "roles", label: "Roles", icon: "badge" },
  { key: "terminal", label: "Terminal Info", icon: "terminal" },
  { key: "projects", label: "Projects", icon: "folder" },
  { key: "skills", label: "Skills", icon: "psychology" },
  { key: "categories", label: "Categories", icon: "category" },
  { key: "education", label: "Education", icon: "school" },
  { key: "certificates", label: "Certificates", icon: "workspace_premium" },
  { key: "achievements", label: "Achievements", icon: "emoji_events" },
  { key: "reviews", label: "Reviews", icon: "rate_review" },
  { key: "resume", label: "Resume", icon: "description" },
];

async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...opts,
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
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
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [termInfo, setTermInfo] = useState<TermInfo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [projectSearch, setProjectSearch] = useState("");
  const [projectCategory, setProjectCategory] = useState("All");
  const [projectPage, setProjectPage] = useState(1);
  const projectPerPage = 10;

  const [stackPickerOpen, setStackPickerOpen] = useState<number | null>(null);
  const [stackSearch, setStackSearch] = useState("");
  const [newSkillMode, setNewSkillMode] = useState<"" | "confirm" | "form">("");
  const [newSkillLevel, setNewSkillLevel] = useState("comfortable");
  const [newSkillCategory, setNewSkillCategory] = useState("");
  const [newSkillIcon, setNewSkillIcon] = useState("code");
  const stackRef = useRef<HTMLDivElement>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const settle = <T,>(p: Promise<T>, fallback: T) => p.catch(() => fallback);
    const [p, r, pr, s, e, c, a, rev, t, cat] = await Promise.all([
      settle(api<Profile>("/profile"), null),
      settle(api<Role[]>("/roles"), []),
      settle(api<Project[]>("/projects"), []),
      settle(api<Skill[]>("/skills"), []),
      settle(api<Education[]>("/education"), []),
      settle(api<Certificate[]>("/certificates"), []),
      settle(api<Achievement[]>("/achievements"), []),
      settle(api<Review[]>("/reviews"), []),
      settle(api<TermInfo[]>("/terminal-info"), []),
      settle(api<Category[]>("/categories"), []),
    ]);
    setProfile(p); setRoles(r); setProjects(pr); setSkills(s);
    setEducation(e); setCertificates(c); setAchievements(a); setReviews(rev); setTermInfo(t); setCategories(cat);
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) loadAll(); }, [authed, loadAll]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (stackRef.current && !stackRef.current.contains(e.target as Node)) setStackPickerOpen(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const login = () => {
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123")) setAuthed(true);
  };

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  // ─── Generic CRUD helpers ─────────────────────────────
  async function saveProfile() {
    if (!profile) return;
    try {
      const updated = await api<Profile>("/profile", { method: "PUT", body: JSON.stringify(profile) });
      if (updated) setProfile(updated);
      flash();
    } catch (e) { alert("Failed to save profile: " + e); }
  }

  async function addRole() {
    try {
      await api<Role>("/roles", { method: "POST", body: JSON.stringify({ title: "New Role", sortOrder: roles.length }) });
      setRoles(await api<Role[]>("/roles"));
    } catch (e) { alert("Failed to add role: " + e); }
  }
  async function saveRole(r: Role) {
    try {
      await api("/roles", { method: "PUT", body: JSON.stringify(r) });
      setRoles(await api<Role[]>("/roles"));
      flash();
    } catch (e) { alert("Failed to save role: " + e); }
  }
  async function removeRole(id: number) {
    try {
      await api("/roles", { method: "DELETE", body: JSON.stringify({ id }) });
      setRoles(await api<Role[]>("/roles"));
    } catch (e) { alert("Failed to delete role: " + e); }
  }

  async function addProject() {
    try {
      await api<Project>("/projects", { method: "POST", body: JSON.stringify({ title: "New Project", sortOrder: projects.length }) });
      setProjects(await api<Project[]>("/projects"));
    } catch (e) { alert("Failed to add project: " + e); }
  }
  async function saveProject(p: Project) {
    try {
      await api("/projects", { method: "PUT", body: JSON.stringify(p) });
      setProjects(await api<Project[]>("/projects"));
      flash();
    } catch (e) { alert("Failed to save project: " + e); }
  }
  async function removeProject(id: number) {
    try {
      await api("/projects", { method: "DELETE", body: JSON.stringify({ id }) });
      setProjects(await api<Project[]>("/projects"));
    } catch (e) { alert("Failed to delete project: " + e); }
  }

  async function addSkill() {
    try {
      const firstCat = categories.filter(c => c.type === "skill")[0]?.name || "";
      await api<Skill>("/skills", { method: "POST", body: JSON.stringify({ name: "New Skill", icon: "code", percent: 70, level: "expertise", category: firstCat, sortOrder: skills.length }) });
      setSkills(await api<Skill[]>("/skills"));
    } catch (e) { alert("Failed to add skill: " + e); }
  }
  async function saveSkill(s: Skill) {
    try {
      await api("/skills", { method: "PUT", body: JSON.stringify(s) });
      setSkills(await api<Skill[]>("/skills"));
      flash();
    } catch (e) { alert("Failed to save skill: " + e); }
  }
  async function removeSkill(id: number) {
    try {
      await api("/skills", { method: "DELETE", body: JSON.stringify({ id }) });
      setSkills(await api<Skill[]>("/skills"));
    } catch (e) { alert("Failed to delete skill: " + e); }
  }

  async function addEducation() {
    try {
      await api<Education>("/education", { method: "POST", body: JSON.stringify({ institution: "New Institution", sortOrder: education.length }) });
      setEducation(await api<Education[]>("/education"));
    } catch (e) { alert("Failed to add education: " + e); }
  }
  async function saveEducation(e: Education) {
    try {
      await api("/education", { method: "PUT", body: JSON.stringify(e) });
      setEducation(await api<Education[]>("/education"));
      flash();
    } catch (e) { alert("Failed to save education: " + e); }
  }
  async function removeEducation(id: number) {
    try {
      await api("/education", { method: "DELETE", body: JSON.stringify({ id }) });
      setEducation(await api<Education[]>("/education"));
    } catch (e) { alert("Failed to delete education: " + e); }
  }

  async function addCertificate() {
    try {
      await api<Certificate>("/certificates", { method: "POST", body: JSON.stringify({ name: "New Certificate", sortOrder: certificates.length }) });
      setCertificates(await api<Certificate[]>("/certificates"));
    } catch (e) { alert("Failed to add certificate: " + e); }
  }
  async function saveCertificate(c: Certificate) {
    try {
      await api("/certificates", { method: "PUT", body: JSON.stringify(c) });
      setCertificates(await api<Certificate[]>("/certificates"));
      flash();
    } catch (e) { alert("Failed to save certificate: " + e); }
  }
  async function removeCertificate(id: number) {
    try {
      await api("/certificates", { method: "DELETE", body: JSON.stringify({ id }) });
      setCertificates(await api<Certificate[]>("/certificates"));
    } catch (e) { alert("Failed to delete certificate: " + e); }
  }

  async function addAchievement() {
    try {
      await api<Achievement>("/achievements", { method: "POST", body: JSON.stringify({ title: "New Achievement", sortOrder: achievements.length }) });
      setAchievements(await api<Achievement[]>("/achievements"));
    } catch (e) { alert("Failed to add achievement: " + e); }
  }
  async function saveAchievement(a: Achievement) {
    try {
      await api("/achievements", { method: "PUT", body: JSON.stringify(a) });
      setAchievements(await api<Achievement[]>("/achievements"));
      flash();
    } catch (e) { alert("Failed to save achievement: " + e); }
  }
  async function removeAchievement(id: number) {
    try {
      await api("/achievements", { method: "DELETE", body: JSON.stringify({ id }) });
      setAchievements(await api<Achievement[]>("/achievements"));
    } catch (e) { alert("Failed to delete achievement: " + e); }
  }

  async function addReview() {
    try {
      await api<Review>("/reviews", { method: "POST", body: JSON.stringify({ clientName: "New Client", rating: 5, sortOrder: reviews.length }) });
      setReviews(await api<Review[]>("/reviews"));
    } catch (e) { alert("Failed to add review: " + e); }
  }
  async function saveReview(r: Review) {
    try {
      await api("/reviews", { method: "PUT", body: JSON.stringify(r) });
      setReviews(await api<Review[]>("/reviews"));
      flash();
    } catch (e) { alert("Failed to save review: " + e); }
  }
  async function removeReview(id: number) {
    try {
      await api("/reviews", { method: "DELETE", body: JSON.stringify({ id }) });
      setReviews(await api<Review[]>("/reviews"));
    } catch (e) { alert("Failed to delete review: " + e); }
  }

  async function addTermInfo() {
    try {
      await api<TermInfo>("/terminal-info", { method: "POST", body: JSON.stringify({ key: "new_key", label: "New Key", value: "", sortOrder: termInfo.length }) });
      setTermInfo(await api<TermInfo[]>("/terminal-info"));
    } catch (e) { alert("Failed to add terminal info: " + e); }
  }
  async function saveTermInfo(t: TermInfo) {
    try {
      await api("/terminal-info", { method: "PUT", body: JSON.stringify(t) });
      setTermInfo(await api<TermInfo[]>("/terminal-info"));
      flash();
    } catch (e) { alert("Failed to save terminal info: " + e); }
  }
  async function removeTermInfo(id: number) {
    try {
      await api("/terminal-info", { method: "DELETE", body: JSON.stringify({ id }) });
      setTermInfo(await api<TermInfo[]>("/terminal-info"));
    } catch (e) { alert("Failed to delete terminal info: " + e); }
  }

  async function addCategory(type: string) {
    try {
      await api<Category>("/categories", { method: "POST", body: JSON.stringify({ name: "New Category", type, sortOrder: categories.length }) });
      setCategories(await api<Category[]>("/categories"));
    } catch (e) { alert("Failed to add category: " + e); }
  }
  async function saveCategory(cat: Category) {
    try {
      await api("/categories", { method: "PUT", body: JSON.stringify(cat) });
      setCategories(await api<Category[]>("/categories"));
      flash();
    } catch (e) { alert("Failed to save category: " + e); }
  }
  async function removeCategory(id: number) {
    try {
      await api("/categories", { method: "DELETE", body: JSON.stringify({ id }) });
      setCategories(await api<Category[]>("/categories"));
    } catch (e) { alert("Failed to delete category: " + e); }
  }

  const categoryOptions = Array.from(new Set(projects.map((p) => p.category).filter(Boolean))).sort();
  const projectCategoryNames = categories.filter(c => c.type === "project").map(c => c.name);
  const allProjectCategories = Array.from(new Set([...projectCategoryNames, ...categoryOptions])).sort();

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (projectCategory !== "All") result = result.filter(p => p.category === projectCategory);
    const q = projectSearch.trim().toLowerCase();
    if (q) result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.stack.toLowerCase().includes(q) ||
      p.tags.toLowerCase().includes(q)
    );
    return result;
  }, [projects, projectSearch, projectCategory]);

  const totalProjectPages = Math.max(1, Math.ceil(filteredProjects.length / projectPerPage));
  const visibleProjects = filteredProjects.slice((projectPage - 1) * projectPerPage, projectPage * projectPerPage);

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
          {password && password !== (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123") && (
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

  // ─── Tab content ────────────────────────────────────── ──────────────────────────────────────
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-primary">Profile Settings</h2>
                <button onClick={saveProfile} className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-bold">Save Changes</button>
              </div>
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
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-primary">Projects</h2>
                <button onClick={addProject} className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-bold">+ Add Project</button>
              </div>

              <div className="flex gap-3">
                <input type="search" placeholder="Search projects..." value={projectSearch}
                  onChange={(e) => { setProjectSearch(e.target.value); setProjectPage(1); }}
                  className="flex-1 bg-surface border border-outline-variant rounded p-2 text-sm focus:border-primary outline-none" />
                <select value={projectCategory} onChange={(e) => { setProjectCategory(e.target.value); setProjectPage(1); }}
                  className="bg-surface border border-outline-variant rounded p-2 text-sm focus:border-primary outline-none">
                  <option value="All">All Categories</option>
                  {allProjectCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="text-sm text-on-surface-variant flex justify-between">
                <span>{filteredProjects.length} project{filteredProjects.length === 1 ? "" : "s"}</span>
                {totalProjectPages > 1 && <span>Page {projectPage} of {totalProjectPages}</span>}
              </div>

              {visibleProjects.map((p) => (
                <details key={p.id} className="bg-surface border border-outline-variant rounded">
                  <summary className="p-4 cursor-pointer flex justify-between items-center hover:bg-surface-variant">
                    <span className="font-bold text-primary">
                      {p.featured > 0 && <span className="text-secondary mr-2">★{p.featured}</span>}
                      {p.title}
                    </span>
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
                        <select
                          className="w-full bg-surface border border-outline-variant rounded p-2 text-sm focus:border-primary outline-none"
                          value={allProjectCategories.includes(p.category) ? p.category : ""}
                          onChange={(e) => {
                            const n = [...projects];
                            n[projects.indexOf(p)] = { ...p, category: e.target.value };
                            setProjects(n);
                          }}
                        >
                          <option value="">Select Category</option>
                          {allProjectCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {inp("Description", p.description, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, description: v }; setProjects(n); })}
                    {inp("Long Description", p.longDescription, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, longDescription: v }; setProjects(n); }, { multiline: true })}
                    <div className="grid grid-cols-2 gap-3">
                      <div ref={stackRef} className="relative">
                        <label className="text-xs text-on-surface-variant mb-1 block">Stack (Skills)</label>
                        {(() => { const arr: string[] = (() => { try { return JSON.parse(p.stack); } catch { return []; } })(); return arr.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {arr.map((name: string) => (
                              <span key={name} className="inline-flex items-center gap-1 bg-primary/20 text-primary rounded px-2 py-0.5 text-xs">
                                {name}
                                <button onClick={() => { const next = arr.filter(x => x !== name); const n = [...projects]; n[projects.indexOf(p)] = { ...p, stack: JSON.stringify(next) }; setProjects(n); }} className="text-error hover:text-error/80 font-bold">×</button>
                              </span>
                            ))}
                          </div>
                        ); })()}
                        <input
                          className="w-full bg-surface border border-outline-variant rounded p-2 text-sm focus:border-primary outline-none"
                          placeholder="Type to search or add a skill..."
                          value={stackSearch}
                          onFocus={() => { setStackPickerOpen(p.id); setNewSkillMode(""); }}
                          onChange={(e) => { setStackSearch(e.target.value); setNewSkillMode(""); setStackPickerOpen(p.id); }}
                        />
                        {stackPickerOpen === p.id && (
                          <div className="absolute z-50 mt-1 w-full bg-surface-container-lowest border border-outline-variant rounded shadow-lg max-h-52 overflow-y-auto">
                            {skills.filter(s => s.name.toLowerCase().includes(stackSearch.toLowerCase())).slice(0, 20).map(sk => {
                              const selected: string[] = (() => { try { return JSON.parse(p.stack); } catch { return []; } })();
                              const isSelected = selected.includes(sk.name);
                              return (
                                <div key={sk.id}
                                  className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-2 ${isSelected ? "bg-primary/10 text-primary" : "hover:bg-surface-variant text-on-surface"}`}
                                  onClick={() => {
                                    const next = isSelected ? selected.filter(x => x !== sk.name) : [...selected, sk.name];
                                    const n = [...projects]; n[projects.indexOf(p)] = { ...p, stack: JSON.stringify(next) }; setProjects(n);
                                    setStackSearch("");
                                  }}
                                >
                                  <span className="material-symbols-outlined text-base">{sk.icon}</span>
                                  <span className="flex-1">{sk.name}</span>
                                  {isSelected && <span className="material-symbols-outlined text-base text-primary">check</span>}
                                </div>
                              );
                            })}
                            {stackSearch && !skills.some(s => s.name.toLowerCase() === stackSearch.toLowerCase()) && (
                              <div className="border-t border-outline-variant">
                                {newSkillMode === "" && (
                                  <div className="px-3 py-2 text-sm cursor-pointer text-secondary hover:bg-surface-variant flex items-center gap-2"
                                    onClick={() => setNewSkillMode("confirm")}>
                                    <span className="material-symbols-outlined text-base">add</span>
                                    Save &ldquo;{stackSearch}&rdquo; to skill list?
                                  </div>
                                )}
                                {newSkillMode === "confirm" && (
                                  <div className="p-3 space-y-2 bg-surface">
                                    <div className="text-sm text-on-surface">Save <strong className="text-primary">&ldquo;{stackSearch}&rdquo;</strong> to your skill list?</div>
                                    <div className="flex gap-2">
                                      <button className="px-3 py-1.5 bg-primary text-on-primary rounded text-xs font-bold" onClick={() => {
                                        setNewSkillCategory(categories.filter(c => c.type === "skill")[0]?.name || "");
                                        setNewSkillIcon("code");
                                        setNewSkillLevel("comfortable");
                                        setNewSkillMode("form");
                                      }}>Yes, add it</button>
                                      <button className="px-3 py-1.5 bg-surface-variant text-on-surface rounded text-xs" onClick={() => setNewSkillMode("")}>Cancel</button>
                                    </div>
                                  </div>
                                )}
                                {newSkillMode === "form" && (
                                  <div className="p-3 space-y-2 bg-surface">
                                    <div className="text-xs text-on-surface-variant font-bold">New Skill: {stackSearch}</div>
                                    <div>
                                      <label className="text-xs text-on-surface-variant mb-1 block">Icon (Material)</label>
                                      <input className="w-full bg-surface border border-outline-variant rounded p-2 text-sm focus:border-primary outline-none"
                                        value={newSkillIcon} onChange={(e) => setNewSkillIcon(e.target.value)} placeholder="e.g. code, javascript, dns" />
                                    </div>
                                    <div>
                                      <label className="text-xs text-on-surface-variant mb-1 block">Level</label>
                                      <select className="w-full bg-surface border border-outline-variant rounded p-2 text-sm" value={newSkillLevel}
                                        onChange={(e) => setNewSkillLevel(e.target.value)}>
                                        <option value="expertise">Expertise (95%)</option>
                                        <option value="comfortable">Comfortable (75%)</option>
                                        <option value="familiar">Familiar (55%)</option>
                                        <option value="learning">Learning (35%)</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="text-xs text-on-surface-variant mb-1 block">Category</label>
                                      <select className="w-full bg-surface border border-outline-variant rounded p-2 text-sm" value={newSkillCategory}
                                        onChange={(e) => setNewSkillCategory(e.target.value)}>
                                        <option value="">Select Category</option>
                                        {categories.filter(c => c.type === "skill").map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                      </select>
                                    </div>
                                    <div className="flex gap-2">
                                      <button className="px-3 py-1.5 bg-primary text-on-primary rounded text-xs font-bold" onClick={async () => {
                                        const pctMap: Record<string, number> = { expertise: 95, comfortable: 75, familiar: 55, learning: 35 };
                                        const created = await api<Skill>("/skills", { method: "POST", body: JSON.stringify({ name: stackSearch, icon: newSkillIcon || "code", percent: pctMap[newSkillLevel] ?? 70, level: newSkillLevel, category: newSkillCategory, sortOrder: skills.length }) });
                                        if (created) {
                                          setSkills(await api<Skill[]>("/skills"));
                                          const arr: string[] = (() => { try { return JSON.parse(p.stack); } catch { return []; } })();
                                          const n = [...projects]; n[projects.indexOf(p)] = { ...p, stack: JSON.stringify([...arr, stackSearch]) }; setProjects(n);
                                          setStackSearch(""); setNewSkillMode(""); setStackPickerOpen(null);
                                        }
                                      }}>Save & Select</button>
                                      <button className="px-3 py-1.5 bg-surface-variant text-on-surface rounded text-xs" onClick={() => setNewSkillMode("")}>Cancel</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {!stackSearch && skills.length === 0 && (
                              <div className="px-3 py-2 text-sm text-on-surface-variant italic">No skills yet. Type a name to create one.</div>
                            )}
                          </div>
                        )}
                      </div>
                      {inp("Tags (comma-sep)", p.tags, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, tags: v }; setProjects(n); })}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {inp("Live URL", p.liveUrl, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, liveUrl: v }; setProjects(n); })}
                      {inp("Source URL", p.sourceUrl, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, sourceUrl: v }; setProjects(n); })}
                    </div>
                    {inp("Image URL", p.image, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, image: v }; setProjects(n); })}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-on-surface-variant mb-1 block">Status</label>
                        <select
                          className="w-full bg-surface border border-outline-variant rounded p-2 text-sm focus:border-primary outline-none"
                          value={p.status}
                          onChange={(e) => {
                            const n = [...projects];
                            n[projects.indexOf(p)] = { ...p, status: e.target.value };
                            setProjects(n);
                          }}
                        >
                          <option value="finished">Finished</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="staging">Staging</option>
                          <option value="failed/cancelled">Failed / Cancelled</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {inp("Grid Span (4/6/8/12)", p.gridSpan, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, gridSpan: v }; setProjects(n); })}
                        {numInp("Featured (0=no, >0=pos)", p.featured, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, featured: Math.max(0, v) }; setProjects(n); })}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {inp("Terminal Type", p.terminalType, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, terminalType: v }; setProjects(n); })}
                      {inp("Terminal Script", p.terminalScript, (v) => { const n = [...projects]; n[projects.indexOf(p)] = { ...p, terminalScript: v }; setProjects(n); })}
                    </div>
                  </div>
                </details>
              ))}

              {totalProjectPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button onClick={() => setProjectPage(Math.max(1, projectPage - 1))} disabled={projectPage === 1}
                    className="px-3 py-2 rounded text-sm bg-surface-variant text-on-surface disabled:opacity-50">Prev</button>
                  {Array.from({ length: totalProjectPages }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setProjectPage(n)}
                      className={`w-9 h-9 rounded text-sm ${projectPage === n ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface'}`}>{n}</button>
                  ))}
                  <button onClick={() => setProjectPage(Math.min(totalProjectPages, projectPage + 1))} disabled={projectPage === totalProjectPages}
                    className="px-3 py-2 rounded text-sm bg-surface-variant text-on-surface disabled:opacity-50">Next</button>
                </div>
              )}
            </div>
          )}

          {/* ─── Skills ───────────────────────────────── */}
          {tab === "skills" && (
            <div className="space-y-4">
              <SectionHeader title="Skills" onAdd={() => addSkill()} />
              <p className="text-on-surface-variant text-sm mb-4">Category and percentage are managed automatically. Percentage is set based on level.</p>
              {skills.map((s) => {
                const skillCategories = categories.filter(c => c.type === "skill");
                return (
                  <div key={s.id} className="bg-surface border border-outline-variant rounded p-4 space-y-3">
                    <div className="grid grid-cols-[1fr_1fr_140px_140px] gap-3 items-end">
                      <div>{inp("Name", s.name, (v) => { const n = [...skills]; n[skills.indexOf(s)] = { ...s, name: v }; setSkills(n); })}</div>
                      <div>{inp("Icon (Material)", s.icon, (v) => { const n = [...skills]; n[skills.indexOf(s)] = { ...s, icon: v }; setSkills(n); })}</div>
                      <div>
                        <label className="text-xs text-on-surface-variant mb-1 block">Level</label>
                        <select
                          className="w-full bg-surface border border-outline-variant rounded p-2 text-sm focus:border-primary outline-none"
                          value={s.level}
                          onChange={(e) => {
                            const lvl = e.target.value;
                            const pctMap: Record<string, number> = { expertise: 95, comfortable: 75, familiar: 55, learning: 35 };
                            const n = [...skills]; n[skills.indexOf(s)] = { ...s, level: lvl, percent: pctMap[lvl] ?? 70 }; setSkills(n);
                          }}
                        >
                          <option value="expertise">Expertise (95%)</option>
                          <option value="comfortable">Comfortable (75%)</option>
                          <option value="familiar">Familiar (55%)</option>
                          <option value="learning">Learning (35%)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-on-surface-variant mb-1 block">Category</label>
                        <select
                          className="w-full bg-surface border border-outline-variant rounded p-2 text-sm focus:border-primary outline-none"
                          value={skillCategories.some(c => c.name === s.category) ? s.category : ""}
                          onChange={(e) => {
                            const n = [...skills]; n[skills.indexOf(s)] = { ...s, category: e.target.value }; setSkills(n);
                          }}
                        >
                          <option value="">Select Category</option>
                          {skillCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => saveSkill(s)} className="text-primary text-xs hover:underline">Save</button>
                      <button onClick={() => removeSkill(s.id)} className="text-error text-xs hover:underline">Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── Categories ──────────────────────────── */}
          {tab === "categories" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-primary">Category Management</h2>
              <p className="text-on-surface-variant text-sm">Manage categories for Skills and Projects. These appear as dropdown options in their respective sections.</p>
              {categories.length === 0 && (
                <button onClick={async () => { await api("/categories/seed", { method: "POST" }); setCategories(await api<Category[]>("/categories")); }}
                  className="px-4 py-2 bg-secondary text-on-secondary rounded text-sm font-bold">Load Default Categories</button>
              )}

              {/* Skill Categories */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-bold text-on-surface">Skill Categories</h3>
                  <button onClick={() => addCategory("skill")} className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-bold">+ Add Skill Category</button>
                </div>
                {categories.filter(c => c.type === "skill").map((cat) => (
                  <div key={cat.id} className="bg-surface border border-outline-variant rounded p-4 flex gap-4 items-end mb-2">
                    <div className="flex-1">{inp("Category Name", cat.name, (v) => { const n = [...categories]; n[categories.indexOf(cat)] = { ...cat, name: v }; setCategories(n); })}</div>
                    <div className="w-20">{numInp("Order", cat.sortOrder, (v) => { const n = [...categories]; n[categories.indexOf(cat)] = { ...cat, sortOrder: v }; setCategories(n); })}</div>
                    <div className="flex gap-2 pb-1">
                      <button onClick={() => saveCategory(cat)} className="text-primary text-xs hover:underline">Save</button>
                      <button onClick={() => removeCategory(cat.id)} className="text-error text-xs hover:underline">Del</button>
                    </div>
                  </div>
                ))}
                {categories.filter(c => c.type === "skill").length === 0 && (
                  <p className="text-on-surface-variant text-sm italic">No skill categories yet. Add one to get started.</p>
                )}
              </div>

              <hr className="border-outline-variant" />

              {/* Project Categories */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-bold text-on-surface">Project Categories</h3>
                  <button onClick={() => addCategory("project")} className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-bold">+ Add Project Category</button>
                </div>
                {categories.filter(c => c.type === "project").map((cat) => (
                  <div key={cat.id} className="bg-surface border border-outline-variant rounded p-4 flex gap-4 items-end mb-2">
                    <div className="flex-1">{inp("Category Name", cat.name, (v) => { const n = [...categories]; n[categories.indexOf(cat)] = { ...cat, name: v }; setCategories(n); })}</div>
                    <div className="w-20">{numInp("Order", cat.sortOrder, (v) => { const n = [...categories]; n[categories.indexOf(cat)] = { ...cat, sortOrder: v }; setCategories(n); })}</div>
                    <div className="flex gap-2 pb-1">
                      <button onClick={() => saveCategory(cat)} className="text-primary text-xs hover:underline">Save</button>
                      <button onClick={() => removeCategory(cat.id)} className="text-error text-xs hover:underline">Del</button>
                    </div>
                  </div>
                ))}
                {categories.filter(c => c.type === "project").length === 0 && (
                  <p className="text-on-surface-variant text-sm italic">No project categories yet. Add one to get started.</p>
                )}
              </div>
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
                  <div className="grid grid-cols-2 gap-3">
                    {inp("Image URL", c.image, (v) => { const n = [...certificates]; n[certificates.indexOf(c)] = { ...c, image: v }; setCertificates(n); })}
                    {inp("Sort Order", String(c.sortOrder), (v) => { const n = [...certificates]; n[certificates.indexOf(c)] = { ...c, sortOrder: parseInt(v) || 0 }; setCertificates(n); })}
                  </div>
                  <div>
                    <label className="text-label-caps text-on-surface-variant block mb-1">Grid Span</label>
                    <select
                      className="w-full bg-surface border border-outline-variant rounded p-2 text-sm focus:border-primary outline-none"
                      value={c.gridSpan}
                      onChange={(e) => {
                        const n = [...certificates];
                        n[certificates.indexOf(c)] = { ...c, gridSpan: e.target.value };
                        setCertificates(n);
                      }}
                    >
                      <option value="4">4</option>
                      <option value="6">6</option>
                      <option value="8">8</option>
                      <option value="12">12</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Achievements ──────────────────────────── */}
          {tab === "achievements" && (
            <div className="space-y-4">
              <SectionHeader title="Achievements & Rewards" onAdd={addAchievement} />
              {achievements.map((a) => (
                <div key={a.id} className="bg-surface border border-outline-variant rounded p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">{a.title}</span>
                    <div className="flex gap-3">
                      <button onClick={() => saveAchievement(a)} className="text-primary text-xs hover:underline">Save</button>
                      <button onClick={() => removeAchievement(a.id)} className="text-error text-xs hover:underline">Delete</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {inp("Title", a.title, (v) => { const n = [...achievements]; n[achievements.indexOf(a)] = { ...a, title: v }; setAchievements(n); })}
                    {inp("Issuer", a.issuer, (v) => { const n = [...achievements]; n[achievements.indexOf(a)] = { ...a, issuer: v }; setAchievements(n); })}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {inp("Date", a.date, (v) => { const n = [...achievements]; n[achievements.indexOf(a)] = { ...a, date: v }; setAchievements(n); })}
                    {inp("Verify URL", a.url, (v) => { const n = [...achievements]; n[achievements.indexOf(a)] = { ...a, url: v }; setAchievements(n); })}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {inp("Image URL", a.image, (v) => { const n = [...achievements]; n[achievements.indexOf(a)] = { ...a, image: v }; setAchievements(n); })}
                    {inp("Sort Order", String(a.sortOrder), (v) => { const n = [...achievements]; n[achievements.indexOf(a)] = { ...a, sortOrder: parseInt(v) || 0 }; setAchievements(n); })}
                  </div>
                  {inp("Description", a.description, (v) => { const n = [...achievements]; n[achievements.indexOf(a)] = { ...a, description: v }; setAchievements(n); }, { multiline: true })}
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
