import Link from "next/link";
import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "취업정보",
  description:
    "자기소개서, 면접, 커리어 등 부동산·금융 취업에 도움이 되는 정보를 모았습니다.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-2 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        INSIGHTS
      </div>
      <h1 className="text-3xl font-bold text-navy">취업정보</h1>
      <p className="mt-2 text-slate-500">
        부동산·금융 취업에 도움이 되는 현직자의 인사이트.
      </p>

      <ul className="mt-10 space-y-6">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="rounded-xl border border-line bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-xs font-medium text-accent">
              {post.category} · {post.publishedAt}
            </span>
            <h2 className="mt-1 text-xl font-bold text-navy">
              <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-slate-600">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
