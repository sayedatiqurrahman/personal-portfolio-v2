import type { Education } from "@/lib/types";

export default function Education({ education }: { education: Education[] }) {
  if (!education.length) return null;

  return (
    <section className="max-w-container-max mx-auto px-6 py-section-padding" id="education">
      <h2 className="font-headline-md text-headline-md text-primary mb-12">
        cat /etc/education
      </h2>
      <div className="space-y-6">
        {education.map((edu) => (
          <div key={edu.id} className="terminal-border p-6 bg-surface-container-low">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-on-surface font-bold text-lg">{edu.institution}</h3>
                <p className="text-primary font-code-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
              </div>
              <span className="text-on-surface-variant text-sm font-code-sm">
                {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : " - Present"}
              </span>
            </div>
            {edu.description && (
              <p className="text-on-surface-variant mt-2">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
