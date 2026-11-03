import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';
import { timelineData } from '../../data/dummyData';
import school from '../../assets/tentang/profile/school.svg';
import accreditation from '../../assets/tentang/profile/accreditation.svg';
import industry from '../../assets/tentang/profile/industry.svg';
import smartSchool from '../../assets/tentang/profile/smart-school.svg';
import ai from '../../assets/tentang/profile/ai.svg';

const icons = [school, accreditation, industry, smartSchool, ai];

const TentangTimelineSection = () => {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  return (
    <section id="perjalanan" className="profile-section profile-history">
      <div className="profile-container">
        <h2 className="profile-section-heading">{t('Perjalanan Kami')}</h2>
        <ol className="profile-timeline">
          {timelineData.map((item, i) => (
            <li key={item.year}>
              <button type="button" onClick={() => setActive(i)} aria-current={active === i ? 'step' : undefined} className="profile-milestone">
                <span className="profile-milestone-icon"><img src={icons[i]} alt="" aria-hidden="true" /></span>
                <span className="profile-milestone-content">
                  <span className="profile-milestone-year">{item.year}</span>
                  <span className="profile-milestone-track" aria-hidden="true"><i /><i /><i /></span>
                  <span className="profile-milestone-title">{t(item.title)}</span>
                  <span className="profile-milestone-description">{t(item.desc)}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default TentangTimelineSection;
