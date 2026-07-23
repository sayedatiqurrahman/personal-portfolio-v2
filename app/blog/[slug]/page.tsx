import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProfile, getBlogPost, getBlogPosts } from "@/lib/db";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

const siteUrl = "https://atiq.is-a.dev";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try { return hljs.highlight(code, { language: lang }).value; } catch {}
      }
      try { return hljs.highlightAuto(code).value; } catch {}
      return code;
    },
  })
);

interface BlogRow {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string;
  coverImage: string;
  published: boolean;
  author: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

function stripMd(md: string) {
  return md.replace(/[#*_`~>\[\]!\-]/g, "").replace(/\n+/g, " ").trim();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug) as BlogRow | null;
  if (!post) return {};

  const description = post.excerpt || stripMd(post.content).slice(0, 160);
  const url = `${siteUrl}/blog/${post.slug}`;
  const tags: string[] = (() => { try { return JSON.parse(post.tags); } catch { return []; } })();
  const publishedTime = typeof post.createdAt === "string" ? post.createdAt : post.createdAt.toISOString();

  return {
    title: `${post.title} | Blog`,
    description,
    keywords: tags,
    authors: [{ name: "Sayed Atiqur Rahman", url: siteUrl }],
    openGraph: {
      title: post.title,
      description,
      url,
      type: "article",
      publishedTime,
      authors: ["Sayed Atiqur Rahman"],
      siteName: "Sayed Atiqur Rahman",
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      creator: "@sayedatiq",
      images: post.coverImage ? [post.coverImage] : [],
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [profile, postRaw] = await Promise.all([
    getProfile(),
    getBlogPost(params.slug),
  ]);

  if (!postRaw) notFound();

  const post = postRaw as BlogRow;
  const tags: string[] = (() => { try { return JSON.parse(post.tags); } catch { return []; } })();
  const html = marked.parse(post.content || "") as string;
  const publishedTime = typeof post.createdAt === "string" ? post.createdAt : post.createdAt.toISOString();
  const modifiedTime = typeof post.updatedAt === "string" ? post.updatedAt : post.updatedAt.toISOString();
  const url = `${siteUrl}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || stripMd(post.content).slice(0, 200),
    author: {
      "@type": "Person",
      name: "Sayed Atiqur Rahman",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Sayed Atiqur Rahman",
    },
    datePublished: publishedTime,
    dateModified: modifiedTime,
    url,
    image: post.coverImage || undefined,
    keywords: tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css" />
      <Header profile={profile} />
      <main className="pt-24 min-h-screen">
        <article className="max-w-3xl mx-auto px-6 py-section-padding">
          <a href="/blog" className="text-primary text-sm font-code-sm hover:underline mb-8 inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Blog
          </a>

          {post.coverImage && (
            <div className="aspect-video rounded-lg overflow-hidden mb-8 border border-outline-variant/20">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <h1 className="font-headline-md text-headline-md text-primary mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-on-surface-variant">
            <span>By <strong className="text-primary">{post.author}</strong></span>
            <span aria-hidden="true">&middot;</span>
            <time dateTime={publishedTime}>
              {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </time>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag) => (
                <span key={tag} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded font-code-sm">{tag}</span>
              ))}
            </div>
          )}

          <div
            className="prose prose-invert prose-headings:text-primary prose-a:text-primary prose-strong:text-on-surface prose-code:text-primary prose-pre:bg-surface-container prose-pre:border prose-pre:border-outline-variant/20 max-w-none text-on-surface-variant leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <div className="mt-12 pt-8 border-t border-outline-variant/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Sayed Atiqur Rahman</p>
                <p className="text-xs text-on-surface-variant">Full Stack Developer &mdash; TypeScript, React, Next.js, Node.js</p>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer profile={profile} />
    </>
  );
}
