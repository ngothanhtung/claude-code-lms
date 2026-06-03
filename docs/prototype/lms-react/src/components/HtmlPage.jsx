import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FILE_TO_PATH } from '../routes.js';

/**
 * Renders a page's original HTML content fragment and runs its page-specific
 * init script (if any). Shared chrome (sidebar/topbar) lives in AppLayout, so
 * fragments contain ONLY the `.content` block.
 *
 * This is the migration bridge: every page is reachable and behaves like the
 * original. To make a page fully idiomatic React, replace its content fragment
 * + script with a hand-written component and drop it into routes.
 */
export default function HtmlPage({ slug, html, run }) {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (window.lucide) window.lucide.createIcons();

    let cleanup;
    try { if (typeof run === 'function') cleanup = run(root); }
    catch (e) { console.error('[page init error]', slug, e); }

    if (window.lucide) window.lucide.createIcons();

    function onClick(e) {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#' || /^(https?:|mailto:|tel:)/.test(href)) return;
      const file = href.split('/').pop();
      if (FILE_TO_PATH[file]) { e.preventDefault(); navigate(FILE_TO_PATH[file]); }
    }
    root.addEventListener('click', onClick);

    return () => {
      root.removeEventListener('click', onClick);
      if (typeof cleanup === 'function') { try { cleanup(); } catch (_) { /* ignore */ } }
    };
  }, [slug, html, run, navigate]);

  return <div ref={ref} className="page-root" dangerouslySetInnerHTML={{ __html: html }} />;
}
