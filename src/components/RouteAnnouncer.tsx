import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteAnnouncer() {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Wait for the document title to update, then announce it
    const timeout = setTimeout(() => {
      setAnnouncement(`Navigated to ${document.title}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <div
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {announcement}
    </div>
  );
}
