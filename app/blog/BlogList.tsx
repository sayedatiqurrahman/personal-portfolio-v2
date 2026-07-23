"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  coverImage: string;
  author: string;
  createdAt: string | Date;
}

function parseTags(tags: string): string[] {
  try { return JSON.parse(tags); } catch { return []; }
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => parseTags(p.tags).forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return posts.filter((p) => {
      if (selectedTag) {
        const tags = parseTags(p.tags);
        if (!tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())) return false;
      }
      if (!q) return true;
      const tags = parseTags(p.tags);
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, search, selectedTag]);

  return (
    <>
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
          <input
            type="search"
            placeholder="Search articles by title, content, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-3 text-primary focus:border-primary outline-none font-code-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all font-code-sm ${
                selectedTag === null
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-transparent text-on-surface-variant border-outline-variant hover:border-primary/50 hover:text-primary"
              }`}
            >
              All ({posts.length})
            </button>
            {allTags.map((tag) => {
              const count = posts.filter((p) => parseTags(p.tags).some((t) => t.toLowerCase() === tag.toLowerCase())).length;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all font-code-sm ${
                    selectedTag === tag
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-transparent text-on-surface-variant border-outline-variant hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {tag} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-on-surface-variant py-16 text-center">
          <span className="material-symbols-outlined text-4xl mb-3 block">article</span>
          {posts.length === 0
            ? "No articles yet. Check back soon."
            : selectedTag
              ? `No articles found with tag "${selectedTag}".`
              : "No matching articles found."}
          {(search || selectedTag) && (
            <button
              onClick={() => { setSearch(""); setSelectedTag(null); }}
              className="mt-3 text-primary text-sm hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => {
            const tags = parseTags(post.tags);
            return (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="group bg-surface-container rounded-lg border border-outline-variant/20 hover:border-primary/40 transition-all overflow-hidden">
                {post.coverImage && (
                  <div className="aspect-video bg-surface-variant overflow-hidden">
                    <img src={post.coverImage} alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="font-headline-md text-headline-sm text-primary group-hover:text-primary-fixed transition-colors mb-2">{post.title}</h2>
                  <p className="text-on-surface-variant text-sm mb-3 line-clamp-2">{post.excerpt || "Read more..."}</p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-code-sm">{tag}</span>
                      ))}
                      {tags.length > 3 && <span className="text-xs text-on-surface-variant">+{tags.length - 3}</span>}
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs text-on-surface-variant">
                    <span>{post.author}</span>
                    <time dateTime={typeof post.createdAt === "string" ? post.createdAt : undefined}>
                      {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </time>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
