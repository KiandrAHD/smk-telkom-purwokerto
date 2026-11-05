import { useLanguage } from '../../context/LanguageContext';
import { nilaiStematel } from '../../data/dummyData';
import vision from '../../assets/tentang/profile/vision.svg';
import mission from '../../assets/tentang/profile/mission.svg';
import innovation from '../../assets/tentang/profile/innovation.svg';
import character from '../../assets/tentang/profile/character.svg';
import technology from '../../assets/tentang/profile/technology.svg';
import collaboration from '../../assets/tentang/profile/collaboration.svg';
import schoolPhoto from '../../assets/tentang/profile/vision-school.png';
import classroomPhoto from '../../assets/tentang/profile/mission-classroom.png';
import visionAccent from '../../assets/tentang/profile/vision-accent.png';

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
    <section className="profile-section profile-principles-section" aria-label={t('Visi, Misi, dan Nilai-Nilai Stematel')}>
      <div className="profile-container profile-principles">
        <div className="profile-vision">
          <div className="profile-vision-grid">
            <article className="profile-principle-card profile-principle-vision">
              <img className="profile-principle-photo" src={schoolPhoto} alt="" aria-hidden="true" loading="lazy" />
              <img className="profile-vision-accent" src={visionAccent} alt="" aria-hidden="true" loading="lazy" />
              <div className="profile-principle-copy">
                <div className="profile-principle-header">
                  <img src={vision} alt="" aria-hidden="true" />
                  <div>
                    <h2>{t('Visi')}</h2>
                    <p className="profile-principle-tagline">School of <span>Global Technopreneur</span></p>
                  </div>
                </div>
                <p className="profile-principle-description">
                  <strong>SMK Telkom Purwokerto</strong>{' '}
                  {t('hadir untuk menjawab tantangan dunia digital. Kami tidak mencetak “pekerja” atau “tukang servis”, melainkan')}{' '}
                  <strong className="text-[#cd0b20]">{t('Kreator dan Inovator')}</strong>
                  {t('. Di sini, siswa dididik untuk menjadi pemimpin masa depan yang mampu menciptakan solusi digital untuk dunia.')}
                </p>
              </div>
            </article>
            <article className="profile-principle-card profile-principle-mission">
              <div className="profile-mission-photo">
                <img className="profile-principle-photo" src={classroomPhoto} alt="" aria-hidden="true" loading="lazy" />
              </div>
              <div className="profile-principle-copy">
                <div className="profile-principle-header">
                  <img src={mission} alt="" aria-hidden="true" />
                  <div>
                    <h2>{t('Misi')}</h2>
                    <p className="profile-principle-tagline">School of <span>Global Technopreneur</span></p>
                  </div>
                </div>
                <p className="profile-principle-description">{t('Menyelenggarakan pendidikan berbasis industri yang adaptif terhadap kemajuan teknologi dan inovatif dalam pembelajaran, guna mencetak lulusan berkarakter unggul yang siap memelopori peradaban Society 5.0.')}</p>
              </div>
            </article>
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
