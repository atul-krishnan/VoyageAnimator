import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { z } from "zod";

import type { HubPostFrontmatter, HubPostSummary } from "@/lib/types";

const CONTENT_PATH = path.join(process.cwd(), "content/hub");

const frontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  coverImage: z.string(),
  publishedAt: z.string(),
  tags: z.array(z.string()).default([]),
});

const wordsPerMinute = 220;

function estimateReadingTime(content: string): number {
  return Math.max(1, Math.round(content.split(/\s+/).length / wordsPerMinute));
}

export function listHubPosts(): HubPostSummary[] {
  const files = fs.readdirSync(CONTENT_PATH).filter((file) => file.endsWith(".mdx"));

  const posts = files.map((file) => {
    const source = fs.readFileSync(path.join(CONTENT_PATH, file), "utf8");
    const parsed = matter(source);
    const frontmatter = frontmatterSchema.parse(parsed.data);

    return {
      ...frontmatter,
      readingMinutes: estimateReadingTime(parsed.content),
    } satisfies HubPostSummary;
  });

  return posts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getHubPostBySlug(
  slug: string,
): Promise<{ frontmatter: HubPostFrontmatter; content: React.ReactNode } | null> {
  const posts = listHubPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return null;
  }

  const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");
  const parsed = matter(source);

  const { content } = await compileMDX({
    source: parsed.content,
    options: {
      parseFrontmatter: false,
    },
  });

  return {
    frontmatter: {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      tags: post.tags,
    },
    content,
  };
}
