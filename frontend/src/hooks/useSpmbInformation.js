import { useCallback, useEffect, useRef, useState } from 'react';
import { getSpmbInformation, getSpmbStatistics, spmbInformationError } from '../services/spmbInformationService';

export default function useSpmbInformation(published = false, initialData) {
  const [items, setItems] = useState(initialData?.items || []), [stats, setStats] = useState(initialData?.stats || null), [loading, setLoading] = useState(!initialData), [error, setError] = useState('');
  const request = useRef(null);
  const refresh = useCallback(async (quiet = false) => {
    request.current?.abort(); const controller = new AbortController(); request.current = controller;
    if (!quiet) setLoading(true);
    try {
      const [rows, counts] = await Promise.all([getSpmbInformation(published, controller.signal), getSpmbStatistics(controller.signal)]);
      if (!controller.signal.aborted) { setItems(rows); setStats(counts); setError(''); }
    } catch (cause) {
      if (!controller.signal.aborted) { setItems([]); setStats(null); setError(spmbInformationError(cause)); }
    } finally { if (!controller.signal.aborted) setLoading(false); }
  }, [published]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    const update = () => { if (document.visibilityState === 'visible') void refresh(true); };
    const storage = event => { if (event.key === 'school-spmb-information-changed') update(); };
    const timer = setInterval(update, 30000);
    window.addEventListener('focus', update); document.addEventListener('visibilitychange', update);
    window.addEventListener('school-spmb-information-changed', update); window.addEventListener('storage', storage);
    return () => { request.current?.abort(); clearInterval(timer); window.removeEventListener('focus', update); document.removeEventListener('visibilitychange', update); window.removeEventListener('school-spmb-information-changed', update); window.removeEventListener('storage', storage); };
  }, [refresh]);
  return { items, stats, loading, error, refresh };
}
