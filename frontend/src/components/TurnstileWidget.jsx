import { useCallback, useEffect, useRef, useState } from 'react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

export async function verifyTurnstileToken(token) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  if (!supabaseUrl || !anonKey) throw new Error('Konfigurasi server belum lengkap.');

  const response = await fetch(`${supabaseUrl}/functions/v1/turnstile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
    },
    body: JSON.stringify({ token }),
  });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error('Verifikasi keamanan gagal. Silakan coba lagi.');
}

export function useTurnstile() {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState(SITE_KEY ? 'loading' : 'disabled');

  const reset = useCallback(() => {
    if (widgetIdRef.current != null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      setToken('');
      setStatus('loading');
    }
  }, []);

  const renderWidget = useCallback(() => {
    if (!SITE_KEY || !containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current != null) window.turnstile.remove(widgetIdRef.current);
    setToken('');
    setStatus('loading');
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      theme: 'light',
      callback: (nextToken) => { setToken(nextToken); setStatus('success'); },
      'error-callback': () => { setToken(''); setStatus('error'); },
      'expired-callback': () => { setToken(''); setStatus('expired'); },
    });
  }, []);

  useEffect(() => {
    if (!SITE_KEY) return undefined;
    if (window.turnstile) {
      renderWidget();
      return undefined;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = renderWidget;
    script.onerror = () => setStatus('error');
    document.head.appendChild(script);
    return () => {
      if (widgetIdRef.current != null && window.turnstile) window.turnstile.remove(widgetIdRef.current);
    };
  }, [renderWidget]);

  return { containerRef, token, status, reset, enabled: Boolean(SITE_KEY) };
}
