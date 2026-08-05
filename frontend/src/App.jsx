import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TentangPage from './pages/TentangPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tentang" element={<TentangPage />} />
    </Routes>
  );
};

export default App;