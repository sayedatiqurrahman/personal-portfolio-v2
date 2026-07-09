"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types";

export default function Header({ profile }: { profile: Profile }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`bg-surface/70 backdrop-blur-md border-b border-primary/30 shadow-sm shadow-[0_0_15px_rgba(74,225,118,0.1)] fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="flex justify-between items-center w-full px-6 max-w-container-max mx-auto">
        <div className="font-headline-md text-headline-md font-bold tracking-tighter text-primary transition-all duration-300">
          {profile.terminalPrompt}
        </div>
        <nav className="hidden md:flex items-center gap-stack-lg">
          {["Home", "Projects", "Skills", "Education", "Reviews", "About"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-on-surface-variant hover:text-primary transition-colors font-label-caps"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-stack-md">
          <a href="/admin" className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-sm">
            ADMIN
          </a>
        </div>
      </div>
    </header>
  );
}
