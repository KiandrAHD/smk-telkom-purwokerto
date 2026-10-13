import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { guruData } = await server.ssrLoadModule('/src/data/guruData.js');
  const { profilGuruData } = await server.ssrLoadModule('/src/data/profilGuruData.js');
  const { schoolTeacherData } = await server.ssrLoadModule('/src/data/schoolTeacherData.js');
  assert.deepEqual(schoolTeacherData.map(teacher => teacher.nama), guruData.map(teacher => teacher.nama));
  const photoFields = ['image', 'thumbnail', 'imageWidth', 'imageHeight', 'imageSrcSet', 'imageSizes', 'photoCropClassName'];
  for (const [index, teacher] of schoolTeacherData.entries()) {
    const canonical = profilGuruData.find(profile => profile.nama === teacher.nama);
    assert.equal(teacher.image, canonical.image);
    const metadata = record => Object.fromEntries(Object.entries(record).filter(([field]) => !photoFields.includes(field)));
    assert.deepEqual(metadata(teacher), metadata(guruData[index]), 'Photo synchronization must not change identities, roles, or descriptions.');
    if (teacher.image !== guruData[index].image) {
      assert.equal(teacher.photoCropClassName, 'w-full left-0 top-0');
      assert.ok(teacher.imageSrcSet.includes('240w') && teacher.imageSrcSet.includes('480w'));
    }
  }
  const changed = schoolTeacherData.filter((teacher, index) => teacher.image !== guruData[index].image).map(teacher => teacher.nama);
  const retained = schoolTeacherData.filter((teacher, index) => teacher.image === guruData[index].image).map(teacher => teacher.nama);
  assert.equal(changed.length, 9);
  assert.equal(retained.length, 4);
  console.log(JSON.stringify({ changed, retained }, null, 2));
} finally {
  await server.close();
}
