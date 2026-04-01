import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"
import { BLOG_POSTS, getPostBySlug } from "../posts"
import { BlogContent } from "../BlogContent"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://cvfit.app/blog/${slug}`,
      type: "article",
    },
  }
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-3xl mx-auto px-4 pt-20 pb-14">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Blog&apos;a dön
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.tagClass}`}>
            {post.tag}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {post.readTime} okuma
          </span>
          <span className="text-xs text-muted-foreground">{post.date}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4">{post.title}</h1>
        <p className="text-muted-foreground leading-relaxed mb-10">{post.excerpt}</p>

        <article className="text-[15px] leading-7 text-foreground/90">
          <BlogContent blocks={post.content} />
        </article>
      </section>

      <section className="border-t border-border py-12 px-4 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Diğer yazılar</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 4).map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <p className="text-xs text-muted-foreground mb-1">{item.tag}</p>
                <p className="font-medium leading-snug">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
