"use client";

import { useState, useEffect, useRef } from "react";
import type { Profile, Role, TerminalInfo } from "@/lib/types";

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";

function GlitchTypewriter({ roles }: { roles: Role[] }) {
  const [displayIdx, setDisplayIdx] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!roles.length) return;
    const target = roles[displayIdx]?.title || "";

    if (phase === "typing") {
      if (displayText.length < target.length) {
        const delay = Math.random() * 60 + 30;
        timeoutRef.current = setTimeout(() => {
          const next = displayText.length + 1;
          const chars = target.slice(0, next - 1) + GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          setDisplayText(target.slice(0, next - 1) + target[next - 1]);
          setTimeout(() => setDisplayText(target.slice(0, next)), 40);
        }, delay);
      } else {
        timeoutRef.current = setTimeout(() => setPhase("pause"), 2000);
      }
    } else if (phase === "pause") {
      timeoutRef.current = setTimeout(() => setPhase("deleting"), 500);
    } else if (phase === "deleting") {
      if (displayText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30);
      } else {
        setDisplayIdx((prev) => (prev + 1) % roles.length);
        setPhase("typing");
      }
    }

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayText, phase, displayIdx, roles]);

  const target = roles[displayIdx]?.title || "";

  return (
    <span className="text-primary">
      {displayText}
      <span className="cursor-blink" />
    </span>
  );
}

export default function Hero({ profile, roles, terminalInfo }: { profile: Profile; roles: Role[]; terminalInfo: TerminalInfo[] }) {
  return (
    <section className="max-w-container-max mx-auto px-6 py-section-padding" id="hero">
      {/* Terminal Mode */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="terminal-window bg-surface-container-lowest rounded-lg overflow-hidden font-code-sm">
          <div className="bg-surface-variant px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-label-caps text-on-surface-variant opacity-60 ml-4">
              {profile.terminalUser}: ~/portfolio
            </div>
          </div>
          <div className="p-8 md:flex gap-12 items-start">
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`Portrait of ${profile.name} - Full Stack Developer`}
                className="w-full aspect-[0.8] object-cover border-2 border-primary/20 rounded shadow-[0_0_20px_rgba(74,225,118,0.2)] grayscale contrast-125"
                src={profile.profileImage}
              />
            </div>
            <div className="flex-1 text-primary space-y-4">
              <p className="text-primary-fixed-dim font-bold">{profile.terminalUser}</p>
              <p className="border-b border-primary/20 pb-2">-----------------</p>
              <h1 className="text-lg font-bold mb-4">
                {profile.name}: <GlitchTypewriter roles={roles} />
              </h1>
              <div className="grid grid-cols-[120px_1fr] gap-y-2">
                {terminalInfo.map((info) => (
                  <Fragment key={info.id}>
                    <span className="text-on-surface-variant">{info.label}:</span>
                    <span>{info.value}</span>
                  </Fragment>
                ))}
              </div>
              <div className="mt-8 flex gap-4 pt-6">
                <div className="w-6 h-6 bg-primary" />
                <div className="w-6 h-6 bg-secondary" />
                <div className="w-6 h-6 bg-tertiary" />
                <div className="w-6 h-6 bg-error" />
                <div className="w-6 h-6 bg-surface-variant" />
              </div>
              <div className="pt-8">
                <p className="cursor-blink">{profile.statusLabel || "Ready for deployment"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Fragment } from "react";
