/* global document, window, history, PopStateEvent */
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'vite';
const modulePath = process.env.PLAYWRIGHT_MODULE || 'playwright';
const { chromium } = await import(modulePath);
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const out = process.env.QA_OUTPUT || join(tmpdir(), 'smk-routing-qa');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
const check = async (name, fn) => {
 try { const detail = await fn(); results.push({name, passed: true, detail}); console.log('PASS', name); }
 catch (error) { results.push({name, passed: false, error: error.message}); console.error('FAIL', name, error.message); }
};
const page = await browser.newPage({viewport:{width:1440,height:1000}});
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const row = { id:'qa-item', slug:'qa-valid', judul:'Konten QA', konten:'Paragraf QA.', deskripsi:'Deskripsi QA.', ringkasan:'Ringkasan QA.', created_at:'2026-10-12T00:00:00Z', tanggal:'2026-10-12', kategori:'Sekolah', status:'published' };
let mode = 'success';
let supabaseOrigin;
page.on('request', request => { if (request.url().includes('/rest/v1/')) supabaseOrigin = new URL(request.url()).origin; });
await page.route('**/rest/v1/**', async route => {
 const url = new URL(route.request().url());
 const slug = url.searchParams.get('slug')?.replace(/^eq\./,'');
 if (mode === 'network') return route.abort('internetdisconnected');
 if (mode === 'server') return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({message:'QA service unavailable'})});
 return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(slug && slug !== 'qa-valid' ? [] : [row])});
});
const heading = () => page.locator('h1').first();
const notFound = async () => {
 await heading().filter({hasText:'404 — Halaman Tidak Ditemukan'}).waitFor();
 await page.waitForFunction(()=>document.title.startsWith('404 —'));
 assert.match(await page.title(), /404/);
};
const go = async path => { await page.goto(base+path); await page.locator('h1, [role="alert"]').first().waitFor(); };
try {
 for (const path of ['/fasilitas123','/jurusanabc','/random-page','/spmb/unknown','/dashboard/unknown','/fasilitas/extra','/jurusan/rpl/extra','/ppdb/unknown','/profil-sekolah/guru/tidak-ada','/tentang/guru/tidak-ada','/jurusan/tidak-ada','/galeri/tidak-ada','/berita/agenda/tidak-ada','/bkk/panduan/tidak-ada','/bkk/pkl/tidak-ada','/bkk/roadmap/tidak-ada','/jurusan/project/tidak-ada']) {
  await check('404 '+path, async()=>{await go(path);await notFound();});
 }
 await check('404 refresh, query, hash, slash',async()=>{await go('/random-page/?qa=1#test');await notFound();await page.reload();await notFound();});
 await check('Direct access dan refresh route valid',async()=>{
  for(const path of ['/fasilitas','/jurusan/rpl']) {
   await go(path);assert.ok(!(await heading().innerText()).includes('404'));await page.reload();await heading().waitFor();assert.ok(!(await heading().innerText()).includes('404'));
  }
 });
 for(const path of ['/berita/tidak-ada','/prestasi/tidak-ada','/pengumuman/tidak-ada']) await check('Data kosong '+path,async()=>{await go(path);await notFound();});
 for(const section of ['berita','prestasi','pengumuman']) {
  await check('Detail tersedia '+section,async()=>{await go('/'+section+'/qa-valid');await heading().filter({hasText:'Konten QA'}).waitFor();});
  await check('503 dan retry '+section,async()=>{
   mode='server';await go('/'+section+'/qa-valid');await page.getByRole('alert').waitFor();assert.ok(!(await heading().count()));
   mode='success';await page.getByRole('button',{name:'Coba lagi',exact:true}).click();await heading().filter({hasText:'Konten QA'}).waitFor();
  });
 }
 await check('Network error dan offline pulih',async()=>{
  mode='network';await go('/berita/qa-valid');await page.getByRole('alert').waitFor();await page.context().setOffline(true);
  await page.getByRole('alert').filter({hasText:'Periksa koneksi internet'}).waitFor();await page.context().setOffline(false);
  mode='success';await page.getByRole('button',{name:'Coba lagi',exact:true}).click();await heading().filter({hasText:'Konten QA'}).waitFor();
 });
 await check('Offline tidak merusak halaman lokal',async()=>{await go('/jurusan');await page.context().setOffline(true);assert.ok((await heading().innerText()).length>0);await page.context().setOffline(false);});
 // Test every explicit static route, including nested dashboard routes and legacy redirects.
 const app = await readFile(new URL('../src/App.jsx',import.meta.url),'utf8');
 const staticRoutes = ['/dashboard', ...[...app.matchAll(/<Route path="([^"*:]+)"/g)].map(m=>m[1].startsWith('/')?m[1]:'/dashboard/'+m[1])];
 for(const path of [...new Set(staticRoutes)]) await check('Route resmi '+path, async()=>{
  await page.goto(base+path);await page.waitForFunction(()=>document.querySelector('h1, h2, [role="alert"]') && !document.querySelector('[aria-busy="true"]'),{},{timeout:15000});
  assert.ok(!/404|Halaman Mengalami Gangguan|Segera Hadir/.test(await page.locator('h1').first().textContent().catch(()=>'')));
  return {finalPath:new URL(page.url()).pathname, heading:await page.locator('h1,h2').first().innerText().catch(()=>null)};
 });
 // Local data provides literal valid slugs for all complementary route categories.
 const server = await createServer({appType:'custom',logLevel:'silent',server:{middlewareMode:true}});
 try {
  const data = await server.ssrLoadModule('/src/data/dummyData.js');
  const teachers = await server.ssrLoadModule('/src/data/profilGuruData.js');
  for(const [prefix, items] of [['/jurusan/',data.jurusanDetail],['/galeri/',data.galeriDetail],['/berita/agenda/',data.agendaDetail],['/bkk/panduan/',data.panduanDetail],['/bkk/pkl/',data.pklDetailLengkap],['/bkk/roadmap/',data.roadmapDetail],['/jurusan/project/',data.projectDetail],['/profil-sekolah/guru/',teachers.profilGuruDetail]]) {
   await check('Detail lokal '+prefix,async()=>{assert.ok(items.length);await go(prefix+items[0].slug);assert.ok(!(await heading().innerText()).includes('404'));return prefix+items[0].slug;});
  }
 } finally {await server.close();}
 await check('Browser Back/Forward dan tombol Kembali',async()=>{
  await go('/jurusan');await page.evaluate(()=>{const a=document.createElement('a');a.href='/random-page';a.textContent='QA';document.body.append(a);a.click();});await notFound();
  // Native navigation is a fresh document: use the existing Router links to establish SPA history.
  await page.getByRole('link',{name:'Kembali ke Beranda',exact:true}).click();await page.waitForURL(base+'/');
  await page.goBack();await notFound();await page.goForward();assert.equal(new URL(page.url()).pathname,'/');
  await page.getByRole('link',{name:'Jurusan',exact:true}).first().click();await page.waitForURL(base+'/jurusan');
  await page.evaluate(()=>{history.pushState({...history.state,key:'qa-unknown',idx:(history.state.idx??0)+1},'', '/random-page');window.dispatchEvent(new PopStateEvent('popstate'));});await notFound();
  await page.getByRole('button',{name:'Kembali',exact:true}).click();await page.waitForURL(base+'/jurusan');
 });
 for(const width of [1440,768,390,375]) await check('Responsive dan ID/EN '+width,async()=>{
  await page.setViewportSize({width,height:1000});await go('/fasilitas123');await notFound();
  const marker=await page.evaluate(()=>{window.qaDocumentMarker=Math.random();return window.qaDocumentMarker;});
  await page.getByRole('button',{name:'Switch to English',exact:true}).click();await heading().filter({hasText:'404 — Page Not Found'}).waitFor();
  assert.equal(await page.evaluate(()=>window.qaDocumentMarker),marker);
  assert.equal(await page.getByRole('link',{name:'Back to Home',exact:true}).getAttribute('href'),'/');
  const size=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));assert.ok(size.scroll<=size.client,JSON.stringify(size));
  await page.screenshot({path:out+'/404-en-'+width+'.png',fullPage:true});
  await page.getByRole('button',{name:'Switch to Indonesian',exact:true}).click();await notFound();
  await page.screenshot({path:out+'/404-id-'+width+'.png',fullPage:true});return size;
 });
 await check('Unauthenticated admin redirect',async()=>{await go('/dashboard');assert.equal(new URL(page.url()).pathname,'/login');});

 for(const failure of ['chunk','render','offline']) await check('Fallback '+failure+' dan reload',async()=>{
  const context=await browser.newContext();const p=await context.newPage();p.setDefaultTimeout(10000);
  try {
   await p.goto(base+'/fasilitas123');await p.locator('h1').waitFor();
   const pattern=/\/assets\/JurusanPage-[^/]+\.js$/;
   await p.route(pattern, route=>failure==='render'?route.fulfill({status:200,contentType:'text/javascript',body:'export default function Page(){throw new Error("QA render failure");}'}):route.abort('failed'));
   if(failure==='offline')await context.setOffline(true);
   await p.getByRole('link',{name:'Jurusan',exact:true}).first().click();
   await p.getByRole('heading',{name:failure==='render'?'Halaman Mengalami Gangguan':failure==='offline'?'Koneksi Internet Terputus':'Halaman Gagal Dimuat',exact:true}).waitFor();
   assert.equal(await p.getByRole('button',{name:'Muat Ulang',exact:true}).count(),1);
   await p.getByRole('button',{name:'Switch to English',exact:true}).click();
   await p.getByRole('heading',{name:failure==='render'?'Something Went Wrong':failure==='offline'?'Internet Connection Lost':'Page Failed to Load',exact:true}).waitFor();
   await context.setOffline(false);await p.unroute(pattern);
   await p.getByRole('button',{name:'Reload',exact:true}).click();
   await p.getByRole('heading',{level:1}).waitFor();assert.ok(!/Failed|Wrong|Lost|404/.test(await p.locator('h1').first().innerText()));
  } finally {await context.close();}
 });
 await check('State email SPMB bertahan pada navigasi SPA',async()=>{
  const context=await browser.newContext();const p=await context.newPage();p.setDefaultTimeout(10000);
  try {
   await p.route('**/auth/v1/signup*',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({id:'00000000-0000-4000-8000-000000000007',email:'routing-qa@example.invalid',identities:[]})}));
   await p.goto(base+'/spmb/daftar');await p.locator('input[name="email"]').fill('routing-qa@example.invalid');
   await p.locator('input[name="password"]').fill('QA-password-123');await p.locator('input[name="confirmPassword"]').fill('QA-password-123');
   await p.getByRole('checkbox').check();await p.locator('form button[type="submit"]').click();
   await p.waitForURL(base+'/spmb/verifikasi');await p.getByText('routing-qa@example.invalid',{exact:false}).first().waitFor();
  }finally{await context.close();}
 });
 for(const permission of ['admin','forbidden','server']) await check('Akses '+permission+' dengan sesi simulasi',async()=>{
  assert.ok(supabaseOrigin,'Supabase public API must be configured for the simulation');
  const context=await browser.newContext();const p=await context.newPage();p.setDefaultTimeout(10000);
  const user={id:'00000000-0000-4000-8000-000000000007',email:'routing-qa@example.invalid',aud:'authenticated',role:'authenticated',app_metadata:{provider:'email',providers:['email']},user_metadata:{},identities:[],created_at:'2026-10-12T00:00:00Z'};
  const exp=Math.floor(Date.now()/1000)+3600;
  const jwt=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url')+'.'+Buffer.from(JSON.stringify({sub:user.id,exp,role:'authenticated',aud:'authenticated'})).toString('base64url')+'.qa-signature';
  const session={access_token:jwt,refresh_token:'qa-local-only',expires_at:exp,expires_in:3600,token_type:'bearer',user};
  await context.addInitScript(({origin,session})=>localStorage.setItem('sb-'+new URL(origin).hostname.split('.')[0]+'-auth-token',JSON.stringify(session)),{origin:supabaseOrigin,session});
  await p.route('**/auth/v1/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(user)}));
  let releaseAdmin;
  let refreshRequested;
  await p.route('**/rest/v1/**',async route=>{
   if(releaseAdmin && new URL(route.request().url()).pathname.endsWith('/admins')) {
    refreshRequested?.();await new Promise(resolve=>{releaseAdmin=resolve;});
   }
   if(new URL(route.request().url()).pathname.endsWith('/admins'))return route.fulfill({status:permission==='server'?503:200,contentType:'application/json',body:JSON.stringify(permission==='admin'?[{id:'qa-admin'}]:permission==='server'?{message:'QA unavailable'}:[])});
   return route.fulfill({status:200,contentType:'application/json',body:'[]'});
  });
  try {
   await p.goto(base+'/dashboard');
   if(permission==='forbidden')await p.getByRole('heading',{name:'403 — Akses Tidak Diizinkan',exact:true}).waitFor();
   else if(permission==='server')await p.getByRole('alert').filter({hasText:'Akses admin belum dapat diperiksa'}).waitFor();
   else {
    await p.locator('h1').waitFor();assert.ok(!(await p.locator('h1').innerText()).includes('403'));
    for(const path of ['/dashboard/berita','/dashboard/pengumuman','/dashboard/spmb','/dashboard/jurusan','/dashboard/prestasi','/dashboard/bkk','/dashboard/pengaturan']){
     await p.goto(base+path);await p.locator('h1').waitFor();assert.equal(new URL(p.url()).pathname,path);assert.ok(!/403|404|Halaman Mengalami Gangguan/.test(await p.locator('h1').innerText()));
    }
    await p.getByRole('tab',{name:'Akun Admin',exact:true}).click();
    const requested=new Promise(resolve=>{refreshRequested=resolve;});releaseAdmin=()=>{};
    await p.evaluate(({origin,session})=>{
     const channel=new BroadcastChannel('sb-'+new URL(origin).hostname.split('.')[0]+'-auth-token');
     channel.postMessage({event:'TOKEN_REFRESHED',session});channel.close();
    },{origin:supabaseOrigin,session});
    await Promise.race([requested,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Token refresh did not trigger admin verification')),10000))]);
    assert.equal(await p.getByRole('tab',{name:'Akun Admin',exact:true}).getAttribute('aria-selected'),'true');
    assert.equal(await p.getByRole('heading',{name:/403/}).count(),0);
    const finish=releaseAdmin;releaseAdmin=null;finish();
    await p.getByRole('tab',{name:'Akun Admin',exact:true}).waitFor();
   }
   assert.equal(new URL(p.url()).pathname,permission==='admin'?'/dashboard/pengaturan':'/dashboard');
  }finally{await context.close();}
 });
 await check('No unexpected JS exceptions',async()=>{assert.deepEqual(errors,[]);});
} finally {
 await writeFile(out+'/results.json',JSON.stringify(results,null,2));await browser.close();
}
console.log(JSON.stringify({passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length,out}));
if(results.some(r=>!r.passed)) process.exitCode=1;
