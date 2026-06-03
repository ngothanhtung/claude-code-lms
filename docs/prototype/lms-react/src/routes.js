// Central route table. `slug` matches the content/script glob keys (src/pages/content/<slug>.html).
export const ROUTES = [
  { slug: 'home',                  path: '/',                       src: 'LMS Portal.html' },
  { slug: 'my-courses',            path: '/khoa-hoc',               src: 'my-courses.html' },
  { slug: 'classroom-oop',         path: '/lop-hoc/oop',            src: 'classroom-oop.html' },
  { slug: 'calendar',              path: '/lich-hoc',               src: 'calendar.html' },
  { slug: 'assignments-personal',  path: '/bai-tap/ca-nhan',        src: 'assignments-personal.html' },
  { slug: 'assignments-group',     path: '/bai-tap/nhom',           src: 'assignments-group.html' },
  { slug: 'group-detail',          path: '/bai-tap/nhom/chi-tiet',  src: 'group-detail.html' },
  { slug: 'workspace',             path: '/bai-tap/nhom/workspace', src: 'workspace.html' },
  { slug: 'final-project',         path: '/bai-tap/do-an',          src: 'final-project.html' },
  { slug: 'quiz',                  path: '/quiz',                   src: 'quiz.html' },
  { slug: 'results',               path: '/ket-qua',                src: 'results.html' },
  { slug: 'attendance',            path: '/diem-danh',              src: 'attendance.html' },
  { slug: 'exams',                 path: '/lich-thi',               src: 'exams.html' },
  { slug: 'tai-lieu-tham-khao',    path: '/tai-lieu/tham-khao',     src: 'tai-lieu-tham-khao.html' },
  { slug: 'tai-lieu-luyen-thi',    path: '/tai-lieu/luyen-thi',     src: 'tai-lieu-luyen-thi.html' },
  { slug: 'notifications',         path: '/thong-bao',              src: 'notifications.html' },
  { slug: 'tuition',               path: '/hoc-phi',                src: 'tuition.html' },
  { slug: 'registration',          path: '/dang-ky',                src: 'registration.html' },
  { slug: 'support',               path: '/ho-tro',                 src: 'support.html' },
  { slug: 'settings',              path: '/cai-dat',                src: 'settings.html' },
  { slug: 'ai-chat',               path: '/chat',                   src: 'ai-chat.html' }
];

// Map original "*.html" links (used inside content fragments) to SPA routes,
// so in-content <a href="x.html"> and window.location navigations resolve correctly.
export const FILE_TO_PATH = ROUTES.reduce((acc, r) => {
  acc[r.src] = r.path;
  return acc;
}, {});
