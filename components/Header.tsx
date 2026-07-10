"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types";

export default function Header({ profile }: { profile: Profile }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
      className={`bg-surface/70 backdrop-blur-md border-b border-primary/30 shadow-sm shadow-[0_0_15px_rgba(74,225,118,0.1)] fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
      role="banner"
    >
      <a href="#home" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded">
        Skip to content
      </a>
      <div className="flex justify-between items-center w-full px-6 max-w-container-max mx-auto">
        <div className="font-headline-md text-headline-md font-bold tracking-tighter text-primary transition-all duration-300">
          {profile.terminalPrompt}
        </div>
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
        <div className="flex items-center gap-stack-md">
          <a href="/admin" className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-sm">
            ADMIN
          </a>
        </div>
      </div>
    </header>
  );
}
