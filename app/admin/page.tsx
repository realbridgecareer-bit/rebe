"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Consultation = {
  id: string; created_at: string; name: string; phone: string;
  email: string | null; program: string | null; message: string; status: string;
};
type StoryRow = {
  id?: string; sort_order: number; published: boolean; company: string;
  logo_url: string; logo_h: number | null; logo_w: number | null; name: string;
  persona: string; service: string; before_text: string; after_text: string;
  quote: string; paragraphs: string[]; tags: string[];
};
type PkgRow = {
  id?: string; sort_order: number; published: boolean; name: string; sub: string;
  detail: string; price: string; sale_price: string | null; features: string[]; featured: boolean;
};
type ReviewRow = {
  id?: string; sort_order: number; published: boolean; name: string;
  service: string; persona: string; text: string;
};
type Settings = { id: number; promo_enabled: boolean; promo_label: string; promo_banner: string };

type State = "loading" | "denied" | "ready";
type Tab = "consultations" | "stories" | "packages" | "reviews" | "settings";
const SERVICES = ["Real Connect", "Real Bridge", "Real Success"];

const emptyStory = (o: number): StoryRow => ({ sort_order: o, published: true, company: "", logo_url: "", logo_h: null, logo_w: null, name: "", persona: "", service: "Real Success", before_text: "", after_text: "", quote: "", paragraphs: [], tags: [] });
const emptyPkg = (o: number): PkgRow => ({ sort_order: o, published: true, name: "", sub: "대면 컨설팅", detail: "", price: "", sale_price: "", features: [], featured: false });
const emptyReview = (o: number): ReviewRow => ({ sort_order: o, published: true, name: "", service: "Real Connect", persona: "", text: "" });

export default function AdminPage() {
  const router = useRouter();
  const [state, setState] = useState<State>("loading");
  const [tab, setTab] = useState<Tab>("consultations");
  const [rows, setRows] = useState<Consultation[]>([]);
  const [stories, setStories] = useState<StoryRow[]>([]);
  const [packages, setPackages] = useState<PkgRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [editingStory, setEditingStory] = useState<StoryRow | null>(null);
  const [editingPkg, setEditingPkg] = useState<PkgRow | null>(null);
  const [editingReview, setEditingReview] = useState<ReviewRow | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { router.replace("/login"); return; }
      const { data: adminRow } = await supabase.from("admins").select("user_id").eq("user_id", sess.session.user.id).maybeSingle();
      if (!adminRow) { setState("denied"); return; }
      await Promise.all([loadConsultations(), loadStories(), loadPackages(), loadReviews(), loadSettings()]);
      setState("ready");
    })();
  }, [router]);

  async function loadConsultations() {
    const { data } = await createClient().from("consultations").select("*").order("created_at", { ascending: false });
    if (data) setRows(data as Consultation[]);
  }
  async function loadStories() {
    const { data } = await createClient().from("success_stories").select("*").order("sort_order").order("created_at", { ascending: false });
    if (data) setStories(data as StoryRow[]);
  }
  async function loadPackages() {
    const { data } = await createClient().from("packages").select("*").order("sort_order");
    if (data) setPackages(data as PkgRow[]);
  }
  async function loadReviews() {
    const { data } = await createClient().from("reviews").select("*").order("sort_order");
    if (data) setReviews(data as ReviewRow[]);
  }
  async function loadSettings() {
    const { data } = await createClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (data) setSettings(data as Settings);
  }
  async function handleLogout() { await createClient().auth.signOut(); router.replace("/"); }

  async function del(table: string, id: string | undefined, reload: () => Promise<void>) {
    if (!id) return;
    if (!confirm("삭제할까요? 되돌릴 수 없습니다.")) return;
    const { error } = await createClient().from(table).delete().eq("id", id);
    if (error) alert("삭제 실패: " + error.message);
    await reload();
  }

  if (state === "loading") return <Shell onLogout={null}><p className="text-slate-500">불러오는 중…</p></Shell>;
  if (state === "denied") return (
    <Shell onLogout={handleLogout}>
      <h1 className="text-2xl font-bold text-ink">접근 권한이 없습니다</h1>
      <p className="mt-3 text-slate-500">관리자 계정으로 로그인해야 이 페이지를 볼 수 있습니다.</p>
      <Link href="/" className="mt-6 inline-block font-medium text-terracotta">← 홈으로</Link>
    </Shell>
  );

  const tabs: [Tab, string][] = [
    ["consultations", `상담 신청 (${rows.length})`],
    ["stories", `합격 사례 (${stories.length})`],
    ["packages", `서비스 비용 (${packages.length})`],
    ["reviews", `컨설팅 후기 (${reviews.length})`],
    ["settings", "할인 설정"],
  ];

  return (
    <Shell onLogout={handleLogout}>
      <div className="mb-8 flex flex-wrap gap-1 border-b border-line">
        {tabs.map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`-mb-px cursor-pointer border-b-2 px-4 py-2.5 text-sm font-bold transition-colors ${tab === t ? "border-sage text-sage" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "consultations" && <ConsultationsView rows={rows} />}
      {tab === "stories" && <StoriesView stories={stories} onAdd={() => setEditingStory(emptyStory(stories.length + 1))} onEdit={setEditingStory} onDelete={(id) => del("success_stories", id, loadStories)} />}
      {tab === "packages" && <PackagesView packages={packages} onAdd={() => setEditingPkg(emptyPkg(packages.length + 1))} onEdit={setEditingPkg} onDelete={(id) => del("packages", id, loadPackages)} />}
      {tab === "reviews" && <ReviewsView reviews={reviews} onAdd={() => setEditingReview(emptyReview(reviews.length + 1))} onEdit={setEditingReview} onDelete={(id) => del("reviews", id, loadReviews)} />}
      {tab === "settings" && <SettingsView settings={settings} onSaved={loadSettings} />}

      {editingStory && <StoryEditor initial={editingStory} onClose={() => setEditingStory(null)} onSaved={async () => { setEditingStory(null); await loadStories(); }} />}
      {editingPkg && <PkgEditor initial={editingPkg} onClose={() => setEditingPkg(null)} onSaved={async () => { setEditingPkg(null); await loadPackages(); }} />}
      {editingReview && <ReviewEditor initial={editingReview} onClose={() => setEditingReview(null)} onSaved={async () => { setEditingReview(null); await loadReviews(); }} />}
    </Shell>
  );
}

/* ---------- 상담 ---------- */
function ConsultationsView({ rows }: { rows: Consultation[] }) {
  if (rows.length === 0) return <p className="text-slate-500">아직 접수된 상담이 없습니다.</p>;
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-ivory text-slate-500"><tr>
          <th className="px-4 py-3 font-semibold">접수일</th><th className="px-4 py-3 font-semibold">이름</th>
          <th className="px-4 py-3 font-semibold">연락처</th><th className="px-4 py-3 font-semibold">이메일</th>
          <th className="px-4 py-3 font-semibold">관심 패키지</th><th className="px-4 py-3 font-semibold">상담 내용</th>
        </tr></thead>
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

/* ---------- 합격 사례 목록 ---------- */
function StoriesView({ stories, onAdd, onEdit, onDelete }: { stories: StoryRow[]; onAdd: () => void; onEdit: (s: StoryRow) => void; onDelete: (id?: string) => void }) {
  return (
    <ListShell addLabel="+ 새 후기 추가" onAdd={onAdd} empty={stories.length === 0} emptyText="success_stories.sql을 실행했는지 확인하세요.">
      {stories.map((s) => (
        <Row key={s.id} order={s.sort_order} title={s.company} sub={`${s.name} · ${s.after_text}`} badge={s.service} hidden={!s.published} onEdit={() => onEdit(s)} onDelete={() => onDelete(s.id)} />
      ))}
    </ListShell>
  );
}

/* ---------- 서비스 비용 목록 ---------- */
function PackagesView({ packages, onAdd, onEdit, onDelete }: { packages: PkgRow[]; onAdd: () => void; onEdit: (p: PkgRow) => void; onDelete: (id?: string) => void }) {
  return (
    <ListShell addLabel="+ 새 패키지 추가" onAdd={onAdd} empty={packages.length === 0} emptyText="site_content.sql을 실행했는지 확인하세요.">
      {packages.map((p) => (
        <Row key={p.id} order={p.sort_order} title={p.name} sub={`${p.sub} ${p.detail} · 정가 ${p.price}${p.sale_price ? ` → 할인 ${p.sale_price}` : ""}`} badge={p.featured ? "인기" : undefined} hidden={!p.published} onEdit={() => onEdit(p)} onDelete={() => onDelete(p.id)} />
      ))}
    </ListShell>
  );
}

/* ---------- 컨설팅 후기 목록 ---------- */
function ReviewsView({ reviews, onAdd, onEdit, onDelete }: { reviews: ReviewRow[]; onAdd: () => void; onEdit: (r: ReviewRow) => void; onDelete: (id?: string) => void }) {
  return (
    <ListShell addLabel="+ 새 후기 추가" onAdd={onAdd} empty={reviews.length === 0} emptyText="site_content.sql을 실행했는지 확인하세요.">
      {reviews.map((r) => (
        <Row key={r.id} order={r.sort_order} title={r.name} sub={r.text} badge={r.service} hidden={!r.published} onEdit={() => onEdit(r)} onDelete={() => onDelete(r.id)} />
      ))}
    </ListShell>
  );
}

/* ---------- 할인 설정 ---------- */
function SettingsView({ settings, onSaved }: { settings: Settings | null; onSaved: () => Promise<void> }) {
  const [enabled, setEnabled] = useState(settings?.promo_enabled ?? true);
  const [label, setLabel] = useState(settings?.promo_label ?? "30% 할인");
  const [banner, setBanner] = useState(settings?.promo_banner ?? "전 서비스 30% 할인");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  if (!settings) return <p className="text-slate-500">site_content.sql을 실행하면 할인 설정이 나타납니다.</p>;

  async function save() {
    setSaving(true); setMsg("");
    const { error } = await createClient().from("site_settings").update({ promo_enabled: enabled, promo_label: label, promo_banner: banner, updated_at: new Date().toISOString() }).eq("id", 1);
    setSaving(false);
    if (error) { setMsg("저장 실패: " + error.message); return; }
    setMsg("저장되었습니다. 홈에서 확인하세요.");
    await onSaved();
  }

  return (
    <div className="max-w-lg">
      <label className="flex items-center gap-3 rounded-xl border border-line bg-white p-4">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-5 w-5 accent-sage" />
        <span className="font-bold text-ink">할인 프로모션 표시</span>
        <span className="text-sm text-slate-500">{enabled ? "켜짐 (배너·할인가·뱃지 노출)" : "꺼짐 (정가만 표시, 배너 숨김)"}</span>
      </label>
      <L label="가격카드 뱃지 문구"><In value={label} onChange={setLabel} placeholder="예: 30% 할인" /></L>
      <L label="상단 배너 문구"><In value={banner} onChange={setBanner} placeholder="예: 전 서비스 30% 할인" /></L>
      {msg && <p className="mt-4 text-sm text-sage">{msg}</p>}
      <button onClick={save} disabled={saving} className="mt-6 cursor-pointer rounded-full bg-sage px-6 py-2.5 text-sm font-bold text-white hover:bg-sage-600 disabled:opacity-50">{saving ? "저장 중…" : "저장"}</button>
      <p className="mt-4 text-xs leading-relaxed text-slate-400">※ 할인가는 각 패키지의 &lsquo;할인가&rsquo; 값으로 표시됩니다. 정가만 남기려면 프로모션을 끄거나 서비스 비용 탭에서 할인가를 비우세요.</p>
    </div>
  );
}

/* ---------- 공용 리스트/행 ---------- */
function ListShell({ addLabel, onAdd, empty, emptyText, children }: { addLabel: string; onAdd: () => void; empty: boolean; emptyText: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">노출 순서(오름차순) 기준 정렬</p>
        <button onClick={onAdd} className="cursor-pointer rounded-full bg-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-sage-600">{addLabel}</button>
      </div>
      {empty ? <p className="text-slate-500">{emptyText}</p> : <div className="flex flex-col gap-3">{children}</div>}
    </div>
  );
}
function Row({ order, title, sub, badge, hidden, onEdit, onDelete }: { order: number; title: string; sub: string; badge?: string; hidden?: boolean; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="rounded bg-ivory px-2 py-0.5 text-xs font-bold text-slate-500">#{order}</span>
          <span className="font-bold text-ink">{title}</span>
          {badge && <span className="rounded-full bg-sand px-2 py-0.5 text-[11px] font-bold text-terracotta">{badge}</span>}
          {hidden && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-500">비공개</span>}
        </div>
        <p className="mt-1 truncate text-sm text-slate-500">{sub}</p>
      </div>
      <div className="flex flex-none gap-2">
        <button onClick={onEdit} className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-ivory">수정</button>
        <button onClick={onDelete} className="cursor-pointer rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-500 hover:bg-rose-50">삭제</button>
      </div>
    </div>
  );
}

/* ---------- 합격 사례 편집 ---------- */
function StoryEditor({ initial, onClose, onSaved }: { initial: StoryRow; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<StoryRow>(initial);
  const [paras, setParas] = useState(initial.paragraphs.join("\n\n"));
  const [tags, setTags] = useState(initial.tags.join(", "));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const set = <K extends keyof StoryRow>(k: K, v: StoryRow[K]) => setF((p) => ({ ...p, [k]: v }));

  async function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setErr("");
    try {
      const supabase = createClient();
      const path = `${crypto.randomUUID()}.${file.name.split(".").pop() || "png"}`;
      const { error } = await supabase.storage.from("story-logos").upload(path, file);
      if (error) throw new Error(error.message);
      set("logo_url", supabase.storage.from("story-logos").getPublicUrl(path).data.publicUrl);
    } catch (e) { setErr("로고 업로드 실패: " + (e instanceof Error ? e.message : "")); } finally { setUploading(false); }
  }
  async function save() {
    if (!f.company.trim() || !f.name.trim()) { setErr("회사명과 이름은 필수입니다."); return; }
    setSaving(true); setErr("");
    const payload = { sort_order: f.sort_order, published: f.published, company: f.company.trim(), logo_url: f.logo_url || null, logo_h: f.logo_h, logo_w: f.logo_w, name: f.name.trim(), persona: f.persona.trim(), service: f.service, before_text: f.before_text.trim(), after_text: f.after_text.trim(), quote: f.quote.trim(), paragraphs: paras.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean), tags: tags.split(",").map((t) => t.trim()).filter(Boolean) };
    const res = f.id ? await createClient().from("success_stories").update(payload).eq("id", f.id) : await createClient().from("success_stories").insert(payload);
    if (res.error) { setErr("저장 실패: " + res.error.message); setSaving(false); return; }
    onSaved();
  }
  return (
    <Modal title={f.id ? "합격 사례 수정" : "새 합격 사례"} onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <L label="회사명 *"><In value={f.company} onChange={(v) => set("company", v)} /></L>
        <L label="서비스"><Sel value={f.service} onChange={(v) => set("service", v)} /></L>
        <L label="이름 *"><In value={f.name} onChange={(v) => set("name", v)} placeholder="예: 김ㅇㅇ 님" /></L>
        <L label="페르소나"><In value={f.persona} onChange={(v) => set("persona", v)} /></L>
        <L label="지원 전"><In value={f.before_text} onChange={(v) => set("before_text", v)} /></L>
        <L label="합격 (지원 후)"><In value={f.after_text} onChange={(v) => set("after_text", v)} /></L>
      </div>
      <L label="인용구"><In value={f.quote} onChange={(v) => set("quote", v)} /></L>
      <L label="본문 문단 (빈 줄로 문단 구분)"><Area value={paras} onChange={setParas} rows={6} /></L>
      <L label="태그 (쉼표로 구분)"><In value={tags} onChange={setTags} /></L>
      <L label="회사 로고">
        <div className="flex items-center gap-4">
          {f.logo_url ? <img src={f.logo_url} alt="로고" className="h-12 w-auto rounded border border-line object-contain px-2" /> : <span className="text-sm text-slate-400">로고 없음</span>}
          <label className="cursor-pointer rounded-lg border border-line px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-ivory">{uploading ? "업로드 중…" : "이미지 업로드"}<input type="file" accept="image/*" onChange={handleLogo} className="hidden" disabled={uploading} /></label>
        </div>
      </L>
      <div className="grid grid-cols-3 gap-4">
        <L label="노출 순서"><In type="number" value={String(f.sort_order)} onChange={(v) => set("sort_order", Number(v) || 0)} /></L>
        <L label="로고 최대높이(px)"><In type="number" value={f.logo_h == null ? "" : String(f.logo_h)} onChange={(v) => set("logo_h", v ? Number(v) : null)} /></L>
        <L label="로고 최대너비(px)"><In type="number" value={f.logo_w == null ? "" : String(f.logo_w)} onChange={(v) => set("logo_w", v ? Number(v) : null)} /></L>
      </div>
      <Pub checked={f.published} onChange={(v) => set("published", v)} />
      <Save err={err} saving={saving || uploading} onClose={onClose} onSave={save} />
    </Modal>
  );
}

/* ---------- 서비스 비용 편집 ---------- */
function PkgEditor({ initial, onClose, onSaved }: { initial: PkgRow; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<PkgRow>(initial);
  const [feat, setFeat] = useState(initial.features.join("\n"));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = <K extends keyof PkgRow>(k: K, v: PkgRow[K]) => setF((p) => ({ ...p, [k]: v }));
  async function save() {
    if (!f.name.trim()) { setErr("패키지명은 필수입니다."); return; }
    setSaving(true); setErr("");
    const payload = { sort_order: f.sort_order, published: f.published, name: f.name.trim(), sub: f.sub.trim(), detail: f.detail.trim(), price: f.price.trim(), sale_price: f.sale_price?.trim() || null, features: feat.split("\n").map((s) => s.trim()).filter(Boolean), featured: f.featured };
    const res = f.id ? await createClient().from("packages").update(payload).eq("id", f.id) : await createClient().from("packages").insert(payload);
    if (res.error) { setErr("저장 실패: " + res.error.message); setSaving(false); return; }
    onSaved();
  }
  return (
    <Modal title={f.id ? "서비스 비용 수정" : "새 패키지"} onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <L label="패키지명 *"><In value={f.name} onChange={(v) => set("name", v)} placeholder="예: Real Connect" /></L>
        <L label="라벨"><In value={f.sub} onChange={(v) => set("sub", v)} placeholder="예: 대면 컨설팅" /></L>
        <L label="강조 스펙"><In value={f.detail} onChange={(v) => set("detail", v)} placeholder="예: 90분 1회 / 시간 제한 없음" /></L>
        <L label="정가"><In value={f.price} onChange={(v) => set("price", v)} placeholder="예: 68만원" /></L>
        <L label="할인가 (비우면 할인 없음)"><In value={f.sale_price ?? ""} onChange={(v) => set("sale_price", v)} placeholder="예: 48만원" /></L>
        <L label="노출 순서"><In type="number" value={String(f.sort_order)} onChange={(v) => set("sort_order", Number(v) || 0)} /></L>
      </div>
      <L label="혜택 항목 (한 줄에 하나)"><Area value={feat} onChange={setFeat} rows={6} /></L>
      <label className="mt-3 flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-sage" />인기 패키지로 강조</label>
      <Pub checked={f.published} onChange={(v) => set("published", v)} />
      <Save err={err} saving={saving} onClose={onClose} onSave={save} />
    </Modal>
  );
}

/* ---------- 컨설팅 후기 편집 ---------- */
function ReviewEditor({ initial, onClose, onSaved }: { initial: ReviewRow; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<ReviewRow>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = <K extends keyof ReviewRow>(k: K, v: ReviewRow[K]) => setF((p) => ({ ...p, [k]: v }));
  async function save() {
    if (!f.name.trim() || !f.text.trim()) { setErr("이름과 후기 내용은 필수입니다."); return; }
    setSaving(true); setErr("");
    const payload = { sort_order: f.sort_order, published: f.published, name: f.name.trim(), service: f.service, persona: f.persona.trim(), text: f.text.trim() };
    const res = f.id ? await createClient().from("reviews").update(payload).eq("id", f.id) : await createClient().from("reviews").insert(payload);
    if (res.error) { setErr("저장 실패: " + res.error.message); setSaving(false); return; }
    onSaved();
  }
  return (
    <Modal title={f.id ? "컨설팅 후기 수정" : "새 컨설팅 후기"} onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <L label="이름 *"><In value={f.name} onChange={(v) => set("name", v)} placeholder="예: 김ㅇㅇ 님" /></L>
        <L label="서비스"><Sel value={f.service} onChange={(v) => set("service", v)} /></L>
      </div>
      <L label="페르소나"><In value={f.persona} onChange={(v) => set("persona", v)} placeholder="예: 신입 · 면접 준비" /></L>
      <L label="후기 내용 *"><Area value={f.text} onChange={(v) => set("text", v)} rows={5} /></L>
      <L label="노출 순서"><In type="number" value={String(f.sort_order)} onChange={(v) => set("sort_order", Number(v) || 0)} /></L>
      <Pub checked={f.published} onChange={(v) => set("published", v)} />
      <Save err={err} saving={saving} onClose={onClose} onSave={save} />
    </Modal>
  );
}

/* ---------- 공용 UI ---------- */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <div className="my-6 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">{title}</h2>
          <button onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Save({ err, saving, onClose, onSave }: { err: string; saving: boolean; onClose: () => void; onSave: () => void }) {
  return (
    <>
      {err && <p className="mt-4 text-sm text-rose-500">{err}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onClose} className="cursor-pointer rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-ivory">취소</button>
        <button onClick={onSave} disabled={saving} className="cursor-pointer rounded-full bg-sage px-6 py-2.5 text-sm font-bold text-white hover:bg-sage-600 disabled:opacity-50">{saving ? "저장 중…" : "저장"}</button>
      </div>
    </>
  );
}
function Pub({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return <label className="mt-3 flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-sage" />공개 (체크 해제 시 사이트에 노출 안 됨)</label>;
}
function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mt-4"><label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>{children}</div>;
}
function In({ value, onChange, type = "text", placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-sage" />;
}
function Area({ value, onChange, rows }: { value: string; onChange: (v: string) => void; rows: number }) {
  return <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-sage" />;
}
function Sel({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-sage">{SERVICES.map((s) => <option key={s}>{s}</option>)}</select>;
}
function Shell({ children, onLogout }: { children: React.ReactNode; onLogout: (() => void) | null }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-bold text-ink">Real Bridge 관리자</Link>
          {onLogout && <button onClick={onLogout} className="cursor-pointer rounded-full border border-line px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-ivory">로그아웃</button>}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
