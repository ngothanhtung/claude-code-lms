/* Staff — Danh sách học viên. Table + 4-tab detail drawer + add/edit modal. */
(function () {

  /* ── Avatar colors ── */
  var AV_COLORS = ['hsl(243 75% 59%)','hsl(172 66% 40%)','hsl(32 95% 48%)','hsl(142 71% 40%)','hsl(262 83% 58%)','hsl(221 83% 53%)','hsl(0 72% 51%)'];
  function avColor(code) { var n = 0; for (var i = 0; i < code.length; i++) n += code.charCodeAt(i); return AV_COLORS[n % AV_COLORS.length]; }
  function inits(name) { var p = name.trim().split(/\s+/); return ((p[p.length-2]||p[0]||'?')[0]+(p[p.length-1]||'')[0]).toUpperCase(); }
  function money(n) { return n.toLocaleString('vi-VN') + ' ₫'; }
  function attColor(p) { if (p < 70) return 'hsl(var(--danger))'; if (p < 80) return 'hsl(var(--warning))'; return 'hsl(var(--success))'; }
  function hpColor(p) { if (p < 50) return 'hsl(var(--danger))'; if (p < 80) return 'hsl(var(--warning))'; return 'hsl(var(--success))'; }

  /* ── Data ── */
  var STUDENTS = [
    { code:'21010234', name:'Trần Văn An',      gender:'Nam',  dob:'2003-04-12', cccd:'001203012345', cohort:'K21', cls:'CNTT-K21A', major:'Công nghệ thông tin',   email:'an.tv21@sv.uni.edu.vn',   phone:'0912 111 001', addr:'45 Lê Lợi, Q.1, TP.HCM', year:2021, status:'active',
      courses:[{code:'IT3080.K21A',name:'Cơ sở dữ liệu',tc:4,gv:'TS. Nguyễn Minh Tuấn',lich:'T3,5·Ca1',room:'A1-201',qt:8.5},{code:'IT4082.K21A',name:'HTTT quản lý',tc:3,gv:'ThS. Vũ Thị Dung',lich:'T4,6·Ca4',room:'A1-204',qt:7.0},{code:'IT4995.K21B',name:'Đồ án môn học',tc:2,gv:'TS. Nguyễn Minh Tuấn',lich:'T5·Ca3',room:'Lab301',qt:9.0},{code:'IT5023.K21A',name:'Trí tuệ nhân tạo',tc:3,gv:'TS. Phan Quốc Việt',lich:'T6·Ca2',room:'Lab302',qt:7.5}],
      hp:{total:18500000,paid:18500000,txs:[{date:'10/03/2026',desc:'Nộp HP đợt 1 HK II',amt:9250000},{date:'12/04/2026',desc:'Nộp HP đợt 2 HK II',amt:9250000}]},
      att:[{code:'IT3080.K21A',name:'Cơ sở dữ liệu',total:28,absent:1,pct:96},{code:'IT4082.K21A',name:'HTTT quản lý',total:24,absent:2,pct:92},{code:'IT4995.K21B',name:'Đồ án môn học',total:16,absent:0,pct:100},{code:'IT5023.K21A',name:'Trí tuệ nhân tạo',total:24,absent:2,pct:92}],
      absents:[{date:'20/05/2026',course:'IT3080.K21A · Cơ sở dữ liệu',ca:'Ca 1'},{date:'10/05/2026',course:'IT4082.K21A · HTTT quản lý',ca:'Ca 4'},{date:'03/05/2026',course:'IT4082.K21A · HTTT quản lý',ca:'Ca 4'}]},

    { code:'21010512', name:'Nguyễn Quốc Bảo',  gender:'Nam',  dob:'2003-07-22', cccd:'001203067890', cohort:'K21', cls:'CNTT-K21A', major:'Công nghệ thông tin',   email:'bao.nq21@sv.uni.edu.vn',  phone:'0912 111 002', addr:'78 Hai Bà Trưng, Q.3, TP.HCM', year:2021, status:'warning',
      courses:[{code:'IT3080.K21A',name:'Cơ sở dữ liệu',tc:4,gv:'TS. Nguyễn Minh Tuấn',lich:'T3,5·Ca1',room:'A1-201',qt:5.0},{code:'IT4082.K21A',name:'HTTT quản lý',tc:3,gv:'ThS. Vũ Thị Dung',lich:'T4,6·Ca4',room:'A1-204',qt:4.5},{code:'IT5023.K21A',name:'Trí tuệ nhân tạo',tc:3,gv:'TS. Phan Quốc Việt',lich:'T6·Ca2',room:'Lab302',qt:6.0}],
      hp:{total:18500000,paid:9250000,txs:[{date:'10/03/2026',desc:'Nộp HP đợt 1 HK II',amt:9250000},{date:'—',desc:'Đợt 2 chưa nộp (hạn 20/06)',amt:-9250000}]},
      att:[{code:'IT3080.K21A',name:'Cơ sở dữ liệu',total:28,absent:9,pct:68},{code:'IT4082.K21A',name:'HTTT quản lý',total:24,absent:5,pct:79},{code:'IT5023.K21A',name:'Trí tuệ nhân tạo',total:24,absent:8,pct:67}],
      absents:[{date:'10/06/2026',course:'IT3080.K21A · Cơ sở dữ liệu',ca:'Ca 1'},{date:'07/06/2026',course:'IT5023.K21A · Trí tuệ nhân tạo',ca:'Ca 2'},{date:'04/06/2026',course:'IT3080.K21A · Cơ sở dữ liệu',ca:'Ca 1'},{date:'01/06/2026',course:'IT4082.K21A · HTTT quản lý',ca:'Ca 4'}]},

    { code:'22010341', name:'Phạm Minh Châu',   gender:'Nữ',   dob:'2004-02-14', cccd:'001204023456', cohort:'K22', cls:'CNTT-K22A', major:'Kỹ thuật phần mềm',     email:'chau.pm22@sv.uni.edu.vn', phone:'0912 111 003', addr:'12 Nguyễn Huệ, Q.1, TP.HCM', year:2022, status:'active',
      courses:[{code:'IT3040.K22A',name:'CTDL & Giải thuật',tc:3,gv:'TS. Nguyễn Minh Tuấn',lich:'T2,4·Ca1',room:'A2-105',qt:9.5},{code:'IT4060.K22A',name:'Mạng máy tính',tc:3,gv:'TS. Phan Quốc Việt',lich:'T3·Ca1',room:'A1-105',qt:8.0},{code:'EN3010.K22A',name:'Anh văn chuyên ngành',tc:2,gv:'ThS. Trần Mỹ Hằng',lich:'T5·Ca2',room:'A1-302',qt:8.5}],
      hp:{total:17800000,paid:17800000,txs:[{date:'08/03/2026',desc:'Nộp HP đợt 1 HK II',amt:8900000},{date:'10/04/2026',desc:'Nộp HP đợt 2 HK II',amt:8900000}]},
      att:[{code:'IT3040.K22A',name:'CTDL & Giải thuật',total:24,absent:0,pct:100},{code:'IT4060.K22A',name:'Mạng máy tính',total:20,absent:1,pct:95},{code:'EN3010.K22A',name:'Anh văn chuyên ngành',total:16,absent:0,pct:100}],
      absents:[{date:'15/05/2026',course:'IT4060.K22A · Mạng máy tính',ca:'Ca 1'}]},

    { code:'22010199', name:'Hoàng Đức Duy',    gender:'Nam',  dob:'2004-09-30', cccd:'001204056789', cohort:'K22', cls:'CNTT-K22B', major:'Công nghệ thông tin',   email:'duy.hd22@sv.uni.edu.vn',  phone:'0912 111 004', addr:'56 Đinh Tiên Hoàng, Q.BT, TP.HCM', year:2022, status:'warning',
      courses:[{code:'IT4409.K22B',name:'Lập trình HĐT',tc:3,gv:'TS. Nguyễn Minh Tuấn',lich:'T4·Ca2',room:'B1-302',qt:6.5},{code:'IT4060.K22B',name:'Mạng máy tính',tc:3,gv:'TS. Phan Quốc Việt',lich:'T2·Ca4',room:'A1-105',qt:5.5}],
      hp:{total:17800000,paid:8900000,txs:[{date:'08/03/2026',desc:'Nộp HP đợt 1 HK II',amt:8900000},{date:'—',desc:'Đợt 2 chưa nộp',amt:-8900000}]},
      att:[{code:'IT4409.K22B',name:'Lập trình HĐT',total:20,absent:5,pct:75},{code:'IT4060.K22B',name:'Mạng máy tính',total:20,absent:6,pct:70}],
      absents:[{date:'09/06/2026',course:'IT4409.K22B · Lập trình HĐT',ca:'Ca 2'},{date:'06/06/2026',course:'IT4060.K22B · Mạng máy tính',ca:'Ca 4'},{date:'03/06/2026',course:'IT4409.K22B · Lập trình HĐT',ca:'Ca 2'}]},

    { code:'23010088', name:'Lê Thị Bình',      gender:'Nữ',   dob:'2005-11-05', cccd:'001205034567', cohort:'K23', cls:'CNTT-K23A', major:'Hệ thống thông tin',    email:'binh.lt23@sv.uni.edu.vn', phone:'0912 111 005', addr:'34 Lý Thường Kiệt, Q.10, TP.HCM', year:2023, status:'active',
      courses:[{code:'MA1041.K24A',name:'Toán rời rạc',tc:3,gv:'TS. Đặng Thái Sơn',lich:'T3·Ca3',room:'A2-201',qt:8.0},{code:'EN2003.K23B',name:'Tiếng Anh 3',tc:3,gv:'ThS. Trần Mỹ Hằng',lich:'T2·Ca1',room:'A1-302',qt:9.0},{code:'IT4060.K23A',name:'Mạng máy tính',tc:3,gv:'TS. Phan Quốc Việt',lich:'T5·Ca2',room:'A1-105',qt:7.5}],
      hp:{total:16500000,paid:16500000,txs:[{date:'05/03/2026',desc:'Nộp HP HK II (1 lần)',amt:16500000}]},
      att:[{code:'MA1041.K24A',name:'Toán rời rạc',total:20,absent:1,pct:95},{code:'EN2003.K23B',name:'Tiếng Anh 3',total:20,absent:0,pct:100},{code:'IT4060.K23A',name:'Mạng máy tính',total:20,absent:1,pct:95}],
      absents:[{date:'20/05/2026',course:'MA1041.K24A · Toán rời rạc',ca:'Ca 3'}]},

    { code:'23010702', name:'Phan Tiến Lực',     gender:'Nam',  dob:'2005-03-17', cccd:'001205078901', cohort:'K23', cls:'CNTT-K23B', major:'An toàn thông tin',     email:'luc.pt23@sv.uni.edu.vn',  phone:'0912 111 006', addr:'89 Cách Mạng Tháng 8, Q.3, TP.HCM', year:2023, status:'suspended',
      courses:[{code:'EN2003.K23C',name:'Tiếng Anh 3',tc:3,gv:'ThS. Trần Mỹ Hằng',lich:'T6·Ca1',room:'A1-303',qt:3.5}],
      hp:{total:16500000,paid:0,txs:[{date:'—',desc:'Đợt 1 chưa nộp',amt:-8250000},{date:'—',desc:'Đợt 2 chưa nộp',amt:-8250000}]},
      att:[{code:'EN2003.K23C',name:'Tiếng Anh 3',total:20,absent:12,pct:40}],
      absents:[{date:'11/06/2026',course:'EN2003.K23C · Tiếng Anh 3',ca:'Ca 1'},{date:'09/06/2026',course:'EN2003.K23C · Tiếng Anh 3',ca:'Ca 1'},{date:'06/06/2026',course:'EN2003.K23C · Tiếng Anh 3',ca:'Ca 1'},{date:'04/06/2026',course:'EN2003.K23C · Tiếng Anh 3',ca:'Ca 1'}]},

    { code:'24010023', name:'Bùi Khánh Linh',   gender:'Nữ',   dob:'2006-06-20', cccd:'001206012344', cohort:'K24', cls:'CNTT-K24A', major:'Công nghệ thông tin',   email:'linh.bk24@sv.uni.edu.vn', phone:'0912 111 007', addr:'23 Nguyễn Đình Chiểu, Q.1, TP.HCM', year:2024, status:'active',
      courses:[{code:'MA1041.K24A',name:'Toán rời rạc',tc:3,gv:'TS. Đặng Thái Sơn',lich:'T3·Ca3',room:'A2-201',qt:8.5},{code:'EN2003.K24A',name:'Tiếng Anh 3',tc:3,gv:'ThS. Trần Mỹ Hằng',lich:'T2·Ca1',room:'A1-302',qt:9.0}],
      hp:{total:15200000,paid:15200000,txs:[{date:'02/03/2026',desc:'Nộp HP HK II',amt:15200000}]},
      att:[{code:'MA1041.K24A',name:'Toán rời rạc',total:20,absent:0,pct:100},{code:'EN2003.K24A',name:'Tiếng Anh 3',total:20,absent:0,pct:100}],
      absents:[]},

    { code:'21010777', name:'Vũ Thị Giang',     gender:'Nữ',   dob:'2003-01-08', cccd:'001203089012', cohort:'K21', cls:'CNTT-K21B', major:'Kỹ thuật phần mềm',     email:'giang.vt21@sv.uni.edu.vn',phone:'0912 111 008', addr:'67 Phan Đăng Lưu, Q.PN, TP.HCM', year:2021, status:'active',
      courses:[{code:'IT4082.K21B',name:'HTTT quản lý',tc:3,gv:'ThS. Vũ Thị Dung',lich:'T4,6·Ca4',room:'A1-204',qt:9.5},{code:'IT5023.K21A',name:'Trí tuệ nhân tạo',tc:3,gv:'TS. Phan Quốc Việt',lich:'T6·Ca2',room:'Lab302',qt:8.5},{code:'IT4995.K21B',name:'Đồ án môn học',tc:2,gv:'TS. Nguyễn Minh Tuấn',lich:'T5·Ca3',room:'Lab301',qt:9.0}],
      hp:{total:18500000,paid:18500000,txs:[{date:'09/03/2026',desc:'Nộp HP đợt 1 HK II',amt:9250000},{date:'11/04/2026',desc:'Nộp HP đợt 2 HK II',amt:9250000}]},
      att:[{code:'IT4082.K21B',name:'HTTT quản lý',total:24,absent:1,pct:96},{code:'IT5023.K21A',name:'Trí tuệ nhân tạo',total:24,absent:1,pct:96},{code:'IT4995.K21B',name:'Đồ án môn học',total:16,absent:0,pct:100}],
      absents:[{date:'18/05/2026',course:'IT4082.K21B · HTTT quản lý',ca:'Ca 4'},{date:'12/05/2026',course:'IT5023.K21A · Trí tuệ nhân tạo',ca:'Ca 2'}]},
  ];

  function statusOf(s) {
    if (s.status === 'suspended') return 'suspended';
    var minAtt = 100;
    s.att.forEach(function(a){ if(a.pct < minAtt) minAtt = a.pct; });
    if (minAtt < 70 || s.hp.paid < s.hp.total) return 'warning';
    return 'active';
  }
  var STATUS_META = {
    active:    { label:'Bình thường',  badge:'green' },
    warning:   { label:'Cảnh báo',     badge:'amber' },
    suspended: { label:'Đình chỉ',     badge:'red'   },
  };

  /* ── Render stats ── */
  function renderStats(all) {
    var total = all.length, active = 0, warn = 0, debt = 0, debtAmt = 0;
    all.forEach(function(s){ var st=statusOf(s); if(st==='active')active++; else if(st==='warning')warn++; if(s.hp.paid<s.hp.total){debt++;debtAmt+=(s.hp.total-s.hp.paid);} });
    document.getElementById('sTotalVal').textContent = total;
    document.getElementById('sActiveVal').textContent = active;
    document.getElementById('sWarnVal').textContent = warn;
    document.getElementById('sDebtVal').textContent = debt;
    document.getElementById('sDebtFoot').textContent = 'Tổng nợ: ' + money(debtAmt);
    document.getElementById('phCount').textContent = total;
    document.getElementById('tabWarnCount').textContent = warn;
  }

  var state = { filter:'all', q:'', cohort:'', sort:'name' };

  function matches(s) {
    var st = statusOf(s);
    if (state.filter === 'active'    && st !== 'active')    return false;
    if (state.filter === 'warning'   && st !== 'warning')   return false;
    if (state.filter === 'suspended' && st !== 'suspended') return false;
    if (state.cohort && s.cohort !== state.cohort) return false;
    if (state.q) {
      var hay = (s.code+' '+s.name+' '+s.cls+' '+s.email).toLowerCase();
      if (hay.indexOf(state.q.toLowerCase()) === -1) return false;
    }
    return true;
  }

  var tbody = document.getElementById('studentRows');

  function render() {
    var list = STUDENTS.filter(matches);
    if (state.sort === 'code') list.sort(function(a,b){ return a.code.localeCompare(b.code); });
    else if (state.sort === 'att') list.sort(function(a,b){
      var ma=100,mb=100; a.att.forEach(function(x){if(x.pct<ma)ma=x.pct;}); b.att.forEach(function(x){if(x.pct<mb)mb=x.pct;});
      return ma-mb;
    });
    else if (state.sort === 'debt') list.sort(function(a,b){ return (b.hp.total-b.hp.paid)-(a.hp.total-a.hp.paid); });
    else list.sort(function(a,b){ return a.name.localeCompare(b.name,'vi'); });

    tbody.innerHTML = list.map(function(s) {
      var idx = STUDENTS.indexOf(s);
      var st = statusOf(s), sm = STATUS_META[st];
      var col = avColor(s.code);
      var hpPct = Math.round(s.hp.paid / s.hp.total * 100);
      var minAtt = 100; s.att.forEach(function(a){ if(a.pct<minAtt) minAtt=a.pct; });
      return '<tr class="clickable" data-idx="'+idx+'">' +
        '<td><div class="cell-user"><div class="av-md" style="background:'+col+'">'+inits(s.name)+'</div>' +
          '<div><div class="nm">'+s.name+'</div><div class="sub">'+s.code+'</div></div></div></td>' +
        '<td><div class="nm">'+s.cohort+' · '+s.cls+'</div><div class="sub" style="font-size:12px">'+s.major+'</div></td>' +
        '<td><div class="nm email-cell" style="font-size:12.5px;color:hsl(var(--foreground));font-weight:600">'+s.email+'</div>' +
          '<div class="email-cell">'+s.phone+'</div></td>' +
        '<td class="num">'+s.courses.length+'</td>' +
        '<td><div class="pct-bar"><div class="track"><span style="width:'+hpPct+'%;background:'+hpColor(hpPct)+'"></span></div>' +
          '<span class="pv" style="color:'+hpColor(hpPct)+'">'+hpPct+'%</span></div></td>' +
        '<td><div class="pct-bar"><div class="track"><span style="width:'+minAtt+'%;background:'+attColor(minAtt)+'"></span></div>' +
          '<span class="pv" style="color:'+attColor(minAtt)+'">'+minAtt+'%</span></div></td>' +
        '<td><span class="badge '+sm.badge+'">'+sm.label+'</span></td>' +
        '<td class="num"><span class="row-act">' +
          '<button class="icon-act js-view" title="Xem chi tiết" data-idx="'+idx+'"><i data-lucide="eye" class="icon-sm"></i></button>' +
          '<button class="icon-act js-edit" title="Chỉnh sửa" data-idx="'+idx+'"><i data-lucide="pencil" class="icon-sm"></i></button>' +
        '</span></td>' +
      '</tr>';
    }).join('');

    document.getElementById('emptyState').style.display = list.length ? 'none' : 'block';
    document.getElementById('resultCount').textContent = list.length + ' học viên';
    if (window.lucide) lucide.createIcons();
  }

  /* ── Drawer ── */
  var scrim = document.getElementById('scrim');
  var drawer = document.getElementById('drawer');

  function openDrawer(idx, tab) {
    var s = STUDENTS[idx];
    var col = avColor(s.code);
    var st = statusOf(s), sm = STATUS_META[st];

    /* header */
    document.getElementById('dwAv').textContent = inits(s.name);
    document.getElementById('dwAv').style.background = col;
    document.getElementById('dwName').textContent = s.name;
    document.getElementById('dwSub').textContent = s.code + ' · ' + s.cls + ' · ' + s.cohort;
    document.getElementById('dwBadge').innerHTML = '<span class="badge '+sm.badge+'">'+sm.label+'</span>';

    /* tab 1 — Thông tin chung */
    document.getElementById('dg-code').textContent    = s.code;
    document.getElementById('dg-gender').textContent  = s.gender;
    document.getElementById('dg-dob').textContent     = s.dob.split('-').reverse().join('/');
    document.getElementById('dg-id').textContent      = s.cccd;
    document.getElementById('dg-class').textContent   = s.cohort + ' · ' + s.cls;
    document.getElementById('dg-major').textContent   = s.major;
    document.getElementById('dg-email').textContent   = s.email;
    document.getElementById('dg-phone').textContent   = s.phone;
    document.getElementById('dg-addr').textContent    = s.addr;
    document.getElementById('dg-year').textContent    = s.year;
    document.getElementById('dg-status').innerHTML    = '<span class="badge '+sm.badge+'">'+sm.label+'</span>';

    /* tab 2 — Lớp học */
    document.getElementById('dw-courses').innerHTML = s.courses.length
      ? s.courses.map(function(c){
          var sc = c.qt >= 8 ? 'hsl(var(--success))' : c.qt >= 6 ? 'hsl(var(--warning))' : 'hsl(var(--danger))';
          return '<div class="course-row">' +
            '<div class="cr-ico ico-tint-indigo"><i data-lucide="book-open" class="icon-sm"></i></div>' +
            '<div style="flex:1;min-width:0"><div class="nm" style="font-size:13.5px">'+c.name+'</div>' +
              '<div style="font-size:12px;color:hsl(var(--muted-foreground))">'+c.gv+' · '+c.lich+' · '+c.room+'</div></div>' +
            '<div style="text-align:right;flex:none"><div class="cr-score" style="color:'+sc+'">'+c.qt.toFixed(1)+'</div><div class="cr-code">QT · '+c.tc+'TC</div></div>' +
          '</div>';
        }).join('')
      : '<div class="empty-state" style="padding:24px 0"><i data-lucide="inbox"></i><div>Chưa đăng ký lớp nào</div></div>';

    /* tab 3 — Học phí */
    var hpPct = Math.round(s.hp.paid / s.hp.total * 100);
    var remain = s.hp.total - s.hp.paid;
    document.getElementById('dw-hp-summary').innerHTML =
      '<div class="hp-box" style="background:hsl(var(--muted))"><div class="hb-lbl">Tổng học phí</div><div class="hb-val">'+money(s.hp.total)+'</div><div class="hb-sub">HK II 2025–2026</div></div>' +
      '<div class="hp-box" style="background:hsl(var(--success-muted));color:hsl(142 64% 30%)"><div class="hb-lbl">Đã nộp</div><div class="hb-val">'+money(s.hp.paid)+'</div><div class="hb-sub">'+hpPct+'% tổng HP</div></div>' +
      '<div class="hp-box" style="background:'+(remain>0?'hsl(var(--danger-muted))':'hsl(var(--success-muted))')+';color:'+(remain>0?'hsl(var(--danger))':'hsl(142 64% 30%)')+'"><div class="hb-lbl">Còn nợ</div><div class="hb-val">'+money(remain)+'</div><div class="hb-sub">'+(remain>0?'Cần thanh toán':'Đã hoàn tất')+'</div></div>';
    var hpBar = document.getElementById('dw-hp-bar');
    hpBar.style.width = hpPct+'%'; hpBar.style.background = hpColor(hpPct);
    document.getElementById('dw-hp-txs').innerHTML = s.hp.txs.map(function(tx){
      var pos = tx.amt > 0;
      return '<div class="tx-row"><span class="tx-date">'+tx.date+'</span>' +
        '<span style="flex:1">'+tx.desc+'</span>' +
        '<span class="tx-amt '+(pos?'pos':'neg')+'">'+(pos?'+':'')+money(tx.amt)+'</span></div>';
    }).join('');

    /* tab 4 — Điểm danh */
    document.getElementById('dw-att-courses').innerHTML = s.att.map(function(a){
      return '<div class="att-row">' +
        '<div style="flex:1;min-width:0"><div class="nm" style="font-size:13.5px">'+a.name+'</div>' +
          '<div style="font-size:12px;color:hsl(var(--muted-foreground))">Vắng '+a.absent+'/'+a.total+' buổi</div></div>' +
        '<div style="flex:1;max-width:120px"><div style="height:7px;border-radius:99px;background:hsl(var(--muted));overflow:hidden">' +
          '<span style="display:block;height:100%;width:'+a.pct+'%;border-radius:99px;background:'+attColor(a.pct)+'"></span></div></div>' +
        '<span class="att-pct" style="color:'+attColor(a.pct)+'">'+a.pct+'%</span>' +
        (a.pct < 80 ? '<span class="absent-chip"><i data-lucide="alert-triangle" class="icon-sm" style="width:12px;height:12px"></i>Cảnh báo</span>' : '') +
      '</div>';
    }).join('') || '<div class="empty-state" style="padding:20px 0">Không có dữ liệu điểm danh.</div>';

    document.getElementById('dw-att-absents').innerHTML = s.absents.length
      ? s.absents.map(function(a){
          return '<div class="absent-item"><span class="ai-date">'+a.date+'</span>' +
            '<i data-lucide="calendar-x" class="icon-sm" style="color:hsl(var(--danger));flex:none"></i>' +
            '<span style="flex:1">'+a.course+'</span>' +
            '<span style="font-size:12px;color:hsl(var(--muted-foreground))">'+a.ca+'</span></div>';
        }).join('')
      : '<div style="text-align:center;padding:16px;color:hsl(var(--muted-foreground));font-size:13px">Không có buổi vắng nào. ✓</div>';

    document.getElementById('dwEdit').onclick = function () { closeDrawer(); openModal(idx); };

    /* activate tab */
    activateDwTab(tab || 'general');

    scrim.classList.add('open'); drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false');
    if (window.lucide) lucide.createIcons();
  }
  function closeDrawer() { scrim.classList.remove('open'); drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }

  function activateDwTab(id) {
    document.querySelectorAll('.dw-tab').forEach(function(t){ t.classList.toggle('active', t.dataset.tab === id); });
    document.querySelectorAll('.dw-panel').forEach(function(p){ p.classList.toggle('active', p.id === 'panel-'+id); });
  }
  document.getElementById('dwTabs').addEventListener('click', function(e){
    var t = e.target.closest('.dw-tab'); if (!t) return;
    activateDwTab(t.dataset.tab);
    if (window.lucide) lucide.createIcons();
  });

  /* ── Modal ── */
  var modal = document.getElementById('modal');
  var editIdx = null;
  function openModal(idx) {
    editIdx = (idx === undefined || idx === null) ? null : idx;
    var s = editIdx === null ? null : STUDENTS[editIdx];
    document.getElementById('modalTitle').textContent = s ? 'Chỉnh sửa học viên' : 'Thêm học viên';
    document.getElementById('fName').value   = s ? s.name : '';
    document.getElementById('fCode').value   = s ? s.code : '';
    document.getElementById('fGender').value = s ? s.gender : 'Nam';
    document.getElementById('fDob').value    = s ? s.dob : '';
    document.getElementById('fId').value     = s ? s.cccd : '';
    document.getElementById('fCohort').value = s ? s.cohort : 'K24';
    document.getElementById('fClass').value  = s ? s.cls : '';
    document.getElementById('fMajor').value  = s ? s.major : 'Công nghệ thông tin';
    document.getElementById('fEmail').value  = s ? s.email : '';
    document.getElementById('fPhone').value  = s ? s.phone : '';
    document.getElementById('fAddr').value   = s ? s.addr : '';
    scrim.classList.add('open'); modal.classList.add('open');
    if (window.lucide) lucide.createIcons();
  }
  function closeModal() { modal.classList.remove('open'); if (!drawer.classList.contains('open')) scrim.classList.remove('open'); }
  function saveModal() {
    var data = {
      code: document.getElementById('fCode').value.trim() || '99'+Date.now().toString().slice(-6),
      name: document.getElementById('fName').value.trim() || 'Học viên mới',
      gender: document.getElementById('fGender').value,
      dob:  document.getElementById('fDob').value || '2000-01-01',
      cccd: document.getElementById('fId').value.trim(),
      cohort: document.getElementById('fCohort').value,
      cls:  document.getElementById('fClass').value.trim() || 'CNTT-K24A',
      major: document.getElementById('fMajor').value,
      email: document.getElementById('fEmail').value.trim(),
      phone: document.getElementById('fPhone').value.trim(),
      addr: document.getElementById('fAddr').value.trim(),
      year: 2024, status:'active', courses:[], att:[], absents:[],
      hp:{total:15200000,paid:0,txs:[]}
    };
    if (editIdx === null) STUDENTS.unshift(data);
    else { data.courses=STUDENTS[editIdx].courses; data.att=STUDENTS[editIdx].att; data.absents=STUDENTS[editIdx].absents; data.hp=STUDENTS[editIdx].hp; STUDENTS[editIdx]=data; }
    closeModal(); renderStats(STUDENTS); render();
  }

  /* ── Wire events ── */
  tbody.addEventListener('click', function(e){
    var editBtn = e.target.closest('.js-edit'); if (editBtn){ e.stopPropagation(); openModal(+editBtn.dataset.idx); return; }
    var viewBtn = e.target.closest('.js-view'); if (viewBtn){ e.stopPropagation(); openDrawer(+viewBtn.dataset.idx); return; }
    var row = e.target.closest('tr[data-idx]'); if (row) openDrawer(+row.dataset.idx);
  });
  document.getElementById('statusTabs').addEventListener('click', function(e){
    var t = e.target.closest('.tab'); if (!t) return;
    this.querySelectorAll('.tab').forEach(function(x){ x.classList.remove('active'); });
    t.classList.add('active'); state.filter = t.dataset.filter; render();
  });
  document.getElementById('searchInput').addEventListener('input', function(){ state.q = this.value; render(); });
  document.getElementById('cohortFilter').addEventListener('change', function(){ state.cohort = this.value; render(); });
  document.getElementById('sortFilter').addEventListener('change', function(){ state.sort = this.value; render(); });
  document.getElementById('addBtn').addEventListener('click', function(){ openModal(null); });
  document.getElementById('dwClose').addEventListener('click', closeDrawer);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalSave').addEventListener('click', saveModal);
  scrim.addEventListener('click', function(){ closeDrawer(); closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ closeDrawer(); closeModal(); } });
  document.getElementById('exportBtn').addEventListener('click', function(){
    this.innerHTML = '<i data-lucide="check" class="icon-sm"></i> Đã xuất'; if (window.lucide) lucide.createIcons();
    var b = this; setTimeout(function(){ b.innerHTML='<i data-lucide="download" class="icon-sm"></i> Xuất Excel'; if(window.lucide) lucide.createIcons(); }, 1600);
  });

  renderStats(STUDENTS);
  render();
})();
