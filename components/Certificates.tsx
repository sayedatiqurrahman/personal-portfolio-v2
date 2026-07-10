import type { Certificate } from "@/lib/types";

export default function Certificates({ certificates }: { certificates: Certificate[] }) {
  if (!certificates.length) return null;

  return (
    <section className="max-w-container-max mx-auto px-6 py-section-padding bg-surface-container-lowest/50" id="certificates">
      <h2 className="font-headline-md text-headline-md text-primary mb-12">
        ls /certificates/
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {certificates.map((cert) => {
          const spanClass =
            cert.gridSpan === "12" ? "md:col-span-12"
            : cert.gridSpan === "8" ? "md:col-span-8"
            : cert.gridSpan === "6" ? "md:col-span-6"
            : "md:col-span-4";
          return (
            <div key={cert.id} className={`terminal-border p-6 bg-surface-container-low ${spanClass}`}>
              <div className="flex items-start gap-3 mb-3">
                <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>
                <div>
                  <h3 className="text-on-surface font-bold">{cert.name}</h3>
                  <p className="text-on-surface-variant text-sm">{cert.issuer}</p>
                </div>
              </div>
              {cert.date && <p className="text-on-surface-variant text-xs font-code-sm mb-2">{cert.date}</p>}
              {cert.image && (
                <div className="mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cert.image} alt={cert.name} className="w-full h-24 object-contain rounded" />
                </div>
              )}
              {cert.url && (
                <a href={cert.url} target="_blank" rel="noopener" className="text-primary text-sm hover:underline font-code-sm">
                  [ VERIFY ]
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
