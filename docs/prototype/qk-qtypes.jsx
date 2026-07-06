/* ═══════════════ EnglishQuiz — Question Type Renderers ═══════════════ */
const {useState:useSQT, useEffect:useEQT, useRef:useRQT, useMemo:useMQT} = React;

/* ── TTS helper ── */
function speak(text, rate=0.85) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; u.rate = rate; u.pitch = 1.05;
  speechSynthesis.speak(u);
}

/* ── deterministic shuffle per question ── */
function hashStr(s){let h=0;for(const c of s){h=(h<<5)-h+c.charCodeAt(0);h|=0;}return Math.abs(h);}
function seededShuffle(len, seed){
  const a=Array.from({length:len},(_,i)=>i); let s=seed;
  for(let i=len-1;i>0;i--){s=(s*9301+49297)%233280;const j=Math.floor(s/233280*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

/* ── shared multiple-choice option button ── */
function OptBtn({i, sel, onSel, children}) {
  return (
    <button className={`opt-btn ${sel?'mine':'none'}`} onClick={()=>onSel(i)}>
      <div className="opt-letter" style={{background:sel?'var(--k-primary)':'var(--k-bg2)',color:sel?'#fff':'var(--k-muted)'}}>{window.L[i]}</div>
      <span style={{flex:1}}>{children}</span>
      {sel && <span style={{fontSize:17}}>✅</span>}
    </button>
  );
}

/* ════════ 1. IMAGE → TEXT ════════ */
function ImageChoiceQ({q, answer, onAnswer}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div className="card" style={{textAlign:'center',padding:'28px 24px'}}>
        <div style={{fontSize:90,lineHeight:1,marginBottom:14}}>{q.image}</div>
        <p style={{fontSize:'clamp(16px,2vw,21px)',fontWeight:800,color:'var(--k-text)'}}>{q.question}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {q.opts.map((o,i) => <OptBtn key={i} i={i} sel={answer===i} onSel={onAnswer}>{o}</OptBtn>)}
      </div>
    </div>
  );
}

/* ════════ 2. WORD → IMAGE ════════ */
function WordImageQ({q, answer, onAnswer}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div className="card" style={{textAlign:'center',padding:'22px 24px'}}>
        <div style={{fontSize:'clamp(30px,5vw,50px)',fontWeight:900,color:'var(--k-primary)',letterSpacing:3,marginBottom:6}}>{q.word}</div>
        <p style={{fontSize:14,color:'var(--k-muted)',fontWeight:700}}>{q.question}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {q.opts.map((em,i) => (
          <button key={i} onClick={()=>onAnswer(i)} style={{
            background:answer===i?'var(--k-primary-l)':'#fff',
            border:`2.5px solid ${answer===i?'var(--k-primary)':'var(--k-border)'}`,
            borderRadius:18,padding:'18px 12px',cursor:'pointer',
            fontFamily:'Nunito,sans-serif',display:'flex',flexDirection:'column',
            alignItems:'center',gap:7,transition:'all .13s',
          }}>
            <span style={{fontSize:50,lineHeight:1}}>{em}</span>
            <div style={{display:'flex',alignItems:'center',gap:5}}>
              <span style={{width:22,height:22,borderRadius:6,background:answer===i?'var(--k-primary)':'var(--k-bg2)',color:answer===i?'#fff':'var(--k-muted)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,flex:'none'}}>{window.L[i]}</span>
              <span style={{fontSize:12.5,fontWeight:800,color:'var(--k-text)'}}>{q.optLabels[i]}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ════════ 3. AUDIO → TEXT ════════ */
function AudioChoiceQ({q, answer, onAnswer}) {
  const [playing,setPlaying] = useSQT(false);
  const [played,setPlayed]   = useSQT(false);
  function play() {
    setPlaying(true); setPlayed(true);
    speak(q.audioWord||q.word, 0.72);
    setTimeout(()=>setPlaying(false), 2200);
  }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div className="card" style={{textAlign:'center',padding:'26px 24px'}}>
        <button onClick={play} style={{
          width:82,height:82,borderRadius:'50%',border:'none',cursor:'pointer',
          background:playing?'var(--k-green)':'var(--k-primary)',
          display:'flex',alignItems:'center',justifyContent:'center',
          margin:'0 auto 12px',transition:'all .2s',fontSize:32,
          boxShadow:playing?'0 0 0 16px rgba(16,185,129,.18)':'0 6px 22px rgba(67,56,202,.32)',
        }}>{playing?'🔊':'▶️'}</button>
        <p style={{fontSize:12.5,fontWeight:800,color:'var(--k-muted)',marginBottom:8}}>
          {played?'Nhấn để nghe lại':'👆 Nhấn để nghe'}
        </p>
        <p style={{fontSize:'clamp(15px,2vw,19px)',fontWeight:800,color:'var(--k-text)'}}>{q.question}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {q.opts.map((o,i) => <OptBtn key={i} i={i} sel={answer===i} onSel={onAnswer}>{o}</OptBtn>)}
      </div>
    </div>
  );
}

/* ════════ 4. VIDEO → TEXT ════════ */
function VideoChoiceQ({q, answer, onAnswer}) {
  const [playing,setPlaying] = useSQT(false);
  const [watched,setWatched] = useSQT(false);
  function play() {
    setPlaying(true); setWatched(true);
    if (q.audioDesc) speak(q.audioDesc, 0.82);
    setTimeout(()=>setPlaying(false), 3200);
  }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={{borderRadius:18,overflow:'hidden',border:'1.5px solid var(--k-border)',cursor:'pointer'}} onClick={play}>
        <div style={{aspectRatio:'16/9',background:'#0a0a1a',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
          <div style={{fontSize:80,filter:playing?'drop-shadow(0 0 22px #fde68a)':'none',transition:'filter .4s'}}>{q.videoEmoji||'🎬'}</div>
          {!playing && (
            <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.38)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(255,255,255,.92)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>▶</div>
            </div>
          )}
          {playing && (
            <div style={{position:'absolute',bottom:0,left:0,right:0,height:4,background:'rgba(255,255,255,.15)'}}>
              <div style={{height:'100%',background:'var(--k-red)',animation:'vidprog 3.2s linear forwards',borderRadius:99}}></div>
            </div>
          )}
        </div>
        <div style={{padding:'9px 14px',background:'#1a1a2e',color:'rgba(255,255,255,.65)',fontSize:13,fontWeight:700}}>
          {watched?`▶ ${q.videoTitle}`:`⏸ ${q.videoTitle} — nhấn để xem`}
        </div>
      </div>
      <div className="card" style={{padding:'12px 16px'}}>
        <p style={{fontSize:'clamp(15px,2vw,18px)',fontWeight:800,color:'var(--k-text)'}}>{q.question}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {q.opts.map((o,i) => <OptBtn key={i} i={i} sel={answer===i} onSel={onAnswer}>{o}</OptBtn>)}
      </div>
    </div>
  );
}

/* ════════ 5. PRONUNCIATION ════════ */
function PronunciationQ({q, answer, onAnswer}) {
  const [st,setSt]           = useSQT(typeof answer==='number'?'done':'idle');
  const [transcript,setTr]   = useSQT('');
  const [score,setScore]     = useSQT(typeof answer==='number'?answer:null);
  const recRef               = useRQT(null);
  const word                 = q.word;

  function listen() {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setSt('listening');
      setTimeout(()=>{ const s=65+Math.floor(Math.random()*28); setScore(s); setTr(word); setSt('done'); onAnswer(s); }, 2000);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR(); rec.lang='en-US'; rec.interimResults=false; rec.maxAlternatives=3;
    recRef.current = rec; setSt('listening'); rec.start();
    rec.onresult = e => {
      const best = e.results[0][0];
      const heard = best.transcript.toLowerCase().trim();
      const match = heard===word.toLowerCase() || heard.includes(word.toLowerCase());
      const s = match ? Math.max(68, Math.round(best.confidence*100)) : Math.round(best.confidence*52);
      setTr(best.transcript); setScore(s); setSt('done'); onAnswer(s);
    };
    rec.onerror = () => setSt('error');
  }
  function retry() { setSt('idle'); setScore(null); setTr(''); onAnswer(undefined); }

  const sc  = score||0;
  const col = sc>=80?'var(--k-green-d)':sc>=60?'#92400e':'var(--k-red-d)';
  const bg  = sc>=80?'var(--k-green-l)':sc>=60?'var(--k-gold-l)':'var(--k-red-l)';
  const bdr = sc>=80?'var(--k-green)':sc>=60?'var(--k-gold)':'var(--k-red)';

  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div className="card" style={{textAlign:'center',padding:'26px 24px'}}>
        <div style={{fontSize:11,fontWeight:800,color:'var(--k-muted)',textTransform:'uppercase',letterSpacing:2,marginBottom:8}}>Phát âm từ này</div>
        <div style={{fontSize:'clamp(32px,5vw,54px)',fontWeight:900,color:'var(--k-primary)',marginBottom:8}}>{word}</div>
        {q.phonetic && <div style={{fontSize:16,color:'var(--k-muted)',fontWeight:700,marginBottom:6}}>{q.phonetic}</div>}
        {q.hint     && <p style={{fontSize:13,marginBottom:12}}>{q.hint}</p>}
        <button onClick={()=>speak(word,0.68)} style={{padding:'8px 18px',borderRadius:99,border:'1.5px solid var(--k-primary)',background:'var(--k-primary-l)',color:'var(--k-primary)',fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:13,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6}}>
          🔊 Nghe mẫu
        </button>
      </div>
      {st==='done' && score!==null ? (
        <div className="card" style={{textAlign:'center',background:bg,border:`2px solid ${bdr}`}}>
          <div style={{fontSize:44,marginBottom:6}}>{sc>=80?'🌟':sc>=60?'👍':'💪'}</div>
          <div style={{fontSize:32,fontWeight:900,color:col,lineHeight:1}}>{sc}<span style={{fontSize:14,opacity:.7}}>/100</span></div>
          <div style={{fontSize:14,fontWeight:800,color:col,marginTop:5}}>{sc>=80?'Tuyệt vời!':sc>=60?'Khá tốt!':'Luyện thêm nhé!'}</div>
          {transcript && <div style={{fontSize:12,color:col,opacity:.65,marginTop:4}}>Nghe được: "{transcript}"</div>}
          <button onClick={retry} style={{marginTop:12,padding:'8px 18px',borderRadius:12,border:`1.5px solid ${col}`,background:'transparent',color:col,fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:13,cursor:'pointer'}}>🔄 Thử lại</button>
        </div>
      ) : st==='listening' ? (
        <div className="card" style={{textAlign:'center',background:'var(--k-red-l)',border:'2px solid var(--k-red)',padding:'28px 24px'}}>
          <div className="pulse" style={{fontSize:50,marginBottom:8}}>🎤</div>
          <div style={{fontSize:16,fontWeight:900,color:'var(--k-red-d)'}}>Đang lắng nghe...</div>
          <p style={{marginTop:6}}>Hãy nói to: <strong>"{word}"</strong></p>
        </div>
      ) : st==='error' ? (
        <div className="card" style={{textAlign:'center',padding:'20px'}}>
          <p>⚠️ Không truy cập được micro.</p>
          <button className="btn btn-p btn-block" style={{marginTop:12}} onClick={retry}>Thử lại</button>
        </div>
      ) : (
        <button onClick={listen} style={{padding:'22px',borderRadius:20,border:'none',cursor:'pointer',background:'linear-gradient(135deg,var(--k-primary),var(--k-purple))',color:'#fff',fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:17,display:'flex',flexDirection:'column',alignItems:'center',gap:10,boxShadow:'0 8px 26px rgba(67,56,202,.32)',transition:'transform .12s'}}
          onMouseEnter={e=>e.currentTarget.style.transform='scale(1.02)'}
          onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
          <span style={{fontSize:50}}>🎤</span>Nhấn để phát âm
        </button>
      )}
    </div>
  );
}

/* ════════ 6. FILL BLANK ════════ */
function FillBlankQ({q, answer, onAnswer}) {
  const parts = (q.sentence||'').split('___');
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div className="card" style={{textAlign:'center',padding:'26px 24px'}}>
        <div style={{fontSize:54,marginBottom:12,lineHeight:1}}>{q.em||'✏️'}</div>
        <p style={{fontSize:'clamp(17px,2vw,22px)',fontWeight:800,color:'var(--k-text)',lineHeight:1.65}}>
          {parts[0]}
          <span style={{display:'inline-block',minWidth:68,padding:'3px 12px',borderRadius:9,margin:'0 6px',verticalAlign:'middle',fontWeight:900,fontSize:'0.9em',transition:'all .2s',
            background:answer!==undefined?'var(--k-primary)':'var(--k-bg)',
            color:answer!==undefined?'#fff':'var(--k-muted)',
            border:`2px solid ${answer!==undefined?'var(--k-primary)':'var(--k-border)'}`}}>
            {answer!==undefined ? q.opts[answer] : '  ?  '}
          </span>
          {parts[1]}
        </p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {q.opts.map((o,i) => (
          <OptBtn key={i} i={i} sel={answer===i} onSel={onAnswer}>
            <em style={{fontStyle:'normal',fontWeight:900}}>{o}</em>
          </OptBtn>
        ))}
      </div>
    </div>
  );
}

/* ════════ 7. WORD ORDER ════════ */
function WordOrderQ({q, answer, onAnswer}) {
  const built     = Array.isArray(answer) ? answer : [];
  const remaining = q.words.map((_,i)=>i).filter(i=>!built.includes(i));
  const done      = built.length === q.words.length;
  function add(i)    { onAnswer([...built, i]); }
  function remove(p) { const n=[...built]; n.splice(p,1); onAnswer(n.length?n:undefined); }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div className="card" style={{padding:'22px 24px'}}>
        <p style={{fontSize:15,fontWeight:800,color:'var(--k-text)',marginBottom:14}}>{q.question}</p>
        {/* sentence area */}
        <div style={{minHeight:54,padding:'11px 13px',borderRadius:14,marginBottom:14,display:'flex',flexWrap:'wrap',gap:8,alignItems:'center',transition:'all .2s',
          background:done?'var(--k-green-l)':'var(--k-bg)',
          border:`2px solid ${done?'var(--k-green)':'var(--k-border)'}`}}>
          {built.length===0
            ? <span style={{color:'var(--k-muted)',fontWeight:700,fontSize:13}}>Nhấn vào từ bên dưới để xếp câu...</span>
            : built.map((wi,pos) => (
              <button key={pos} onClick={()=>remove(pos)} style={{padding:'7px 12px',borderRadius:10,background:'var(--k-primary)',color:'#fff',fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:14,border:'none',cursor:'pointer'}}
                onMouseEnter={e=>e.currentTarget.style.background='var(--k-red)'}
                onMouseLeave={e=>e.currentTarget.style.background='var(--k-primary)'}>
                {q.words[wi]} ×
              </button>
            ))}
        </div>
        {/* word bank */}
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {remaining.map(i => (
            <button key={i} onClick={()=>add(i)} style={{padding:'9px 14px',borderRadius:12,background:'#fff',color:'var(--k-text)',border:'2px solid var(--k-border)',fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:14,cursor:'pointer',transition:'all .12s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--k-primary)';e.currentTarget.style.background='var(--k-primary-l)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--k-border)';e.currentTarget.style.background='#fff';}}>
              {q.words[i]}
            </button>
          ))}
        </div>
        {done && <div style={{marginTop:12,textAlign:'center',fontSize:13,fontWeight:800,color:'var(--k-green-d)'}}>✅ "{built.map(i=>q.words[i]).join(' ')}"</div>}
      </div>
    </div>
  );
}

/* ════════ 8. MATCHING ════════ */
function MatchingQ({q, answer, onAnswer}) {
  const isDone    = answer && typeof answer.total === 'number';
  const rightOrder = useMQT(()=>seededShuffle(q.pairs.length,hashStr(q.question)),[q.question]);
  const [leftSel,setLeftSel] = useSQT(null);
  const [matched,setMatched] = useSQT({}); // {leftOrigIdx → rightDisplayPos}
  const [wrong,setWrong]     = useSQT(null);
  const matchedRight = Object.values(matched);

  function clickLeft(i)   { if(matched.hasOwnProperty(i)||isDone) return; setLeftSel(leftSel===i?null:i); }
  function clickRight(pos) {
    if(matchedRight.includes(pos)||isDone||leftSel===null) return;
    if(rightOrder[pos]===leftSel){
      const next={...matched,[leftSel]:pos};
      setMatched(next); setLeftSel(null);
      if(Object.keys(next).length===q.pairs.length) onAnswer({score:q.pairs.length,total:q.pairs.length});
    } else {
      setWrong({l:leftSel,r:pos});
      setTimeout(()=>{setWrong(null);setLeftSel(null);},900);
    }
  }

  return (
    <div className="card" style={{padding:'22px 24px'}}>
      <p style={{fontSize:15,fontWeight:800,color:'var(--k-text)',textAlign:'center',marginBottom:14}}>{q.question}</p>
      {leftSel!==null && (
        <div style={{textAlign:'center',fontSize:13,fontWeight:700,color:'var(--k-primary)',marginBottom:12}}>
          👆 Đã chọn "<strong>{q.pairs[leftSel].word}</strong>" — nhấn nghĩa tiếng Việt để nối
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {/* left */}
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div style={{fontSize:11.5,fontWeight:800,color:'var(--k-muted)',textAlign:'center',marginBottom:2}}>🇬🇧 Tiếng Anh</div>
          {q.pairs.map((pair,i) => {
            const isMat=matched.hasOwnProperty(i), isSel=leftSel===i, isW=wrong?.l===i;
            return (
              <button key={i} onClick={()=>clickLeft(i)} style={{
                padding:'11px 14px',borderRadius:13,fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:14,
                cursor:isMat?'default':'pointer',textAlign:'left',width:'100%',transition:'all .15s',
                border:`2px solid ${isW?'var(--k-red)':isMat?'var(--k-green)':isSel?'var(--k-primary)':'var(--k-border)'}`,
                background:isW?'var(--k-red-l)':isMat?'var(--k-green-l)':isSel?'var(--k-primary-l)':'#fff',
                color:'var(--k-text)',
              }}>
                {pair.word} {isMat&&'✓'}
              </button>
            );
          })}
        </div>
        {/* right (shuffled) */}
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div style={{fontSize:11.5,fontWeight:800,color:'var(--k-muted)',textAlign:'center',marginBottom:2}}>🇻🇳 Tiếng Việt</div>
          {rightOrder.map((origIdx,pos) => {
            const isMat=matchedRight.includes(pos), isW=wrong?.r===pos;
            return (
              <button key={pos} onClick={()=>clickRight(pos)} style={{
                padding:'11px 14px',borderRadius:13,fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:14,
                cursor:isMat?'default':'pointer',textAlign:'left',width:'100%',transition:'all .15s',
                border:`2px solid ${isW?'var(--k-red)':isMat?'var(--k-green)':'var(--k-border)'}`,
                background:isW?'var(--k-red-l)':isMat?'var(--k-green-l)':'#fff',
                color:'var(--k-text)',
              }}>
                {q.pairs[origIdx].match} {isMat&&'✓'}
              </button>
            );
          })}
        </div>
      </div>
      {isDone && (
        <div style={{marginTop:14,padding:'11px',borderRadius:12,background:'var(--k-green-l)',textAlign:'center',fontWeight:800,color:'var(--k-green-d)'}}>
          🎉 Nối đúng tất cả {q.pairs.length} cặp!
        </div>
      )}
    </div>
  );
}

/* ════════ 9. TRUE / FALSE ════════ */
function TrueFalseQ({q, answer, onAnswer}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div className="card" style={{textAlign:'center',padding:'28px 24px'}}>
        <div style={{fontSize:60,marginBottom:14,lineHeight:1}}>{q.em||'🤔'}</div>
        <p style={{fontSize:'clamp(16px,2vw,21px)',fontWeight:800,color:'var(--k-text)',lineHeight:1.55}}>{q.statement}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {[{v:0,icon:'✓',lbl:'Đúng',ac:'var(--k-green)',bg:'var(--k-green-l)'},
          {v:1,icon:'✗',lbl:'Sai', ac:'var(--k-red)',  bg:'var(--k-red-l)'}
        ].map(({v,icon,lbl,ac,bg}) => (
          <button key={v} onClick={()=>onAnswer(v)} style={{
            padding:'26px 16px',borderRadius:20,cursor:'pointer',fontFamily:'Nunito,sans-serif',
            border:`3px solid ${answer===v?ac:'var(--k-border)'}`,
            background:answer===v?bg:'#fff',
            fontWeight:900,fontSize:20,transition:'all .15s',
            display:'flex',flexDirection:'column',alignItems:'center',gap:10,
            color:answer===v?ac:'var(--k-text)',
          }}>
            <span style={{fontSize:46}}>{icon}</span>{lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ════════ 10. SPELLING ════════ */
function SpellingQ({q, answer, onAnswer}) {
  const [typed,setTyped] = useSQT(typeof answer==='string'?answer:'');
  const [played,setPlayed] = useSQT(false);
  function play() { speak(q.word, 0.62); setPlayed(true); }
  function handleChange(v) { setTyped(v); onAnswer(v.trim().toLowerCase()||undefined); }
  const correct = typed.trim().toLowerCase() === q.word.toLowerCase() && typed.length>0;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div className="card" style={{textAlign:'center',padding:'26px 24px'}}>
        <div style={{fontSize:52,marginBottom:12}}>{q.em||'🔡'}</div>
        <p style={{fontSize:15,fontWeight:800,color:'var(--k-muted)',marginBottom:16}}>{q.question||'Nghe và viết đúng chính tả:'}</p>
        <button onClick={play} style={{padding:'13px 26px',borderRadius:99,background:played?'var(--k-green)':'var(--k-primary)',color:'#fff',border:'none',fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:15,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:8,boxShadow:'0 5px 18px rgba(67,56,202,.28)'}}>
          🔊 {played?'Nghe lại':'Nghe từ'}
        </button>
      </div>
      <div className="card">
        <label style={{fontWeight:800,fontSize:14,display:'block',marginBottom:8}}>Viết từ bạn vừa nghe:</label>
        <input className="inp" type="text" value={typed} onChange={e=>handleChange(e.target.value)}
          placeholder="Gõ từ vào đây..."
          style={{fontSize:22,fontWeight:900,textAlign:'center',borderColor:typed?(correct?'var(--k-green)':'var(--k-border)'):'var(--k-border)'}}/>
        {typed && (
          <div style={{marginTop:8,textAlign:'center',fontSize:14,fontWeight:800,color:correct?'var(--k-green-d)':'var(--k-muted)'}}>
            {correct?'✅ Chính xác!':'Đang nhập...'}
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════ DISPATCHER ════════ */
function QuestionDisplay({q, answer, onAnswer}) {
  const T = q.type;
  if (T==='image-choice')  return <ImageChoiceQ  q={q} answer={answer} onAnswer={onAnswer}/>;
  if (T==='word-image')    return <WordImageQ    q={q} answer={answer} onAnswer={onAnswer}/>;
  if (T==='audio-choice')  return <AudioChoiceQ  q={q} answer={answer} onAnswer={onAnswer}/>;
  if (T==='video-choice')  return <VideoChoiceQ  q={q} answer={answer} onAnswer={onAnswer}/>;
  if (T==='pronunciation') return <PronunciationQ q={q} answer={answer} onAnswer={onAnswer}/>;
  if (T==='fill-blank')    return <FillBlankQ    q={q} answer={answer} onAnswer={onAnswer}/>;
  if (T==='word-order')    return <WordOrderQ    q={q} answer={answer} onAnswer={onAnswer}/>;
  if (T==='matching')      return <MatchingQ     q={q} answer={answer} onAnswer={onAnswer}/>;
  if (T==='true-false')    return <TrueFalseQ    q={q} answer={answer} onAnswer={onAnswer}/>;
  if (T==='spelling')      return <SpellingQ     q={q} answer={answer} onAnswer={onAnswer}/>;
  return <ImageChoiceQ q={q} answer={answer} onAnswer={onAnswer}/>;
}

Object.assign(window, {QuestionDisplay, speak});
