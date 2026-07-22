import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProfile } from "@/lib/db";

const siteUrl = "https://atiq.is-a.dev";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: "About",
    description: `Learn more about Sayed Atiqur Rahman — full stack developer, open-source contributor, and builder of performant web applications. Background, philosophy, and how to connect.`,
    openGraph: {
      title: `About | Sayed Atiqur Rahman`,
      description: `Learn more about Sayed Atiqur Rahman — full stack developer, open-source contributor, and builder of performant web applications.`,
      url: `${siteUrl}/about`,
      type: "profile",
      images: [{ url: "https://images.pexels.com/photos/38513711/pexels-photo-38513711.jpeg", width: 1200, height: 630, alt: "Sayed Atiqur Rahman - About" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `About | Sayed Atiqur Rahman`,
      description: `Learn more about Sayed Atiqur Rahman — full stack developer, open-source contributor, and builder of performant web applications.`,
      images: [{ url: "https://images.pexels.com/photos/38513711/pexels-photo-38513711.jpeg", width: 1200, height: 630, alt: "Sayed Atiqur Rahman - About" }],
    },
    alternates: {
      canonical: `${siteUrl}/about`,
    },
  };
}

export default async function AboutPage() {
  const profile = await getProfile();
  const about = (() => { try { return JSON.parse(profile.about); } catch { return []; } })();
  const principles = (() => { try { return JSON.parse(profile.corePrinciples); } catch { return []; } })();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Sayed Atiqur Rahman",
    description: `Learn more about Sayed Atiqur Rahman — full stack developer, open-source contributor, and builder of performant web applications.`,
    url: `${siteUrl}/about`,
    mainEntity: {
      "@type": "Person",
      name: "Sayed Atiqur Rahman",
      alternateName: ["Atiq", "Atiqur", "Atiqur Rahman", "Sayed Atiqur Rahman"],
      url: siteUrl,
      image: "https://images.pexels.com/photos/38512418/pexels-photo-38512418.jpeg?w=800",
      jobTitle: "Full Stack Developer",
      knowsAbout: ["MERN Stack", "TypeScript", "React", "Next.js", "Node.js", "Web Development", "Software Engineering"],
      sameAs: [profile.github, profile.linkedin, profile.twitter].filter(Boolean),
      email: profile.email,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header profile={profile} />
      <main className="pt-24 min-h-screen">
        <section className="max-w-3xl mx-auto px-6 py-section-padding">
          <h1 className="font-headline-md text-headline-md text-primary mb-4">
            About Sayed Atiqur Rahman
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-12">
            {profile.name} is a full stack developer who goes by Atiq, Atiqur, or Sayed Atiqur Rahman.
            Sayed Atiqur Rahman builds web applications that are fast, accessible, and thoughtfully designed.
          </p>

          <h2 className="font-headline-md text-headline-sm text-primary mb-4">
            Who is Sayed Atiqur Rahman?
          </h2>
          <div className="space-y-4 text-on-surface-variant leading-relaxed mb-12">
            <p>
              Sayed Atiqur Rahman is a software developer specializing in the MERN stack — MongoDB, Express.js, React, and Node.js —
              with a deep focus on TypeScript and modern tooling. Atiqur Rahman has experience building everything from small business
              websites to complex SaaS dashboards and real-time applications. As a developer, Sayed Atiqur Rahman believes in writing
              clean, maintainable code that stands the test of time.
            </p>
            <p>
              Atiqur Rahman, often just called Atiq, started his journey in web development driven by curiosity about how the web works
              under the hood. That curiosity turned into a career. Today, Sayed Atiqur Rahman works across the full stack, from designing
              intuitive user interfaces with React and Next.js to architecting robust APIs with Node.js and Express.
            </p>
            <p>
              Outside of writing code, Atiq is passionate about open-source, developer tooling, and sharing knowledge with the community.
              Sayed Atiqur Rahman believes every line of code should serve a purpose and every project should solve a real problem.
            </p>
          </div>

          <h2 className="font-headline-md text-headline-sm text-primary mb-4">
            Skills and Technologies
          </h2>
          <div className="space-y-4 text-on-surface-variant leading-relaxed mb-12">
            <p>
              Sayed Atiqur Rahman works extensively with TypeScript, React, Next.js, Node.js, and PostgreSQL. Atiq&apos;s toolkit
              also includes Tailwind CSS, Prisma, Docker, and various cloud platforms. As a full stack developer, Sayed Atiqur Rahman
              is comfortable moving between frontend and backend, always focusing on performance, accessibility, and developer experience.
            </p>
            <p>
              Atiqur Rahman pays special attention to web performance — lazy loading, code splitting, server-side rendering, and
              edge caching are second nature. Sayed Atiqur Rahman builds with SEO in mind from the start, ensuring every project
              is discoverable and ranks well.
            </p>
          </div>

          <h2 className="font-headline-md text-headline-sm text-primary mb-4">
            What Sayed Atiqur Rahman Believes In
          </h2>
          <ul className="space-y-4 font-code-sm mb-12">
            {principles.map((principle: string) => (
              <li key={principle} className="flex items-start gap-3 bg-surface-container p-4 rounded-lg border border-outline-variant/20">
                <span className="text-primary mt-0.5">&gt;</span>
                <span className="text-on-surface-variant">{principle}</span>
              </li>
            ))}
          </ul>

          <h2 className="font-headline-md text-headline-sm text-primary mb-4">
            More About This Site
          </h2>
          <div className="space-y-4 text-on-surface-variant leading-relaxed mb-12">
            <p>
              This portfolio — atiq.is-a.dev — is built by Sayed Atiqur Rahman using Next.js 14, TypeScript, Tailwind CSS,
              and Prisma. It is deployed on Vercel and designed to be fast, accessible, and SEO-friendly. Every page,
              including this about page, is server-rendered for optimal performance.
            </p>
            <p>
              The source code for this site is available on GitHub. If you spot a bug or have a suggestion,
              Sayed Atiqur Rahman welcomes contributions and feedback.
            </p>
          </div>

          <h2 className="font-headline-md text-headline-sm text-primary mb-4">
            Connect with Sayed Atiqur Rahman
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-surface-container p-4 rounded-lg border border-outline-variant/20 hover:border-primary/40 transition-colors group">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-on-surface-variant group-hover:fill-primary transition-colors"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/></svg>
                <div>
                  <div className="font-bold text-on-surface">GitHub</div>
                  <div className="text-sm text-on-surface-variant">github.com/{profile.github?.split("/").pop()}</div>
                </div>
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-surface-container p-4 rounded-lg border border-outline-variant/20 hover:border-primary/40 transition-colors group">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-on-surface-variant group-hover:fill-primary transition-colors"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <div>
                  <div className="font-bold text-on-surface">LinkedIn</div>
                  <div className="text-sm text-on-surface-variant">linkedin.com/in/{profile.linkedin?.split("/").pop()}</div>
                </div>
              </a>
            )}
            {profile.twitter && (
              <a href={profile.twitter} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-surface-container p-4 rounded-lg border border-outline-variant/20 hover:border-primary/40 transition-colors group">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-on-surface-variant group-hover:fill-primary transition-colors"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <div>
                  <div className="font-bold text-on-surface">Twitter / X</div>
                  <div className="text-sm text-on-surface-variant">@{profile.twitter?.split("/").pop()}</div>
                </div>
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`}
                className="flex items-center gap-3 bg-surface-container p-4 rounded-lg border border-outline-variant/20 hover:border-primary/40 transition-colors group">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">mail</span>
                <div>
                  <div className="font-bold text-on-surface">Email</div>
                  <div className="text-sm text-on-surface-variant">{profile.email}</div>
                </div>
              </a>
            )}
          </div>

          {about.length > 0 && (
            <>
              <h2 className="font-headline-md text-headline-sm text-primary mb-4">
                In Sayed Atiqur Rahman&apos;s Own Words
              </h2>
              <div className="space-y-4 text-on-surface-variant leading-relaxed">
                {about.map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      <Footer profile={profile} />
    </>
  );
}
