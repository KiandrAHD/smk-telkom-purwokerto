import { fasilitasData } from './fasilitasData';

const existing = id => fasilitasData.find(item => item.id === id);
const knownPlace = (id, name, preview = '') => ({ id, name, preview, description: '', image: null });
export const campusFacilities = {
  'kelas-a': { content: existing('kelas-a'), list: { category: 'Kelas', group: 'kelas-a' } },
  'kelas-b': { content: existing('kelas-b'), list: { category: 'Kelas', group: 'kelas-b' } },
  'kelas-c': { content: existing('kelas-c'), list: { category: 'Kelas', group: 'kelas-c' } },
  'kelas-d': { content: existing('kelas-d'), list: { category: 'Kelas', group: 'kelas-d' } },
  perpustakaan: { content: existing('perpustakaan'), list: { category: 'Perpustakaan', group: 'perpustakaan' } },
  'rps-selatan': { content: knownPlace('rps-selatan', 'RPS Selatan', 'Ruang Praktik Siswa'), list: { category: 'Laboratorium', group: 'lab', item: 'lab-6' } },
  'rps-utara': { content: knownPlace('rps-utara', 'RPS Utara', 'Ruang Praktik Siswa'), list: { category: 'Laboratorium', group: 'lab', item: 'lab-5' } },
  dlg: { content: knownPlace('dlg', 'DLG', 'Digital Literacy Garden'), list: { category: 'Perpustakaan', group: 'literasi' } },
  'lapangan-apel': { content: knownPlace('lapangan-apel', 'Lapangan Apel'), list: null },
  aula: { content: knownPlace('aula', 'Aula'), list: null },
  parkiran: { content: knownPlace('parkiran', 'Parkiran'), list: null },
};

// Pin tips normalized against the Figma image, not the page viewport. Static classes keep Tailwind aware of coordinates.
export const campusHotspots = [
  { id: 'gedung-d-1', facilityId: 'kelas-d', label: 'Gedung D', node: '205:1108', x: 0.13461, y: 0.43102, position: 'left-[13.461%] top-[43.102%]' },
  { id: 'gedung-d-2', facilityId: 'kelas-d', label: 'Gedung D', node: '205:1114', x: 0.21704, y: 0.41199, position: 'left-[21.704%] top-[41.199%]' },
  { id: 'parkiran', facilityId: 'parkiran', label: 'Parkiran', node: '205:1107', x: 0.16357, y: 0.49382, position: 'left-[16.357%] top-[49.382%]' },
  { id: 'gedung-c', facilityId: 'kelas-c', label: 'Gedung C', node: '205:1136', x: 0.25714, y: 0.34158, position: 'left-[25.714%] top-[34.158%]' },
  { id: 'gedung-b', facilityId: 'kelas-b', label: 'Gedung B', node: '205:1109', x: 0.33148, y: 0.36061, position: 'left-[33.148%] top-[36.061%]' },
  { id: 'rps-selatan', facilityId: 'rps-selatan', label: 'RPS Selatan', node: '205:1111', x: 0.41344, y: 0.44910, position: 'left-[41.344%] top-[44.910%]' },
  { id: 'rps-utara', facilityId: 'rps-utara', label: 'RPS Utara', node: '205:1148', x: 0.41582, y: 0.54139, position: 'left-[41.582%] top-[54.139%]' },
  { id: 'lapangan-apel', facilityId: 'lapangan-apel', label: 'Lapangan Apel', node: '205:1112', x: 0.33116, y: 0.52141, position: 'left-[33.116%] top-[52.141%]' },
  { id: 'gedung-a', facilityId: 'kelas-a', label: 'Gedung A', node: '205:1110', x: 0.51144, y: 0.34919, position: 'left-[51.144%] top-[34.919%]' },
  { id: 'dlg', facilityId: 'dlg', label: 'DLG', node: '205:1921', x: 0.55759, y: 0.44053, position: 'left-[55.759%] top-[44.053%]' },
  { id: 'perpustakaan', facilityId: 'perpustakaan', label: 'Perpustakaan', node: '205:1902', x: 0.61106, y: 0.53473, position: 'left-[61.106%] top-[53.473%]' },
  { id: 'aula', facilityId: 'aula', label: 'Aula', node: '205:1927', x: 0.75778, y: 0.41579, position: 'left-[75.778%] top-[41.579%]' },
];
export function campusIdForCard(item) {
  const building = item.name?.match(/^Kelas ([ABCD]) /)?.[1];
  if (building) return `kelas-${building.toLowerCase()}`;
  return ({ 'RPS. Utara': 'rps-utara', 'RPS. Selatan': 'rps-selatan' })[item.name] || null;
}
