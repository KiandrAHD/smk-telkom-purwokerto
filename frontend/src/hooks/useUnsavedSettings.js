import { useEffect } from 'react';
export function canLeaveSettings() {
  return window.dispatchEvent(new Event('settings-before-leave', { cancelable: true }));
}
export default function useUnsavedSettings(dirty, busy = false) {
  useEffect(() => {
    if (!dirty && !busy) return;
    const message = 'Ada perubahan belum disimpan. Tinggalkan halaman?';
    const unload = event => { event.preventDefault(); event.returnValue = ''; };
    const allowed = () => !busy && window.confirm(message);
    const leave = event => { if (!allowed()) event.preventDefault(); };
    const click = event => {
      const link = event.target.closest?.('a[href]');
      if (link && link.href !== window.location.href && link.target !== '_blank' && !allowed()) { event.preventDefault(); event.stopImmediatePropagation(); }
    };
    let index = window.history.state?.idx ?? 0, restoring = false;
    const pop = event => {
      const next = event.state?.idx;
      if (restoring) { restoring = false; event.stopImmediatePropagation(); return; }
      if (Number.isInteger(next) && next !== index && !allowed()) {
        restoring = true; event.stopImmediatePropagation(); window.history.go(index-next);
      } else if (Number.isInteger(next)) index=next;
    };
    window.addEventListener('settings-before-leave',leave);
    window.addEventListener('beforeunload',unload); document.addEventListener('click',click,true); window.addEventListener('popstate',pop,true);
    return () => { window.removeEventListener('settings-before-leave',leave); window.removeEventListener('beforeunload',unload); document.removeEventListener('click',click,true); window.removeEventListener('popstate',pop,true); };
  },[dirty,busy]);
}
