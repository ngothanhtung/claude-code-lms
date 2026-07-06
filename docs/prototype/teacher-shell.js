/* Teacher shell — shared sidebar + topbar injected into each teacher page.
   Page sets <body data-active="KEY" data-open="GROUP">. */
(function () {
  var NAV = [
    { key: 'home', href: 'LMS Teacher Portal.html', icon: 'home', label: 'Trang chủ' },
    { key: 'classes', href: 'teacher-classes.html', icon: 'book-open-check', label: 'Lớp học của tôi' },
    { key: 'schedule', href: 'teacher-schedule.html', icon: 'calendar-days', label: 'Lịch giảng dạy' },
    { group: 'baitap', icon: 'file-pen-line', label: 'Bài tập & Chấm điểm', children: [
      { key: 'grading', href: 'teacher-grading.html', label: 'Cần chấm', badge: '32' },
      { key: 'assignments', href: 'teacher-assignments.html', label: 'Bài đã giao' },
      { key: 'qbank', href: 'teacher-question-bank.html', label: 'Ngân hàng đề' }
    ] },
    { key: 'students', href: 'teacher-students.html', icon: 'users', label: 'Sinh viên' },
    { key: 'gradebook', href: 'teacher-gradebook.html', icon: 'bar-chart-3', label: 'Sổ điểm' },
    { key: 'attendance', href: 'teacher-attendance.html', icon: 'user-check', label: 'Điểm danh' },
    { key: 'exams', href: 'teacher-exams.html', icon: 'calendar-clock', label: 'Lịch thi' },
    { group: 'tailieu', icon: 'folder-open', label: 'Tài liệu giảng dạy', children: [
      { key: 'materials', href: 'teacher-materials.html', label: 'Bài giảng' },
      { key: 'qbank2', href: 'teacher-question-bank.html', label: 'Ngân hàng câu hỏi' }
    ] },
    { key: 'notifications', href: 'teacher-notifications.html', icon: 'bell', label: 'Thông báo', badge: '4' },
    { key: 'support', href: 'support.html', icon: 'life-buoy', label: 'Hỗ trợ' },
    { key: 'settings', href: 'settings.html', icon: 'settings', label: 'Cài đặt' }
  ];

  function esc(s) { return s == null ? '' : String(s); }

  function buildSidebar(active, open) {
    var items = NAV.map(function (it) {
      if (it.group) {
        var isOpen = open === it.group;
        var anyActive = it.children.some(function (c) { return c.key === active; });
        var subs = it.children.map(function (c) {
          var ac = c.key === active ? ' active' : '';
          var bd = c.badge ? ' <span class="nav-badge">' + c.badge + '</span>' : '';
          return '<a class="nav-subitem' + ac + '" href="' + c.href + '"><span class="nav-dot"></span> ' + esc(c.label) + bd + '</a>';
        }).join('');
        return '<div class="nav-group' + ((isOpen || anyActive) ? ' open' : '') + '">' +
          '<button class="nav-item nav-parent" type="button" data-tip="' + esc(it.label) + '">' +
          '<i data-lucide="' + it.icon + '" class="icon"></i> ' + esc(it.label) +
          '<i data-lucide="chevron-down" class="icon-sm nav-caret"></i></button>' +
          '<div class="nav-sub"><div class="nav-sub-inner">' + subs + '</div></div></div>';
      }
      var ac = it.key === active ? ' active' : '';
      var bd = it.badge ? ' <span class="nav-badge">' + it.badge + '</span>' : '';
      return '<a class="nav-item' + ac + '" href="' + it.href + '" data-tip="' + esc(it.label) + '">' +
        '<i data-lucide="' + it.icon + '" class="icon"></i> ' + esc(it.label) + bd + '</a>';
    }).join('');

    return '' +
      '<div class="brand">' +
        '<div class="brand-mark"><i data-lucide="graduation-cap"></i></div>' +
        '<div><div class="brand-name">LMS Portal</div><div class="brand-sub">Dành cho Giảng viên</div></div>' +
      '</div>' +
      '<nav class="nav">' + items + '</nav>' +
      '<div class="assistant">' +
        '<div class="assistant-top">' +
          '<div class="assistant-avatar"><i data-lucide="sparkles" class="icon"></i></div>' +
          '<div><div class="assistant-title">Trợ lý AI</div><div class="assistant-sub">Soạn đề, gợi ý chấm bài</div></div>' +
        '</div>' +
        '<button class="assistant-btn" onclick="window.location.href=\'ai-chat.html\'"><i data-lucide="message-circle" class="icon-sm"></i> Chat ngay</button>' +
      '</div>';
  }

  function buildTopbar(searchPlaceholder) {
    return '' +
      '<button class="icon-btn" id="menuToggle" aria-label="Thu gọn menu"><i data-lucide="menu" class="icon-lg"></i></button>' +
      '<div class="search"><i data-lucide="search" class="icon"></i>' +
        '<input type="text" placeholder="' + esc(searchPlaceholder || 'Tìm kiếm lớp học, sinh viên, bài nộp...') + '" /></div>' +
      '<div class="topbar-right">' +
        '<button class="icon-btn" aria-label="Lịch"><i data-lucide="calendar" class="icon-lg"></i></button>' +
        '<button class="icon-btn" aria-label="Thông báo"><i data-lucide="bell" class="icon-lg"></i><span class="dot-badge">4</span></button>' +
        '<button class="icon-btn" aria-label="Tin nhắn"><i data-lucide="message-square" class="icon-lg"></i></button>' +
        '<button class="icon-btn" id="themeToggle" aria-label="Chế độ sáng/tối"></button>' +
        '<div class="profile-menu" id="profileMenu">' +
          '<div class="profile" id="profileTrigger">' +
            '<div class="profile-meta"><div class="profile-name">TS. Nguyễn Minh Tuấn</div><div class="profile-sub">Bộ môn CNPM</div></div>' +
            '<div class="avatar">NT</div>' +
            '<i data-lucide="chevron-down" class="icon-sm profile-caret" style="color:hsl(var(--muted-foreground))"></i>' +
          '</div>' +
          '<div class="dropdown" role="menu">' +
            '<a class="dropdown-item" href="#" role="menuitem"><i data-lucide="user-round" class="icon-sm"></i> Hồ sơ giảng viên</a>' +
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
    document.querySelectorAll('.nav-group .nav-parent').forEach(function (p) {
      p.addEventListener('click', function () { p.closest('.nav-group').classList.toggle('open'); });
    });
  }

  function init() {
    var sb = document.getElementById('tSidebar');
    var tb = document.getElementById('tTopbar');
    if (!sb || !tb) return;
    var active = document.body.dataset.active || '';
    var open = document.body.dataset.open || '';
    sb.innerHTML = buildSidebar(active, open);
    tb.innerHTML = buildTopbar(document.body.dataset.search);
    if (window.lucide) lucide.createIcons();
    wire();
    // theme icon (theme-toggle.js handles clicks via delegation)
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
