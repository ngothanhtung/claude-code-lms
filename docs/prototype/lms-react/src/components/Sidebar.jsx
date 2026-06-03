import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const ICONS = (window.lucide && window.lucide.createIcons) ? window.lucide.createIcons : () => {};

function NavLink({ to, tip, icon, children, badge }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link className={'nav-item' + (active ? ' active' : '')} to={to} data-tip={tip}>
      <i data-lucide={icon} className="icon"></i> {children}
      {badge ? <span className="nav-badge">{badge}</span> : null}
    </Link>
  );
}

function NavGroup({ tip, icon, label, prefixes, children }) {
  const { pathname } = useLocation();
  const within = prefixes.some(p => pathname.startsWith(p));
  const [open, setOpen] = useState(within);
  useEffect(() => { if (within) setOpen(true); }, [within]);
  return (
    <div className={'nav-group' + (open ? ' open' : '')}>
      <button className="nav-item nav-parent" type="button" data-tip={tip} onClick={() => setOpen(o => !o)}>
        <i data-lucide={icon} className="icon"></i> {label}
        <i data-lucide="chevron-down" className="icon-sm nav-caret"></i>
      </button>
      <div className="nav-sub">
        <div className="nav-sub-inner">{children}</div>
      </div>
    </div>
  );
}

function SubItem({ to, children }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link className={'nav-subitem' + (active ? ' active' : '')} to={to}>
      <span className="nav-dot"></span> {children}
    </Link>
  );
}

export default function Sidebar() {
  const location = useLocation();
  useEffect(() => { ICONS(); }, [location]);

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><i data-lucide="graduation-cap"></i></div>
        <div>
          <div className="brand-name">LMS Portal</div>
          <div className="brand-sub">Dành cho Sinh viên</div>
        </div>
      </div>

      <nav className="nav">
        <NavLink to="/" tip="Trang chủ" icon="home">Trang chủ</NavLink>
        <NavLink to="/khoa-hoc" tip="Khóa học của tôi" icon="book-open-check">Khóa học của tôi</NavLink>
        <NavLink to="/lich-hoc" tip="Lịch học" icon="calendar-days">Lịch học</NavLink>

        <NavGroup tip="Bài tập" icon="file-text" label="Bài tập" prefixes={['/bai-tap']}>
          <SubItem to="/bai-tap/ca-nhan">Bài tập cá nhân</SubItem>
          <SubItem to="/bai-tap/nhom">Bài tập nhóm</SubItem>
          <SubItem to="/bai-tap/do-an">Đồ án cuối kỳ</SubItem>
        </NavGroup>

        <NavLink to="/ket-qua" tip="Kết quả học tập" icon="bar-chart-3">Kết quả học tập</NavLink>
        <NavLink to="/diem-danh" tip="Điểm danh" icon="user-check">Điểm danh</NavLink>
        <NavLink to="/lich-thi" tip="Lịch thi" icon="calendar-clock">Lịch thi</NavLink>

        <NavGroup tip="Tài liệu" icon="folder-open" label="Tài liệu" prefixes={['/tai-lieu']}>
          <SubItem to="/tai-lieu/tham-khao">Tài liệu tham khảo</SubItem>
          <SubItem to="/tai-lieu/luyen-thi">Tài liệu luyện thi</SubItem>
        </NavGroup>

        <NavLink to="/thong-bao" tip="Thông báo" icon="bell" badge="6">Thông báo</NavLink>
        <NavLink to="/hoc-phi" tip="Học phí" icon="circle-dollar-sign">Học phí</NavLink>
        <NavLink to="/dang-ky" tip="Đăng ký môn học" icon="clipboard-check">Đăng ký môn học</NavLink>
        <NavLink to="/ho-tro" tip="Hỗ trợ" icon="life-buoy">Hỗ trợ</NavLink>
        <NavLink to="/cai-dat" tip="Cài đặt" icon="settings">Cài đặt</NavLink>
      </nav>

      <div className="assistant">
        <div className="assistant-top">
          <div className="assistant-avatar"><i data-lucide="sparkles" className="icon"></i></div>
          <div>
            <div className="assistant-title">AI Assistant</div>
            <div className="assistant-sub">Bạn cần hỗ trợ gì?</div>
          </div>
        </div>
        <Link className="assistant-btn" to="/chat"><i data-lucide="message-circle" className="icon-sm"></i> Chat ngay</Link>
      </div>
    </aside>
  );
}
