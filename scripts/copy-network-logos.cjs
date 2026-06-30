// 멘토 네트워크 회사 로고: 카테고리별 정리 + 자르기/여백제거/흰배경 투명화 → public/logos/network/
// 사용자가 logo/ 에 넣은 원본 기준. SVG는 그대로(벡터·투명), 그 외는 PNG로 가공.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC = "logo";
const DEST = "public/logos/network";
fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(DEST, { recursive: true });

// 특정 로고 사전 크롭(비율 기반: 위에서부터 heightFrac 만큼만 남김)
const crops = {
  nps: { heightFrac: 0.5 }, // 위 50% (NPS만, 아래 Keppel 제거)
  "woori-sec": { heightFrac: 0.76 }, // 위 76% (우하단 워터마크 제거)
};

const groups = [
  {
    category: "자산운용 · 리츠",
    items: [
      ["미래에셋자산운용.png", "미래에셋자산운용", "mirae-am"],
      ["삼성SRA자산운용.png", "삼성SRA자산운용", "samsung-sra"],
      ["kb자산운용.png", "KB자산운용", "kb-am"],
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
      ["sk리츠운용.png", "SK리츠운용", "sk-reits"],
      ["롯데 AMC.svg", "롯데AMC", "lotte-amc"],
      ["코람코.png", "코람코자산신탁", "koramco"],
      ["대신자산신탁.png", "대신자산신탁", "daishin-trust"],
      ["ARA.png", "ARA Korea", "ara"],
      ["keppel.png", "Keppel", "keppel"],
      ["켄달스퀘어.png", "켄달스퀘어", "kendall"],
    ],
  },
  {
    category: "증권",
    items: [
      ["삼성증권.png", "삼성증권", "samsung-sec"],
      ["미래에셋증권.png", "미래에셋증권", "mirae-sec"],
      ["한투증권.png", "한국투자증권", "kis-sec"],
      ["nh투자증권.png", "NH투자증권", "nh-sec"],
      ["kb증권.jpg", "KB증권", "kb-sec"],
      ["신한투자증권.png", "신한투자증권", "shinhan-sec"],
      ["메리츠증권.png", "메리츠증권", "meritz"],
      ["한화투자증권.jpg", "한화투자증권", "hanwha-sec"],
      ["우리투자증권.jpg", "우리투자증권", "woori-sec"],
      ["유진투자증권.jpg", "유진투자증권", "eugene-sec"],
    ],
  },
  {
    category: "기관투자자 · 은행 · 캐피탈",
    items: [
      ["국민연금.jpg", "국민연금공단", "nps"],
      ["한국투자공사.png", "한국투자공사(KIC)", "kic"],
      ["aberdeen.png", "abrdn", "aberdeen"],
      ["Brookfield.png", "Brookfield", "brookfield"],
      ["kdb산업은행.jpg", "KDB산업은행", "kdb"],
      ["국민은행.jpg", "KB국민은행", "kb-bank"],
      ["우리은행.jpg", "우리은행", "woori-bank"],
      ["신한캐피탈.svg", "신한캐피탈", "shinhan-cap"],
      ["db손해보험.png", "DB손해보험", "db-ins"],
      ["kb손해보험.jpg", "KB손해보험", "kb-ins"],
      ["삼천리.svg", "삼천리", "samchully"],
    ],
  },
  {
    category: "부동산 개발 · 신탁 · 디벨로퍼",
    items: [
      ["신영.jpg", "신영", "shinyoung"],
      ["엠디엠.svg", "MDM", "mdm"],
      ["한국토지신탁.png", "한국토지신탁", "koreit-trust"],
      ["BS.jpg", "BS", "bs"],
      ["신세계프라퍼티.png", "신세계프라퍼티", "shinsegae-prop"],
      ["weave living.png", "Weave Living", "weave"],
    ],
  },
  {
    category: "외국계 부동산 서비스사",
    items: [
      ["CBRE.png", "CBRE", "cbre"],
      ["cushman.jpg", "Cushman & Wakefield", "cushman"],
      ["jll.png", "JLL", "jll"],
      ["SAVILLS.png", "Savills", "savills"],
      ["NAI Korea.png", "NAI Korea", "nai"],
      ["젠스타메이트.png", "젠스타메이트", "genstar"],
      ["알스퀘어.png", "알스퀘어", "rsquare"],
    ],
  },
  {
    category: "회계법인",
    items: [
      ["삼정kpmg.png", "삼정KPMG", "kpmg"],
      ["Deloitte.jpeg", "Deloitte", "deloitte"],
    ],
  },
  {
    category: "감정평가법인",
    items: [
      ["경일감정평가법인.png", "경일감정평가법인", "kyungil-appr"],
      ["삼창감정평가법인.jpg", "삼창감정평가법인", "samchang-appr"],
      ["나라감정평가법인.png", "나라감정평가법인", "nara-appr"],
      ["가온감정평가법인.jpg", "가온감정평가법인", "gaon-appr"],
    ],
  },
];

async function processRaster(srcPath, destPath, crop) {
  // EXIF 자동 회전을 먼저 적용해 실제 픽셀 버퍼 생성
  let buf = await sharp(srcPath).rotate().png().toBuffer();
  // 크롭(별도 단계 — extract와 trim 체인 시 sharp 오류 방지)
  if (crop && crop.heightFrac) {
    const meta = await sharp(buf).metadata();
    const h = Math.min(
      meta.height,
      Math.max(1, Math.round(meta.height * crop.heightFrac)),
    );
    buf = await sharp(buf)
      .extract({ left: 0, top: 0, width: meta.width, height: h })
      .png()
      .toBuffer();
  }
  // 여백 제거(흰 테두리 트림) — 새 인스턴스에서
  const trimmed = await sharp(buf).trim({ threshold: 25 }).png().toBuffer();
  // 흰 배경 → 투명
  const { data, info } = await sharp(trimmed)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] >= 238 && data[i + 1] >= 238 && data[i + 2] >= 238) {
      data[i + 3] = 0;
    }
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(destPath);
}

(async () => {
  const manifest = [];
  let count = 0;
  const missing = [];
  for (const g of groups) {
    const items = [];
    for (const [file, name, slug] of g.items) {
      const srcPath = path.join(SRC, file);
      if (!fs.existsSync(srcPath)) {
        missing.push(file);
        continue;
      }
      const ext = path.extname(file).toLowerCase();
      let destName;
      if (ext === ".svg") {
        destName = slug + ".svg"; // 벡터는 그대로 (이미 투명·확대 무손실)
        fs.copyFileSync(srcPath, path.join(DEST, destName));
      } else {
        destName = slug + ".png";
        try {
          await processRaster(srcPath, path.join(DEST, destName), crops[slug]);
        } catch (e) {
          console.log("처리 실패:", file, "->", e.message);
          // 가공 실패 시 원본을 그대로 복사(투명/트림 없이라도 표시되게)
          fs.copyFileSync(srcPath, path.join(DEST, destName));
        }
      }
      items.push({ name, src: "/logos/network/" + destName });
      count++;
    }
    manifest.push({ category: g.category, items });
  }
  fs.writeFileSync("lib/network-logos.json", JSON.stringify(manifest, null, 2));
  console.log("처리 완료:", count, "개");
  if (missing.length) console.log("누락:", missing.join(", "));
})();
