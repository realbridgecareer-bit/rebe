"use client";

import { useEffect, useState } from "react";

export function Lightbox({
  images,
  index = 0,
  alt = "사진 크게 보기",
  onClose,
}: {
  images: string[];
  index?: number;
  alt?: string;
  onClose: () => void;
}) {
  const [i, setI] = useState(index);
  const total = images.length;

  useEffect(() => {
    if (total <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setI((v) => (v - 1 + total) % total);
      else if (e.key === "ArrowRight") setI((v) => (v + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  if (total === 0) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-6">
      <button onClick={onClose} className="absolute top-5 right-5 cursor-pointer rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/20">닫기 ✕</button>
      {total > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setI((v) => (v - 1 + total) % total); }}
            className="absolute left-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:left-6"
            aria-label="이전 사진"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setI((v) => (v + 1) % total); }}
            className="absolute right-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-6"
            aria-label="다음 사진"
          >
            ›
          </button>
        </>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[i]} alt={alt} onClick={(e) => e.stopPropagation()} className="max-h-[88vh] max-w-[92vw] cursor-default rounded-lg object-contain shadow-2xl" />
      {total > 1 && (
        <span className="absolute bottom-6 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white/85">{i + 1} / {total}</span>
      )}
    </div>
  );
}
