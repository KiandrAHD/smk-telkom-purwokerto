/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createServer} from 'vite';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const out=process.env.QA_OUTPUT || join(tmpdir(),'smk-shared-bottom-qa');
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.setDefaultTimeout(12000);
const results=[];const errors=[];
page.on('pageerror',error=>errors.push(error.message));
const check=async(name,fn)=>{
 try {results.push({name,passed:true,detail:await fn()});console.log('PASS',name);}
 catch(error){results.push({name,passed:false,error:error.message});console.error('FAIL',name,error.message);}
};
await page.route('**/rest/v1/**',route=>{
 const url=new URL(route.request().url());const slug=url.searchParams.get('slug')?.replace(/^eq\./,'');
 const row={id:'qa',slug:'qa-valid',judul:'Konten QA',konten:'Paragraf QA',deskripsi:'Deskripsi QA',created_at:'2026-10-12T00:00:00Z',status:'published',kategori:'Sekolah'};
 return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(slug==='qa-valid'?[row]:[])});
});
const ready=async()=>{
 await page.waitForFunction(()=>{
  const main=document.getElementById('main-content');
  return main ? !main.hasAttribute('aria-busy') && !!main.querySelector('h1') : !!document.querySelector('h1,h2');
 });
};
const audit=async()=>{
 const details=await page.evaluate(()=>{
  const main=document.getElementById('main-content');
  if(!main)return {mainLayout:false,stela:document.querySelectorAll('#stela').length,cta:document.querySelectorAll('#ppdb').length};
  const stela=main.querySelector('#stela');const cta=main.querySelector('#ppdb');
  return {mainLayout:true,stela:document.querySelectorAll('#stela').length,cta:document.querySelectorAll('#ppdb').length,artwork:document.querySelectorAll('img[width="2200"][height="693"],img[width="2172"][height="724"]').length,ordered:main.lastElementChild===cta && cta?.previousElementSibling===stela && main.nextElementSibling?.tagName==='FOOTER',stelaPosition:stela&&getComputedStyle(stela).position,ctaPosition:cta&&getComputedStyle(cta).position};
 });
 if(details.mainLayout){assert.equal(details.stela,1);assert.equal(details.cta,1);assert.equal(details.artwork,1);assert.equal(details.ordered,true);assert.equal(details.stelaPosition,'static');assert.equal(details.ctaPosition,'static');}
 else{assert.equal(details.stela,0);assert.equal(details.cta,0);}
 return {...details,finalPath:new URL(page.url()).pathname};
};
try{
 const app=await readFile(new URL('../src/App.jsx',import.meta.url),'utf8');
 const paths=[...new Set(['/dashboard',...[...app.matchAll(/<Route path="([^"*:]+)"/g)].map(m=>m[1].startsWith('/')?m[1]:'/dashboard/'+m[1])])];
 for(const path of paths)await check('Route '+path,async()=>{await page.goto(base+path);await ready();return audit();});
 const server=await createServer({appType:'custom',logLevel:'silent',server:{middlewareMode:true}});
 try{
  const data=await server.ssrLoadModule('/src/data/dummyData.js');const teachers=await server.ssrLoadModule('/src/data/profilGuruData.js');
  for(const [prefix,items] of [['/jurusan/',data.jurusanDetail],['/galeri/',data.galeriDetail],['/berita/agenda/',data.agendaDetail],['/bkk/panduan/',data.panduanDetail],['/bkk/pkl/',data.pklDetailLengkap],['/bkk/roadmap/',data.roadmapDetail],['/jurusan/project/',data.projectDetail],['/profil-sekolah/guru/',teachers.profilGuruDetail]]){
   await check('Detail '+prefix,async()=>{await page.goto(base+prefix+items[0].slug);await ready();assert.ok(!(await page.locator('h1').first().innerText()).includes('404'));return audit();});
  }
 }finally{await server.close();}
 for(const path of ['/berita/qa-valid','/prestasi/qa-valid','/pengumuman/qa-valid','/random-page','/jurusan/tidak-ada','/ppdb/masuk'])await check('Detail/error/alias '+path,async()=>{await page.goto(base+path);await ready();return audit();});
 const canonicalStyles={};
 for(const width of [1920,1440,768,390,375])for(const path of ['/','/fasilitas','/jurusan','/profil-sekolah','/prestasi'])await check('Responsive ID/EN '+width+' '+path,async()=>{
  await page.setViewportSize({width,height:1000});await page.goto(base+path);await ready();await audit();
  for(const lang of ['id','en']){
   if(lang==='en'){
    await page.evaluate(()=>{window.qaDocumentMarker='same-document';});
    await page.getByRole('button',{name:'Switch to English',exact:true}).click();
    await page.locator('#ppdb h2').filter({hasText:'Found the Right Program for You?'}).waitFor();
    assert.equal(await page.evaluate(()=>window.qaDocumentMarker),'same-document');
   }
   await page.locator('#stela').scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>{const img=document.querySelector('#stela img');return img?.complete&&img.naturalWidth>0;});
   const bounds=await page.evaluate(()=>{
    const stela=document.querySelector('#stela > div > div').getBoundingClientRect();const cta=document.querySelector('#ppdb > div > div').getBoundingClientRect();
    const title=getComputedStyle(document.querySelector('#ppdb h2'));
    const links=[...document.querySelectorAll('#stela a')].filter(a=>getComputedStyle(a).display!=='none'&&a.getClientRects().length>0);
    return {scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,stela:{x:stela.x,width:stela.width},cta:{x:cta.x,width:cta.width},styles:[title.fontFamily,title.fontWeight,title.fontSize,title.letterSpacing,title.lineHeight],gap:cta.top-stela.bottom,stelaLinks:links.length,stelaHref:links[0]?.getAttribute('href'),ctaHref:document.querySelector('#ppdb a')?.getAttribute('href'),currentSrc:document.querySelector('#stela img').currentSrc};
   });
   assert.ok(bounds.scroll<=bounds.client,JSON.stringify(bounds));assert.ok(Math.abs(bounds.stela.x-bounds.cta.x)<1);assert.ok(Math.abs(bounds.stela.width-bounds.cta.width)<1);
   assert.equal(bounds.stelaLinks,1);assert.equal(bounds.stelaHref,'/stela');assert.equal(bounds.ctaHref,'/spmb');
   assert.ok(bounds.gap>=24 && bounds.gap<=33);
   const key=width+'-'+lang;canonicalStyles[key]??=bounds.styles;assert.deepEqual(bounds.styles,canonicalStyles[key],'Tipografi harus konsisten lintas page.');
   const link=page.locator('#stela a').filter({visible:true});await link.getByText(lang==='id'?'Tanya STELA Sekarang':'Ask STELA Now',{exact:true}).waitFor();
   await page.locator('#ppdb a').filter({hasText:lang==='id'?'Daftar SPMB Sekarang':'Register for SPMB'}).waitFor();
   if(path==='/fasilitas'){
    const stelaBox=await page.locator('#stela').boundingBox();const ctaBox=await page.locator('#ppdb').boundingBox();const scroll=await page.evaluate(()=>window.scrollY);
    await page.screenshot({path:out+'/shared-'+lang+'-'+width+'.png',fullPage:true,clip:{x:0,y:stelaBox.y+scroll,width,height:ctaBox.y+ctaBox.height-stelaBox.y}});
   }
  }
  await page.getByRole('button',{name:'Switch to Indonesian',exact:true}).click();return {width,path};
 });
 await check('Navigasi tombol STELA dan SPMB',async()=>{
  await page.goto(base+'/jurusan');await ready();await page.locator('#stela a').filter({visible:true}).click();await page.waitForURL(base+'/stela');await ready();await audit();
  await page.locator('#ppdb a').click();await page.waitForURL(base+'/spmb/masuk');await ready();assert.equal(await page.locator('#stela').count(),0);
 });
 await check('Fallback artwork EN tetap bekerja',async()=>{
  const p=await browser.newPage({viewport:{width:1440,height:1000}});
  await p.addInitScript(()=>sessionStorage.setItem('smk-telkom-language','en'));
  await p.route(/stela-card-en-\d+.*\.webp$/,route=>route.abort());
  try{await p.goto(base+'/random-page');await p.locator('#stela').scrollIntoViewIfNeeded();await p.waitForFunction(()=>{const img=document.querySelector('#stela img');return img?.complete&&img.naturalWidth>0&&img.currentSrc.includes('.png');});assert.equal(await p.locator('#stela img').getAttribute('srcset'),null);}finally{await p.close();}
 });
 await check('Tanpa JavaScript exception tak terduga',async()=>assert.deepEqual(errors,[]));
}finally{await writeFile(out+'/results.json',JSON.stringify(results,null,2));await browser.close();}
console.log(JSON.stringify({passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length,out}));
if(results.some(r=>!r.passed))process.exitCode=1;
