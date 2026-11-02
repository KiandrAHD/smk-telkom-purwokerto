import { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import HeroBreadcrumb from '../HeroBreadcrumb';
import NextTelAccents from './NextTelAccents';

const NextTelIntro = ({ onStart }) => {
  const { t } = useLanguage();
  const headingRef = useRef(null);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, []);
  return (
    <div className="nexttel-intro">
      <HeroBreadcrumb current="NexTel" parent="Beranda" parentTo="/" />
      <div className="nexttel-intro__panel">
        <div className="nexttel-intro__background" aria-hidden="true" />
        <NextTelAccents />
        <div className="nexttel-intro__content">
          <div className="nexttel-intro__heading">
            <div className="nexttel-intro__mascot" aria-hidden="true"><img src="/assets/nexttel/robot-figma.png" alt="" /></div>
            <h1 ref={headingRef} tabIndex={-1}>{t('Temukan jurusan yang cocok dengan minatmu')}</h1>
          </div>
          <p className="nexttel-intro__description">{t('Jawab 8 pertanyaan singkat tentang hal yang kamu sukai. NextTel akan membantu membaca kecenderungan minatmu pada jurusan teknologi di SMK Telkom Purwokerto.')}</p>
          <button type="button" onClick={onStart} className="nexttel-intro__start">
            {t('Mulai sekarang')} <img src="/assets/nexttel/intro-arrow.svg" alt="" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NextTelIntro;
