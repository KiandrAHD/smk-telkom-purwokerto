import { useSiteSettings } from '../context/SiteSettingsContext';
import logo from '../assets/landing/logo-smk-telkom-purwokerto.png';

const Logo = ({ className = 'w-10 h-10' }) => {
  const { settings } = useSiteSettings();
  return (
  <img src={settings?.logo_url || logo} alt={settings?.school_name || 'Logo SMK Telkom Purwokerto'} className={`${className} object-contain`} />
);
};

export default Logo;
