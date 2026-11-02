import { createContext, useContext, useEffect, useState } from 'react';
import { getSiteSettings } from '../services/siteSettingsService';
import { supabaseSiap } from '../services/supabase';
const Context = createContext({ settings:null });
export function SiteSettingsProvider({children}) {
  const [settings,setSettings] = useState(null);
  useEffect(() => {
    if (!supabaseSiap) return;
    let active = true, request = 0;
    const refresh = () => {
      const version = ++request;
      getSiteSettings().then(row => { if (active && version === request) setSettings(row); }).catch(() => {});
    };
    refresh();
    const interval = setInterval(refresh,60000);
    const storage = event => { if (event.key === 'site-settings-changed') refresh(); };
    window.addEventListener('focus',refresh); window.addEventListener('site-settings-changed',refresh); window.addEventListener('storage',storage);
    return () => { active = false; clearInterval(interval); window.removeEventListener('focus',refresh); window.removeEventListener('site-settings-changed',refresh); window.removeEventListener('storage',storage); };
  },[]);
  return <Context.Provider value={{settings}}>{children}</Context.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export const useSiteSettings = () => useContext(Context);
