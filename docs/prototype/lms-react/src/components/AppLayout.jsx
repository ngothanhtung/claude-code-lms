import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import { FILE_TO_PATH } from '../routes.js';

export default function AppLayout() {
  const navigate = useNavigate();

  // Bridge for content-fragment scripts that navigate via window.__spaNav('x.html').
  useEffect(() => {
    window.__spaNav = (file) => {
      const path = FILE_TO_PATH[String(file).split('/').pop()];
      if (path) navigate(path);
    };
    return () => { delete window.__spaNav; };
  }, [navigate]);

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebarCollapsed') === '1'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem('sidebarCollapsed', collapsed ? '1' : '0'); } catch { /* ignore */ }
  }, [collapsed]);

  return (
    <div className={'app' + (collapsed ? ' collapsed' : '')}>
      <Sidebar />
      <div className="main">
        <Topbar onToggleSidebar={() => setCollapsed(c => !c)} />
        <Outlet />
      </div>
    </div>
  );
}
