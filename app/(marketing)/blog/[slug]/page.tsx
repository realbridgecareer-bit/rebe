import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPost, getPosts } from "@/lib/posts";

// 빌드 시 게시글 경로를 미리 생성 (정적 최적화 + SEO)
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return { title: "게시글을 찾을 수 없습니다" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/blog" className="text-sm text-slate-400 hover:text-terracotta">
        ← 목록으로
      </Link>
      <span className="mt-6 block text-xs font-medium text-terracotta">
        {post.category} · {post.publishedAt}
      </span>
      <h1 className="mt-1 text-3xl font-bold text-ink">{post.title}</h1>
      <div className="mt-8 leading-relaxed text-slate-600">{post.content}</div>
    </article>
  );
}
