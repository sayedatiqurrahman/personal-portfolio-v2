import type { Certificate } from "@/lib/types";

export default function Certificates({ certificates }: { certificates: Certificate[] }) {
  if (!certificates.length) return null;

  return (
    <section className="max-w-container-max mx-auto px-6 py-section-padding bg-surface-container-lowest/50" id="certificates">
      <h2 className="font-headline-md text-headline-md text-primary mb-12">
        ls /certificates/
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="terminal-border p-6 bg-surface-container-low">
            <div className="flex items-start gap-3 mb-3">
              <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>
              <div>
                <h3 className="text-on-surface font-bold">{cert.name}</h3>
                <p className="text-on-surface-variant text-sm">{cert.issuer}</p>
              </div>
            </div>
            {cert.date && <p className="text-on-surface-variant text-xs font-code-sm mb-2">{cert.date}</p>}
            {cert.url && (
              <a href={cert.url} target="_blank" rel="noopener" className="text-primary text-sm hover:underline font-code-sm">
                [ VERIFY ]
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
