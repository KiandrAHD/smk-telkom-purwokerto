import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TentangPage from './pages/TentangPage';
import JurusanPage from './pages/JurusanPage';
import PrestasiPage from './pages/PrestasiPage';
import BkkPage from './pages/BkkPage';
import BeritaPage from './pages/BeritaPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tentang" element={<TentangPage />} />
      <Route path="/jurusan" element={<JurusanPage />} />
      <Route path="/prestasi" element={<PrestasiPage />} />
      <Route path="/bkk" element={<BkkPage />} />
      <Route path="/berita" element={<BeritaPage />} />
    </Routes>
  );
};

export default App;
