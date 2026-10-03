import { useEffect, useState } from 'react';

export default function SearchResultStatus({ message, className = 'sr-only' }) {
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    const timer = window.setTimeout(() => setAnnouncement(message), 300);
    return () => window.clearTimeout(timer);
  }, [message]);

  return (
    <>
      {className !== 'sr-only' && <p aria-hidden="true" className={className}>{message}</p>}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</p>
    </>
  );
}
