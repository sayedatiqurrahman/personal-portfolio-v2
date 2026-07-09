import type { Profile } from "@/lib/types";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30 mt-section-padding">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-stack-lg max-w-container-max mx-auto gap-stack-md">
        <div className="text-label-caps font-label-caps text-on-surface-variant">
          {profile.footerText}
        </div>
        <div className="flex gap-stack-lg">
          {profile.github && profile.github !== "#" && (
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-caps" href={profile.github} target="_blank" rel="noopener">GitHub</a>
          )}
          {profile.linkedin && profile.linkedin !== "#" && (
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-caps" href={profile.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          )}
          {profile.twitter && profile.twitter !== "#" && (
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-caps" href={profile.twitter} target="_blank" rel="noopener">Twitter</a>
          )}
          {profile.resumeUrl && (
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-caps" href={profile.resumeUrl} target="_blank" rel="noopener">Resume</a>
          )}
          {profile.resumeFile && (
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-caps" href="/api/resume" download>Resume</a>
          )}
        </div>
      </div>
    </footer>
  );
}
