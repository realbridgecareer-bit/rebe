// 'logo/로고 정리.pptx'를 PowerPoint로 내보낸 슬라이드 PNG(logo/_slides_png)의
// 여백을 잘라 public/logos/network-wall/ 에 저장. (사이트는 이 이미지를 그대로 사용)
const sharp=require('sharp'),path=require('path');
const SRC='logo/_slides_png', OUT='public/logos/network-wall';
(async()=>{
  for(let i=1;i<=6;i++){
    const buf=await sharp(path.join(SRC,`slide${i}.png`)).trim({threshold:12}).png().toBuffer();
    const m=await sharp(buf).metadata();
    await sharp(buf).toFile(path.join(OUT,`slide${i}.png`));
    console.log(`slide${i}: ${m.width}x${m.height} (ar ${(m.width/m.height).toFixed(2)})`);
  }
})();
