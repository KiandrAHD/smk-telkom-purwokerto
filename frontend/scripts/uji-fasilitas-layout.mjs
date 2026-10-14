import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { fasilitasViews } = await server.ssrLoadModule('/src/data/fasilitasPageData.js');
  assert.deepEqual(fasilitasViews.Semua.map(group => group.title), ['Laboratorium', 'Ruang Kelas', 'Perpustakaan', 'Aula', 'GOR', 'Parkiran']);
  assert.equal(fasilitasViews.Semua.flatMap(group => group.items).length, 24);
  const classrooms = fasilitasViews.Kelas.flatMap(group => group.items);
  assert(classrooms.some(item => item.name === 'Kelas C 2.1'));
  assert(classrooms.some(item => item.name === 'Kelas C 3.1'));
  assert(!classrooms.some(item => /C (2\.3|3\.3)/.test(item.name)));
  for (const item of Object.values(fasilitasViews).flatMap(groups => groups.flatMap(group => group.items))) {
    assert(item.photos?.length, `${item.name}: photo slot must be filled`);
    assert(item.photos[0].source, `${item.name}: source must be traceable`);
    assert(!item.image.includes('belajar-kelompok-laptop'), `${item.name}: no placeholder`);
  }
  const { campusHotspots, campusFacilities } = await server.ssrLoadModule('/src/data/campusData.js');
  const point = campusHotspots.find(point => point.id === 'gedung-d-2');
  assert.equal(point.label, 'Gedung D');
  assert.equal(campusFacilities[point.facilityId].location, 'Gedung D');
  console.log('PASS Figma groups, 24 slots, corrected classroom names, traceable photos, and Gedung D destination');
} finally { await server.close(); }
