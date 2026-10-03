// 로고 이미지 파일 안의 여백(투명·흰 배경)을 제외한 실제 내용 크기를 분석해,
// 다른 로고들과 시각적으로 비슷한 높이로 보이도록 표시용 최대높이/최대너비(px)를
// 자동 계산한다. 관리자가 픽셀 값을 직접 알아내 입력할 필요가 없도록 하기 위함.

const TARGET_VISUAL_HEIGHT = 42; // 합격 사례 로고 영역 기본 높이와 동일하게 맞춘다
const MAX_WIDTH_CEIL = 160;

export async function computeLogoFit(file: File): Promise<{ h: number; w: number }> {
  const fallback = { h: TARGET_VISUAL_HEIGHT, w: MAX_WIDTH_CEIL };
  const img = await loadImage(file).catch(() => null);
  if (!img) return fallback;

  const w0 = img.naturalWidth;
  const h0 = img.naturalHeight;
  if (!w0 || !h0) return fallback;

  const scale = Math.min(1, 300 / Math.max(w0, h0));
  const cw = Math.max(1, Math.round(w0 * scale));
  const ch = Math.max(1, Math.round(h0 * scale));

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  if (!ctx) return fallback;
  ctx.drawImage(img, 0, 0, cw, ch);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, cw, ch).data;
  } catch {
    return fallback; // 캔버스 오염(CORS) 등으로 읽을 수 없으면 기본값 사용
  }

  const alpha = hasTransparency(data);
  const bg = alpha ? null : cornerColor(data);
  const box = findContentBox(data, cw, ch, alpha, bg);

  const fracH = box ? (box.maxY - box.minY + 1) / ch : 1;
  const trimmedH = Math.max(1, fracH * h0);

  let mh = Math.round((TARGET_VISUAL_HEIGHT * h0) / trimmedH);
  let mw = Math.round((w0 * TARGET_VISUAL_HEIGHT) / trimmedH);

  if (mw > MAX_WIDTH_CEIL) {
    mw = MAX_WIDTH_CEIL;
    mh = Math.round((h0 * mw) / w0);
  }

  return { h: clamp(mh, 24, 100), w: clamp(mw, 40, MAX_WIDTH_CEIL) };
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { resolve(img); URL.revokeObjectURL(url); };
    img.onerror = () => { reject(new Error("이미지를 읽을 수 없습니다.")); URL.revokeObjectURL(url); };
    img.src = url;
  });
}

function hasTransparency(data: Uint8ClampedArray): boolean {
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 250) return true;
  }
  return false;
}

function cornerColor(data: Uint8ClampedArray): [number, number, number] {
  return [data[0], data[1], data[2]]; // 좌상단 픽셀 = 배경색으로 취급
}

function findContentBox(data: Uint8ClampedArray, w: number, h: number, alpha: boolean, bg: [number, number, number] | null) {
  let minX = w, minY = h, maxX = -1, maxY = -1;
  const tolerance = 16;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const isContent = alpha
        ? data[i + 3] >= 20
        : Math.abs(data[i] - bg![0]) > tolerance || Math.abs(data[i + 1] - bg![1]) > tolerance || Math.abs(data[i + 2] - bg![2]) > tolerance;
      if (isContent) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { minX, minY, maxX, maxY };
}
