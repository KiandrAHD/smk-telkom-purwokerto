import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lightbulb, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const DISMISSAL_KEY = 'stela-reminder-dismissed-at';
const CYCLE_MS = 7 * 24 * 60 * 60 * 1000;

/** A small, infrequent prompt that does not open or modify the STELA chat. */
export default function StelaReminder() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname === '/stela') return undefined;

    let dismissedAt = 0;
    try {
      dismissedAt = Number.parseInt(window.localStorage.getItem(DISMISSAL_KEY) || '0', 10) || 0;
    } catch {
      // Storage can be unavailable in private browsing. The reminder still works.
    }

    if (Date.now() - dismissedAt < CYCLE_MS) return undefined;
    const timer = window.setTimeout(() => setVisible(true), 5000);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISSAL_KEY, String(Date.now()));
    } catch {
      // Dismiss for this render when storage is unavailable.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label={t('Pengingat STELA')}
      className="fixed bottom-24 left-4 right-4 z-40 sm:bottom-28 sm:left-auto sm:right-6 sm:w-80"
    >
      <div className="relative rounded-2xl border border-primary/15 bg-white p-4 pr-11 shadow-card motion-reduce:animate-none motion-chat-enter">
        <button
          type="button"
          onClick={dismiss}
          aria-label={t('Tutup pengingat STELA')}
          className="absolute right-2 top-2 rounded-full p-2 text-dark-500 transition-colors hover:bg-dark-100 hover:text-dark-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex gap-3">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="font-heading text-sm font-bold text-dark-900">{t('Punya pertanyaan?')}</p>
            <p className="mt-1 text-xs leading-relaxed text-dark-600">
              {t('STELA siap membantu menemukan informasi tentang sekolah.')}
            </p>
            <Link
              to="/stela"
              onClick={dismiss}
              className="mt-2 inline-flex min-h-8 items-center rounded-lg text-xs font-bold text-primary underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              {t('Tanya STELA')}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
