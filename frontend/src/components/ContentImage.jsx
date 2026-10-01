import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ImageContent = ({ src, alt, className = '', ...props }) => {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div role="img" aria-label={t('Foto belum tersedia')} className={`${className} flex items-center justify-center bg-dark-50 px-3 text-center text-xs text-dark-500`}>
        {t('Foto belum tersedia')}
      </div>
    );
  }

  return <img {...props} src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
};

const ContentImage = (props) => <ImageContent key={props.src || ''} {...props} />;

export default ContentImage;
