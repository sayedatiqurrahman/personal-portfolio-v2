"use client";

import type { Profile } from "@/lib/types";

export default function About({ profile }: { profile: Profile }) {
  const about = (() => { try { return JSON.parse(profile.about); } catch { return []; } })();
  const principles = (() => { try { return JSON.parse(profile.corePrinciples); } catch { return []; } })();

  return (
    <section className="max-w-container-max mx-auto px-6 py-section-padding" id="about">
      <div className="grid md:grid-cols-2 gap-20">
        <div>
          <h2 className="font-headline-md text-headline-md text-primary mb-8">
            cat about_me.txt
          </h2>
          <div className="space-y-6 text-on-surface-variant leading-relaxed">
            {about.map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-headline-md text-headline-md text-primary mb-8">
            core_principles.config
          </h2>
          <ul className="space-y-4 font-code-sm">
            {principles.map((principle: string) => (
              <li key={principle} className="flex items-start gap-3 bg-surface-container p-4 rounded-lg border border-outline-variant/20">
                <span className="text-primary mt-0.5">&gt;</span>
                <span className="text-on-surface-variant">{principle}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
