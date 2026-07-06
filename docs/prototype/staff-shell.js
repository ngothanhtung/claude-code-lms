/* Staff (Giáo vụ) shell — shared sidebar + topbar injected into each staff page.
   Page sets <body data-active="KEY">. Mirrors teacher-shell.js. */
(function () {
  var NAV = [
    { key: 'home', href: 'LMS Staff Portal.html', icon: 'home', label: 'Trang chủ' },
    { key: 'classes', href: 'staff-classes.html', icon: 'layout-grid', label: 'Danh sách lớp học' },
    { key: 'teachers', href: 'staff-teachers.html', icon: 'users', label: 'Danh sách giảng viên' },
    { key: 'students', href: 'staff-students.html', icon: 'graduation-cap', label: 'Danh sách học viên' },
    { key: 'tasks', href: 'staff-tasks.html', icon: 'inbox', label: 'Tác vụ hành chính', badge: '9' },
    { key: 'scheduling', href: 'staff-scheduling.html', icon: 'calendar-range', label: 'Sắp lịch giảng dạy' },
    { key: 'tuition', href: 'staff-tuition.html', icon: 'wallet', label: 'Thu học phí' },
    { key: 'attendance', href: 'staff-attendance.html', icon: 'user-check', label: 'Giám sát điểm danh', badge: '17' },
    { key: 'support', href: 'support.html', icon: 'life-buoy', label: 'Hỗ trợ' },
    { key: 'settings', href: 'settings.html', icon: 'settings', label: 'Cài đặt' }
  ];

  function esc(s) { return s == null ? '' : String(s); }

  function buildSidebar(active) {
    var items = NAV.map(function (it) {
      var ac = it.key === active ? ' active' : '';
      var bd = it.badge ? ' <span class="nav-badge">' + it.badge + '</span>' : '';
      return '<a class="nav-item' + ac + '" href="' + it.href + '" data-tip="' + esc(it.label) + '">' +
        '<i data-lucide="' + it.icon + '" class="icon"></i> ' + esc(it.label) + bd + '</a>';
    }).join('');

    return '' +
      '<div class="brand">' +
        '<div class="brand-mark"><i data-lucide="graduation-cap"></i></div>' +
        '<div><div class="brand-name">LMS Portal</div><div class="brand-sub">Dành cho Giáo vụ</div></div>' +
      '</div>' +
      '<nav class="nav">' + items + '</nav>' +
      '<div class="assistant">' +
        '<div class="assistant-top">' +
          '<div class="assistant-avatar"><i data-lucide="sparkles" class="icon"></i></div>' +
          '<div><div class="assistant-title">Trợ lý AI</div><div class="assistant-sub">Xếp lịch, soát công nợ</div></div>' +
        '</div>' +
        '<button class="assistant-btn" onclick="window.location.href=\'ai-chat.html\'"><i data-lucide="message-circle" class="icon-sm"></i> Chat ngay</button>' +
      '</div>';
  }

  function buildTopbar(searchPlaceholder) {
    return '' +
      '<button class="icon-btn" id="menuToggle" aria-label="Thu gọn menu"><i data-lucide="menu" class="icon-lg"></i></button>' +
      '<div class="search"><i data-lucide="search" class="icon"></i>' +
        '<input type="text" placeholder="' + esc(searchPlaceholder || 'Tìm kiếm lớp học phần, giảng viên, sinh viên...') + '" /></div>' +
      '<div class="topbar-right">' +
        '<button class="icon-btn" aria-label="Lịch"><i data-lucide="calendar" class="icon-lg"></i></button>' +
        '<button class="icon-btn" aria-label="Thông báo"><i data-lucide="bell" class="icon-lg"></i><span class="dot-badge">6</span></button>' +
        '<button class="icon-btn" aria-label="Tin nhắn"><i data-lucide="message-square" class="icon-lg"></i></button>' +
        '<button class="icon-btn" id="themeToggle" aria-label="Chế độ sáng/tối"></button>' +
        '<div class="profile-menu" id="profileMenu">' +
          '<div class="profile" id="profileTrigger">' +
            '<div class="profile-meta"><div class="profile-name">ThS. Trần Thu Hà</div><div class="profile-sub">Phòng Đào tạo</div></div>' +
            '<div class="avatar">TH</div>' +
            '<i data-lucide="chevron-down" class="icon-sm profile-caret" style="color:hsl(var(--muted-foreground))"></i>' +
          '</div>' +
          '<div class="dropdown" role="menu">' +
            '<a class="dropdown-item" href="#" role="menuitem"><i data-lucide="user-round" class="icon-sm"></i> Hồ sơ cán bộ</a>' +
            '<a class="dropdown-item" href="settings.html" role="menuitem"><i data-lucide="settings" class="icon-sm"></i> Cấu hình</a>' +
            '<div class="dropdown-sep"></div>' +
            '<a class="dropdown-item danger" href="#" role="menuitem"><i data-lucide="log-out" class="icon-sm"></i> Thoát</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function wire() {
    var menuToggle = document.getElementById('menuToggle');
    var appEl = document.querySelector('.app');
    if (menuToggle && appEl) {
      if (localStorage.getItem('sidebarCollapsed') === '1') appEl.classList.add('collapsed');
      menuToggle.addEventListener('click', function () {
        appEl.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', appEl.classList.contains('collapsed') ? '1' : '0');
      });
    }
    var profileMenu = document.getElementById('profileMenu');
    var profileTrigger = document.getElementById('profileTrigger');
    if (profileMenu && profileTrigger) {
      profileTrigger.addEventListener('click', function (e) { e.stopPropagation(); profileMenu.classList.toggle('open'); });
      document.addEventListener('click', function (e) { if (!profileMenu.contains(e.target)) profileMenu.classList.remove('open'); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') profileMenu.classList.remove('open'); });
    }
  }

  function init() {
    var sb = document.getElementById('sSidebar');
    var tb = document.getElementById('sTopbar');
    if (!sb || !tb) return;
    var active = document.body.dataset.active || '';
    sb.innerHTML = buildSidebar(active);
    tb.innerHTML = buildTopbar(document.body.dataset.search);
    if (window.lucide) lucide.createIcons();
    wire();
    var tt = document.getElementById('themeToggle');
    if (tt) {
      var dark = document.documentElement.classList.contains('dark');
      tt.innerHTML = '<i data-lucide="' + (dark ? 'sun' : 'moon') + '" class="icon-lg"></i>';
      if (window.lucide) lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
