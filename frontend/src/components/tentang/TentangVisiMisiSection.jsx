import { useLanguage } from '../../context/LanguageContext';
import { nilaiStematel, visiMisi } from '../../data/dummyData';
import vision from '../../assets/tentang/profile/vision.svg';
import mission from '../../assets/tentang/profile/mission.svg';
import innovation from '../../assets/tentang/profile/innovation.svg';
import character from '../../assets/tentang/profile/character.svg';
import technology from '../../assets/tentang/profile/technology.svg';
import collaboration from '../../assets/tentang/profile/collaboration.svg';

const nilaiIcons = { lightbulb: innovation, shield: character, cpu: technology, handshake: collaboration };

const Card = ({ icon, title, desc }) => {
  const { t } = useLanguage();
  return (
    <article className="profile-value-card">
      <div className="profile-value-icon"><img src={icon} alt="" aria-hidden="true" /></div>
      <h3>{t(title)}</h3>
      <p>{t(desc)}</p>
    </article>
  );
};

const TentangVisiMisiSection = () => {
  const { t } = useLanguage();
  return (
    <section className="profile-section" aria-label={t('Visi, Misi, dan Nilai-Nilai Stematel')}>
      <div className="profile-container profile-principles">
        <div className="profile-vision">
          <h2 className="profile-section-heading">{t('Visi & Misi')}</h2>
          <div className="profile-vision-grid">
            <Card icon={vision} title="Visi" desc={visiMisi.visi} />
            <Card icon={mission} title="Misi" desc={visiMisi.misi} />
          </div>
        </div>
        <div className="profile-values">
          <h2 className="profile-section-heading">{t('Nilai-Nilai Stematel')}</h2>
          <div className="profile-values-grid">
            {nilaiStematel.map(nilai => <Card key={nilai.title} icon={nilaiIcons[nilai.icon]} title={nilai.title} desc={nilai.desc} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TentangVisiMisiSection;
