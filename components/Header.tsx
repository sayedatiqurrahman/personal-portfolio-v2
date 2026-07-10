"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import type { Profile } from "@/lib/types";
import { useAccent, type Accent } from "./ThemeProvider";

const ACCENTS: { key: Accent; label: string; color: string }[] = [
  { key: "green",   label: "G", color: "#4be277" },
  { key: "yellow",  label: "Y", color: "#eab308" },
  { key: "cyan",    label: "C", color: "#06b6d4" },
  { key: "orange",  label: "O", color: "#f97316" },
  { key: "lime",    label: "L", color: "#84cc16" },
];

export default function Header({ profile }: { profile: Profile }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { accent, setAccent } = useAccent();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Home", href: pathname === "/projects" ? "/#home" : "#home" },
    { label: "Projects", href: pathname === "/projects" ? "/projects" : "#projects" },
    { label: "Skills", href: pathname === "/projects" ? "/#skills" : "#skills" },
    { label: "Education", href: pathname === "/projects" ? "/#education" : "#education" },
    { label: "Reviews", href: pathname === "/projects" ? "/#reviews" : "#reviews" },
    { label: "About", href: pathname === "/projects" ? "/#about" : "#about" },
  ];

  return (
    <header
      className={`bg-surface/70 backdrop-blur-md border-b border-primary/30 shadow-sm fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
      style={{ boxShadow: `0 0 15px rgb(var(--accent) / 0.1)` }}
      role="banner"
    >
      <a href="#home" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded">
        Skip to content
      </a>
      <div className="flex justify-between items-center w-full px-6 max-w-container-max mx-auto">
        <a href="/" className="font-headline-md text-headline-md font-bold tracking-tighter text-primary transition-all duration-300 hover:text-primary-fixed">
          {profile.terminalPrompt}
        </a>
        <nav className="hidden md:flex items-center gap-stack-lg" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-on-surface-variant hover:text-primary transition-colors font-label-caps"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-stack-md relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center"
            aria-label="Switch accent color"
          >
            <span className="material-symbols-outlined text-xl">palette</span>
          </button>
          {open && (
            <div className="absolute top-full right-0 mt-2 bg-surface-container border border-primary/20 rounded p-2 flex gap-1.5 shadow-lg z-50">
              {ACCENTS.map((a) => (
                <button
                  key={a.key}
                  onClick={() => { setAccent(a.key); setOpen(false); }}
                  className={`w-6 h-6 rounded-full transition-all duration-200 hover:scale-125 hover:brightness-125 ${accent === a.key ? "ring-2 ring-white scale-110" : ""}`}
                  style={{ backgroundColor: a.color }}
                  aria-label={`Set ${a.label} accent`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
