import { guruData } from './guruData';
import { profilGuruData } from './profilGuruData';

const profilesByName = new Map(profilGuruData.map(teacher => [teacher.nama, teacher]));
const photoFields = ['image', 'thumbnail', 'imageWidth', 'imageHeight', 'imageSrcSet', 'imageSizes', 'photoCropClassName'];

// Match verified full names and copy only photography; keep the school carousel's records and order.
export const schoolTeacherData = guruData.map(teacher => {
  const profile = profilesByName.get(teacher.nama);
  if (!profile?.image) return teacher;
  return { ...teacher, ...Object.fromEntries(photoFields.filter(field => profile[field] !== undefined).map(field => [field, profile[field]])) };
});
