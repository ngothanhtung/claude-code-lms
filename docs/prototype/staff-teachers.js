/* Staff — Danh sách giảng viên. Data-driven table + detail drawer + add/edit modal. */
(function () {
  var DEPT_COLORS = {
    'Bộ môn CNPM':     'hsl(243 75% 59%)',
    'Bộ môn HTTT':     'hsl(262 83% 58%)',
    'Bộ môn KHMT':     'hsl(142 71% 40%)',
    'Bộ môn Ngoại ngữ':'hsl(172 66% 40%)',
    'Bộ môn Toán':     'hsl(32 95% 48%)'
  };
  var DEPT_TINT = {
    'Bộ môn CNPM':     'ico-tint-indigo',
    'Bộ môn HTTT':     'ico-tint-indigo',
    'Bộ môn KHMT':     'ico-tint-green',
    'Bộ môn Ngoại ngữ':'ico-tint-blue',
    'Bộ môn Toán':     'ico-tint-amber'
  };
  function inits(name) {
    var p = name.replace(/^(TS\.|ThS\.|PGS\.TS\.|GS\.TS\.)\s*/i, '').trim().split(/\s+/);
    return ((p[p.length - 2] || p[0] || '?')[0] + (p[p.length - 1] || '')[0]).toUpperCase();
  }
  function degClass(deg) {
    if (/GS\.TS/i.test(deg)) return 'gs';
    if (/PGS/i.test(deg)) return 'pgs';
    if (/TS\./i.test(deg)) return 'ts';
    return '';
  }

  var TEACHERS = [
    { code:'GV00001', name:'Nguyễn Minh Tuấn', degree:'TS.', dept:'Bộ môn CNPM', spec:'Kỹ thuật phần mềm', email:'tuannm@uni.edu.vn', phone:'0912 001 001', quota:20, classes:6, periods:22, status:'active',
      teaching:['IT3040.K22A · CTDL&GT','IT4409.K22B · Lập trình HĐT','IT3080.K21A · Cơ sở dữ liệu','IT4995.K21B · Đồ án môn học','IT5023.K21B · Claude Code','MA9001.K21 · Seminar']},
    { code:'GV00002', name:'Lê Văn Hùng', degree:'TS.', dept:'Bộ môn CNPM', spec:'Mạng & Hệ thống', email:'hunglv@uni.edu.vn', phone:'0912 002 002', quota:20, classes:4, periods:16, status:'active',
      teaching:['IT4015.K22C · Lập trình Java','IT4015.K23A · Lập trình Java','IT3100.K22A · Hệ điều hành','IT4060.K22B · Mạng máy tính']},
    { code:'GV00003', name:'Vũ Thị Dung', degree:'ThS.', dept:'Bộ môn HTTT', spec:'Hệ thống thông tin', email:'dungvt@uni.edu.vn', phone:'0912 003 003', quota:20, classes:5, periods:18, status:'active',
      teaching:['IT4082.K21A · HTTT quản lý','IT4082.K21B · HTTT quản lý','IT4082.K22A · HTTT quản lý','IT3210.K21 · Phân tích TK HT','IT4085.K21C · HTTT nâng cao']},
    { code:'GV00004', name:'Phan Quốc Việt', degree:'TS.', dept:'Bộ môn KHMT', spec:'Mạng máy tính', email:'vietpq@uni.edu.vn', phone:'0912 004 004', quota:20, classes:4, periods:14, status:'active',
      teaching:['IT4060.K22A · Mạng máy tính','IT5023.K21A · Trí tuệ nhân tạo','IT4060.K23A · Mạng máy tính','IT3090.K22A · Kiến trúc MT']},
    { code:'GV00005', name:'Đặng Thái Sơn', degree:'TS.', dept:'Bộ môn Toán', spec:'Toán học rời rạc', email:'sondt@uni.edu.vn', phone:'0912 005 005', quota:20, classes:3, periods:12, status:'active',
      teaching:['MA1041.K24A · Toán rời rạc','MA1041.K24B · Toán rời rạc','MA2030.K23A · Xác suất thống kê']},
    { code:'GV00006', name:'Trần Mỹ Hằng', degree:'ThS.', dept:'Bộ môn Ngoại ngữ', spec:'Tiếng Anh chuyên ngành', email:'hangtm@uni.edu.vn', phone:'0912 006 006', quota:20, classes:5, periods:20, status:'active',
      teaching:['EN2003.K23B · Tiếng Anh 3','EN2003.K23C · Tiếng Anh 3','EN2003.K24A · Tiếng Anh 3','EN3010.K22A · Anh văn CN','EN3010.K22B · Anh văn CN']},
    { code:'GV00007', name:'Ngô Hải Long', degree:'ThS.', dept:'Bộ môn CNPM', spec:'Lập trình Web', email:'longnb@uni.edu.vn', phone:'0912 007 007', quota:20, classes:2, periods:8, status:'active',
      teaching:['IT4500.K22A · Lập trình Web','IT4500.K23A · Lập trình Web']},
    { code:'GV00008', name:'Phạm Thị Lan', degree:'PGS.TS.', dept:'Bộ môn HTTT', spec:'Khai phá dữ liệu', email:'lanpt@uni.edu.vn', phone:'0912 008 008', quota:16, classes:3, periods:22, status:'active',
      teaching:['IT6010.K21 · Khai phá dữ liệu','IT6011.K21 · ML cơ bản','IT5080.K21A · HTTT nâng cao']},
    { code:'GV00009', name:'Hoàng Đức Minh', degree:'TS.', dept:'Bộ môn KHMT', spec:'An toàn thông tin', email:'minhhs@uni.edu.vn', phone:'0912 009 009', quota:20, classes:4, periods:22, status:'active',
      teaching:['IT4700.K22A · An toàn TT','IT4700.K22B · An toàn TT','IT4701.K21A · Bảo mật hệ thống','IT6020.K21 · An ninh mạng']},
    { code:'GV00010', name:'Bùi Thanh Tùng', degree:'ThS.', dept:'Bộ môn CNPM', spec:'Kiểm thử phần mềm', email:'tungbt@uni.edu.vn', phone:'0912 010 010', quota:20, classes:0, periods:0, status:'idle',
      teaching:[]},
    { code:'GV00011', name:'Lưu Thị Hoa', degree:'ThS.', dept:'Bộ môn Ngoại ngữ', spec:'Phương pháp giảng dạy', email:'hoalt@uni.edu.vn', phone:'0912 011 011', quota:20, classes:0, periods:0, status:'idle',
      teaching:[]},
    { code:'GV00012', name:'Trần Quốc Bình', degree:'TS.', dept:'Bộ môn KHMT', spec:'Điện toán đám mây', email:'binhtq@uni.edu.vn', phone:'0912 012 012', quota:20, classes:0, periods:0, status:'leave',
      teaching:[]},
  ];

  function loadStatus(t) {
    if (t.status === 'leave') return 'leave';
    if (t.status === 'idle' || t.classes === 0) return 'idle';
    var pct = t.periods / t.quota;
    if (pct > 1) return 'over';
    return 'active';
  }
  var STATUS_META = {
    active: { label: 'Đang dạy',         badge: 'green' },
    over:   { label: 'Vượt định mức',     badge: 'red' },
    idle:   { label: 'Chưa có lớp',       badge: 'amber' },
    leave:  { label: 'Nghỉ dài hạn',      badge: '' },
  };
  function loadColor(pct) {
    if (pct > 1)   return 'hsl(var(--danger))';
    if (pct > .85) return 'hsl(var(--warning))';
    return 'hsl(var(--success))';
  }

  var state = { filter: 'all', q: '', dept: '', sort: 'name' };
  var tbody = document.getElementById('teacherRows');

  function matches(t) {
    var st = loadStatus(t);
    if (state.filter === 'active' && st !== 'active') return false;
    if (state.filter === 'over' && st !== 'over') return false;
    if (state.filter === 'idle' && st !== 'idle' && st !== 'leave') return false;
    if (state.dept && t.dept !== state.dept) return false;
    if (state.q) {
      var hay = (t.name + ' ' + t.code + ' ' + t.dept + ' ' + t.email + ' ' + t.spec).toLowerCase();
      if (hay.indexOf(state.q.toLowerCase()) === -1) return false;
    }
    return true;
  }

  function render() {
    var list = TEACHERS.filter(matches);
    if (state.sort === 'load')    list.sort(function (a, b) { return b.periods - a.periods; });
    else if (state.sort === 'classes') list.sort(function (a, b) { return b.classes - a.classes; });
    else list.sort(function (a, b) { return a.name.localeCompare(b.name, 'vi'); });

    tbody.innerHTML = list.map(function (t) {
      var idx = TEACHERS.indexOf(t);
      var st = loadStatus(t), sm = STATUS_META[st];
      var pct = t.quota > 0 ? t.periods / t.quota : 0;
      var pctN = Math.round(pct * 100);
      var col = DEPT_COLORS[t.dept] || 'hsl(var(--primary))';
      return '<tr class="clickable" data-idx="' + idx + '">' +
        '<td><div class="cell-user"><div class="av-lg" style="background:' + col + '">' + inits(t.name) + '</div>' +
          '<div><div class="nm">' + t.degree + ' ' + t.name + '</div>' +
          '<div class="sub">' + t.code + ' · ' + t.spec + '</div></div></div></td>' +
        '<td><span class="dept-chip"><span style="display:inline-block;width:9px;height:9px;border-radius:3px;background:' + col + ';flex:none"></span>' + t.dept.replace('Bộ môn ', '') + '</span></td>' +
        '<td><div class="nm email-cell">' + t.email + '</div><div class="email-cell">' + (t.phone || '—') + '</div></td>' +
        '<td class="num">' + t.classes + '</td>' +
        '<td class="num">' + t.periods + '</td>' +
        '<td><div class="load-bar"><div class="track"><span style="width:' + Math.min(pctN, 100) + '%;background:' + loadColor(pct) + '"></span></div>' +
          '<span class="pct" style="color:' + loadColor(pct) + '">' + pctN + '%</span></div></td>' +
        '<td><span class="badge ' + sm.badge + '">' + sm.label + '</span></td>' +
        '<td class="num"><span class="row-act">' +
          '<button class="icon-act js-view" title="Xem chi tiết" data-idx="' + idx + '"><i data-lucide="eye" class="icon-sm"></i></button>' +
          '<button class="icon-act js-edit" title="Chỉnh sửa" data-idx="' + idx + '"><i data-lucide="pencil" class="icon-sm"></i></button>' +
        '</span></td>' +
      '</tr>';
    }).join('');

    document.getElementById('emptyState').style.display = list.length ? 'none' : 'block';
    document.getElementById('resultCount').textContent = list.length + ' giảng viên';
    if (window.lucide) lucide.createIcons();
  }

  /* ── Drawer ── */
  var scrim   = document.getElementById('scrim');
  var drawer  = document.getElementById('drawer');
  function openDrawer(idx) {
    var t = TEACHERS[idx];
    var col = DEPT_COLORS[t.dept] || 'hsl(var(--primary))';
    var st = loadStatus(t), sm = STATUS_META[st];
    var pct = t.quota > 0 ? t.periods / t.quota : 0;
    var pctN = Math.round(pct * 100);

    document.getElementById('dwAv').textContent = inits(t.name);
    document.getElementById('dwAv').style.background = col;
    document.getElementById('dwName').textContent = t.degree + ' ' + t.name;
    document.getElementById('dwSub').textContent = t.spec + ' · ' + t.dept;
    document.getElementById('dwBadge').innerHTML = sm.badge ? '<span class="badge ' + sm.badge + '">' + sm.label + '</span>' : '<span class="badge">' + sm.label + '</span>';
    document.getElementById('dwCode').textContent = t.code;
    document.getElementById('dwTitle').textContent = t.degree + ' (' + (t.degree === 'TS.' ? 'Tiến sĩ' : t.degree === 'ThS.' ? 'Thạc sĩ' : t.degree === 'PGS.TS.' ? 'Phó Giáo sư Tiến sĩ' : 'Giáo sư Tiến sĩ') + ')';
    document.getElementById('dwDept').textContent = t.dept;
    document.getElementById('dwPhone').textContent = t.phone || '—';
    document.getElementById('dwEmail').textContent = t.email;
    document.getElementById('dwPeriods').textContent = t.periods + ' tiết / ' + t.quota + ' định mức';
    document.getElementById('dwLoadPct').textContent = pctN + '%';
    document.getElementById('dwLoadPct').style.color = loadColor(pct);
    var bar = document.getElementById('dwLoadBar');
    bar.style.width = Math.min(pctN, 100) + '%';
    bar.style.background = loadColor(pct);
    document.getElementById('dwClassBadge').textContent = t.classes + ' lớp';

    var tint = DEPT_TINT[t.dept] || 'ico-tint-indigo';
    document.getElementById('dwClasses').innerHTML = t.teaching.length
      ? t.teaching.map(function (c) {
          var parts = c.split(' · ');
          return '<div class="class-item"><div class="ci-ico ' + tint + '"><i data-lucide="book-open" class="icon-sm"></i></div>' +
            '<div style="flex:1"><div class="nm" style="font-size:13.5px">' + (parts[1] || c) + '</div></div>' +
            '<span class="ci-code">' + (parts[0] || '') + '</span></div>';
        }).join('')
      : '<div class="empty-state" style="padding:24px 0"><i data-lucide="inbox" class="icon"></i><div>Chưa có lớp học phần</div></div>';

    document.getElementById('dwEdit').onclick = function () { closeDrawer(); openModal(idx); };
    scrim.classList.add('open'); drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false');
    if (window.lucide) lucide.createIcons();
  }
  function closeDrawer() { scrim.classList.remove('open'); drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }

  /* ── Modal ── */
  var modal = document.getElementById('modal');
  var editIdx = null;
  function openModal(idx) {
    editIdx = (idx === undefined || idx === null) ? null : idx;
    var t = editIdx === null ? null : TEACHERS[editIdx];
    document.getElementById('modalTitle').textContent = t ? 'Chỉnh sửa giảng viên' : 'Thêm giảng viên';
    document.getElementById('fName').value    = t ? t.name : '';
    document.getElementById('fCode').value    = t ? t.code : '';
    document.getElementById('fDegree').value  = t ? t.degree : 'ThS.';
    document.getElementById('fDept').value    = t ? t.dept : 'Bộ môn CNPM';
    document.getElementById('fSpec').value    = t ? t.spec : '';
    document.getElementById('fEmail').value   = t ? t.email : '';
    document.getElementById('fPhone').value   = t ? t.phone : '';
    document.getElementById('fQuota').value   = t ? t.quota : 20;
    document.getElementById('fClasses').value = t ? t.classes : 0;
    document.getElementById('fPeriods').value = t ? t.periods : 0;
    scrim.classList.add('open'); modal.classList.add('open');
    if (window.lucide) lucide.createIcons();
  }
  function closeModal() { modal.classList.remove('open'); if (!drawer.classList.contains('open')) scrim.classList.remove('open'); }
  function saveModal() {
    var name   = document.getElementById('fName').value.trim() || 'Giảng viên mới';
    var degree = document.getElementById('fDegree').value;
    var data = {
      code:    document.getElementById('fCode').value.trim() || ('GV0' + (TEACHERS.length + 1).toString().padStart(4, '0')),
      name:    name, degree: degree, dept: document.getElementById('fDept').value,
      spec:    document.getElementById('fSpec').value.trim(),
      email:   document.getElementById('fEmail').value.trim(),
      phone:   document.getElementById('fPhone').value.trim(),
      quota:   +document.getElementById('fQuota').value || 20,
      classes: +document.getElementById('fClasses').value || 0,
      periods: +document.getElementById('fPeriods').value || 0,
      status:  'active', teaching: []
    };
    if (editIdx === null) TEACHERS.unshift(data);
    else TEACHERS[editIdx] = data;
    closeModal(); render();
  }

  /* ── Wire ── */
  tbody.addEventListener('click', function (e) {
    var editBtn = e.target.closest('.js-edit'); if (editBtn) { e.stopPropagation(); openModal(+editBtn.dataset.idx); return; }
    var viewBtn = e.target.closest('.js-view'); if (viewBtn) { e.stopPropagation(); openDrawer(+viewBtn.dataset.idx); return; }
    var row = e.target.closest('tr[data-idx]'); if (row) openDrawer(+row.dataset.idx);
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
    this.innerHTML = '<i data-lucide="check" class="icon-sm"></i> Đã xuất';
    if (window.lucide) lucide.createIcons();
    var b = this; setTimeout(function () { b.innerHTML = '<i data-lucide="download" class="icon-sm"></i> Xuất Excel'; if (window.lucide) lucide.createIcons(); }, 1600);
  });

  render();
})();
