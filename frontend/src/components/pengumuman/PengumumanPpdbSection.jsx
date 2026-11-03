import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, CalendarDays, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPublicDate, getPengumumanHariIni } from '../../utils/publicContent';
import FeaturedAnnouncementAccents from './FeaturedAnnouncementAccents';
import speaker from '../../assets/pengumuman/featured/Group.svg';
import circle from '../../assets/pengumuman/featured/Ellipse308.svg';
import notification from '../../assets/pengumuman/featured/BasilNotificationOnOutline.svg';
import './PengumumanPpdbSection.css';

import { latestPublishedAnnouncements } from '../../utils/featuredAnnouncements';

const PengumumanPpdbSection = ({ items = [], loading = false, error = '', now = new Date(), tampilkanLihatSemua = true }) => {
  const { t, locale } = useLanguage();
  const published = latestPublishedAnnouncements(items);
  const latest = published.slice(0, 3);
  const today = getPengumumanHariIni(published, now);
  const shown = (today.length ? today : latest).slice(0, 3);
  const featured = latest[0];
  const status = loading ? t('Memuat pengumuman...') : error ? t(error) : t('Belum ada pengumuman.');
  return (
    <section className="announcement-feature-section bg-white py-4 lg:py-6" aria-label={t('Pengumuman Terbaru')}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="announcement-feature" data-figma-node="305:1638" aria-busy={loading || undefined}>
          <FeaturedAnnouncementAccents />
          <div className="announcement-feature-content">
            <div className="announcement-speaker" aria-hidden="true"><img src={circle} alt="" /><img src={speaker} alt="" /></div>
            <div className="announcement-feature-copy">
              <h2>{!loading && !error && featured ? t(featured.title) : t('Pusat Informasi & Pengumuman Resmi Sekolah')}</h2>
              {!loading && !error && featured ? <>
                <div className="announcement-feature-tags"><span><CalendarDays aria-hidden="true" /><time dateTime={featured.iso}>{formatPublicDate(featured.iso, { timeZone: 'Asia/Jakarta' }, locale)}</time></span></div>
                {featured.desc && <p className="announcement-feature-description">{t(featured.desc)}</p>}
                <Link to={`/pengumuman/${featured.slug}`} className="announcement-outline-button announcement-feature-button">{t('Lihat Detail')}<ArrowRight aria-hidden="true" /></Link>
              </> : <p role={error ? 'alert' : 'status'} className="announcement-feature-description">{status}</p>}
            </div>
          </div>
          <div className="announcement-info-card" data-figma-node="305:1637">
            <h2 className="announcement-info-title"><img src={notification} alt="" aria-hidden="true" />{t('Informasi Penting Hari ini')}</h2>
            {tampilkanLihatSemua && <Link to="/pengumuman/informasi-penting" className="announcement-outline-button announcement-all-button">{t('Lihat Semua')}<ArrowRight aria-hidden="true" /></Link>}
            {loading || error || !published.length ? <p role={error ? 'alert' : 'status'} className="announcement-info-status">{status}</p> : <>
              {!today.length && <p className="announcement-info-status">{t('Belum ada pengumuman yang diterbitkan hari ini.')}</p>}
              {!today.length && <h3 className="announcement-latest-title">{t('Pengumuman Terbaru')}</h3>}
              <ul className="announcement-latest-list">
                {shown.map(item => <li key={item.id || item.slug}>
                  <Link to={`/pengumuman/${item.slug}`} className="announcement-item-link">
                    <span className="announcement-item-icon" aria-hidden="true"><ClipboardList /></span>
                    <span className="min-w-0"><span className="announcement-item-title">{t(item.title)}</span><time dateTime={item.iso}>{formatPublicDate(item.iso, { timeZone: 'Asia/Jakarta' }, locale)}</time></span>
                  </Link>
                </li>)}
              </ul>
            </>}
          </div>
        </div>
      </div>
    </section>
  );
};
export default PengumumanPpdbSection;
