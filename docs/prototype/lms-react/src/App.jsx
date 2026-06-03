import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import Page from './components/Page.jsx';
import { ROUTES } from './routes.js';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {ROUTES.map(r => (
          <Route key={r.slug} path={r.path} element={<Page slug={r.slug} />} />
        ))}
      </Route>
    </Routes>
  );
}
