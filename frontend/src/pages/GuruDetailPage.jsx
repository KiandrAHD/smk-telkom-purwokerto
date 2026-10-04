import DetailPelengkapPage from './DetailPelengkapPage';
import { profilGuruDetail, profilGuruTranslations } from '../data/profilGuruData';

// Chunk khusus guru: halaman detail lain tidak mengunduh data/foto guru baru.
const GuruDetailPage = () => (
  <DetailPelengkapPage jenis="guru" data={profilGuruDetail} translations={profilGuruTranslations} />
);

export default GuruDetailPage;
