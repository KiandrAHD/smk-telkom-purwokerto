import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import FormInput from '../dashboard/FormInput';
import { useLanguage } from '../../context/LanguageContext';

export default function PasswordInput({ label, ...props }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  return <div className="relative"><FormInput label={label} {...props} type={visible ? 'text' : 'password'} className="pr-12" />
    <button type="button" aria-label={t(visible ? 'Sembunyikan sandi: {label}' : 'Tampilkan sandi: {label}', { label })} aria-pressed={visible} onClick={() => setVisible((v) => !v)} className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-lg text-dark-500 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
  </div>;
}
