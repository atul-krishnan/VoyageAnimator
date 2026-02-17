import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";
import { listHubPosts } from "@/lib/content/hub";

export const metadata: Metadata = {
  title: "Hub",
  description:
    "Voyagraph resource hub for route storytelling, map animation workflows, and creator playbooks.",
};

export default function HubPage() {
  const posts = listHubPosts();

  return (
    <section className="px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <PageHeader
        description="Practical workflow guides for travel storytellers creating map-first videos."
        eyebrow="Resource Hub"
        title="Creator playbooks and tutorials"
      />

      <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2">
        {posts.map((post) => (
          <article
            className="rounded-2xl border border-white/10 bg-[#061523]/70 p-6"
            key={post.slug}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#79ecc9]">
              {new Date(post.publishedAt).toLocaleDateString()} • {post.readingMinutes} min
            </p>
            <h2 className="mt-3 font-display text-2xl text-white">{post.title}</h2>
            <p className="mt-3 text-sm text-[#c0d4e8]">{post.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-[#afc7de]"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              className="mt-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              href={`/hub/${post.slug}`}
            >
              Read article
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
