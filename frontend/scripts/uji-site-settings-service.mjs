import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { validateSettings } from '../src/utils/siteSettings.js';
let row={id:true,school_name:'Sekolah QA',npsn:'20303020',address:'Alamat QA',phone:'0281632138',email:'qa@example.invalid',website:'https://example.invalid',logo_url:null,academic_year:'2027/2028',spmb_open:true,news_page_size:5,revision:1};
let admin=true, writes=0, failWrite=false, corruptRead=false, pendingEmail='';
let user={id:'admin-qa',email:'old@example.invalid',user_metadata:{full_name:'Admin QA'}};
globalThis.__settingsClient={
  auth:{getUser:async()=>({data:{user:structuredClone(user)},error:null}),updateUser:async changes=>{user.user_metadata={...user.user_metadata,...changes.data};pendingEmail=changes.email||'';return {data:{user},error:null};}},
  from(table){
    const filters={};let update;
    const chain={select(){return chain;},eq(k,v){filters[k]=v;return chain;},update(value){update=value;return chain;},
      maybeSingle:async()=>{
        if(table==='admins')return {data:admin?{id:'membership'}:null,error:null};
        if(failWrite)return {error:new Error('Network rejected')};
        if(filters.revision!==row.revision)return {data:null,error:null};
        writes++;row={...row,...update,revision:row.revision+1};return {data:structuredClone(row),error:null};
      },single:async()=>({data:{...row,...(corruptRead?{revision:row.revision+1}:{})},error:null})};return chain;
  },
};
globalThis.window=new EventTarget();globalThis.localStorage={setItem(){}};
const server=await createServer({logLevel:'error',server:{middlewareMode:true},plugins:[{name:'settings-service-boundary',enforce:'pre',resolveId(id,importer){if(id==='./supabase'&&importer?.endsWith('siteSettingsService.js'))return '\0settings-client';},load(id){if(id==='\0settings-client')return 'export const ensureSupabase=()=>globalThis.__settingsClient;';}}]});
try {
 const api=await server.ssrLoadModule('/src/services/siteSettingsService.js');
 assert.ok(validateSettings({...row,npsn:'abc'},'school').npsn);
 for(const payload of [{academic_year:'2027/2030'},{news_page_size:2.5},{spmb_open:'false'}])assert.ok(Object.keys(validateSettings({...row,...payload},'general')).length);
 await api.saveSiteSettings({...row,news_page_size:'7',role:'owner'},'general',1);
 assert.equal(row.news_page_size,7);assert.equal(row.role,undefined);assert.equal(writes,1);
 await assert.rejects(api.saveSiteSettings({...row},'general',1),/berubah|ditolak/);
 admin=false;await assert.rejects(api.saveSiteSettings(row,'general',row.revision),/admin/);assert.equal(writes,1);
 admin=true;failWrite=true;await assert.rejects(api.saveSiteSettings(row,'general',row.revision),/Network/);failWrite=false;
 corruptRead=true;await assert.rejects(api.saveSiteSettings(row,'general',row.revision),/berubah/);corruptRead=false;
 const result=await api.saveAdminAccount({full_name:'Updated QA',email:'new@example.invalid'},'https://example.invalid/dashboard/pengaturan');
 assert.equal(result.emailPending,true);assert.equal(result.user.email,'old@example.invalid');assert.equal(pendingEmail,'new@example.invalid');assert.equal(result.user.user_metadata.full_name,'Updated QA');
 console.log('Settings service boundary: validation, payload allowlist, stale/error/readback handling, non-admin guard and pending email passed. Hosted Auth verification remains a separate manual test.');
} finally {await server.close();delete globalThis.__settingsClient;delete globalThis.window;delete globalThis.localStorage;}
