/* ═══════════════ EnglishQuiz — Dashboard shell & views ═══════════════ */
const { useState: useStateD } = React;

/* ── Sidebar ── */
function Sidebar({ view, setView, session, ud, onNav }) {
  const NAV = [
  { id: 'home', ico: '🏠', label: 'Trang chủ' },
  { id: 'assignments', ico: '📝', label: 'Bài tập', badge: '1' },
  { id: 'group', ico: '👥', label: 'Nhóm của em' },
  { id: 'results', ico: '🏆', label: 'Kết quả' }];

  const grade = window.GRADES.find((g) => g.n === session?.grade) || window.GRADES[2];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">🦉</div>
        <div className="brand-name">English<span>Quiz</span></div>
      </div>
      <nav className="nav">
        <div className="nav-label">Học tập</div>
        {NAV.map((n) =>
        <button key={n.id} className={`nav-item ${view === n.id ? 'active' : ''}`} onClick={() => {setView(n.id);onNav && onNav();}}>
            <span className="ni-ico">{n.ico}</span>{n.label}
            {n.badge && <span className="ni-badge">{n.badge}</span>}
          </button>
        )}
        <div className="nav-label">Lớp học</div>
        <div className="nav-item" style={{ cursor: 'default' }}>
          <span className="ni-ico">{grade.emoji}</span>Lớp {session?.cls || '3A'}
        </div>
      </nav>
      <div className="side-foot">
        <div className="side-user">
          <div className="su-av">😊</div>
          <div style={{ minWidth: 0 }}>
            <div className="su-name">{ud?.code || 'HS001234'}</div>
            <div className="su-sub">{ud?.school || 'TH Nguyễn Du'}</div>
          </div>
        </div>
      </div>
    </aside>);

}

/* ── Topbar ── */
function Topbar({ onMenu, title }) {
  return (
    <header className="topbar">
      <button className="hamburger" onClick={onMenu}>☰</button>
      <div className="searchbox">
        <span>🔍</span>
        <input placeholder="Tìm bài tập, từ vựng..." />
      </div>
      <div className="top-actions">
        <button className="icon-btn">🔔<span className="dot"></span></button>
        <div className="top-av">😊</div>
      </div>
    </header>);

}

/* ── Stat card ── */
function Stat({ ico, bg, fg, val, lbl }) {
  return (
    <div className="card stat">
      <div className="st-ico" style={{ background: bg, color: fg }}>{ico}</div>
      <div>
        <div className="st-val">{val}</div>
        <div className="st-lbl">{lbl}</div>
      </div>
    </div>);

}

/* ── Quiz card ── */
function QuizCard({ q, go }) {
  const pct = q.status === 'done' ? Math.round(q.score / q.total * 100) : 0;
  return (
    <div className="card qcard">
      <div className="qcard-top">
        <div className="qcard-ico" style={{ background: q.color }}>{q.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="qcard-title">{q.title}</div>
          <div className="qcard-meta">
            <span>📋 {q.qs} câu</span>
            <span>⏱ {q.time} phút</span>
          </div>
        </div>
        <span className={`badge ${q.status === 'done' ? 'bdg-g' : 'bdg-a'}`}>{q.status === 'done' ? '✓ Đã làm' : 'Chưa làm'}</span>
      </div>
      <div className="qcard-foot">
        {q.status === 'done' ? <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
            <span className="score-big" style={{ color: pct >= 70 ? 'var(--k-green)' : 'var(--k-red)' }}>{q.score}/{q.total}</span>
            <span style={{ fontSize: 13, color: 'var(--k-muted)', fontWeight: 700 }}>{pct}%</span>
          </div>
          <button className="btn btn-s" style={{ padding: '10px 18px' }}>Xem lại</button>
        </> : <>
          <span style={{ fontSize: 13, color: 'var(--k-red)', fontWeight: 800 }}>⏰ {q.due}</span>
          <button className="btn btn-p" style={{ padding: '11px 22px' }} onClick={() => go('quiz', { quiz: q })}>Làm bài nhóm 👥</button>
        </>}
      </div>
    </div>);

}

/* ── Home view ── */
function HomeView({ go, session }) {
  const partner = session?.partner || { name: 'Mai Anh', initials: 'MA', color: '#f59e0b' };
  const nextQuiz = window.QUIZZES.find((q) => q.status === 'new');
  const done = window.QUIZZES.filter((q) => q.status === 'done');
  const avg = Math.round(done.reduce((a, q) => a + q.score / q.total, 0) / done.length * 100);
  return (
    <div className="page-enter">
      {/* hero */}
      <div className="hero">
        <div className="hero-txt">
          <h1>Chào buổi sáng, cùng học nhé! ☀️</h1>
          <p>Em đang học cùng <strong>{partner.name}</strong>. Hôm nay có <strong>1 bài tập mới</strong> đang chờ hai bạn hoàn thành.</p>
          <div className="hero-cta">
            <button className="btn btn-w" onClick={() => nextQuiz && go('quiz', { quiz: nextQuiz })}>Làm bài ngay 🎯</button>
            <button className="btn btn-ghost" onClick={() => go('assignments')}>Xem tất cả bài tập</button>
          </div>
        </div>
        <div className="hero-mascot">🦉</div>
      </div>

      {/* stats */}
      <div className="grid stat-grid">
        <Stat ico="✅" bg="var(--k-green-l)" fg="var(--k-green-d)" val={done.length} lbl="Bài đã hoàn thành" />
        <Stat ico="📊" bg="var(--k-primary-l)" fg="var(--k-primary)" val={avg + '%'} lbl="Điểm trung bình" />
        <Stat ico="🔥" bg="var(--k-gold-l)" fg="#92400e" val="5 ngày" lbl="Chuỗi học liên tục" />
        <Stat ico="⭐" bg="#ede9fe" fg="#5b21b6" val="240" lbl="Điểm thưởng" />
      </div>

      {/* two columns */}
      <div className="cols">
        <div>
          <div className="sec-head">
            <h2>Bài tập của em 📝</h2>
            <button className="link-btn" onClick={() => go('assignments')}>Xem tất cả →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {window.QUIZZES.map((q) => <QuizCard key={q.id} q={q} go={go} />)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* group card */}
          <div className="card">
            <div className="sec-head" style={{ marginBottom: 14 }}>
              <h3>Nhóm của em 👥</h3>
              <span className="badge bdg-g">● Online</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="member">
                <div className="m-av" style={{ background: 'var(--k-primary)' }}>TT</div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 900, fontSize: 14.5 }}>Thanh Tùng</div><div style={{ fontSize: 12, color: 'var(--k-muted)' }}>Chủ nhóm</div></div>
                <span style={{ fontSize: 18 }}>👑</span>
              </div>
              <div className="member">
                <div className="m-av" style={{ background: partner.color }}>{partner.initials}</div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 900, fontSize: 14.5 }}>{partner.name}</div><div style={{ fontSize: 12, color: 'var(--k-muted)' }}>Minh Anh</div></div>
                <span className="badge bdg-g">Sẵn sàng</span>
              </div>
            </div>
            <button className="btn btn-o btn-block" style={{ marginTop: 14 }} onClick={() => go('group')}>Quản lý nhóm</button>
          </div>

          {/* tip card */}
          <div className="card" style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)', border: 'none' }}>
            <div style={{ fontSize: 34, marginBottom: 8 }}>💡</div>
            <h3 style={{ color: '#92400e' }}>Mẹo học hôm nay</h3>
            <p style={{ color: '#a16207', marginTop: 6, fontWeight: 600 }}>Đọc to từ vựng tiếng Anh mỗi ngày 10 phút sẽ giúp em nhớ lâu hơn đó!</p>
          </div>
        </div>
      </div>
    </div>);

}

/* ── Assignments view ── */
function AssignmentsView({ go, session }) {
  const partner = session?.partner || { name: 'Mai Anh' };
  return (
    <div className="page-enter">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 6 }}>
        <div>
          <h1>Bài tập 📝</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--k-green)' }}></div>
            <p style={{ fontWeight: 700 }}>Nhóm: Tôi &amp; {partner.name}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span className="badge bdg-a" style={{ padding: '8px 14px', fontSize: 13 }}>1 chưa làm</span>
          <span className="badge bdg-g" style={{ padding: '8px 14px', fontSize: 13 }}>2 đã làm</span>
        </div>
      </div>
      <div className="assign-grid" style={{ marginTop: 24 }}>
        {window.QUIZZES.map((q) => <QuizCard key={q.id} q={q} go={go} />)}
      </div>
    </div>);

}

/* ── Group view ── */
function GroupView({ go, session }) {
  const partner = session?.partner || { name: 'Mai Anh', initials: 'MA', color: '#f59e0b' };
  const grade = window.GRADES.find((g) => g.n === session?.grade) || window.GRADES[2];
  return (
    <div className="page-enter">
      <h1>Nhóm của em 👥</h1>
      <p style={{ marginTop: 8, marginBottom: 24, fontWeight: 700 }}>Lớp {session?.cls || '3A'} · Khối {session?.grade || 3} {grade.emoji}</p>

      <div className="cols" style={{ marginTop: 0 }}>
        <div className="card" style={{ background: 'linear-gradient(135deg,#312e81,#4338ca)', color: '#fff', border: 'none' }}>
          <div style={{ fontSize: 13, opacity: .8, fontWeight: 800, letterSpacing: .5 }}>MÃ NHÓM</div>
          <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 4, margin: '6px 0 22px' }}>NOM-2024</div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {[{ lbl: 'Thanh Tùng', init: 'TT', col: '#fff', fg: '#4338ca' }, { lbl: partner.name, init: partner.initials, col: partner.color, fg: '#fff' }].map((m, i) =>
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
                <div style={{ ...{ width: 68, height: 68, borderRadius: 20, background: m.col, color: m.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, border: '3px solid rgba(255,255,255,.3)' }, background: "rgb(249, 185, 0)" }}>{m.init}</div>
                <span style={{ fontSize: 13, opacity: .92, fontWeight: 800 }}>{m.lbl}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card">
            <h3>Hoạt động nhóm 📈</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
              {[{ t: 'Hoàn thành Unit 2 — My Body', s: '8/10 điểm · hôm qua', e: '✅' },
              { t: 'Hoàn thành Unit 1 — Hello!', s: '6/6 điểm · 3 ngày trước', e: '🏆' },
              { t: 'Tạo nhóm học tập', s: '5 ngày trước', e: '🎉' }].map((a, i) =>
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--k-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flex: 'none' }}>{a.e}</div>
                  <div><div style={{ fontWeight: 800, fontSize: 14 }}>{a.t}</div><div style={{ fontSize: 12, color: 'var(--k-muted)' }}>{a.s}</div></div>
                </div>
              )}
            </div>
          </div>
          <button className="btn btn-o btn-block" onClick={() => go('onboarding')}>Đổi nhóm khác</button>
        </div>
      </div>
    </div>);

}

/* ── Results view ── */
function ResultsView({ go }) {
  const done = window.QUIZZES.filter((q) => q.status === 'done');
  return (
    <div className="page-enter">
      <h1>Kết quả học tập 🏆</h1>
      <p style={{ marginTop: 8, marginBottom: 24, fontWeight: 700 }}>Xem lại tất cả bài tập em đã hoàn thành</p>
      <div className="grid stat-grid" style={{ marginTop: 0 }}>
        <Stat ico="✅" bg="var(--k-green-l)" fg="var(--k-green-d)" val={done.length} lbl="Bài đã làm" />
        <Stat ico="📊" bg="var(--k-primary-l)" fg="var(--k-primary)" val={Math.round(done.reduce((a, q) => a + q.score / q.total, 0) / done.length * 100) + '%'} lbl="Điểm trung bình" />
        <Stat ico="🎯" bg="var(--k-gold-l)" fg="#92400e" val={done.reduce((a, q) => a + q.score, 0)} lbl="Tổng câu đúng" />
        <Stat ico="⭐" bg="#ede9fe" fg="#5b21b6" val="240" lbl="Điểm thưởng" />
      </div>
      <div className="assign-grid" style={{ marginTop: 22 }}>
        {done.map((q) => <QuizCard key={q.id} q={q} go={go} />)}
      </div>
    </div>);

}

/* ── Dashboard shell ── */
function Dashboard({ go, session, ud, initialView }) {
  const [view, setView] = useStateD(initialView || 'home');
  const [drawer, setDrawer] = useStateD(false);
  const views = {
    home: <HomeView go={go} session={session} />,
    assignments: <AssignmentsView go={go} session={session} />,
    group: <GroupView go={go} session={session} />,
    results: <ResultsView go={go} />
  };
  return (
    <div className={`shell ${drawer ? 'drawer-open' : ''}`}>
      <Sidebar view={view} setView={setView} session={session} ud={ud} onNav={() => setDrawer(false)} />
      <div className="scrim" onClick={() => setDrawer(false)}></div>
      <div className="main">
        <Topbar onMenu={() => setDrawer(true)} />
        <div className="content">{views[view]}</div>
      </div>
    </div>);

}

Object.assign(window, { Dashboard, Sidebar, Topbar, HomeView, AssignmentsView, GroupView, ResultsView, QuizCard, Stat });