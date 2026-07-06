// 'logo/로고 정리.pptx' 슬라이드 로고 배치를 비율 기반 절대배치로 추출.
// srcRect(자르기)를 sharp로 실제 반영해 public/logos/ppt/ 에 굽고, 좌표는 lib/ppt-logos.json.
const fs=require('fs'),path=require('path'),sharp=require('sharp');
const EX='logo/_ppt_extract';
const OUT='public/logos/ppt';
fs.rmSync(OUT,{recursive:true,force:true});
fs.mkdirSync(OUT,{recursive:true});
const SLIDE_W=12192000, SLIDE_H=6858000;

(async()=>{
  const slides=[];
  for(let s=1;s<=6;s++){
    const xml=fs.readFileSync(`${EX}/ppt/slides/slide${s}.xml`,'utf8');
    const rels=fs.readFileSync(`${EX}/ppt/slides/_rels/slide${s}.xml.rels`,'utf8');
    const rmap={};
    for(const m of rels.matchAll(/Id="([^"]+)"[^>]*Target="[^"]*media\/([^"]+)"/g)) rmap[m[1]]=m[2];
    const pics=[];
    for(const blk of xml.matchAll(/<p:pic>[\s\S]*?<\/p:pic>/g)){
      const b=blk[0];
      const embed=(b.match(/r:embed="([^"]+)"/)||[])[1];
      const off=b.match(/<a:off x="(-?\d+)" y="(-?\d+)"/);
      const ext=b.match(/<a:ext cx="(\d+)" cy="(\d+)"/);
      if(!embed||!off||!ext)continue;
      const x=+off[1],y=+off[2],cx=+ext[1],cy=+ext[2];
      if(cx>SLIDE_W*0.92)continue;
      const media=rmap[embed]; if(!media)continue;
      const sr=b.match(/<a:srcRect([^/]*)\/>/);
      let crop=null;
      if(sr){
        const g=a=>{const m=sr[1].match(new RegExp(a+'="(-?\d+)"'));return m?+m[1]/100000:0;};
        crop={l:g('l'),t:g('t'),r:g('r'),b:g('b')};
      }
      pics.push({media,x,y,cx,cy,crop});
    }
    if(!pics.length)continue;
    const minX=Math.min(...pics.map(p=>p.x)), minY=Math.min(...pics.map(p=>p.y));
    const maxX=Math.max(...pics.map(p=>p.x+p.cx)), maxY=Math.max(...pics.map(p=>p.y+p.cy));
    const bw=maxX-minX, bh=maxY-minY;
    const items=[];
    for(let k=0;k<pics.length;k++){
      const p=pics[k];
      const ext=path.extname(p.media).toLowerCase();
      const srcPath=`${EX}/ppt/media/${p.media}`;
      let outName;
      const hasCrop=p.crop && (p.crop.l||p.crop.t||p.crop.r||p.crop.b);
      if(!hasCrop && ext==='.svg'){ outName=`s${s}i${k}.svg`; fs.copyFileSync(srcPath,path.join(OUT,outName)); }
      else if(!hasCrop){ outName=`s${s}i${k}${ext==='.jpeg'?'.jpg':ext}`; fs.copyFileSync(srcPath,path.join(OUT,outName)); }
      else {
        outName=`s${s}i${k}.png`;
        let img = ext==='.svg' ? sharp(srcPath,{density:300}) : sharp(srcPath);
        let buf = await img.png().toBuffer();
        const meta = await sharp(buf).metadata();
        const W=meta.width, H=meta.height;
        const left=Math.round(p.crop.l*W), top=Math.round(p.crop.t*H);
        const width=Math.max(1,Math.round((1-p.crop.l-p.crop.r)*W));
        const height=Math.max(1,Math.round((1-p.crop.t-p.crop.b)*H));
        await sharp(buf).extract({left:Math.min(left,W-1),top:Math.min(top,H-1),width:Math.min(width,W-left),height:Math.min(height,H-top)}).png().toFile(path.join(OUT,outName));
      }
      items.push({
        src:'/logos/ppt/'+outName,
        l:+((p.x-minX)/bw*100).toFixed(3),
        t:+((p.y-minY)/bh*100).toFixed(3),
        w:+(p.cx/bw*100).toFixed(3),
        h:+(p.cy/bh*100).toFixed(3),
      });
    }
    slides.push({ar:+(bw/bh).toFixed(4), items});
  }
  fs.writeFileSync('lib/ppt-logos.json',JSON.stringify(slides,null,1));
  console.log('slides:',slides.length,'| logos:',slides.reduce((a,s)=>a+s.items.length,0));
  slides.forEach((s,i)=>console.log(` slide${i+1}: ar=${s.ar} logos=${s.items.length}`));
})();
