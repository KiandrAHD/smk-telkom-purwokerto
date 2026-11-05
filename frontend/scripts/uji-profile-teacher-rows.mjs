/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {createServer} from 'vite';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const server=await createServer({appType:'custom',logLevel:'silent',server:{middlewareMode:true}});
const {schoolTeacherData}=await server.ssrLoadModule('/src/data/schoolTeacherData.js');
const {kepalaSekolah}=await server.ssrLoadModule('/src/data/dummyData.js');
const {translate}=await server.ssrLoadModule('/src/utils/language.js');await server.close();
const out=process.env.QA_OUTPUT || 'outputs/profile-teacher-rows';await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('**/api/**',r=>r.fulfill({contentType:'application/json',body:'[]'}));
const root=page.locator('#guru'),grid=root.locator('[data-profile-teacher-grid]');
try {
for(const [width,columns,perPage] of [[1847,4,8],[1440,4,8],[1280,4,8],[1024,3,6],[768,2,4],[640,2,4],[400,2,2],[390,1,1],[320,1,1]]) {
 await page.setViewportSize({width,height:1100});await page.goto((process.env.QA_URL || 'http://127.0.0.1:5173')+'/profil-sekolah');await grid.waitFor();
 for(const lang of ['id','en']) {
  if(await page.locator('html').getAttribute('lang')!==lang)await page.getByRole('button',{name:/^Switch to /}).first().click();
  const principal=root.locator('[data-principal-profile]');
  assert.equal(await principal.locator('[data-teacher-border] img').count(),4);
  assert.ok((await principal.innerText()).includes(kepalaSekolah.name));
  assert.ok((await principal.innerText()).includes(translate(kepalaSekolah.quoteFull,lang)));
  const prev=root.getByRole('button',{name:lang==='id'?'Guru sebelumnya':'Previous teachers',exact:true});
  const next=root.getByRole('button',{name:lang==='id'?'Guru berikutnya':'Next teachers',exact:true});
  while(!await prev.isDisabled())await prev.click();
  const found=[];
  for(let i=0;i<Math.ceil(schoolTeacherData.length/perPage);i++) {
   await grid.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   const names=await grid.locator('h3').allTextContents();found.push(...names);
   assert.deepEqual(names,schoolTeacherData.slice(i*perPage,(i+1)*perPage).map(teacher=>translate(teacher.nama,lang)));
   assert.equal(await root.locator('[data-slide-indicator]').count(),Math.ceil(schoolTeacherData.length/perPage));
   assert.equal(await root.locator('[data-slide-indicator][aria-current="true"]').count(),1);
   const layout=await grid.evaluate(grid=>({columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,rows:getComputedStyle(grid).gridTemplateRows.split(' ').length,cards:[...grid.children].map(c=>c.getBoundingClientRect().height)}));
   assert.equal(layout.columns,columns);if(width>=640)assert.equal(layout.rows,2);
   assert.ok(Math.max(...layout.cards)-Math.min(...layout.cards)<1);
   assert.equal(await grid.locator('[data-teacher-border]').count(),names.length);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);
   if(i===0)await root.screenshot({path:`${out}/${width}-${lang}.png`,style:'header.sticky,header.sticky *,.fixed.bottom-4 {visibility:hidden}'});
   if(i<Math.ceil(schoolTeacherData.length/perPage)-1)await next.click();
  }
  assert.equal(found.length,schoolTeacherData.length);assert.equal(await next.isDisabled(),true);
  await root.locator('[data-slide-indicator]').first().click();assert.equal(await prev.isDisabled(),true);
 }
 console.log('PASS profile rows/batik/data/pagination',width);
}
await page.setViewportSize({width:1440,height:1100});await page.emulateMedia({reducedMotion:'no-preference'});
await root.getByRole('button',{name:'Next teachers',exact:true}).click();
await page.waitForFunction(()=>!document.querySelector('#guru [data-motion-outgoing]'));
assert.equal(await root.locator('[data-slide-indicator][aria-current="true"]').count(),1);
await page.setViewportSize({width:390,height:1100});await page.waitForTimeout(100);
assert.equal(await grid.locator('.teacher-card').count(),1);
assert.deepEqual(errors,[]);console.log('PASS animated transition, resize bounds and no exceptions');
}finally{await browser.close();}
