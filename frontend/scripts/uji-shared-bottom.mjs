import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import {createServer} from 'vite';
const server=await createServer({appType:'custom',logLevel:'silent',server:{middlewareMode:true}});
try {
 const {default:MainLayout}=await server.ssrLoadModule('/src/layouts/MainLayout.jsx');
 const {LanguageContext}=await server.ssrLoadModule('/src/context/LanguageContext.js');
 const {translate}=await server.ssrLoadModule('/src/utils/language.js');
 const {default:JurusanPage}=await server.ssrLoadModule('/src/pages/JurusanPage.jsx');
 const jurusan=renderToStaticMarkup(createElement(MemoryRouter,{initialEntries:['/jurusan']},createElement(JurusanPage)));
 assert.equal([...jurusan.matchAll(/<img\b[^>]*src="[^"]*stela-card\.jpg/g)].length,1,'Banner penuh STELA tidak boleh tersisa di dalam FAQ jurusan.');
 for(const busy of [false,true]) {
  const html=renderToStaticMarkup(createElement(MemoryRouter,null,createElement(MainLayout,{busy},createElement('h1',null,'Konten QA'))));
  assert.equal([...html.matchAll(/id="stela"/g)].length,1,'MainLayout harus selalu memuat Banner STELA tepat satu kali');
  assert.equal([...html.matchAll(/id="ppdb"/g)].length,1,'MainLayout harus selalu memuat CTA SPMB tepat satu kali');
  assert.ok(html.indexOf('Konten QA')<html.indexOf('id="stela"'));
  assert.ok(html.indexOf('id="stela"')<html.indexOf('id="ppdb"'));
  assert.ok(html.indexOf('id="ppdb"')<html.indexOf('<footer'));
 }
 const english=renderToStaticMarkup(createElement(MemoryRouter,null,createElement(LanguageContext.Provider,{value:{language:'en',t:(text,variables)=>translate(text,'en',variables)}},createElement(MainLayout,null,createElement('h1',null,'Konten QA')))));
 assert.ok(english.includes('Ask STELA Now')&&english.includes('Register for SPMB'));
 assert.ok(english.includes('Found the Right Program for You?'));
 const image=english.match(/<img\b[^>]*src="[^"]*stela-card-en[^>]*>/)?.[0];
 assert.ok(image&&image.includes('srcSet=')&&image.includes('sizes='));
 assert.ok(image.includes('loading="lazy"')&&image.includes('stela-card-en.png'));
 assert.ok(english.includes('href="/stela"')&&english.includes('href="/spmb"'));
 console.log('Shared layout: STELA lalu CTA sebelum Footer, tepat sekali pada normal dan loading.');
 console.log('Shared layout: EN, responsive artwork, PNG fallback, lazy loading dan link existing lulus.');
}finally{await server.close();}
