"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Consultation = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  program: string | null;
  message: string;
  status: string;
};

type StoryRow = {
  id?: string;
  sort_order: number;
  published: boolean;
  company: string;
  logo_url: string;
  logo_h: number | null;
  logo_w: number | null;
  name: string;
  persona: string;
  service: string;
  before_text: string;
  after_text: string;
  quote: string;
  paragraphs: string[];
  tags: string[];
};

type State = "loading" | "denied" | "ready";
type Tab = "consultations" | "stories";

const SERVICES = ["Real Connect", "Real Bridge", "Real Success"];

function emptyStory(order: number): StoryRow {
  return {
    sort_order: order,
    published: true,
    company: "",
    logo_url: "",
    logo_h: null,
    logo_w: null,
    name: "",
    persona: "",
    service: "Real Success",
    before_text: "",
    after_text: "",
    quote: "",
    paragraphs: [],
    tags: [],
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [state, setState] = useState<State>("loading");
  const [tab, setTab] = useState<Tab>("consultations");
  const [rows, setRows] = useState<Consultation[]>([]);
  const [stories, setStories] = useState<StoryRow[]>([]);
  const [editing, setEditing] = useState<StoryRow | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/login");
        return;
      }
      const uid = sessionData.session.user.id;
      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", uid)
        .maybeSingle();
      if (!adminRow) {
        setState("denied");
        return;
      }
      await Promise.all([loadConsultations(), loadStories()]);
      setState("ready");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadConsultations() {
    const supabase = createClient();
    const { data } = await supabase
      .from("consultations")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setRows(data as Consultation[]);
  }

  async function loadStories() {
    const supabase = createClient();
    const { data } = await supabase
      .from("success_stories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (data) setStories(data as StoryRow[]);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
  }

  async function deleteStory(id?: string) {
    if (!id) return;
    if (!confirm("이 합격 사례를 삭제할까요? 되돌릴 수 없습니다.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("success_stories").delete().eq("id", id);
    if (error) alert("삭제 실패: " + error.message);
    await loadStories();
  }

  if (state === "loading") {
    return <Shell onLogout={null}><p className="text-slate-500">불러오는 중…</p></Shell>;
  }

  if (state === "denied") {
    return (
      <Shell onLogout={handleLogout}>
        <h1 className="text-2xl font-bold text-ink">접근 권한이 없습니다</h1>
        <p className="mt-3 text-slate-500">관리자 계정으로 로그인해야 이 페이지를 볼 수 있습니다.</p>
        <Link href="/" className="mt-6 inline-block font-medium text-terracotta">← 홈으로</Link>
      </Shell>
    );
  }

  return (
    <Shell onLogout={handleLogout}>
      {/* 탭 */}
      <div className="mb-8 flex gap-2 border-b border-line">
        {([["consultations", `상담 신청 (${rows.length})`], ["stories", `합격 사례 (${stories.length})`]] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px cursor-pointer border-b-2 px-4 py-2.5 text-sm font-bold transition-colors ${
              tab === t ? "border-sage text-sage" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "consultations" ? (
        <ConsultationsView rows={rows} />
      ) : (
        <StoriesView
          stories={stories}
          onAdd={() => setEditing(emptyStory(stories.length + 1))}
          onEdit={(s) => setEditing(s)}
          onDelete={deleteStory}
        />
      )}

      {editing && (
        <StoryEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await loadStories();
          }}
        />
      )}
    </Shell>
  );
}

/* ---------------- 상담 신청 뷰 ---------------- */
function ConsultationsView({ rows }: { rows: Consultation[] }) {
  if (rows.length === 0) return <p className="mt-2 text-slate-500">아직 접수된 상담이 없습니다.</p>;
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-ivory text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">접수일</th>
            <th className="px-4 py-3 font-semibold">이름</th>
            <th className="px-4 py-3 font-semibold">연락처</th>
            <th className="px-4 py-3 font-semibold">이메일</th>
            <th className="px-4 py-3 font-semibold">관심 패키지</th>
            <th className="px-4 py-3 font-semibold">상담 내용</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.id} className="align-top">
              <td className="px-4 py-3 whitespace-nowrap text-slate-500">{new Date(r.created_at).toLocaleDateString("ko-KR")}</td>
              <td className="px-4 py-3 font-medium text-ink">{r.name}</td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-700">{r.phone}</td>
              <td className="px-4 py-3 text-slate-600">{r.email ?? "-"}</td>
              <td className="px-4 py-3 text-slate-600">{r.program ?? "-"}</td>
              <td className="px-4 py-3 text-slate-600">{r.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- 합격 사례 목록 뷰 ---------------- */
function StoriesView({
  stories,
  onAdd,
  onEdit,
  onDelete,
}: {
  stories: StoryRow[];
  onAdd: () => void;
  onEdit: (s: StoryRow) => void;
  onDelete: (id?: string) => void;
}) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">노출 순서(오름차순) 기준으로 정렬됩니다.</p>
        <button onClick={onAdd} className="cursor-pointer rounded-full bg-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-sage-600">+ 새 후기 추가</button>
      </div>
      {stories.length === 0 ? (
        <p className="text-slate-500">등록된 합격 사례가 없습니다. DB에 <code>success_stories.sql</code>을 실행했는지 확인하세요.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {stories.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-ivory px-2 py-0.5 text-xs font-bold text-slate-500">#{s.sort_order}</span>
                  <span className="font-bold text-ink">{s.company}</span>
                  <span className="text-sm text-slate-500">· {s.name}</span>
                  <span className="rounded-full bg-sand px-2 py-0.5 text-[11px] font-bold text-terracotta">{s.service}</span>
                  {!s.published && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-500">비공개</span>}
                </div>
                <p className="mt-1 truncate text-sm text-slate-500">{s.after_text} — “{s.quote}”</p>
              </div>
              <div className="flex flex-none gap-2">
                <button onClick={() => onEdit(s)} className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-ivory">수정</button>
                <button onClick={() => onDelete(s.id)} className="cursor-pointer rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-500 hover:bg-rose-50">삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- 합격 사례 편집 폼 ---------------- */
function StoryEditor({
  initial,
  onClose,
  onSaved,
}: {
  initial: StoryRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [f, setF] = useState<StoryRow>(initial);
  const [paragraphsText, setParagraphsText] = useState(initial.paragraphs.join("\n\n"));
  const [tagsText, setTagsText] = useState(initial.tags.join(", "));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  function set<K extends keyof StoryRow>(k: K, v: StoryRow[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  async function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "png";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("story-logos").upload(path, file, { upsert: false });
      if (error) throw new Error(error.message);
      const { data } = supabase.storage.from("story-logos").getPublicUrl(path);
      set("logo_url", data.publicUrl);
    } catch (e) {
      setErr("로고 업로드 실패: " + (e instanceof Error ? e.message : ""));
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!f.company.trim() || !f.name.trim()) {
      setErr("회사명과 이름은 필수입니다.");
      return;
    }
    setSaving(true);
    setErr("");
    const payload = {
      sort_order: f.sort_order,
      published: f.published,
      company: f.company.trim(),
      logo_url: f.logo_url || null,
      logo_h: f.logo_h,
      logo_w: f.logo_w,
      name: f.name.trim(),
      persona: f.persona.trim(),
      service: f.service,
      before_text: f.before_text.trim(),
      after_text: f.after_text.trim(),
      quote: f.quote.trim(),
      paragraphs: paragraphsText.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean),
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      const supabase = createClient();
      const res = f.id
        ? await supabase.from("success_stories").update(payload).eq("id", f.id)
        : await supabase.from("success_stories").insert(payload);
      if (res.error) throw new Error(res.error.message);
      onSaved();
    } catch (e) {
      setErr("저장 실패: " + (e instanceof Error ? e.message : ""));
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <div className="my-6 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">{f.id ? "합격 사례 수정" : "새 합격 사례"}</h2>
          <button onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <L label="회사명 *"><In value={f.company} onChange={(v) => set("company", v)} /></L>
          <L label="서비스">
            <select value={f.service} onChange={(e) => set("service", e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-sage">
              {SERVICES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </L>
          <L label="이름 *"><In value={f.name} onChange={(v) => set("name", v)} placeholder="예: 김ㅇㅇ 님" /></L>
          <L label="페르소나"><In value={f.persona} onChange={(v) => set("persona", v)} placeholder="예: 대학생 · 신입 취업" /></L>
          <L label="지원 전"><In value={f.before_text} onChange={(v) => set("before_text", v)} /></L>
          <L label="합격 (지원 후)"><In value={f.after_text} onChange={(v) => set("after_text", v)} /></L>
        </div>

        <L label="인용구 (한 줄 강조)"><In value={f.quote} onChange={(v) => set("quote", v)} /></L>
        <L label="본문 문단 (빈 줄로 문단 구분)">
          <textarea value={paragraphsText} onChange={(e) => setParagraphsText(e.target.value)} rows={6} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-sage" />
        </L>
        <L label="태그 (쉼표로 구분)"><In value={tagsText} onChange={setTagsText} placeholder="예: 자소서 첨삭, 현직자 연결, 이직 성공" /></L>

        <L label="회사 로고">
          <div className="flex items-center gap-4">
            {f.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.logo_url} alt="로고 미리보기" className="h-12 w-auto rounded border border-line bg-white object-contain px-2" />
            ) : (
              <span className="text-sm text-slate-400">로고 없음</span>
            )}
            <label className="cursor-pointer rounded-lg border border-line px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-ivory">
              {uploading ? "업로드 중…" : "이미지 업로드"}
              <input type="file" accept="image/*" onChange={handleLogo} className="hidden" disabled={uploading} />
            </label>
          </div>
        </L>

        <div className="grid grid-cols-3 gap-4">
          <L label="노출 순서"><In type="number" value={String(f.sort_order)} onChange={(v) => set("sort_order", Number(v) || 0)} /></L>
          <L label="로고 최대높이(px, 선택)"><In type="number" value={f.logo_h == null ? "" : String(f.logo_h)} onChange={(v) => set("logo_h", v ? Number(v) : null)} /></L>
          <L label="로고 최대너비(px, 선택)"><In type="number" value={f.logo_w == null ? "" : String(f.logo_w)} onChange={(v) => set("logo_w", v ? Number(v) : null)} /></L>
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={f.published} onChange={(e) => set("published", e.target.checked)} className="accent-sage" />
          공개 (체크 해제 시 사이트에 노출되지 않음)
        </label>

        {err && <p className="mt-4 text-sm text-rose-500">{err}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="cursor-pointer rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-ivory">취소</button>
          <button onClick={handleSave} disabled={saving || uploading} className="cursor-pointer rounded-full bg-sage px-6 py-2.5 text-sm font-bold text-white hover:bg-sage-600 disabled:opacity-50">
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 작은 UI 헬퍼 ---------------- */
function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}
function In({ value, onChange, type = "text", placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-sage"
    />
  );
}

function Shell({ children, onLogout }: { children: React.ReactNode; onLogout: (() => void) | null }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-bold text-ink">Real Bridge 관리자</Link>
          {onLogout && (
            <button onClick={onLogout} className="cursor-pointer rounded-full border border-line px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-ivory">로그아웃</button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
