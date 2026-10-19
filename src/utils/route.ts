import { useCallback, useEffect, useState } from 'react';

export type Page = 'tree' | 'roadmap' | 'settings';
const PATHS: Record<Page, string> = { tree: '/', roadmap: '/roadmap', settings: '/settings' };

const pageFromPath = (path: string): Page =>
  path.startsWith('/settings') ? 'settings' : path.startsWith('/roadmap') ? 'roadmap' : 'tree';

export function usePage(): [Page, (page: Page) => void] {
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname));
  useEffect(() => {
    const onPop = () => setPage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const go = useCallback((next: Page) => {
    if (window.location.pathname !== PATHS[next]) window.history.pushState(null, '', PATHS[next]);
    setPage(next);
  }, []);
  return [page, go];
}

export const pagePath = (page: Page) => PATHS[page];
