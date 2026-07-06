/* Staff — Danh sách lớp học phần. Data-driven table + detail drawer + add/edit modal. */
(function () {
  var COLORS = {
    'Bộ môn CNPM': 'hsl(243 75% 59%)',
    'Bộ môn HTTT': 'hsl(262 83% 58%)',
    'Bộ môn KHMT': 'hsl(142 71% 40%)',
    'Bộ môn Ngoại ngữ': 'hsl(172 66% 40%)',
    'Bộ môn Toán': 'hsl(32 95% 48%)'
  };
  function inits(name) {
    var p = name.replace(/^(TS\.|ThS\.|PGS\.|GS\.)\s*/i, '').trim().split(/\s+/);
    return ((p[p.length - 2] || p[0] || '?')[0] + (p[p.length - 1] || '')[0]).toUpperCase();
  }

  // status: open | full | low | noteacher
  var CLASSES = [
    { code: 'IT3040.K22A', name: 'Cấu trúc dữ liệu & Giải thuật', dept: 'Bộ môn CNPM', teacher: 'TS. Nguyễn Minh Tuấn', credits: 3, enrolled: 48, cap: 50, sched: 'Thứ 2, 4 · Ca 1', room: 'A2-105' },
    { code: 'IT4409.K22B', name: 'Lập trình hướng đối tượng', dept: 'Bộ môn CNPM', teacher: 'TS. Nguyễn Minh Tuấn', credits: 3, enrolled: 50, cap: 50, sched: 'Thứ 4 · Ca 2', room: 'B1-302' },
    { code: 'IT3080.K21A', name: 'Cơ sở dữ liệu', dept: 'Bộ môn HTTT', teacher: 'TS. Nguyễn Minh Tuấn', credits: 4, enrolled: 44, cap: 45, sched: 'Thứ 3, 5 · Ca 1', room: 'A1-201' },
    { code: 'IT4082.K21B', name: 'Hệ thống thông tin quản lý', dept: 'Bộ môn HTTT', teacher: 'ThS. Vũ Thị Dung', credits: 3, enrolled: 38, cap: 45, sched: 'Thứ 4, 6 · Ca 4', room: 'A1-204' },
    { code: 'IT4060.K22A', name: 'Mạng máy tính', dept: 'Bộ môn KHMT', teacher: 'TS. Phan Quốc Việt', credits: 3, enrolled: 41, cap: 50, sched: 'Thứ 3 · Ca 1', room: 'A1-105' },
    { code: 'IT4015.K22C', name: 'Lập trình Java', dept: 'Bộ môn CNPM', teacher: '', credits: 3, enrolled: 36, cap: 50, sched: 'Thứ 4 · Ca 2', room: 'B1-204' },
    { code: 'MA1041.K24A', name: 'Toán rời rạc', dept: 'Bộ môn Toán', teacher: 'TS. Đặng Thái Sơn', credits: 3, enrolled: 52, cap: 60, sched: 'Thứ 3 · Ca 3', room: 'A2-201' },
    { code: 'EN2003.K23B', name: 'Tiếng Anh 3', dept: 'Bộ môn Ngoại ngữ', teacher: 'ThS. Trần Mỹ Hằng', credits: 3, enrolled: 28, cap: 35, sched: 'Thứ 2 · Ca 1', room: 'A1-302' },
    { code: 'EN2003.K23C', name: 'Tiếng Anh 3', dept: 'Bộ môn Ngoại ngữ', teacher: 'ThS. Trần Mỹ Hằng', credits: 3, enrolled: 14, cap: 35, sched: 'Thứ 6 · Ca 1', room: 'A1-303' },
    { code: 'IT4995.K21B', name: 'Đồ án môn học', dept: 'Bộ môn CNPM', teacher: 'TS. Nguyễn Minh Tuấn', credits: 2, enrolled: 22, cap: 30, sched: 'Thứ 5 · Ca 3', room: 'Lab 301' },
    { code: 'IT5023.K21A', name: 'Trí tuệ nhân tạo', dept: 'Bộ môn KHMT', teacher: 'TS. Phan Quốc Việt', credits: 3, enrolled: 49, cap: 50, sched: 'Thứ 6 · Ca 2', room: 'Lab 302' },
    { code: 'IT4070.K23A', name: 'Hệ điều hành', dept: 'Bộ môn KHMT', teacher: '', credits: 3, enrolled: 11, cap: 50, sched: 'Thứ 2 · Ca 4', room: 'A2-103' }
  ];

  // sample rosters (shared pool, sliced per class)
  var POOL = [
    ['Trần Văn An', '21010234'], ['Nguyễn Quốc Bảo', '21010512'], ['Lê Thị Bình', '23010088'],
    ['Phạm Minh Châu', '22010341'], ['Hoàng Đức Duy', '22010199'], ['Vũ Thị Giang', '21010777'],
    ['Đỗ Hải Hà', '23010456'], ['Bùi Khánh Linh', '24010023'], ['Ngô Quang Huy', '22010610'],
    ['Đặng Thu Hương', '21010301'], ['Phan Tiến Lực', '23010702'], ['Mai Phương Thảo', '24010188']
  ];

  function statusOf(c) {
    if (!c.teacher) return 'noteacher';
    var pct = c.enrolled / c.cap;
    if (c.enrolled < 20 || pct < 0.45) return 'low';
    if (pct >= 0.95) return 'full';
    return 'open';
  }
  var STATUS_META = {
    open:      { label: 'Đang mở',     badge: 'green' },
    full:      { label: 'Gần đầy',     badge: 'amber' },
    low:       { label: 'Sĩ số thấp',  badge: 'red' },
    noteacher: { label: 'Chưa phân GV', badge: 'red' }
  };
  function capColor(c) {
    var pct = c.enrolled / c.cap;
    if (pct >= 0.95) return 'hsl(var(--warning))';
    if (c.enrolled < 20 || pct < 0.45) return 'hsl(var(--danger))';
    return 'hsl(var(--success))';
  }

  var state = { filter: 'all', q: '', dept: '', sort: 'code' };
  var tbody = document.getElementById('classRows');
  var emptyState = document.getElementById('emptyState');

  function matches(c) {
    var st = statusOf(c);
    if (state.filter === 'open' && st !== 'open') return false;
    if (state.filter === 'full' && st !== 'full') return false;
    if (state.filter === 'action' && st !== 'low' && st !== 'noteacher') return false;
    if (state.dept && c.dept !== state.dept) return false;
    if (state.q) {
      var hay = (c.code + ' ' + c.name + ' ' + c.teacher).toLowerCase();
      if (hay.indexOf(state.q.toLowerCase()) === -1) return false;
    }
    return true;
  }

  function render() {
    var list = CLASSES.filter(matches);
    if (state.sort === 'cap') list.sort(function (a, b) { return b.enrolled - a.enrolled; });
    else if (state.sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name, 'vi'); });
    else list.sort(function (a, b) { return a.code.localeCompare(b.code); });

    tbody.innerHTML = list.map(function (c) {
      var st = statusOf(c), sm = STATUS_META[st];
      var pct = Math.round(c.enrolled / c.cap * 100);
      var idx = CLASSES.indexOf(c);
      var tCell = c.teacher
        ? '<div class="cell-user"><div class="av" style="background:' + (COLORS[c.dept] || 'hsl(var(--primary))') + '">' + inits(c.teacher) + '</div><div><div class="nm">' + c.teacher + '</div></div></div>'
        : '<span class="stt bad">Chưa phân công</span>';
      return '<tr class="clickable" data-idx="' + idx + '">' +
        '<td><div class="cls-code">' + c.code + '</div><div class="sub" style="font-size:13px;color:hsl(var(--foreground));font-weight:600;margin-top:2px">' + c.name + '</div></td>' +
        '<td>' + tCell + '</td>' +
        '<td class="muted">' + c.dept.replace('Bộ môn ', '') + '</td>' +
        '<td class="num">' + c.credits + '</td>' +
        '<td class="cap-cell"><div class="cap-top"><strong>' + c.enrolled + '/' + c.cap + '</strong><span class="cap-pct">' + pct + '%</span></div>' +
          '<div class="track"><span style="width:' + pct + '%;background:' + capColor(c) + '"></span></div></td>' +
        '<td class="sched-cell">' + c.sched + '<br><span class="sc-room">' + c.room + '</span></td>' +
        '<td><span class="badge ' + sm.badge + '">' + sm.label + '</span></td>' +
        '<td class="num"><span class="row-act">' +
          '<button class="icon-act js-view" title="Xem chi tiết" data-idx="' + idx + '"><i data-lucide="eye" class="icon-sm"></i></button>' +
          '<button class="icon-act js-edit" title="Chỉnh sửa" data-idx="' + idx + '"><i data-lucide="pencil" class="icon-sm"></i></button>' +
        '</span></td>' +
      '</tr>';
    }).join('');

    emptyState.style.display = list.length ? 'none' : 'block';
    document.getElementById('resultCount').textContent = list.length + ' lớp';
    if (window.lucide) lucide.createIcons();
  }

  // ── Drawer ──
  var scrim = document.getElementById('scrim');
  var drawer = document.getElementById('drawer');
  function openDrawer(idx) {
    var c = CLASSES[idx];
    var st = statusOf(c), sm = STATUS_META[st];
    var pct = Math.round(c.enrolled / c.cap * 100);
    document.getElementById('dwTitle').textContent = c.name;
    document.getElementById('dwCode').textContent = c.code + ' · HK II 2025–2026';
    document.getElementById('dwBadge').innerHTML = '<span class="badge ' + sm.badge + '">' + sm.label + '</span>';
    document.getElementById('dwTeacher').textContent = c.teacher || 'Chưa phân công';
    document.getElementById('dwDept').textContent = c.dept;
    document.getElementById('dwCredits').textContent = c.credits + ' tín chỉ';
    document.getElementById('dwSchedule').textContent = c.sched;
    document.getElementById('dwRoom').textContent = c.room;
    document.getElementById('dwCapText').textContent = c.enrolled + ' / ' + c.cap + ' sinh viên';
    document.getElementById('dwCapPct').textContent = pct + '% sĩ số';
    var bar = document.getElementById('dwCapBar');
    bar.style.width = pct + '%'; bar.style.background = capColor(c);

    var n = Math.min(c.enrolled, 6);
    var roster = '';
    for (var i = 0; i < n; i++) {
      var s = POOL[i % POOL.length];
      roster += '<div class="roster-item"><div class="av" style="width:32px;height:32px;border-radius:9px;display:grid;place-items:center;font-size:11.5px;font-weight:700;color:#fff;background:' +
        (COLORS[c.dept] || 'hsl(var(--primary))') + '">' + inits(s[0]) + '</div>' +
        '<div><div class="nm" style="font-size:13px;font-weight:600">' + s[0] + '</div></div>' +
        '<span class="ri-id">' + s[1] + '</span></div>';
    }
    if (c.enrolled > 6) roster += '<div class="roster-item muted" style="justify-content:center;font-size:12.5px">+ ' + (c.enrolled - 6) + ' sinh viên khác</div>';
    document.getElementById('dwRoster').innerHTML = roster;
    document.getElementById('dwEdit').onclick = function () { closeDrawer(); openModal(idx); };

    scrim.classList.add('open'); drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false');
    if (window.lucide) lucide.createIcons();
  }
  function closeDrawer() { scrim.classList.remove('open'); drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }

  // ── Modal ──
  var modal = document.getElementById('modal');
  var editingIdx = null;
  function openModal(idx) {
    editingIdx = (idx === undefined || idx === null) ? null : idx;
    var t = document.getElementById('modalTitle');
    var c = editingIdx === null ? null : CLASSES[editingIdx];
    t.textContent = c ? 'Chỉnh sửa lớp học phần' : 'Thêm lớp học phần';
    document.getElementById('fCode').value = c ? c.code : '';
    document.getElementById('fName').value = c ? c.name : '';
    document.getElementById('fDept').value = c ? c.dept : 'Bộ môn CNPM';
    document.getElementById('fTeacher').value = c ? c.teacher : '';
    document.getElementById('fCredits').value = c ? c.credits : 3;
    document.getElementById('fCap').value = c ? c.cap : 50;
    document.getElementById('fEnrolled').value = c ? c.enrolled : 0;
    document.getElementById('fSchedule').value = c ? c.sched : '';
    document.getElementById('fRoom').value = c ? c.room : '';
    scrim.classList.add('open'); modal.classList.add('open');
    if (window.lucide) lucide.createIcons();
  }
  function closeModal() { modal.classList.remove('open'); if (!drawer.classList.contains('open')) scrim.classList.remove('open'); }
  function saveModal() {
    var data = {
      code: document.getElementById('fCode').value.trim() || 'NEW.K00X',
      name: document.getElementById('fName').value.trim() || 'Học phần mới',
      dept: document.getElementById('fDept').value,
      teacher: document.getElementById('fTeacher').value,
      credits: +document.getElementById('fCredits').value || 3,
      cap: +document.getElementById('fCap').value || 50,
      enrolled: +document.getElementById('fEnrolled').value || 0,
      sched: document.getElementById('fSchedule').value.trim() || 'Chưa xếp lịch',
      room: document.getElementById('fRoom').value.trim() || '—'
    };
    if (editingIdx === null) CLASSES.unshift(data);
    else CLASSES[editingIdx] = data;
    closeModal(); render();
  }

  // ── Wire events ──
  tbody.addEventListener('click', function (e) {
    var editBtn = e.target.closest('.js-edit');
    if (editBtn) { e.stopPropagation(); openModal(+editBtn.dataset.idx); return; }
    var viewBtn = e.target.closest('.js-view');
    if (viewBtn) { e.stopPropagation(); openDrawer(+viewBtn.dataset.idx); return; }
    var row = e.target.closest('tr[data-idx]');
    if (row) openDrawer(+row.dataset.idx);
  });

  document.getElementById('statusTabs').addEventListener('click', function (e) {
    var t = e.target.closest('.tab'); if (!t) return;
    this.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('active'); });
    t.classList.add('active'); state.filter = t.dataset.filter; render();
  });
  document.getElementById('searchInput').addEventListener('input', function () { state.q = this.value; render(); });
  document.getElementById('deptFilter').addEventListener('change', function () { state.dept = this.value; render(); });
  document.getElementById('sortFilter').addEventListener('change', function () { state.sort = this.value; render(); });

  document.getElementById('addBtn').addEventListener('click', function () { openModal(null); });
  document.getElementById('dwClose').addEventListener('click', closeDrawer);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalSave').addEventListener('click', saveModal);
  scrim.addEventListener('click', function () { closeDrawer(); closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDrawer(); closeModal(); } });
  document.getElementById('exportBtn').addEventListener('click', function () {
    this.innerHTML = '<i data-lucide="check" class="icon-sm"></i> Đã xuất'; if (window.lucide) lucide.createIcons();
    var b = this; setTimeout(function () { b.innerHTML = '<i data-lucide="download" class="icon-sm"></i> Xuất Excel'; if (window.lucide) lucide.createIcons(); }, 1600);
  });

  render();
})();
