import { useState } from 'react';
import { Copy } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function CopyRegistrationNumber({ value }) {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setMessage('Nomor disalin.'); }
    catch { setMessage('Tidak dapat menyalin. Pilih dan salin nomor secara manual.'); }
  };
  return <div className="mt-2"><button type="button" onClick={copy} className="inline-flex min-h-11 items-center gap-2 text-xs font-bold text-primary hover:underline"><Copy className="h-3.5 w-3.5" />{t('Salin nomor registrasi')}</button>{message && <p role="status" className="text-xs font-normal text-dark-500">{t(message)}</p>}</div>;
}
