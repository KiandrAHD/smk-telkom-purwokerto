import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { stelaData } from '../../data/dummyData';
import stelaPanel from '../../assets/pengumuman/stela-help-panel.png';
import { stelaCardEn, stelaEnglishSrcSet, stelaHelpSizes, restoreOriginalStelaArtwork } from '../../utils/stelaArtwork';

const PengumumanBantuanCard = () => {
  const { t, language } = useLanguage();
  return (
  <div className="font-['Plus_Jakarta_Sans']">
    {/* Figma menempatkan ilustrasi/chat dan tombol sebagai dua bagian terpisah. */}
    <div className="relative aspect-[565/265] overflow-hidden rounded-xl bg-[#830b19]">
      <img
        src={language === 'en' ? stelaCardEn : stelaPanel}
        srcSet={language === 'en' ? stelaEnglishSrcSet : undefined}
        sizes={language === 'en' ? stelaHelpSizes : undefined}
        onError={language === 'en' ? restoreOriginalStelaArtwork : undefined}
        alt=""
        aria-hidden="true"
        className={language === 'en' ? 'absolute -left-[56%] h-full w-[156%] max-w-none' : 'h-full w-full object-cover'}
      />
    </div>
    <div className="sr-only">
      <h2>{t(stelaData.title).replace('\n', ' ')}</h2>
      {stelaData.chats.map((chat) => <p key={chat.from}>{t(chat.text)}</p>)}
    </div>
    <Link
      to="/stela"
      className="mt-4 flex min-h-11 w-full items-center rounded-xl bg-[#cd0b20] px-5 py-3 text-base font-extrabold tracking-[0.05em] text-white shadow-md transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:text-xl"
    >
      {t(stelaData.ctaText)}
    </Link>

  </div>
  );
};

export default PengumumanBantuanCard;
