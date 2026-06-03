import { useEffect, useRef, useState } from 'react';

export default function Topbar({ onToggleSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, []);

  useEffect(() => {
    function onDoc(e) { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); }
    function onKey(e) { if (e.key === 'Escape') setMenuOpen(false); }
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <header className="topbar">
      <button className="icon-btn" id="menuToggle" aria-label="Thu gọn menu" onClick={onToggleSidebar}>
        <i data-lucide="menu" className="icon-lg"></i>
      </button>
      <div className="search">
        <i data-lucide="search" className="icon"></i>
        <input type="text" placeholder="Tìm kiếm khóa học, tài liệu, bài tập..." />
      </div>
      <div className="topbar-right">
        <button className="icon-btn" aria-label="Lịch"><i data-lucide="calendar" className="icon-lg"></i></button>
        <button className="icon-btn" aria-label="Thông báo"><i data-lucide="bell" className="icon-lg"></i><span className="dot-badge">6</span></button>
        <button className="icon-btn" aria-label="Tin nhắn"><i data-lucide="message-square" className="icon-lg"></i></button>
        <div className={'profile-menu' + (menuOpen ? ' open' : '')} ref={menuRef}>
          <div className="profile" onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}>
            <div className="profile-meta">
              <div className="profile-name">Ngô Thanh Tùng</div>
              <div className="profile-sub">MSSV: 21123456</div>
            </div>
            <div className="avatar">NT</div>
            <i data-lucide="chevron-down" className="icon-sm profile-caret" style={{ color: 'hsl(var(--muted-foreground))' }}></i>
          </div>
          <div className="dropdown" role="menu">
            <a className="dropdown-item" href="#" role="menuitem"><i data-lucide="user-round" className="icon-sm"></i> Tài khoản</a>
            <a className="dropdown-item" href="#" role="menuitem"><i data-lucide="settings" className="icon-sm"></i> Cấu hình</a>
            <div className="dropdown-sep"></div>
            <a className="dropdown-item danger" href="#" role="menuitem"><i data-lucide="log-out" className="icon-sm"></i> Thoát</a>
          </div>
        </div>
      </div>
    </header>
  );
}
