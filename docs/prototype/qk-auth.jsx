/* ═══════════════ EnglishQuiz — Auth & Onboarding screens ═══════════════ */
const { useState: useStateA, useEffect: useEffectA } = React;

/* ── shared data ── */
const PROVINCES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Bình Dương', 'Đồng Nai', 'Nghệ An', 'Thanh Hóa', 'An Giang'];
const SCHOOLS = {
  'Hà Nội': ['TH Nguyễn Du', 'TH Lê Văn Tám', 'TH Chu Văn An', 'TH Trưng Vương'],
  'TP. Hồ Chí Minh': ['TH Trần Hưng Đạo', 'TH Lý Tự Trọng', 'TH Đinh Tiên Hoàng'],
  default: ['TH Nguyễn Du', 'TH Lê Văn Tám', 'TH Trần Quốc Toản']
};
const GRADES = [
{ n: 1, emoji: '🦊', bg: '#fee2e2', fg: '#991b1b', label: 'Khối 1' },
{ n: 2, emoji: '🐸', bg: '#d1fae5', fg: '#065f46', label: 'Khối 2' },
{ n: 3, emoji: '🦋', bg: '#dbeafe', fg: '#1e40af', label: 'Khối 3' },
{ n: 4, emoji: '🦁', bg: '#fef3c7', fg: '#92400e', label: 'Khối 4' },
{ n: 5, emoji: '🦅', bg: '#ede9fe', fg: '#5b21b6', label: 'Khối 5' }];

const CLASSES = { 1: ['1A', '1B', '1C'], 2: ['2A', '2B', '2C'], 3: ['3A', '3B', '3C', '3D'], 4: ['4A', '4B', '4C'], 5: ['5A', '5B'] };
const WAIT_GROUPS = [
{ id: 1, name: 'Minh Anh', initials: 'MA', color: '#4338ca' },
{ id: 2, name: 'Bảo Châu', initials: 'BC', color: '#10b981' },
{ id: 3, name: 'Tuấn Kiệt', initials: 'TK', color: '#f59e0b' }];

/* Groups per class — mirrors tk-data.js but used by student side */
const CLASS_GROUPS = {
  '3A': [
  { id: 1, name: 'Nhóm 1', members: [{ n: 'An Bình', i: 'AB', c: '#4338ca' }, { n: 'Cẩm Ly', i: 'CL', c: '#7c3aed' }] },
  { id: 2, name: 'Nhóm 2', members: [{ n: 'Đức Minh', i: 'ĐM', c: '#10b981' }, { n: 'Gia Hân', i: 'GH', c: '#f59e0b' }] },
  { id: 3, name: 'Nhóm 3', members: [{ n: 'Hoài Anh', i: 'HA', c: '#ef4444' }, { n: 'Khánh Linh', i: 'KL', c: '#0ea5e9' }] },
  { id: 4, name: 'Nhóm 4', members: [{ n: 'Lâm Nhi', i: 'LN', c: '#8b5cf6' }, { n: 'Minh Phúc', i: 'MP', c: '#ec4899' }] },
  { id: 5, name: 'Nhóm 5', members: [{ n: 'Ngọc Hà', i: 'NH', c: '#14b8a6' }, { n: 'Phú Quý', i: 'PQ', c: '#f97316' }] },
  { id: 6, name: 'Nhóm 6', members: [{ n: 'Quỳnh Anh', i: 'QA', c: '#6366f1' }, { n: 'Sơn Ca', i: 'SC', c: '#22c55e' }] },
  { id: 7, name: 'Nhóm 7', members: [{ n: 'Thiện Nhân', i: 'TN', c: '#a855f7' }, { n: 'Uyên Thy', i: 'UT', c: '#f59e0b' }] },
  { id: 8, name: 'Nhóm 8', members: [{ n: 'Văn Khoa', i: 'VK', c: '#3b82f6' }, { n: 'Xuân Thi', i: 'XT', c: '#84cc16' }] }],

  '3B': [
  { id: 1, name: 'Nhóm 1', members: [{ n: 'Bảo Anh', i: 'BA', c: '#4338ca' }, { n: 'Chi Mai', i: 'CM', c: '#10b981' }] },
  { id: 2, name: 'Nhóm 2', members: [{ n: 'Duy Khang', i: 'DK', c: '#f59e0b' }, { n: 'Hồng Nhung', i: 'HN', c: '#ef4444' }] },
  { id: 3, name: 'Nhóm 3', members: [{ n: 'Khánh Ly', i: 'KY', c: '#8b5cf6' }, { n: 'Long Vũ', i: 'LV', c: '#0ea5e9' }] },
  { id: 4, name: 'Nhóm 4', members: [{ n: 'Minh Tú', i: 'MT', c: '#ec4899' }, { n: 'Nam Khánh', i: 'NK', c: '#14b8a6' }] },
  { id: 5, name: 'Nhóm 5', members: [{ n: 'Oanh Yến', i: 'OY', c: '#f97316' }, { n: 'Phước Lộc', i: 'PL', c: '#6366f1' }] },
  { id: 6, name: 'Nhóm 6', members: [{ n: 'Quốc Bảo', i: 'QB', c: '#a855f7' }, { n: 'Thùy Linh', i: 'TL', c: '#22c55e' }] },
  { id: 7, name: 'Nhóm 7', members: [{ n: 'Vân Khánh', i: 'VKh', c: '#3b82f6' }, { n: 'Xuân Mai', i: 'XM', c: '#84cc16' }] }],

  '3C': [
  { id: 1, name: 'Nhóm 1', members: [{ n: 'Ánh Tuyết', i: 'AT', c: '#4338ca' }, { n: 'Bình An', i: 'BN', c: '#10b981' }] },
  { id: 2, name: 'Nhóm 2', members: [{ n: 'Chánh Tín', i: 'CT', c: '#f59e0b' }, { n: 'Diệu Linh', i: 'DL', c: '#ef4444' }] },
  { id: 3, name: 'Nhóm 3', members: [{ n: 'Gia Bảo', i: 'GB', c: '#8b5cf6' }, { n: 'Hà My', i: 'HM', c: '#0ea5e9' }] },
  { id: 4, name: 'Nhóm 4', members: [{ n: 'Khoa Thi', i: 'KT', c: '#ec4899' }, { n: 'Lệ Uyên', i: 'LU', c: '#14b8a6' }] },
  { id: 5, name: 'Nhóm 5', members: [{ n: 'Minh Châu', i: 'MC', c: '#f97316' }, { n: 'Nguyên Khôi', i: 'NK2', c: '#6366f1' }] },
  { id: 6, name: 'Nhóm 6', members: [{ n: 'Phương Linh', i: 'PhL', c: '#a855f7' }, { n: 'Quốc Huy', i: 'QH', c: '#22c55e' }] },
  { id: 7, name: 'Nhóm 7', members: [{ n: 'Tâm Anh', i: 'TA', c: '#3b82f6' }, { n: 'Uyên Nhi', i: 'UN', c: '#84cc16' }] },
  { id: 8, name: 'Nhóm 8', members: [{ n: 'Vinh Khang', i: 'VKg', c: '#f59e0b' }, { n: 'Yến Ngọc', i: 'YN', c: '#7c3aed' }] }],

  '3D': [
  { id: 1, name: 'Nhóm 1', members: [{ n: 'Anh Dũng', i: 'AD', c: '#4338ca' }, { n: 'Bảo Linh', i: 'BL', c: '#10b981' }] },
  { id: 2, name: 'Nhóm 2', members: [{ n: 'Cam Thảo', i: 'CaT', c: '#f59e0b' }, { n: 'Đan Trường', i: 'ĐT', c: '#ef4444' }] },
  { id: 3, name: 'Nhóm 3', members: [{ n: 'Hải Đăng', i: 'HĐ', c: '#8b5cf6' }, { n: 'Ích Lợi', i: 'IL', c: '#0ea5e9' }] },
  { id: 4, name: 'Nhóm 4', members: [{ n: 'Kỳ Nam', i: 'KN', c: '#ec4899' }, { n: 'Lưu Ly', i: 'LL', c: '#14b8a6' }] },
  { id: 5, name: 'Nhóm 5', members: [{ n: 'Mỹ Hạnh', i: 'MH', c: '#f97316' }, { n: 'Nhã Uyên', i: 'NU', c: '#6366f1' }] },
  { id: 6, name: 'Nhóm 6', members: [{ n: 'Phong Vũ', i: 'PV', c: '#a855f7' }, { n: 'Quý Phong', i: 'QPh', c: '#22c55e' }] }]

};


/* ═══════════════ WELCOME ═══════════════ */
function WelcomeScreen({ go }) {
  return (
    <div className="centerpage welcome-bg">
      <div style={{ textAlign: 'center', maxWidth: 520, width: '100%' }}>
        <div style={{ fontSize: 'clamp(80px,12vw,120px)', marginBottom: 8, filter: 'drop-shadow(0 10px 30px rgba(0,0,0,.35))' }}>🦉</div>
        <div style={{ fontSize: 'clamp(40px,6vw,58px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1.1 }}>
          AMES<span style={{ color: '#fde68a' }}> ENGLISH</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 'clamp(15px,2vw,19px)', marginTop: 12, marginBottom: 36, fontWeight: 600 }}>
          Học tiếng Anh cùng bạn bè! 🌟
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-w" style={{ fontSize: 17, padding: '16px 32px' }} onClick={() => go('onboarding')}>
            Bắt đầu ngay! →
          </button>
        </div>
        <div style={{ display: 'flex', gap: 22, marginTop: 40, justifyContent: 'center' }}>
          {['🏆', '⭐', '📚', '✨', '🎯'].map((e, i) => <span key={i} style={{ fontSize: 28, opacity: .55 }}>{e}</span>)}
        </div>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, marginTop: 26 }}>Dành cho học sinh tiểu học · Lớp 1 – 5</p>
      </div>
    </div>);

}

/* ═══════════════ LOGIN ═══════════════ */
function LoginScreen({ go, setUD }) {
  const [step, setStep] = useStateA(0);
  const [province, setProvince] = useStateA('');
  const [school, setSchool] = useStateA('');
  const [password, setPassword] = useStateA('');
  const [code, setCode] = useStateA('');
  const [search, setSearch] = useStateA('');
  const [err, setErr] = useStateA('');
  const [loading, setLoading] = useStateA(false);

  const prov = PROVINCES.filter((p) => p.toLowerCase().includes(search.toLowerCase()));
  const schs = SCHOOLS[province] || SCHOOLS.default;
  const stepLabels = ['Tỉnh/TP', 'Trường học', 'Đăng nhập'];

  function pickProvince(p) {setProvince(p);setSearch('');setStep(1);}
  function pickSchool(s) {setSchool(s);setStep(2);}
  function doLogin() {
    if (!password) {setErr('Em chưa nhập mật khẩu!');return;}
    if (!code) {setErr('Em chưa nhập mã học sinh!');return;}
    setLoading(true);
    setTimeout(() => {setLoading(false);setUD({ province, school, code });go('onboarding');}, 1200);
  }

  return (
    <div className="centerpage" style={{ background: 'var(--k-page)' }}>
      <div className="cp-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <button className="back-btn" onClick={() => {if (step === 0) go('welcome');else setStep((s) => s - 1);}}>←</button>
          <div>
            <div style={{ fontWeight: 900, fontSize: 19 }}>Đăng nhập</div>
            <p style={{ fontSize: 12.5 }}>Bước {step + 1}/3 · {stepLabels[step]}</p>
          </div>
        </div>

        <div className="steps" style={{ marginBottom: 22 }}>
          {stepLabels.map((lbl, i) =>
          <div key={i} className="s-node" style={{ flex: i < 2 ? 1 : 'none' }}>
              <div className={`s-dot ${i < step ? 'done' : i === step ? 'curr' : 'idle'}`}>{i < step ? '✓' : i + 1}</div>
              {i < 2 && <div className={`s-line ${i < step ? 'done' : ''}`} />}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {step === 0 && <>
            <h2>Em ở tỉnh/thành phố nào? 🗺️</h2>
            <input className="inp" placeholder="🔍  Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
              {prov.map((p) => <button key={p} className={`sel-item ${province === p ? 'active' : ''}`} onClick={() => pickProvince(p)}>🏙️ {p}</button>)}
            </div>
          </>}

          {step === 1 && <>
            <h2>Chọn trường của em 🏫</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 15px', borderRadius: 13, background: 'var(--k-primary-l)' }}>
              <span>📍</span><span style={{ fontWeight: 800, fontSize: 14, color: 'var(--k-primary)' }}>{province}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {schs.map((s) => <button key={s} className={`sel-item ${school === s ? 'active' : ''}`} onClick={() => pickSchool(s)}>🏫 {s}</button>)}
            </div>
          </>}

          {step === 2 && <>
            <h2>Nhập mật khẩu 🔐</h2>
            <div style={{ display: 'flex', gap: 11, padding: '13px 15px', borderRadius: 14, background: 'var(--k-primary-l)', alignItems: 'center' }}>
              <span style={{ fontSize: 24 }}>🏫</span>
              <div>
                <div style={{ fontWeight: 900, fontSize: 14.5, color: 'var(--k-text)' }}>{school}</div>
                <div style={{ fontSize: 12.5, color: 'var(--k-muted)' }}>{province}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ fontWeight: 800, fontSize: 14, color: 'var(--k-text)' }}>Mật khẩu trường 🔑</label>
              <input className="inp" type="password" placeholder="Mật khẩu do thầy/cô cấp..." value={password} onChange={(e) => {setPassword(e.target.value);setErr('');}} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ fontWeight: 800, fontSize: 14, color: 'var(--k-text)' }}>Mã học sinh 🪪</label>
              <input className="inp" placeholder="VD: HS001234" value={code} onChange={(e) => {setCode(e.target.value.toUpperCase());setErr('');}} />
            </div>
            {err && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 15px', borderRadius: 12, background: 'var(--k-red-l)', color: 'var(--k-red-d)', fontWeight: 800, fontSize: 14 }}>⚠️ {err}</div>}
            <button className="btn btn-p btn-block" style={{ marginTop: 4, padding: '15px' }} onClick={doLogin} disabled={loading}>
              {loading ? <><svg width="20" height="20" viewBox="0 0 20 20" className="spin"><circle cx="10" cy="10" r="7" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2.5" /><path d="M10 3a7 7 0 0 1 7 7" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></svg> Đang đăng nhập...</> : 'Đăng nhập →'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 13 }}>💡 Thầy/cô sẽ cho em mật khẩu</p>
          </>}
        </div>
      </div>
    </div>);

}

/* ═══════════════ ONBOARDING (grade → class → group) ═══════════════ */
function OnboardingScreen({ go, ud, setSession }) {
  const [phase, setPhase] = useStateA('grade'); // grade | class | group
  const [grade, setGrade] = useStateA(null);
  const [cls, setCls] = useStateA('');
  const g = GRADES.find((x) => x.n === grade) || GRADES[2];
  const clsList = CLASSES[grade] || CLASSES[3];

  return (
    <div className="centerpage" style={{ background: 'var(--k-page)' }}>
      <div className="cp-card" style={{ maxWidth: phase === 'grade' ? 540 : 480 }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          {phase !== 'grade' && <button className="back-btn" onClick={() => setPhase(phase === 'group' ? 'class' : 'grade')}>←</button>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: 'var(--k-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21 }}>🦉</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, color: 'var(--k-text)' }}>AMESEnglish</div>
              <div style={{ fontSize: 12, color: 'var(--k-muted)' }}>
                {phase === 'grade' ? 'Chọn khối lớp' : phase === 'class' ? `Khối ${grade}` : `Lớp ${cls} · Khối ${grade}`}
              </div>
            </div>
          </div>
        </div>

        {phase === 'grade' && <>
          <h1>Em học lớp mấy? 📖</h1>
          <p style={{ marginTop: 5, marginBottom: 18 }}>Chọn khối lớp để bắt đầu học nhé!</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {GRADES.map((gr) =>
            <button key={gr.n} className="grade-btn" style={{ background: gr.bg, color: gr.fg,
              border: `2.5px solid ${grade === gr.n ? gr.fg : 'transparent'}`,
              gridColumn: gr.n === 4 ? 'span 1' : gr.n === 5 ? 'span 2' : 'auto' }}
            onClick={() => {setGrade(gr.n);setTimeout(() => setPhase('class'), 140);}}>
                <span style={{ fontSize: 40 }}>{gr.emoji}</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 21, fontWeight: 900 }}>Lớp {gr.n}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, opacity: .75 }}>{gr.label}</span>
                </div>
              </button>
            )}
          </div>
        </>}

        {phase === 'class' && <>
          <h2>Chọn lớp {g.emoji}</h2>
          <p style={{ marginTop: 4, marginBottom: 16 }}>Khối {grade} · Năm học 2025–2026</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {clsList.map((c) =>
            <button key={c} onClick={() => {setCls(c);setTimeout(() => setPhase('group'), 140);}} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 16,
              border: `2px solid ${cls === c ? 'var(--k-primary)' : 'var(--k-border)'}`, background: '#fff', cursor: 'pointer', transition: 'all .12s', fontFamily: 'Nunito,sans-serif' }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: g.bg, color: g.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900 }}>{g.emoji}</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 900, fontSize: 16, color: 'var(--k-text)' }}>Lớp {c}</div>
                  <div style={{ fontSize: 12, color: 'var(--k-muted)' }}>Năm học 2025–2026</div>
                </div>
                <span style={{ color: 'var(--k-primary)', fontSize: 20 }}>›</span>
              </button>
            )}
          </div>
        </>}

        {phase === 'group' && <>
          <h2>Chọn nhóm của em 👥</h2>
          <p style={{ marginTop: 4, marginBottom: 18 }}>Lớp {cls} · Cả nhóm dùng chung máy này</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CLASS_GROUPS[cls] ? CLASS_GROUPS[cls].map((grp) =>
            <button key={grp.id} onClick={() => {const pm=grp.members[1];setSession({ grade, cls, partner: { name: pm.n, initials: pm.i, color: pm.c } });go('dashboard');}}
            style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderRadius: 16,
              border: '2px solid var(--k-border)', background: '#fff', cursor: 'pointer',
              transition: 'all .12s', fontFamily: 'Nunito,sans-serif', textAlign: 'left' }}
            onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'var(--k-primary)';e.currentTarget.style.background = 'var(--k-primary-l)';}}
            onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'var(--k-border)';e.currentTarget.style.background = '#fff';}}>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {grp.members.map((m, i) =>
                <div key={i} style={{ width: 38, height: 38, borderRadius: 11, background: m.c, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>{m.i}</div>
                )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: 15, color: 'var(--k-text)' }}>{grp.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--k-muted)' }}>{grp.members.map((m) => m.n).join(' · ')}</div>
                </div>
                <span style={{ color: 'var(--k-primary)', fontSize: 20, flexShrink: 0 }}>›</span>
              </button>
            ) : [1, 2, 3, 4, 5].map((n) =>
            <button key={n} onClick={() => {setSession({ grade, cls, partner: { name: 'Minh Anh', initials: 'MA', color: '#10b981' } });go('dashboard');}}
            style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderRadius: 16,
              border: '2px solid var(--k-border)', background: '#fff', cursor: 'pointer',
              transition: 'all .12s', fontFamily: 'Nunito,sans-serif' }}
            onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'var(--k-primary)';e.currentTarget.style.background = 'var(--k-primary-l)';}}
            onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'var(--k-border)';e.currentTarget.style.background = '#fff';}}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: 'var(--k-primary-l)', color: 'var(--k-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, flexShrink: 0 }}>{n}</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 900, fontSize: 15, color: 'var(--k-text)' }}>Nhóm {n}</div>
                  <div style={{ fontSize: 12, color: 'var(--k-muted)' }}>Lớp {cls}</div>
                </div>
                <span style={{ color: 'var(--k-primary)', fontSize: 20 }}>›</span>
              </button>
            )}
          </div>
        </>}
      </div>
    </div>);

}

Object.assign(window, { WelcomeScreen, LoginScreen, OnboardingScreen, GRADES, CLASSES, WAIT_GROUPS, PROVINCES, SCHOOLS });