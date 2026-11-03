import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { aboutDescription, videoProfilSekolah } from '../../data/dummyData';
import VideoEmbed from '../VideoEmbed';
import poster from '../../assets/tentang/video-profil-thumbnail.png';
import schoolLogoMask from '../../assets/tentang/profile/school-logo-mask.png';
import playIcon from '../../assets/landing/about-play.svg';

const TentangAboutSection = () => {
  const { t } = useLanguage();
  return (
    <section id="profil" className="profile-section profile-about">
      <div className="profile-container">
        <div className="profile-about-panel">
          <div className="profile-about-copy">
            <h2>{t(aboutDescription.title)}</h2>
            <p>{t(aboutDescription.text)}</p>
            <a href="#perjalanan" className="profile-about-action">
              {t(aboutDescription.ctaText)}<ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
            </a>
          </div>
          <div className="profile-video">
            <VideoEmbed {...videoProfilSekolah} poster={poster} title={t(videoProfilSekolah.title)} desc={t(videoProfilSekolah.desc)} showCaption={false} appearance="about" playIcon={playIcon} />
            <span aria-hidden="true" className="profile-video-logo"><span style={{ maskImage: `url(${schoolLogoMask})` }} /></span>
            <p>{t('Tentang SMK Telkom Purwokerto')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TentangAboutSection;
