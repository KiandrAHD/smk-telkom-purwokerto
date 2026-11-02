import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

const env = loadEnv('development', process.cwd(), 'VITE_');
const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const read = () => client.from('site_settings').select('*').eq('id', true).single();
const before = await read();
assert.ifError(before.error);
assert.equal(before.data.school_name, 'SMK Telkom Purwokerto');
const denied = await client.from('site_settings').update({ news_page_size: before.data.news_page_size }).eq('id', true).select();
assert.ok(denied.error, 'Anonymous users must not update settings');
const after = await read();
assert.ifError(after.error);
assert.equal(after.data.revision, before.data.revision);
if (after.data.logo_url) {
  const response = await fetch(after.data.logo_url);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^image\//);
}
console.log(`Hosted Supabase: public read, anonymous write denial, unchanged revision, public logo fetch passed (revision ${after.data.revision}).`);
