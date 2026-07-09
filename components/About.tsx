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
            <div className="pt-8 border-t border-outline-variant/30">
              <h4 className="font-label-caps text-secondary mb-4">Core Principles</h4>
              <ul className="space-y-2 font-code-sm">
                {principles.map((principle: string) => (
                  <li key={principle} className="flex items-center gap-2">
                    <span className="text-primary">&gt;</span> {principle}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-headline-md text-headline-md text-primary mb-8">
            ./contact --init
          </h2>
          <form className="space-y-6 bg-surface-container p-8 rounded-xl border border-outline-variant/20">
            <div className="space-y-2">
              <label className="font-label-caps text-on-surface-variant" htmlFor="name">Identifier</label>
              <input className="w-full bg-background border border-outline-variant/30 rounded p-3 focus:border-primary focus:ring-0 outline-none transition-all font-code-sm" id="name" placeholder="Your Name" type="text" />
            </div>
            <div className="space-y-2">
              <label className="font-label-caps text-on-surface-variant" htmlFor="email">Destination</label>
              <input className="w-full bg-background border border-outline-variant/30 rounded p-3 focus:border-primary focus:ring-0 outline-none transition-all font-code-sm" id="email" placeholder="email@address.com" type="email" />
            </div>
            <div className="space-y-2">
              <label className="font-label-caps text-on-surface-variant" htmlFor="message">Payload</label>
              <textarea className="w-full bg-background border border-outline-variant/30 rounded p-3 focus:border-primary focus:ring-0 outline-none transition-all font-code-sm h-32" id="message" placeholder="Type your message here..." />
            </div>
            <button className="w-full py-4 bg-primary text-on-primary font-bold rounded hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2" type="submit">
              <span className="material-symbols-outlined">send</span>
              TRANSMIT DATA
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
