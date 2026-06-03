import HtmlPage from './HtmlPage.jsx';

// Eagerly bundle every page's content fragment + optional init script.
const contents = import.meta.glob('../pages/content/*.html', { query: '?raw', import: 'default', eager: true });
const scripts = import.meta.glob('../pages/scripts/*.js', { eager: true });

function pick(map, slug, ext) {
  const suffix = '/' + slug + ext;
  const key = Object.keys(map).find(k => k.endsWith(suffix));
  return key ? map[key] : null;
}

export default function Page({ slug }) {
  const html = pick(contents, slug, '.html') || '<div class="content"><p style="padding:24px">Trang chưa có nội dung.</p></div>';
  const mod = pick(scripts, slug, '.js');
  const run = mod && typeof mod.default === 'function' ? mod.default : null;
  return <HtmlPage slug={slug} html={html} run={run} />;
}
