import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogList from "./BlogList";
import { getProfile, getBlogPosts } from "@/lib/db";

const siteUrl = "https://atiq.is-a.dev";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog",
    description: "Articles and thoughts by Sayed Atiqur Rahman — full stack developer writing about TypeScript, React, Next.js, Node.js, and web development.",
    openGraph: {
      title: "Blog | Sayed Atiqur Rahman",
      description: "Articles and thoughts by Sayed Atiqur Rahman — full stack developer writing about TypeScript, React, Next.js, Node.js, and web development.",
      url: `${siteUrl}/blog`,
      type: "website",
      images: [{ url: "https://images.pexels.com/photos/38513711/pexels-photo-38513711.jpeg", width: 1200, height: 630, alt: "Blog - Sayed Atiqur Rahman" }],
    },
    alternates: { canonical: `${siteUrl}/blog` },
  };
}

export default async function BlogPage() {
  const [profile, posts] = await Promise.all([
    getProfile(),
    getBlogPosts(true),
  ]);

  return (
    <>
      <Header profile={profile} />
      <main className="pt-24 min-h-screen">
        <section className="max-w-container-max mx-auto px-6 py-section-padding">
          <h1 className="font-headline-md text-headline-md text-primary mb-2">
            Blog
          </h1>
          <p className="text-on-surface-variant mb-10">
            Articles by Sayed Atiqur Rahman on web development, TypeScript, React, and more.
          </p>
          <BlogList posts={posts} />
        </section>
      </main>
      <Footer profile={profile} />
    </>
  );
}
