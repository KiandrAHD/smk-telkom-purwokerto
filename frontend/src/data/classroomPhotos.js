import manifest from './classroomPhotoManifest.json';

const assets = import.meta.glob('../assets/fasilitas/kelas/*.webp', { eager: true, query: '?url', import: 'default' });
const asset = (id, width) => assets[`../assets/fasilitas/kelas/${id}-${width}.webp`];

export const classroomPhotos = Object.fromEntries(Object.entries(manifest).map(([name, photos]) => [
  name,
  photos.map(photo => ({
    source: photo.source,
    src: asset(photo.id, 1280),
    thumbnail: asset(photo.id, 320),
    srcSet: [320, 640, 960, 1280].map(width => `${asset(photo.id, width)} ${width}w`).join(', '),
    width: 1280,
    height: 960,
  })),
]));
