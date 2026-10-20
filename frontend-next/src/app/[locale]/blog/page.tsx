"use client";

import { Link } from "@/navigation";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import { BLOG_POSTS } from "@/app/blog/posts";

export default function BlogPage() {
  const t = useTranslations("blog");
  const featured = BLOG_POSTS[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="pt-24 pb-16 text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-xs text-muted-foreground mb-6">
          <Tag className="size-3 text-primary" />
          {t("tag")}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t("subtitle")}</p>
      </section>

      {/* Featured post */}
      <section className="max-w-4xl mx-auto px-4 mb-8">
        <Link
          href={`/blog/${featured.slug}`}
          className={`group block rounded-2xl border p-8 hover:border-primary/40 transition-all ${featured.featuredBg}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${featured.tagClass}`}>
              {featured.tag}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {featured.readTime} {t("read_time_suffix")}
            </span>
            <span className="text-xs text-muted-foreground">{featured.date}</span>
          </div>
          <h2 className="text-2xl font-bold mb-3 group-hover:opacity-80 transition-opacity">
            {featured.title}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{featured.excerpt}</p>
          <span
            className={`inline-flex items-center gap-1 text-sm font-medium ${featured.accentText || "text-primary"}`}
          >
            {t("read_more")} <ArrowRight className="size-4" />
          </span>
        </Link>
      </section>

      {/* Grid */}
      <section className="max-w-4xl mx-auto px-4 pb-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {BLOG_POSTS.slice(1).map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.tagClass}`}>
                {post.tag}
              </span>
            </div>
            <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors leading-snug">
              {post.title}
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {post.readTime}
              </span>
              <span>{post.date}</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
