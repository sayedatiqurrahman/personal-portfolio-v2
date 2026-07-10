"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Profile, Role, TerminalInfo } from "@/lib/types";

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";

function glitchPerChar(
  prefix: string,
  targetChar: string,
  onGlitch: (s: string) => void,
  onDone: (s: string) => void,
  timeouts: NodeJS.Timeout[],
) {
  const maxGlitch = 3 + Math.floor(Math.random() * 4);
  let count = 0;

  function step() {
    if (count < maxGlitch) {
      onGlitch(prefix + GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
      count++;
      const t = setTimeout(step, 30 + Math.random() * 60);
      timeouts.push(t);
    } else {
      onDone(prefix + targetChar);
    }
  }

  const t = setTimeout(step, 30 + Math.random() * 50);
  timeouts.push(t);
}

function GlitchTypewriter({ roles }: { roles: Role[] }) {
  const [display, setDisplay] = useState("");
  const textIdxRef = useRef(0);
  const charIdxRef = useRef(0);
  const phaseRef = useRef<"typing" | "pause" | "deleting">("typing");

  useEffect(() => {
    if (!roles.length) return;
    const texts = roles.map((r) => r.title);
    const timeouts: NodeJS.Timeout[] = [];

    function tick() {
      const target = texts[textIdxRef.current] || "";

      if (phaseRef.current === "typing") {
        if (charIdxRef.current < target.length) {
          const prefix = target.slice(0, charIdxRef.current);
          glitchPerChar(
            prefix,
            target[charIdxRef.current],
            setDisplay,
            (s) => {
              setDisplay(s);
              charIdxRef.current++;
              const t = setTimeout(tick, 20 + Math.random() * 30);
              timeouts.push(t);
            },
            timeouts,
          );
          return;
        }
        phaseRef.current = "pause";
        const t = setTimeout(tick, 2000);
        timeouts.push(t);
      } else if (phaseRef.current === "pause") {
        phaseRef.current = "deleting";
        const t = setTimeout(tick, 500);
        timeouts.push(t);
      } else if (phaseRef.current === "deleting") {
        if (charIdxRef.current > 0) {
          charIdxRef.current--;
          setDisplay(target.slice(0, charIdxRef.current));
          const t = setTimeout(tick, 20);
          timeouts.push(t);
        } else {
          textIdxRef.current = (textIdxRef.current + 1) % texts.length;
          phaseRef.current = "typing";
          const t = setTimeout(tick, 300);
          timeouts.push(t);
        }
      }
    }

    const t = setTimeout(tick, 400);
    timeouts.push(t);

    return () => timeouts.forEach(clearTimeout);
  }, [roles]);

  return (
    <span className="text-primary">
      {display}
      <span className="cursor-blink" aria-hidden="true" />
    </span>
  );
}

export default function Hero({ profile, roles, terminalInfo }: { profile: Profile; roles: Role[]; terminalInfo: TerminalInfo[] }) {
  return (
    <section className="max-w-container-max mx-auto px-6 py-section-padding" id="hero" aria-label="Hero introduction">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="terminal-window bg-surface-container-lowest rounded-lg overflow-hidden font-code-sm">
          <div className="bg-surface-variant px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5" aria-hidden="true">
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
              {profile.profileImage ? (
                <Image
                  alt={`Portrait of ${profile.name} - Full Stack Developer`}
                  className="w-full aspect-[0.8] object-cover border-2 border-primary/20 rounded grayscale contrast-125"
                  style={{ boxShadow: '0 0 20px rgba(74,225,118,0.2)' }}
                  src={profile.profileImage}
                  width={400}
                  height={500}
                  priority
                />
              ) : (
                <div className="w-full aspect-[0.8] border-2 border-primary/20 rounded bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-primary/30">person</span>
                </div>
              )}
            </div>
            <div className="flex-1 text-primary space-y-4">
              <p className="text-primary-fixed-dim font-bold">{profile.terminalUser}</p>
              <p className="border-b border-primary/20 pb-2" aria-hidden="true">-----------------</p>
              <h1 className="text-lg font-bold mb-4 flex flex-col md:block">
                <span>{profile.name}:</span>{" "}
                <GlitchTypewriter roles={roles} />
              </h1>
              <div className="grid grid-cols-[120px_1fr] gap-y-2" role="list">
                {terminalInfo.map((info) => (
                  <Fragment key={info.id}>
                    <span className="text-on-surface-variant" role="term">{info.label}:</span>
                    <span role="definition">{info.value}</span>
                  </Fragment>
                ))}
              </div>
              <div className="mt-8 flex gap-3 pt-6 flex-wrap justify-center md:justify-start">
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-primary font-code-sm font-bold hover:text-primary-fixed transition-colors flex items-center gap-1.5">
                    [<svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/></svg>github ]</a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary font-code-sm font-bold hover:text-primary-fixed transition-colors flex items-center gap-1.5">
                    [<svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>linkedin ]</a>
                )}
                {profile.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-primary font-code-sm font-bold hover:text-primary-fixed transition-colors flex items-center gap-1.5">
                    [<svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>twitter ]</a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="text-primary font-code-sm font-bold hover:text-primary-fixed transition-colors flex items-center gap-1.5">
                    [<span className="material-symbols-outlined text-sm leading-none" aria-hidden="true">mail</span> email ]</a>
                )}
              </div>
              {profile.resumeUrl && (
                <div className="pt-8 flex justify-center md:justify-start">
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-fixed transition-colors text-sm font-code-sm cursor-pointer w-fit"
                  >
                    <span className="material-symbols-outlined text-base">download</span>
                    DOWNLOAD RESUME
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
