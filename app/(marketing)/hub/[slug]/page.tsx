import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TrackedLink } from "@/components/ui/tracked-link";
import { getHubPostBySlug, listHubPosts } from "@/lib/content/hub";

type HubPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return listHubPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: HubPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getHubPostBySlug(slug);

  if (!post) {
    return {
      title: "Article",
    };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
  };
}

export default async function HubPostPage({ params }: HubPostPageProps) {
  const { slug } = await params;
  const post = await getHubPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-[#79ecc9]">
        {new Date(post.frontmatter.publishedAt).toLocaleDateString()}
      </p>
      <h1 className="mt-4 font-display text-4xl leading-tight text-white md:text-5xl">
        {post.frontmatter.title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[#c4d8ec]">
        {post.frontmatter.excerpt}
      </p>

      <div className="prose prose-invert mt-8 max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-[#c6d9eb] prose-strong:text-white">
        {post.content}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-[#061523]/70 p-6">
        <p className="text-sm text-[#bdd0e6]">
          Ready to apply this workflow to your own travel reels?
        </p>
        <TrackedLink
          className="mt-4 bg-[#72f7cf] text-[#04221f] hover:bg-[#8bfad9]"
          eventProps={{ location: "hub_article", target: "waitlist", slug }}
          href="/waitlist"
        >
          Join the waitlist
        </TrackedLink>
      </div>
    </article>
  );
}
