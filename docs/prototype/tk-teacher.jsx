/* ═══════════════ EnglishQuiz — Teacher Dashboard ═══════════════ */
const { useState: useST, useEffect: useET, useRef: useRT } = React;

/* ─── fresh state clone of class data ─── */
function freshClasses() {
  const out = {};
  Object.entries(window.T_CLASSES_DATA).forEach(([k, v]) => {
    out[k] = { ...v, groups: v.groups.map((g) => ({ ...g, status: 'idle', progress: 0, score: null })) };
  });
  return out;
}

/* ═══════════════ LOGIN ═══════════════ */
function TeacherLoginScreen({ onLogin }) {
  const [code, setCode] = useST('');
  const [pass, setPass] = useST('');
  const [loading, setLoading] = useST(false);
  const [err, setErr] = useST('');

  function login() {
    if (!code || !pass) {setErr('Vui lòng nhập đầy đủ thông tin!');return;}
    setLoading(true);setErr('');
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: 'Nguyễn Thị Lan', code, school: 'TH Nguyễn Du' });
    }, 900);
  }

  return (
    <div className="centerpage welcome-bg">
      <div style={{ textAlign: 'center', maxWidth: 440, width: '100%' }}>
        <div style={{ fontSize: 72, marginBottom: 6, filter: 'drop-shadow(0 10px 28px rgba(0,0,0,.3))' }}>👩‍🏫</div>
        <div style={{ fontSize: 'clamp(32px,5vw,46px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1.1 }}>
          AMES<span style={{ color: '#fde68a' }}> ENGLISH</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16, marginTop: 8, marginBottom: 32, fontWeight: 700 }}>Trang quản lý Giáo viên 🏫</p>
        <div className="cp-card" style={{ textAlign: 'left' }}>
          <h2 style={{ marginBottom: 16 }}>Đăng nhập</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="inp" placeholder="Mã giáo viên (VD: GV001)" value={code}
            onChange={(e) => {setCode(e.target.value.toUpperCase());setErr('');}}
            onKeyDown={(e) => e.key === 'Enter' && login()} />
            <input className="inp" type="password" placeholder="Mật khẩu" value={pass}
            onChange={(e) => {setPass(e.target.value);setErr('');}}
            onKeyDown={(e) => e.key === 'Enter' && login()} />
            {err && <div style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--k-red-l)', color: 'var(--k-red-d)', fontWeight: 800, fontSize: 13 }}>⚠️ {err}</div>}
            <button className="btn btn-p btn-block" style={{ padding: '15px', marginTop: 4 }} onClick={login} disabled={loading || !code || !pass}>
              {loading ? '⏳ Đang đăng nhập...' : 'Vào trang quản lý →'}
            </button>
          </div>
          <p style={{ textAlign: 'center', marginTop: 14, fontSize: 13 }}>💡 Liên hệ nhà trường để lấy mã đăng nhập</p>
        </div>
      </div>
    </div>);

}

/* ═══════════════ SIDEBAR ═══════════════ */
function TeacherSidebar({ view, setView, teacher, onClose }) {
  const NAV = [
  { id: 'classes', ico: '👥', label: 'Lớp & Nhóm' },
  { id: 'quizzes', ico: '📝', label: 'Ngân hàng bài' },
  { id: 'results', ico: '🏆', label: 'Kết quả' }];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">🦉</div>
        <div>
          <div className="brand-name">English<span>Quiz</span></div>
          <div style={{ fontSize: 11, color: 'var(--k-green-d)', fontWeight: 800, background: 'var(--k-green-l)', borderRadius: 99, padding: '2px 8px', marginTop: 3, display: 'inline-block' }}>Giáo viên</div>
        </div>
      </div>
      <nav className="nav">
        <div className="nav-label">Quản lý lớp</div>
        {NAV.map((n) =>
        <button key={n.id} className={`nav-item ${view === n.id ? 'active' : ''}`}
        onClick={() => {setView(n.id);onClose && onClose();}}>
            <span className="ni-ico">{n.ico}</span>{n.label}
          </button>
        )}
      </nav>
      <div className="side-foot">
        <div className="side-user">
          <div className="su-av" style={{ background: 'var(--k-green)', fontSize: 20 }}>👩‍🏫</div>
          <div style={{ minWidth: 0 }}>
            <div className="su-name">{teacher?.name || 'GV001'}</div>
            <div className="su-sub">{teacher?.school || 'TH Nguyễn Du'}</div>
          </div>
        </div>
      </div>
    </aside>);

}

/* ═══════════════ CLASS TABS ═══════════════ */
function ClassTabs({ classData, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 22 }}>
      {Object.entries(classData).map(([cls, data]) => {
        const liveCount = data.groups.filter((g) => g.status === 'active').length;
        const isActive = active === cls;
        return (
          <button key={cls} onClick={() => onChange(cls)} style={{
            padding: '10px 20px', borderRadius: 14, fontFamily: 'Nunito,sans-serif',
            fontWeight: 900, fontSize: 15, cursor: 'pointer', transition: 'all .15s',
            border: `2.5px solid ${isActive ? 'var(--k-primary)' : 'var(--k-border)'}`,
            background: isActive ? 'var(--k-primary)' : '#fff',
            color: isActive ? '#fff' : 'var(--k-text)',
            boxShadow: isActive ? '0 4px 14px rgba(67,56,202,.28)' : 'none',
            display: 'flex', alignItems: 'center', gap: 9
          }}>
            Lớp {cls}
            {liveCount > 0 &&
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: isActive ? 'rgba(255,255,255,.25)' : 'var(--k-green-l)',
              color: isActive ? '#fff' : 'var(--k-green-d)',
              fontSize: 11, fontWeight: 900, borderRadius: 99, padding: '2px 8px'
            }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? '#fff' : 'var(--k-green)', display: 'inline-block' }}></span>
                {liveCount}
              </span>
            }
          </button>);

      })}
    </div>);

}

/* ═══════════════ GROUP CARD ═══════════════ */
function GroupCard({ group, totalQs }) {
  const { status, progress, members, name, score } = group;
  const currentQ = status === 'active' ? Math.max(1, Math.round(progress / 100 * totalQs)) : 0;

  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '15px 16px', transition: 'all .3s',
      border: `1.5px solid ${status === 'active' ? 'var(--k-green)' : status === 'done' ? '#a7f3d0' : 'var(--k-border)'}`,
      boxShadow: status === 'active' ? '0 4px 18px rgba(16,185,129,.13)' : 'var(--k-shadow)'
    }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontWeight: 900, fontSize: 14 }}>{name}</span>
        <span style={{
          fontSize: 11.5, fontWeight: 800, padding: '3px 10px', borderRadius: 99,
          display: 'flex', alignItems: 'center', gap: 5,
          background: status === 'active' ? 'var(--k-green-l)' : status === 'done' ? '#d1fae5' : 'var(--k-bg)',
          color: status === 'active' ? 'var(--k-green-d)' : status === 'done' ? '#065f46' : 'var(--k-muted)'
        }}>
          {status === 'active' && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--k-green)', display: 'inline-block' }}></span>}
          {status === 'idle' ? 'Chờ bắt đầu' :
          status === 'active' ? `Câu ${currentQ}/${totalQs}` :
          'Đã nộp ✓'}
        </span>
      </div>

      {/* members */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {members.map((m, i) =>
        <React.Fragment key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: m.c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{m.i}</div>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--k-text)' }}>{m.n}</span>
            </div>
            {i === 0 && <span style={{ color: 'var(--k-muted2)', fontSize: 14, fontWeight: 900, flexShrink: 0 }}>·</span>}
          </React.Fragment>
        )}
      </div>

      {/* progress bar */}
      {status === 'active' &&
      <div style={{ marginTop: 11, height: 6, borderRadius: 99, background: 'var(--k-bg)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--k-green)', borderRadius: 99, transition: 'width .6s ease' }}></div>
        </div>
      }

      {/* score */}
      {status === 'done' && score !== null &&
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: score / totalQs >= 0.7 ? 'var(--k-green)' : 'var(--k-red)' }}>{score}/{totalQs}</span>
          <span style={{ fontSize: 12, color: 'var(--k-muted)', fontWeight: 700 }}>{Math.round(score / totalQs * 100)}%</span>
        </div>
      }
    </div>);

}

/* ═══════════════ LIVE LEADERBOARD ═══════════════ */
function LiveLeaderboard({ clsKey, cls, activeQuiz, onClose }) {
  const totalQs = activeQuiz?.qs || 8;
  const done = cls.groups.filter((g) => g.status === 'done').sort((a, b) => (b.score || 0) - (a.score || 0));
  const going = cls.groups.filter((g) => g.status === 'active');
  const waiting = cls.groups.filter((g) => g.status === 'idle');
  const ranked = [...done, ...going, ...waiting];

  const MEDAL = ['🥇', '🥈', '🥉'];
  const RANK_BG = ['#fef9c3', '#f1f5f9', '#fff7ed'];
  const RANK_BORDER = ['#fbbf24', '#cbd5e1', '#fdba74'];
  const RANK_SCORE = ['#92400e', '#334155', '#9a3412'];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, fontFamily: 'Nunito,sans-serif',
      background: 'var(--k-page)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

      {/* sticky header — matches topbar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(243,245,255,.92)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--k-border)',
        padding: '14px clamp(16px,3vw,36px)',
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 3, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 22 }}>🏆</span>
            <span style={{ fontSize: 'clamp(16px,2vw,20px)', fontWeight: 900, color: 'var(--k-text)', letterSpacing: '-.4px' }}>
              Bảng xếp hạng
            </span>
            <span className="badge bdg-g" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--k-green)', display: 'inline-block' }}></span>
              LIVE
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--k-muted)', fontWeight: 700 }}>
            {activeQuiz?.emoji} {activeQuiz?.title} · Lớp {clsKey} ·{' '}
            <span style={{ color: 'var(--k-green-d)', fontWeight: 800 }}>{done.length}/{cls.groups.length} nhóm đã nộp</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--k-primary)', lineHeight: 1 }}>{Math.round(done.length / cls.groups.length * 100)}%</div>
            <div style={{ fontSize: 11, color: 'var(--k-muted)', fontWeight: 700 }}>hoàn thành</div>
          </div>
          <button onClick={onClose} className="icon-btn" style={{ fontSize: 16 }}>✕</button>
        </div>
      </div>

      {/* overall progress bar */}
      <div style={{ height: 5, background: 'var(--k-bg)', flexShrink: 0 }}>
        <div style={{ height: '100%', width: `${Math.round(done.length / cls.groups.length * 100)}%`,
          background: 'var(--k-green)', transition: 'width .6s' }}></div>
      </div>

      {/* leaderboard rows */}
      <div style={{ flex: 1, padding: 'clamp(14px,2.5vw,32px)', display: 'flex', flexDirection: 'column',
        gap: 10, maxWidth: 820, width: '100%', margin: '0 auto' }}>

        {ranked.map((g) => {
          const isDone = g.status === 'done';
          const isActive = g.status === 'active';
          const doneRank = isDone ? done.findIndex((d) => d.id === g.id) + 1 : null;
          const isTop3 = doneRank && doneRank <= 3;
          const pct = isDone ? Math.round((g.score || 0) / totalQs * 100) : 0;
          const ri = doneRank ? doneRank - 1 : null;

          return (
            <div key={g.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px', borderRadius: 18, transition: 'all .4s',
              background: isTop3 ? RANK_BG[ri] : isDone ? '#fff' : 'var(--k-bg)',
              border: isTop3 ? `2px solid ${RANK_BORDER[ri]}` : '1.5px solid var(--k-border)',
              boxShadow: isTop3 ? 'var(--k-shadow-lg)' : 'var(--k-shadow)',
              opacity: isDone || isActive ? 1 : 0.55
            }}>

              {/* rank */}
              <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isTop3 ? 26 : 16, fontWeight: 900,
                background: isTop3 ? 'rgba(255,255,255,.7)' : 'var(--k-bg)',
                border: `1.5px solid ${isTop3 ? RANK_BORDER[ri] : 'var(--k-border)'}`,
                color: isDone && !isTop3 ? 'var(--k-muted)' : isActive ? 'var(--k-primary)' : 'var(--k-muted2)' }}>
                {isTop3 ? MEDAL[ri] : isDone ? doneRank : isActive ? '▶' : '—'}
              </div>

              {/* members */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: isActive ? 8 : 0, flexWrap: 'wrap' }}>
                  {g.members.map((m, i) =>
                  <React.Fragment key={i}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: m.c, color: '#fff', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>{m.i}</div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--k-text)' }}>{m.n}</span>
                      </div>
                      {i === 0 && <span style={{ color: 'var(--k-muted2)', fontWeight: 900 }}>+</span>}
                    </React.Fragment>
                  )}
                  <span style={{ fontSize: 12, color: 'var(--k-muted2)', fontWeight: 700, marginLeft: 2 }}>{g.name}</span>
                </div>
                {isActive &&
                <>
                    <div style={{ height: 6, borderRadius: 99, background: 'var(--k-bg2)', overflow: 'hidden', maxWidth: 240 }}>
                      <div style={{ height: '100%', width: `${g.progress}%`, borderRadius: 99,
                      background: 'var(--k-primary)', transition: 'width .6s' }}></div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--k-primary)', fontWeight: 800, marginTop: 4 }}>
                      Đang làm · {Math.round(g.progress)}%
                    </div>
                  </>
                }
                {!isDone && !isActive &&
                <div style={{ fontSize: 12, color: 'var(--k-muted2)', fontWeight: 700, marginTop: 2 }}>Chờ bắt đầu...</div>
                }
              </div>

              {/* score */}
              {isDone &&
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 900, lineHeight: 1,
                  color: isTop3 ? RANK_SCORE[ri] : pct >= 70 ? 'var(--k-green-d)' : 'var(--k-red)' }}>
                    {g.score}<span style={{ fontSize: '0.5em', color: 'var(--k-muted)', fontWeight: 700 }}>/{totalQs}</span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 800, marginTop: 3,
                  color: pct >= 70 ? 'var(--k-green-d)' : 'var(--k-red)' }}>{pct}%</div>
                </div>
              }
            </div>);

        })}

        {done.length === 0 && going.length === 0 &&
        <div className="card" style={{ textAlign: 'center', padding: '56px 24px' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>⏳</div>
            <h3 style={{ color: 'var(--k-muted)' }}>Đang chờ học sinh bắt đầu làm bài...</h3>
          </div>
        }
      </div>
    </div>);

}

/* ═══════════════ CLASSES VIEW ═══════════════ */
function ClassesView({ classData, setClassData }) {
  const [activeClass, setActiveClass] = useST(Object.keys(classData)[0]);
  const [assignments, setAssignments] = useST({}); // {cls: quizId}
  const [launching, setLaunching] = useST(null);
  const [showLeaderboard, setShowLeaderboard] = useST(false);
  const timersRef = useRT({});

  const cls = classData[activeClass];
  const activeQuizId = assignments[activeClass];
  const activeQuiz = window.T_QUIZZES.find((q) => q.id === activeQuizId);
  const totalQs = activeQuiz?.qs || 8;

  function simulateProgress(cls, quizQs) {
    const groups = window.T_CLASSES_DATA[cls].groups;
    groups.forEach((g) => {
      const startDelay = Math.random() * 1500;
      const totalMs = 10000 + Math.random() * 14000; // 10–24 s
      const steps = 14;
      const stepMs = totalMs / steps;
      let step = 0;

      const handle = setTimeout(() => {
        const t = setInterval(() => {
          step++;
          const p = Math.min(100, step / steps * 100);
          const done = p >= 100;
          setClassData((prev) => ({
            ...prev,
            [cls]: {
              ...prev[cls],
              groups: prev[cls].groups.map((gr) => gr.id === g.id ? {
                ...gr,
                progress: p,
                status: done ? 'done' : 'active',
                score: done ? Math.floor(quizQs * 0.6) + Math.floor(Math.random() * (quizQs * 0.4 + 1)) : gr.score
              } : gr)
            }
          }));
          if (done) clearInterval(t);
        }, stepMs);
        timersRef.current[`${cls}-${g.id}`] = t;
      }, startDelay);
      timersRef.current[`${cls}-${g.id}-delay`] = handle;
    });
  }

  function startAssignment(quizId) {
    setLaunching(quizId);
    setTimeout(() => {
      setLaunching(null);
      setAssignments((prev) => ({ ...prev, [activeClass]: quizId }));
      setClassData((prev) => ({
        ...prev,
        [activeClass]: {
          ...prev[activeClass],
          groups: prev[activeClass].groups.map((g) => ({ ...g, status: 'active', progress: 0, score: null }))
        }
      }));
      const quiz = window.T_QUIZZES.find((q) => q.id === quizId);
      simulateProgress(activeClass, quiz?.qs || 8);
    }, 700);
  }

  useET(() => () => {
    Object.values(timersRef.current).forEach((t) => {clearInterval(t);clearTimeout(t);});
  }, []);

  const idleCount = cls.groups.filter((g) => g.status === 'idle').length;
  const liveCount = cls.groups.filter((g) => g.status === 'active').length;
  const doneCount = cls.groups.filter((g) => g.status === 'done').length;
  const pendingQuizzes = window.T_QUIZZES.filter((q) => q.status === 'pending');

  return (
    <div className="page-enter">
      <ClassTabs classData={classData} active={activeClass} onChange={setActiveClass} />

      {/* class header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <h1>Lớp {activeClass} 🦋</h1>
          <p style={{ marginTop: 5 }}>{cls.groups.length} nhóm · {cls.groups.length * 2} học sinh · GV: {cls.teacher}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {idleCount > 0 && <span className="badge bdg-a">{idleCount} chờ</span>}
          {liveCount > 0 && <span className="badge bdg-g">● {liveCount} đang làm</span>}
          {doneCount > 0 && <span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>{doneCount} đã nộp</span>}
        </div>
      </div>

      {/* assignment launcher / live status */}
      {!activeQuizId ?
      <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg,#f0f4ff,#e8edff)', border: '1.5px solid #c7d2fe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 22 }}>🎯</span>
            <h3>Giao bài cho lớp {activeClass}</h3>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {pendingQuizzes.map((q) =>
          <button key={q.id} className={`btn ${launching === q.id ? 'btn-s' : 'btn-p'}`}
          style={{ padding: '12px 20px' }} disabled={!!launching}
          onClick={() => startAssignment(q.id)}>
                {launching === q.id ? '⏳ Đang giao...' : `${q.emoji} ${q.title} →`}
              </button>
          )}
            {pendingQuizzes.length === 0 && <p style={{ color: 'var(--k-muted)' }}>Chưa có bài tập nào. Thêm bài trong mục Ngân hàng bài.</p>}
          </div>
        </div> :

      <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', border: '1.5px solid var(--k-green)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 36 }}>{activeQuiz?.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 16, color: 'var(--k-green-d)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--k-green)', display: 'inline-block' }}></span>
                Đang chạy: {activeQuiz?.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--k-green-d)', opacity: .8, marginTop: 3, fontWeight: 700 }}>
                {doneCount}/{cls.groups.length} nhóm đã nộp · {cls.groups.length * 2} học sinh
              </div>
            </div>
            <button className="btn" onClick={() => setShowLeaderboard(true)}
          style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', color: '#fde68a',
            border: 'none', padding: '11px 18px', fontSize: 14, gap: 7, flexShrink: 0,
            boxShadow: '0 4px 16px rgba(49,46,129,.35)' }}>
              🏆 Bảng xếp hạng
            </button>
          </div>
          <div style={{ marginTop: 14, height: 8, borderRadius: 99, background: 'rgba(16,185,129,.2)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round(doneCount / cls.groups.length * 100)}%`, background: 'var(--k-green)', borderRadius: 99, transition: 'width .6s' }}></div>
          </div>
        </div>
      }

      {showLeaderboard && activeQuizId &&
      <LiveLeaderboard
        clsKey={activeClass}
        cls={cls}
        activeQuiz={activeQuiz}
        onClose={() => setShowLeaderboard(false)} />

      }

      {/* groups grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 13 }}>
        {cls.groups.map((g) => <GroupCard key={g.id} group={g} totalQs={totalQs} />)}
      </div>
    </div>);

}

/* ═══════════════ QUIZ BANK VIEW ═══════════════ */
function TeacherQuizzesView() {
  return (
    <div className="page-enter">
      <h1 style={{ marginBottom: 6 }}>Ngân hàng bài tập 📝</h1>
      <p style={{ marginBottom: 22 }}>Danh sách bài kiểm tra có thể giao cho lớp</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
        {window.T_QUIZZES.map((q) =>
        <div key={q.id} className="card qcard">
            <div className="qcard-top">
              <div className="qcard-ico" style={{ background: q.status === 'used' ? '#f3f4f6' : '#e0e7ff' }}>{q.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="qcard-title">{q.title}</div>
                <div className="qcard-meta">
                  <span>📋 {q.qs} câu hỏi</span>
                  <span>⏱ {q.time} phút</span>
                </div>
              </div>
              <span className={`badge ${q.status === 'used' ? 'bdg-g' : 'bdg-a'}`}>
                {q.status === 'used' ? '✓ Đã dùng' : 'Chưa giao'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>);

}

/* ═══════════════ RESULTS VIEW ═══════════════ */
function TeacherResultsView({ classData }) {
  const [activeClass, setActiveClass] = useST(Object.keys(classData)[0]);
  const cls = classData[activeClass];
  const done = cls.groups.filter((g) => g.status === 'done');
  const totalQs = done.length > 0 ? done[0].score !== null ? 8 : 8 : 8;
  const avg = done.length > 0 ? (done.reduce((a, g) => a + (g.score || 0), 0) / done.length).toFixed(1) : null;

  return (
    <div className="page-enter">
      <ClassTabs classData={classData} active={activeClass} onChange={setActiveClass} />
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <h1>Kết quả 🏆</h1>
          <p style={{ marginTop: 5 }}>{done.length} nhóm đã nộp bài · Lớp {activeClass}</p>
        </div>
        {avg &&
        <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ textAlign: 'center', padding: '10px 20px', borderRadius: 14, background: 'var(--k-primary-l)' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--k-primary)' }}>{avg}</div>
              <div style={{ fontSize: 12, color: 'var(--k-muted)', fontWeight: 700 }}>Điểm TB</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px 20px', borderRadius: 14, background: 'var(--k-green-l)' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--k-green-d)' }}>{Math.round(done.filter((g) => (g.score || 0) / 8 >= 0.6).length / Math.max(done.length, 1) * 100)}%</div>
              <div style={{ fontSize: 12, color: 'var(--k-muted)', fontWeight: 700 }}>Tỷ lệ đạt</div>
            </div>
          </div>
        }
      </div>

      {done.length === 0 ?
      <div className="card" style={{ textAlign: 'center', padding: '52px 24px' }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>📋</div>
          <h3 style={{ color: 'var(--k-muted)' }}>Chưa có nhóm nào nộp bài</h3>
          <p style={{ marginTop: 8 }}>Giao bài từ trang Lớp &amp; Nhóm để bắt đầu.</p>
        </div> :

      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {[...done].sort((a, b) => (b.score || 0) - (a.score || 0)).map((g, rank) =>
        <div key={g.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
            width: 42, height: 42, borderRadius: 13, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 18,
            background: rank === 0 ? '#fef3c7' : rank === 1 ? '#f1f5f9' : rank === 2 ? '#fff7f0' : 'var(--k-bg)',
            color: rank === 0 ? '#92400e' : rank === 1 ? '#374151' : rank === 2 ? '#c2410c' : 'var(--k-muted)'
          }}>
                {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : rank + 1}
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                {g.members.map((m, i) =>
            <React.Fragment key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: m.c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>{m.i}</div>
                      <span style={{ fontSize: 13.5, fontWeight: 800 }}>{m.n}</span>
                    </div>
                    {i === 0 && <span style={{ color: 'var(--k-muted2)', fontWeight: 900 }}>+</span>}
                  </React.Fragment>
            )}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: (g.score || 0) / 8 >= 0.6 ? 'var(--k-green)' : 'var(--k-red)' }}>{g.score}/{8}</div>
                <div style={{ fontSize: 12, color: 'var(--k-muted)', fontWeight: 700 }}>{Math.round((g.score || 0) / 8 * 100)}%</div>
              </div>
            </div>
        )}
        </div>
      }
    </div>);

}

/* ═══════════════ DASHBOARD SHELL ═══════════════ */
function TeacherDashboard({ teacher }) {
  const [view, setView] = useST('classes');
  const [drawer, setDrawer] = useST(false);
  const [classData, setClassData] = useST(freshClasses);

  const views = {
    classes: <ClassesView classData={classData} setClassData={setClassData} />,
    quizzes: <TeacherQuizzesView />,
    results: <TeacherResultsView classData={classData} />
  };

  return (
    <div className={`shell ${drawer ? 'drawer-open' : ''}`}>
      <TeacherSidebar view={view} setView={setView} teacher={teacher} onClose={() => setDrawer(false)} />
      <div className="scrim" onClick={() => setDrawer(false)}></div>
      <div className="main">
        <header className="topbar">
          <button className="hamburger" onClick={() => setDrawer(true)}>☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontWeight: 900, fontSize: 15, color: 'var(--k-text)' }}>Trang quản lý</span>
            <span className="badge" style={{ background: 'var(--k-green-l)', color: 'var(--k-green-d)' }}>Giáo viên</span>
          </div>
          <div className="top-actions" style={{ marginLeft: 'auto' }}>
            <button className="icon-btn">🔔<span className="dot"></span></button>
            <div className="top-av" style={{ background: 'var(--k-green)', fontSize: 20 }}>👩‍🏫</div>
          </div>
        </header>
        <div className="content">{views[view]}</div>
      </div>
    </div>);

}

/* ═══════════════ APP ROOT ═══════════════ */
function TeacherApp() {
  const [teacher, setTeacher] = useST(null);
  if (!teacher) return <TeacherLoginScreen onLogin={setTeacher} />;
  return <TeacherDashboard teacher={teacher} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<TeacherApp />);