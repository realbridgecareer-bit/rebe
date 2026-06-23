import type { Post } from "@/types";

/**
 * 임시 게시글 데이터. 추후 Supabase `posts` 테이블 조회로 교체하세요.
 */
const posts: Post[] = [
  {
    slug: "resume-tips",
    title: "합격하는 자기소개서의 3가지 공통점",
    excerpt: "수많은 합격 자소서를 분석해 찾아낸 핵심 패턴을 정리했습니다.",
    category: "자기소개서",
    publishedAt: "2026-06-01",
    content:
      "합격하는 자기소개서는 (1) 직무와의 연결, (2) 구체적 경험, (3) 결과의 수치화라는 공통점을 가집니다...",
  },
  {
    slug: "interview-basics",
    title: "면접 첫인상을 결정하는 1분",
    excerpt: "면접관의 평가는 초반 1분에 좌우됩니다. 핵심 준비법을 소개합니다.",
    category: "면접",
    publishedAt: "2026-05-20",
    content:
      "면접 초반 1분은 첫인상을 좌우합니다. 자기소개, 시선, 자세를 점검해 보세요...",
  },
];

export async function getPosts(): Promise<Post[]> {
  return posts;
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return posts.find((p) => p.slug === slug);
}
