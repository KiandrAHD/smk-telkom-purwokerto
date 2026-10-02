import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const server = await createServer({
  configFile: false, appType: 'custom', logLevel: 'silent',
  server: { middlewareMode: true },
  plugins: [{
    name: 'image-upload-test-client', enforce: 'pre',
    resolveId(source) { if (source === './supabase') return '\0image-test-client'; },
    load(id) { if (id === '\0image-test-client') return 'export const ensureSupabase = () => globalThis.__imageTestClient'; },
  }],
});

try {
  for (const [folder, name] of [['prestasi', 'Prestasi'], ['bkk', 'Bkk'], ['berita', 'Berita'], ['pengumuman', 'Pengumuman']]) {
    const { default: Form } = await server.ssrLoadModule(`/src/pages/admin/${folder}/${name}Form.jsx`);
    const html = renderToStaticMarkup(createElement(Form, { onSubmit() {}, onCancel() {} }));
    assert.match(html, /type="file"/, `${name} perlu pemilih gambar`);
    assert.match(html, /Pilih berkas/);
    assert.match(html, /Maksimal 5 MB/);
  }

  const { validateImageFile, validateImageUrl, MAX_IMAGE_SIZE } = await server.ssrLoadModule('/src/utils/imageFile.js');
  assert.equal(validateImageUrl('https://example.com/photo.png'), '');
  assert.equal(validateImageUrl(''), '');
  assert.match(validateImageUrl('ftp://example.com/photo.png'), /http/);
  const samples = [
    ['png', 'image/png', [137, 80, 78, 71, 13, 10, 26, 10]],
    ['jpg', 'image/jpeg', [255, 216, 255, 224]],
    ['jpeg', 'image/jpeg', [255, 216, 255, 225]],
    ['gif', 'image/gif', [...Buffer.from('GIF89a')]],
    ['webp', 'image/webp', [...Buffer.from('RIFF0000WEBP')]],
  ];
  for (const [extension, type, bytes] of samples) {
    const file = new File([new Uint8Array(bytes)], `foto.${extension}`, { type });
    assert.equal((await validateImageFile(file)).type, type);
    const noMime = new File([new Uint8Array(bytes)], `foto.${extension}`);
    assert.equal((await validateImageFile(noMime)).type, type);
  }
  const file = new File([new Uint8Array(samples[0][2])], 'foto.png', { type: 'image/png' });
  await assert.rejects(validateImageFile(new File(['text'], 'foto.png', { type: 'image/png' })), /isi berkas/i);
  await assert.rejects(validateImageFile(new File(['text'], 'foto.svg', { type: 'image/svg+xml' })), /format/i);
  await assert.rejects(validateImageFile(new File(['text'], 'foto.png', { type: 'image/jpeg' })), /format/i);
  await assert.rejects(validateImageFile(new File([], 'kosong.png', { type: 'image/png' })), /kosong/i);
  await assert.rejects(validateImageFile(new File([new Uint8Array(MAX_IMAGE_SIZE + 1)], 'besar.png', { type: 'image/png' })), /5 MB/);
  const exactSize = new Uint8Array(MAX_IMAGE_SIZE);
  exactSize.set(samples[0][2]);
  await validateImageFile(new File([exactSize], 'batas.png', { type: 'image/png' }));

  const uploads = [], removals = [], writes = [];
  let uploadError = null, writeError = null, cleanupError = null;
  globalThis.__imageTestClient = {
    storage: { from(bucket) {
      assert.equal(bucket, 'content-images');
      return {
        upload: async (path, image, options) => { uploads.push({ path, image, options }); return { error: uploadError }; },
        getPublicUrl: (path) => ({ data: { publicUrl: `https://storage.example/${path}` } }),
        remove: async (paths) => { removals.push(...paths); return { error: cleanupError }; },
      };
    } },
    from(table) {
      const query = { eq: () => query, select: () => query, single: async () => ({ data: writeError ? null : { id: 'record', status: 'published' }, error: writeError }) };
      return { insert: (payload) => { writes.push({ table, payload }); return query; }, update: (payload) => { writes.push({ table, payload }); return query; } };
    },
  };
  for (const [module, create, update, field] of [
    ['prestasi', 'createPrestasi', 'updatePrestasi', 'gambar_url'],
    ['bkk', 'createBkk', 'updateBkk', 'logo_url'],
    ['berita', 'createBerita', 'updateBerita', 'gambar_url'],
    ['pengumuman', 'createPengumuman', 'updatePengumuman', 'gambar_url'],
  ]) {
    const service = await server.ssrLoadModule(`/src/services/${module}Service.js`);
    for (const save of [data => service[create](data), data => service[update]('record', data)]) {
      await save({ status: 'published', [field]: 'https://old.example/photo.png', image_file: file });
      assert.match(writes.at(-1).payload[field], /^https:\/\/storage.example\//);
      assert.equal('image_file' in writes.at(-1).payload, false);
      assert.equal(uploads.at(-1).options.upsert, false);
      const count = uploads.length;
      await save({ status: 'published', [field]: 'https://old.example/photo.png', image_file: null });
      assert.equal(uploads.length, count);
      assert.equal(writes.at(-1).payload[field], 'https://old.example/photo.png');
    }
  }
  const { createPrestasi } = await server.ssrLoadModule('/src/services/prestasiService.js');
  uploadError = new Error('Storage unavailable');
  const count = writes.length;
  await assert.rejects(createPrestasi({ image_file: file }), { code: 'CONTENT_IMAGE_UPLOAD' });
  assert.equal(writes.length, count);
  uploadError = null;
  writeError = Object.assign(new Error('duplicate'), { code: '23505' });
  await assert.rejects(createPrestasi({ image_file: file }), { code: '23505' });
  assert.equal(removals.at(-1), uploads.at(-1).path);
  cleanupError = new Error('cleanup unavailable');
  await assert.rejects(createPrestasi({ image_file: file }), { code: 'CONTENT_IMAGE_CLEANUP' });
  cleanupError = null;
  writeError = new Error('Network response lost');
  const removedCount = removals.length;
  await assert.rejects(createPrestasi({ image_file: file }), /Network response lost/);
  assert.equal(removals.length, removedCount, 'Jangan hapus gambar bila hasil simpan tidak pasti');
  console.log('Unggah gambar: 4 form, 5 format, batas 5 MB, 8 jalur simpan, URL lama, dan kegagalan Storage/database lulus.');
} finally {
  delete globalThis.__imageTestClient;
  await server.close();
}
