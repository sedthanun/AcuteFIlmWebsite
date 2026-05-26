'use client';

import { useEffect, useRef } from 'react';

const CHECK_INTERVAL = 60_000;
const VERSION_URL = '/version.json';
const DEBUG = true;

async function fetchVersion() {
  const url = `${VERSION_URL}?t=${Date.now()}`;
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });

  if (!response.ok) return null;

  const data = await response.json();
  const version = String(data?.version || '').trim();
  return version || null;
}

export default function VersionReloader() {
  const currentVersionRef = useRef(null);
  const isReloadingRef = useRef(false);

  useEffect(() => {
    let intervalId;
    let isMounted = true;

    async function checkVersion() {
      if (isReloadingRef.current) return;

      try {
        const latestVersion = await fetchVersion();
        if (!latestVersion || !isMounted) return;

        if (!currentVersionRef.current) {
          currentVersionRef.current = latestVersion;
          if (DEBUG) {
            console.log('[VersionReloader] initial version:', currentVersionRef.current);
          }
          return;
        }

        if (DEBUG) {
          console.log('[VersionReloader] current/latest:', currentVersionRef.current, latestVersion);
        }

        if (currentVersionRef.current !== latestVersion) {
          if (DEBUG) {
            console.log('[VersionReloader] version changed, reloading page');
          }
          isReloadingRef.current = true;
          window.location.reload();
        }
      } catch (error) {
        console.warn('[VersionReloader] version check failed:', error);
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    }

    function handlePageShow(event) {
      if (event.persisted) {
        checkVersion();
      }
    }

    checkVersion();
    intervalId = window.setInterval(checkVersion, CHECK_INTERVAL);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return null;
}
