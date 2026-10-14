// Stable IDs preserve the existing scoring and API contract.
// shortcut: Existing major weights are reused; validate them before treating the new questions as an assessment instrument.
export const NEXTTEL_QUESTIONS = [
  { id: 'activity', prompt: 'Aktivitas apa yang paling kamu sukai?', options: [
    { id: 'a', label: 'Mencoba hal baru' }, { id: 'b', label: 'Membuat sesuatu yang menarik' }, { id: 'c', label: 'Memecahkan masalah' }, { id: 'd', label: 'Mengatur suatu kegiatan' },
  ] },
  { id: 'interest', prompt: 'Hal apa yang paling menarik perhatianmu?', options: [
    { id: 'a', label: 'Teknologi dan perkembangannya' }, { id: 'b', label: 'Seni dan kreativitas' }, { id: 'c', label: 'Cara kerja suatu benda' }, { id: 'd', label: 'Ide dan peluang baru' },
  ] },
  { id: 'project', prompt: 'Saat menghadapi kesulitan, apa yang kamu lakukan?', options: [
    { id: 'a', label: 'Mencoba cara lain' }, { id: 'b', label: 'Mencari ide baru' }, { id: 'c', label: 'Mencari penyebabnya' }, { id: 'd', label: 'Meminta pendapat orang lain' },
  ] },
  { id: 'learning', prompt: 'Kegiatan apa yang paling ingin kamu coba?', options: [
    { id: 'a', label: 'Membuat karya yang bermanfaat' }, { id: 'b', label: 'Menghasilkan karya kreatif' }, { id: 'c', label: 'Mencoba alat atau hal baru' }, { id: 'd', label: 'Merencanakan sebuah kegiatan' },
  ] },
  { id: 'problem', prompt: 'Bagaimana cara belajar yang paling kamu sukai?', options: [
    { id: 'a', label: 'Langsung mencoba sendiri' }, { id: 'b', label: 'Melihat contoh dan berkreasi' }, { id: 'c', label: 'Memahami cara kerjanya' }, { id: 'd', label: 'Berdiskusi bersama teman' },
  ] },
  { id: 'tool', prompt: 'Apa yang membuatmu semangat mempelajari sesuatu?', options: [
    { id: 'a', label: 'Bisa menghasilkan sesuatu' }, { id: 'b', label: 'Bisa menyalurkan kreativitas' }, { id: 'c', label: 'Bisa memahami hal baru' }, { id: 'd', label: 'Bisa mencapai target' },
  ] },
  { id: 'work', prompt: 'Dalam sebuah kelompok, kamu biasanya lebih suka?', options: [
    { id: 'a', label: 'Mengerjakan bagian utama' }, { id: 'b', label: 'Memberikan ide kreatif' }, { id: 'c', label: 'Mencari solusi saat ada masalah' }, { id: 'd', label: 'Mengatur tugas kelompok' },
  ] },
  { id: 'future', prompt: 'Hal apa yang ingin kamu kembangkan untuk masa depan?', options: [
    { id: 'a', label: 'Kemampuan membuat sesuatu' }, { id: 'b', label: 'Kreativitas dan ide' }, { id: 'c', label: 'Kemampuan memahami teknologi' }, { id: 'd', label: 'Kemampuan mengelola dan berkomunikasi' },
  ] },
];
