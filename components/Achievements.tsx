import type { Achievement } from "@/lib/types";

export default function Achievements({ achievements }: { achievements: Achievement[] }) {
  if (!achievements.length) return null;

  return (
    <section className="max-w-container-max mx-auto px-6 py-section-padding" id="achievements">
      <h2 className="font-headline-md text-headline-md text-primary mb-12">
        echo $ACHIEVEMENTS
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((a) => (
          <div key={a.id} className="terminal-border p-5 bg-surface-container-low flex gap-4">
            {a.image && (
              <div className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.image} alt={a.title} className="w-14 h-14 object-contain rounded" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-on-surface font-bold text-sm truncate">{a.title}</h3>
                {a.url && (
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-code-sm hover:underline shrink-0">
                    [ VERIFY ]
                  </a>
                )}
              </div>
              {a.issuer && <p className="text-primary text-xs font-code-sm">{a.issuer}</p>}
              {a.date && <p className="text-on-surface-variant text-xs mt-1">{a.date}</p>}
              {a.description && <p className="text-on-surface-variant text-sm mt-2">{a.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
