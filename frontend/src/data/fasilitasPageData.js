import image from '../assets/ekstrakurikuler/belajar-kelompok-laptop.png';
import { classroomPhotoCovers } from './classroomPhotoCovers';

// Page-specific example inventory from Figma 174:151–174:2042 and the supplied ZIP.
// Keep the landing carousel separate; unavailable rooms retain the illustrative fallback.
const previews = [
  'Ruang kelas modern dengan pencahayaan baik dan perangkat belajar lengkap.',
  'Ruang kelas nyaman dengan suasana belajar yang tenang dan tertata.',
  'Ruang kelas modern yang mendukung diskusi dan kerja kelompok.',
  'Ruang kelas modern dengan suasana belajar yang nyaman dan kondusif.',
];
const section = (id, title, names) => ({
  id, title,
  items: names.map((name, index) => {
    const photos = classroomPhotoCovers[name];
    return { id: `${id}-${index + 1}`, name, image: photos?.[0].src || image, photos, preview: previews[index % previews.length] };
  }),
});
const rooms = {
  A: ['1.4', '2.2', '3.4', '3.6'], B: ['1.4', '1.5', '2.3', '2.5'],
  C: ['2.2', '2.3', '3.2', '3.3'], D: ['1.2', '2.1', '2.2', '3.1'],
};
const classroomNames = building => rooms[building].map(room => `Kelas ${building} ${room}`);
const libraryNames = ['Rak Tas', 'Tempat Baca', 'Lab. TJA', 'Lab. RPL'];

// Copied example labels are intentionally retained at the user's request.
export const fasilitasViews = {
  Semua: [
    section('semua-lab', 'Laboratorium', classroomNames('A')),
    section('semua-kelas', 'Ruang Kelas', classroomNames('B')),
    section('semua-perpustakaan', 'Perpustakaan', classroomNames('C')),
    section('semua-aula', 'Aula', classroomNames('D')),
  ],
  Laboratorium: [section('lab', '', ['Lab. Robotik', 'Lab. TKJ', 'Lab. TJA', 'Lab. RPL', 'RPS. Utara', 'RPS. Selatan'])],
  Kelas: Object.keys(rooms).map(building => section(`kelas-${building.toLowerCase()}`, `Kelas Gedung ${building}`, classroomNames(building))),
  Perpustakaan: [section('perpustakaan', 'Ruang Perpustakaan', libraryNames), section('literasi', 'Digital Literasi Garden', libraryNames)],
  Aula: [section('aula', '', ['Panggung', 'Halaman Depan', 'Lab. TJA', 'Lab. RPL'])],
  GOR: [section('gor', '', ['Lapangan Futsal', 'Lapangan Basket', 'Lapangan Voli', 'Lapangan Badminton'])],
  Parkiran: [section('parkiran', '', ['Lapangan Futsal', 'Lapangan Basket', 'Lab. TJA', 'Lab. RPL'])],
};
export const fasilitasCategories = Object.keys(fasilitasViews);
