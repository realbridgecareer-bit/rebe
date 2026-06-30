// 멘토 네트워크 회사 로고를 카테고리별로 정리해 public/logos/network/로 복사하고
// 매니페스트(lib/network-logos.json)를 생성한다. (사용자가 logo/ 에 넣은 파일 기준)
const fs = require("fs");
const path = require("path");

const SRC = "logo";
const DEST = "public/logos/network";
fs.mkdirSync(DEST, { recursive: true });

const groups = [
  {
    category: "자산운용 · 리츠",
    items: [
      ["미래에셋자산운용.png", "미래에셋자산운용", "mirae-am"],
      ["삼성SRA자산운용.png", "삼성SRA자산운용", "samsung-sra"],
      ["KB자산운용", "KB자산운용", "kb-am", "kb자산운용.png"],
      ["이지스자산운용 로고.jpg", "이지스자산운용", "igis"],
      ["마스턴투자운용.png", "마스턴투자운용", "mastern"],
      ["코레이트자산운용.jpg", "코레이트자산운용", "coreit"],
      ["크리에이트자산운용.png", "크리에이트자산운용", "create-am"],
      ["키움투자자산운용.jpg", "키움투자자산운용", "kiwoom-am"],
      ["한국투자신탁운용.png", "한국투자신탁운용", "kitc"],
      ["한투리얼에셋운용.png", "한투리얼에셋운용", "kis-realasset"],
      ["현대인베스트먼트자산운용.jpg", "현대인베스트먼트자산운용", "hyundai-inv"],
      ["nh아문디자산운용.png", "NH아문디자산운용", "nh-amundi"],
      ["교보AIM자산운용.png", "교보AIM자산운용", "kyobo-aim"],
      ["스틱얼터너티브자산운용.png", "스틱얼터너티브자산운용", "stic"],
      ["퍼시픽자산운용.png", "퍼시픽자산운용", "pacific-am"],
      ["이화자산운용.jpg", "이화자산운용", "ewha-am"],
      ["kt투자운용.png", "KT투자운용", "kt-inv"],
      ["aberdeen.png", "abrdn", "aberdeen"],
      ["sk리츠운용.png", "SK리츠운용", "sk-reits"],
      ["롯데 AMC.svg", "롯데AMC", "lotte-amc"],
    ],
  },
  {
    category: "증권",
    items: [
      ["삼성증권.png", "삼성증권", "samsung-sec"],
      ["미래에셋증권.png", "미래에셋증권", "mirae-sec"],
      ["한투증권.png", "한국투자증권", "kis-sec"],
      ["NH투자증권", "NH투자증권", "nh-sec", "nh투자증권.png"],
      ["KB증권", "KB증권", "kb-sec", "kb증권.jpg"],
      ["신한투자증권.png", "신한투자증권", "shinhan-sec"],
      ["메리츠증권.png", "메리츠증권", "meritz"],
      ["한화투자증권.jpg", "한화투자증권", "hanwha-sec"],
      ["우리투자증권.jpg", "우리투자증권", "woori-sec"],
      ["유진투자증권.jpg", "유진투자증권", "eugene-sec"],
    ],
  },
  {
    category: "은행 · 기관 · 캐피탈",
    items: [
      ["국민연금.jpg", "국민연금공단", "nps"],
      ["한국투자공사.png", "한국투자공사(KIC)", "kic"],
      ["kdb산업은행.jpg", "KDB산업은행", "kdb"],
      ["국민은행.jpg", "KB국민은행", "kb-bank"],
      ["우리은행.jpg", "우리은행", "woori-bank"],
      ["신한캐피탈.svg", "신한캐피탈", "shinhan-cap"],
      ["db손해보험.png", "DB손해보험", "db-ins"],
      ["kb손해보험.jpg", "KB손해보험", "kb-ins"],
    ],
  },
  {
    category: "부동산 개발 · 신탁 · 디벨로퍼",
    items: [
      ["신세계프라퍼티.png", "신세계프라퍼티", "shinsegae-prop"],
      ["코람코.png", "코람코자산신탁", "koramco"],
      ["대신자산신탁.png", "대신자산신탁", "daishin-trust"],
      ["한국토지신탁.png", "한국토지신탁", "koreit-trust"],
      ["엠디엠.svg", "MDM", "mdm"],
      ["신영.jpg", "신영", "shinyoung"],
      ["ARA.png", "ARA Korea", "ara"],
      ["Brookfield.png", "Brookfield", "brookfield"],
      ["keppel.png", "Keppel", "keppel"],
      ["weave living.png", "Weave Living", "weave"],
      ["켄달스퀘어.png", "켄달스퀘어", "kendall"],
      ["삼천리.svg", "삼천리", "samchully"],
      ["BS.jpg", "BS", "bs"],
    ],
  },
  {
    category: "외국계 · 부동산서비스 · 컨설팅",
    items: [
      ["CBRE.png", "CBRE", "cbre"],
      ["cushman.jpg", "Cushman & Wakefield", "cushman"],
      ["jll.png", "JLL", "jll"],
      ["SAVILLS.png", "Savills", "savills"],
      ["Deloitte.jpeg", "Deloitte", "deloitte"],
      ["삼정kpmg.png", "삼정KPMG", "kpmg"],
      ["NAI Korea.png", "NAI Korea", "nai"],
      ["젠스타메이트.png", "젠스타메이트", "genstar"],
      ["알스퀘어.png", "알스퀘어", "rsquare"],
    ],
  },
  {
    category: "감정평가법인",
    items: [
      ["가온감정평가법인.jpg", "가온감정평가법인", "gaon-appr"],
      ["경일감정평가법인.png", "경일감정평가법인", "kyungil-appr"],
      ["나라감정평가법인.png", "나라감정평가법인", "nara-appr"],
      ["삼창감정평가법인.jpg", "삼창감정평가법인", "samchang-appr"],
    ],
  },
];

const manifest = [];
let count = 0;
const missing = [];
for (const g of groups) {
  const items = [];
  for (const entry of g.items) {
    // entry: [file, name, slug] 또는 [_, name, slug, file]
    const file = entry.length === 4 ? entry[3] : entry[0];
    const name = entry[1];
    const slug = entry[2];
    const srcPath = path.join(SRC, file);
    if (!fs.existsSync(srcPath)) {
      missing.push(file);
      continue;
    }
    const ext = path.extname(file).toLowerCase();
    const dest = slug + ext;
    fs.copyFileSync(srcPath, path.join(DEST, dest));
    items.push({ name, src: "/logos/network/" + dest });
    count++;
  }
  manifest.push({ category: g.category, items });
}

fs.writeFileSync("lib/network-logos.json", JSON.stringify(manifest, null, 2));
console.log("복사 완료:", count, "개");
if (missing.length) console.log("누락(파일명 불일치):", missing.join(", "));
