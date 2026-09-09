#!/usr/bin/env node
'use strict';
// Render an annotated single-figure HTML document; audit declared connections.
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

function parse(argv) {
  const options = { width: 2400, height: 1400, tolerance: 8 };
  const allowed = new Set(['input','out','width','height','tolerance','playwright-module','browser']);
  for (let i=0; i<argv.length; i++) {
    if (argv[i] === '--help') { console.log('render_review.cjs --input figure.html --out output [--width 2400 --height 1400 --tolerance 8 --playwright-module PATH --browser PATH]'); return null; }
    const key = argv[i].replace(/^--/, '');
    if (!argv[i].startsWith('--') || !allowed.has(key) || !argv[i+1] || argv[i+1].startsWith('--')) throw new Error(`Invalid argument: ${argv[i]}`);
    options[key] = argv[++i];
  }
  if (!options.input || !options.out) throw new Error('--input and --out are required');
  for (const k of ['width','height','tolerance']) { options[k]=Number(options[k]); if (!Number.isFinite(options[k]) || options[k]<=0) throw new Error(`Invalid ${k}`); }
  options.width=Math.ceil(options.width); options.height=Math.ceil(options.height);
  return options;
}

async function main() {
  const o=parse(process.argv.slice(2)); if (!o) return;
  const {chromium}=require(o['playwright-module'] ? path.resolve(o['playwright-module']) : 'playwright');
  const out=path.resolve(o.out); fs.mkdirSync(path.join(out,'modules'),{recursive:true});
  const browser=await chromium.launch({headless:true,...(o.browser?{executablePath:path.resolve(o.browser)}:{})});
  try {
    const page=await browser.newPage({viewport:{width:o.width,height:o.height},deviceScaleFactor:1});
    await page.goto(pathToFileURL(path.resolve(o.input)).href,{waitUntil:'load',timeout:60000});
    await page.evaluate(()=>document.fonts.ready);
    const figure=page.locator('#figure'); if (await figure.count() !== 1) throw new Error('Exactly one #figure is required');
    const frame=await figure.boundingBox(); if (!frame || !frame.width || !frame.height) throw new Error('#figure has no visible size');
    const report=await page.evaluate(({tolerance})=>{
      const root=document.querySelector('#figure'), frame=root.getBoundingClientRect();
      const issues=[], texts=[], edges=[], modules=[...root.querySelectorAll('[data-module]')];
      const issue=(type,detail)=>issues.push({type,...detail});
      const outside=r=>r.left<frame.left-2||r.top<frame.top-2||r.right>frame.right+2||r.bottom>frame.bottom+2;
      if (Math.abs(frame.x)>1||Math.abs(frame.y)>1) issue('page-origin',{x:frame.x,y:frame.y});
      for (const el of root.querySelectorAll('img')) if (!el.complete||!el.naturalWidth) issue('image-load',{src:el.getAttribute('src')?.slice(0,160)});
      for (const m of modules) if (outside(m.getBoundingClientRect()) || m.scrollWidth>m.clientWidth+2 || m.scrollHeight>m.clientHeight+2) issue('module-overflow',{module:m.dataset.module});
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); let n;
      while ((n=walker.nextNode())) {
        if (!n.textContent.trim() || n.parentElement.closest('style,script,defs,[data-route-label]')) continue;
        const range=document.createRange(); range.selectNodeContents(n);
        for (const r of range.getClientRects()) {
          if (!r.width||!r.height) continue;
          if (outside(r)) issue('text-overflow',{text:n.textContent.trim().slice(0,120)});
          texts.push({rect:r,text:n.textContent.trim().slice(0,120)});
        }
      }
      const endpoint=selector=>{
        if (!selector) return null;
        try { const es=root.querySelectorAll(selector); if(es.length!==1)return null;const e=es[0],r=e.getBoundingClientRect();return {el:e,x:r.x+r.width/2,y:r.y+r.height/2}; } catch { return null; }
      };
      for (const line of root.querySelectorAll('path[data-edge]')) {
        const id=line.dataset.edge, a=endpoint(line.dataset.from), b=endpoint(line.dataset.to);
        if (!a||!b) { issue('missing-or-ambiguous-port',{edge:id,from:line.dataset.from,to:line.dataset.to});continue; }
        const len=line.getTotalLength(), matrix=line.getScreenCTM();
        if (!matrix || !len) {issue('empty-path',{edge:id});continue;}
        const point=d=>{const p=line.getPointAtLength(d);return new DOMPoint(p.x,p.y).matrixTransform(matrix);};
        const first=point(0),last=point(len),fromError=Math.hypot(first.x-a.x,first.y-a.y),toError=Math.hypot(last.x-b.x,last.y-b.y);
        edges.push({id,fromError,toError});
        if (fromError>tolerance||toError>tolerance) issue('endpoint-mismatch',{edge:id,fromError,toError});
        if (line.dataset.directed!=='false' && getComputedStyle(line).markerEnd==='none') issue('missing-arrowhead',{edge:id});
        const unrelated=modules.filter(m=>!m.contains(a.el)&&!m.contains(b.el)).map(m=>({name:m.dataset.module,r:m.getBoundingClientRect()}));
        const scale=Math.max(Math.hypot(matrix.a,matrix.b),Math.hypot(matrix.c,matrix.d),0.01),step=3/scale;
        let textHit=null,moduleHit=null;
        for (let d=0;d<=len;d+=step) {
          const p=point(d); if (Math.hypot(p.x-first.x,p.y-first.y)<tolerance || Math.hypot(p.x-last.x,p.y-last.y)<tolerance) continue;
          if (!textHit) textHit=texts.find(t=>p.x>t.rect.left&&p.x<t.rect.right&&p.y>t.rect.top&&p.y<t.rect.bottom);
          if (!moduleHit) moduleHit=unrelated.find(m=>p.x>m.r.left+2&&p.x<m.r.right-2&&p.y>m.r.top+2&&p.y<m.r.bottom-2);
          if (textHit&&moduleHit) break;
        }
        if (textHit) issue('edge-crosses-text',{edge:id,text:textHit.text});
        if (moduleHit) issue('edge-crosses-unrelated-module',{edge:id,module:moduleHit.name});
      }
      return {ok:issues.length===0,issues,checkedEdges:edges,modules:modules.map(m=>m.dataset.module),coverage:'Only paths with data-edge are audited. Raster content, method semantics, and visual quality require inspection.'};
    },{tolerance:o.tolerance});
    const imageFailures=await page.evaluate(async()=>{
      const images=[...document.querySelectorAll('#figure svg image')];
      return (await Promise.all(images.map(e=>new Promise(resolve=>{const href=e.getAttribute('href')||e.getAttribute('xlink:href');const img=new Image();let timer=setTimeout(()=>resolve(href?.slice(0,160)||'empty href'),10000);img.onload=()=>{clearTimeout(timer);resolve(null)};img.onerror=()=>{clearTimeout(timer);resolve(href?.slice(0,160)||'empty href')};if(href)img.src=href;else{clearTimeout(timer);resolve('empty href')}})))).filter(Boolean);
    });
    imageFailures.forEach(src=>report.issues.push({type:'svg-image-load',src})); report.ok=report.issues.length===0;
    await figure.screenshot({path:path.join(out,'figure.png')});
    await page.pdf({path:path.join(out,'figure.pdf'),width:`${frame.width}px`,height:`${frame.height}px`,printBackground:true,margin:{top:0,right:0,bottom:0,left:0}});
    const modEls=page.locator('[data-module]');
    for (let i=0;i<await modEls.count();i++) {const el=modEls.nth(i),name=(await el.getAttribute('data-module')||String(i)).replace(/[^a-zA-Z0-9_-]/g,'_');await el.screenshot({path:path.join(out,'modules',`${i+1}-${name}.png`)});}
    fs.writeFileSync(path.join(out,'review.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify({ok:report.ok,issues:report.issues,checkedEdges:report.checkedEdges.length,out},null,2));
    if (!report.ok) process.exitCode=2;
  } finally {await browser.close();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
