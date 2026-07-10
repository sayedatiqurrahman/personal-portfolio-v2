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

function GlitchText({ text }: { text: string }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!text) return;
    const timeouts: NodeJS.Timeout[] = [];
    let charIdx = 0;

    function typeNext() {
      if (charIdx >= text.length) return;
      const prefix = text.slice(0, charIdx);
      glitchPerChar(
        prefix,
        text[charIdx],
        setDisplay,
        (s) => {
          setDisplay(s);
          charIdx++;
          const t = setTimeout(typeNext, 20 + Math.random() * 30);
          timeouts.push(t);
        },
        timeouts,
      );
    }

    const t = setTimeout(typeNext, 200);
    timeouts.push(t);

    return () => timeouts.forEach(clearTimeout);
  }, [text]);

  return <>{display}</>;
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
              <Image
                alt={`Portrait of ${profile.name} - Full Stack Developer`}
                className="w-full aspect-[0.8] object-cover border-2 border-primary/20 rounded shadow-[0_0_20px_rgba(74,225,118,0.2)] grayscale contrast-125"
                src={profile.profileImage}
                width={400}
                height={500}
                priority
              />
            </div>
            <div className="flex-1 text-primary space-y-4">
              <p className="text-primary-fixed-dim font-bold">{profile.terminalUser}</p>
              <p className="border-b border-primary/20 pb-2" aria-hidden="true">-----------------</p>
              <h1 className="text-lg font-bold mb-4">
                <GlitchText text={profile.name} />: <GlitchTypewriter roles={roles} />
              </h1>
              <div className="grid grid-cols-[120px_1fr] gap-y-2" role="list">
                {terminalInfo.map((info) => (
                  <Fragment key={info.id}>
                    <span className="text-on-surface-variant" role="term">{info.label}:</span>
                    <span role="definition">{info.value}</span>
                  </Fragment>
                ))}
              </div>
              <div className="mt-8 flex gap-4 pt-6" aria-hidden="true">
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
