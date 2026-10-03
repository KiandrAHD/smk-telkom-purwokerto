import logo from '../assets/landing/logo-smk-telkom-purwokerto.png';

const Logo = ({ className = 'w-10 h-10' }) => (
  <img src={logo} alt="Logo SMK Telkom Purwokerto" className={`${className} object-contain`} />
);

export default Logo;
