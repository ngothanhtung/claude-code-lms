/* ═══════════════ EnglishQuiz — Quiz runtime & Result ═══════════════ */
const {useState:useStateQ,useEffect:useEffectQ,useRef:useRefQ} = React;

/* ═══════════════ LOBBY — chờ cả nhóm sẵn sàng ═══════════════ */
function LobbyPhase({quiz,partner,onStart}){
  const [pReady,setPReady]=useStateQ(true);
  const [going,setGoing]=useStateQ(false);

  function handleStart(){setGoing(true);setTimeout(onStart,700);}

  return(
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--k-page)',padding:24}}>
      <div style={{maxWidth:460,width:'100%',display:'flex',flexDirection:'column',gap:20}}>

        {/* quiz info */}
        <div className="card" style={{textAlign:'center',padding:'34px 24px'}}>
          <div style={{fontSize:66,marginBottom:12}}>{quiz?.emoji||'🏫'}</div>
          <h2 style={{fontSize:21}}>{quiz?.title||'Unit 3 — My School'}</h2>
          <div style={{display:'flex',justifyContent:'center',gap:18,marginTop:12}}>
            <span style={{fontSize:13,fontWeight:800,color:'var(--k-muted)'}}>📋 {quiz?.qs||8} câu hỏi</span>
            <span style={{fontSize:13,fontWeight:800,color:'var(--k-muted)'}}>⏱ {quiz?.time||10} phút</span>
          </div>
          <div style={{marginTop:14,padding:'10px 14px',borderRadius:12,background:'var(--k-primary-l)',fontSize:13,fontWeight:800,color:'var(--k-primary)'}}>
            👥 Bài tập làm bài theo nhóm 2 người
          </div>
        </div>

        {/* group ready */}
        <div className="card">
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
            <span style={{fontSize:20}}>👥</span>
            <h3>Nhóm cùng làm bài</h3>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'13px 15px',borderRadius:14,background:'var(--k-green-l)',border:'2px solid var(--k-green)'}}>
              <div style={{width:44,height:44,borderRadius:12,background:'var(--k-primary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:15,flex:'none'}}>TT</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:900,fontSize:15}}>Thanh Tùng</div>
                <div style={{fontSize:12.5,color:'var(--k-green-d)',fontWeight:800}}>✅ Sẵn sàng</div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'13px 15px',borderRadius:14,background:pReady?'var(--k-green-l)':'var(--k-bg2)',border:`2px solid ${pReady?'var(--k-green)':'var(--k-bg)'}`,transition:'all .35s'}}>
              <div style={{width:44,height:44,borderRadius:12,background:partner.color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:15,flex:'none'}}>{partner.initials}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:900,fontSize:15}}>{partner.name}</div>
                <div style={{fontSize:12.5,fontWeight:800,color:pReady?'var(--k-green-d)':'var(--k-muted)'}}>
                  {pReady?'✅ Sẵn sàng':'⏳ Đang vào phòng...'}
                </div>
              </div>
              {!pReady&&<div className="pulse" style={{width:10,height:10,borderRadius:'50%',background:'var(--k-gold)',flex:'none'}}></div>}
            </div>
          </div>

          {pReady&&(
            <div style={{marginTop:14,padding:'11px 14px',borderRadius:12,background:'var(--k-green-l)',textAlign:'center',fontSize:14,fontWeight:800,color:'var(--k-green-d)'}}>
              🎉 Cả nhóm đã sẵn sàng!
            </div>
          )}

          <button
            className={`btn btn-block ${pReady?'btn-p':'btn-s'}`}
            style={{marginTop:16,padding:'16px',fontSize:16,fontWeight:900}}
            onClick={handleStart}
            disabled={!pReady||going}
          >
            {going?'🚀 Đang bắt đầu...':pReady?'Bắt đầu làm bài nhóm 🚀':'Chờ bạn sẵn sàng...'}
          </button>
        </div>

        <p style={{textAlign:'center',fontSize:13,color:'var(--k-muted)',fontWeight:700}}>
          💡 Hai bạn cùng thảo luận và chọn một đáp án chung nhé!
        </p>
      </div>
    </div>
  );
}

/* ═══════════════ QUIZ RUNTIME ═══════════════ */
function QuizScreen({go,session,quiz}){
  const QS=window.QS, L=window.L, fmt=window.fmt;
  const partner=session?.partner||{name:'Mai Anh',initials:'MA',color:'#f59e0b'};

  const [phase,setPhase]=useStateQ('lobby');
  const [qi,setQi]=useStateQ(0);
  const [groupA,setGroupA]=useStateQ({}); // đáp án nhóm
  const [tLeft,setTLeft]=useStateQ((quiz?.time||10)*60);
  const [showSub,setShowSub]=useStateQ(false);
  const timerRef=useRefQ();

  /* ── luân phiên học sinh ── */
  const members=[{name:'Thanh Tùng',initials:'TT',color:'var(--k-primary)'},{name:partner.name,initials:partner.initials,color:partner.color}];
  const [turnIdx,setTurnIdx]=useStateQ(0);
  const [turnCount,setTurnCount]=useStateQ(0);
  const [showSwitch,setShowSwitch]=useStateQ(false);
  const [switchPending,setSwitchPending]=useStateQ(false);
  const countedRef=useRefQ(new Set());

  /* ── chọn đáp án → nộp câu → câu tiếp theo ── */
  const [submitted,setSubmitted]=useStateQ({});

  function handleAnswer(val){
    if(submitted[qi]) return;
    setGroupA(prev=>({...prev,[qi]:val}));
  }

  function handleSubmit(){
    if(submitted[qi]) return;
    setSubmitted(prev=>({...prev,[qi]:true}));
    if(!countedRef.current.has(qi)){
      countedRef.current.add(qi);
      setTurnCount(c=>{
        const nc=c+1;
        if(nc>=3){setSwitchPending(true);return 0;}
        return nc;
      });
    }
  }

  function handleNext(){
    if(switchPending){setSwitchPending(false);setShowSwitch(true);return;}
    if(qi<QS.length-1)nav(1);else setShowSub(true);
  }

  useEffectQ(()=>{
    if(phase!=='playing') return;
    timerRef.current=setInterval(()=>setTLeft(t=>{
      if(t<=1){clearInterval(timerRef.current);go('result',{myA:groupA,timeout:true,quiz});return 0;}
      return t-1;
    }),1000);
    return()=>clearInterval(timerRef.current);
  },[phase]);

  if(phase==='lobby'){
    return <LobbyPhase quiz={quiz} partner={partner} onStart={()=>setPhase('playing')}/>;
  }

  const q=QS[qi];
  const urgent=tLeft<=60;
  const isSub=!!submitted[qi];
  const isCorrectNow=isSub&&window.isCorrect(q,groupA[qi]);
  const submittedCount=Object.keys(submitted).length;

  function nav(d){const n=qi+d;if(n>=0&&n<QS.length)setQi(n);}
  function submit(){clearInterval(timerRef.current);go('result',{myA:groupA,quiz});}

  return(
    <div className="quiz-shell">
      {/* top bar */}
      <div className="quiz-bar">
        <div style={{display:'flex',alignItems:'center',gap:11,minWidth:0}}>
          <div style={{width:42,height:42,borderRadius:13,background:'var(--k-primary-l)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:21,flex:'none'}}>{quiz?.emoji||'🏫'}</div>
          <div style={{minWidth:0}}>
            <div style={{fontWeight:900,fontSize:15.5,color:'var(--k-text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{quiz?.title||'Unit 3 — My School'}</div>
            <div style={{fontSize:12.5,color:'var(--k-muted)',fontWeight:700}}>Câu {qi+1}/{QS.length} · 👥 Làm bài nhóm</div>
          </div>
        </div>
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'7px 13px 7px 7px',borderRadius:99,background:'var(--k-primary-l)'}}>
            <div style={{width:26,height:26,borderRadius:8,background:members[turnIdx].color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:11,flex:'none'}}>{members[turnIdx].initials}</div>
            <span style={{fontSize:12.5,fontWeight:800,color:'var(--k-primary)'}}>Đến lượt {members[turnIdx].name}</span>
          </div>
          <div className="quiz-timer" style={{color:urgent?'var(--k-red)':'var(--k-text)',background:urgent?'var(--k-red-l)':'var(--k-bg)'}}>
            {urgent&&<span>🔥</span>}{fmt(tLeft)}
          </div>
          <button className="btn btn-danger" style={{padding:'10px 18px'}} onClick={()=>setShowSub(true)}>Nộp bài nhóm</button>
        </div>
      </div>

      <div className="quiz-body">
        {/* main column */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{pointerEvents:isSub?'none':'auto',opacity:isSub?0.82:1,transition:'opacity .2s',userSelect:isSub?'none':'auto'}}>
            <QuestionDisplay q={q} answer={groupA[qi]} onAnswer={handleAnswer}/>
          </div>

          {isSub&&(
            <div style={{padding:'13px 16px',borderRadius:14,fontWeight:800,fontSize:14.5,display:'flex',alignItems:'center',gap:10,
              background:isCorrectNow?'var(--k-green-l)':'var(--k-red-l)',
              color:isCorrectNow?'var(--k-green-d)':'var(--k-red-d)',
              border:`2px solid ${isCorrectNow?'var(--k-green)':'var(--k-red)'}`}}>
              <span style={{fontSize:21}}>{isCorrectNow?'✅':'❌'}</span>
              {isCorrectNow?'Chính xác! Làm tốt lắm 🎉':'Chưa đúng rồi, cùng xem lại ở phần đáp án nhé!'}
            </div>
          )}

          <div style={{display:'flex',gap:11,marginTop:4}}>
            <button className="btn btn-s" style={{flex:1,padding:'14px'}} onClick={()=>nav(-1)} disabled={qi===0}>← Câu trước</button>
            {!isSub?(
              <button className="btn btn-p" style={{flex:1,padding:'14px'}} onClick={handleSubmit} disabled={!window.isAnswered(q,groupA[qi])}>Nộp đáp án ✓</button>
            ):(
              <button className="btn btn-p" style={{flex:1,padding:'14px'}} onClick={handleNext}>
                {switchPending?'Tiếp theo → (đổi lượt)':qi<QS.length-1?'Câu tiếp theo →':'Nộp bài 🎯'}
              </button>
            )}
          </div>
        </div>

        {/* aside */}
        <div className="quiz-aside">
          <div className="card">
            <h3 style={{marginBottom:12}}>Danh sách câu hỏi</h3>
            <div className="q-dots">
              {QS.map((_,i)=>{
                const isSubI=!!submitted[i];
                const cls=`q-dot ${i===qi?'curr':isSubI?'agreed':''}`;
                return <div key={i} className={cls} onClick={()=>setQi(i)} title={window.typeIcon(QS[i].type)}>{i+1}</div>;
              })}
            </div>
            <div style={{marginTop:11,display:'flex',gap:12}}>
              <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,fontWeight:800,color:'var(--k-muted)'}}>
                <div className="q-dot agreed" style={{width:13,height:13,borderRadius:4,minWidth:13,fontSize:0,cursor:'default'}}></div>Đã chọn
              </div>
            </div>
            <div style={{marginTop:14,paddingTop:12,borderTop:'1.5px solid var(--k-bg)',display:'flex',flexDirection:'column',gap:8}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:13,fontWeight:700,color:'var(--k-muted)'}}>
                <span>Nhóm đã nộp</span><strong style={{color:'var(--k-primary)'}}>{submittedCount}/{QS.length}</strong>
              </div>
              <div style={{height:8,borderRadius:99,background:'var(--k-bg)',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${submittedCount/QS.length*100}%`,background:'var(--k-primary)',borderRadius:99,transition:'width .3s'}}></div>
              </div>
            </div>
          </div>

          {/* group members */}
          <div className="card" style={{display:'flex',flexDirection:'column',gap:10}}>
            <div style={{fontSize:12.5,fontWeight:800,color:'var(--k-muted)',marginBottom:2}}>👥 Nhóm đang làm bài</div>
            {members.map((m,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:11,padding:'8px 9px',borderRadius:12,background:i===turnIdx?'var(--k-primary-l)':'transparent',border:i===turnIdx?'2px solid var(--k-primary)':'2px solid transparent'}}>
                <div style={{width:38,height:38,borderRadius:11,background:m.color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,flex:'none',fontSize:13}}>{m.initials}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:900,fontSize:14,color:'var(--k-text)'}}>{m.name}</div>
                  {i===turnIdx&&<div style={{fontSize:11.5,fontWeight:800,color:'var(--k-primary)'}}>✍️ Đang làm bài</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* switch turn dialog */}
      {showSwitch&&(
        <div className="overlay">
          <div className="dialog bounce-in">
            <div style={{fontSize:48}}>🔄</div>
            <h2>Đến lượt bạn khác!</h2>
            <p><strong>{members[turnIdx].name}</strong> đã làm xong 3 câu. Chọn bạn tiếp theo làm bài nhé!</p>
            <div style={{display:'flex',gap:10,width:'100%'}}>
              {members.map((m,i)=>(
                <button key={i} className="btn btn-o" style={{flex:1,flexDirection:'column',gap:6,padding:'16px 10px'}} onClick={()=>{setTurnIdx(i);setShowSwitch(false);if(qi<QS.length-1)nav(1);else setShowSub(true);}}>
                  <div style={{width:42,height:42,borderRadius:12,background:m.color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:14}}>{m.initials}</div>
                  <span style={{fontWeight:800,fontSize:13.5}}>{m.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* submit dialog */}
      {showSub&&(
        <div className="overlay">
          <div className="dialog bounce-in">
            <div style={{fontSize:48}}>👥</div>
            <h2>Nộp bài nhóm?</h2>
            <p>Nhóm đã nộp đáp án cho <strong>{submittedCount}/{QS.length}</strong> câu.</p>
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'13px 16px',borderRadius:14,background:'var(--k-green-l)',border:'2px solid var(--k-green)',width:'100%'}}>
              <div style={{display:'flex',gap:6}}>
                <div style={{width:38,height:38,borderRadius:11,background:'var(--k-primary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:13}}>TT</div>
                <div style={{width:38,height:38,borderRadius:11,background:partner.color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:13}}>{partner.initials}</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:900,fontSize:14,color:'var(--k-green-d)'}}>Thanh Tùng &amp; {partner.name}</div>
                <div style={{fontSize:12.5,color:'var(--k-green-d)',opacity:.8}}>{submittedCount}/{QS.length} câu đã nộp</div>
              </div>
            </div>
            <div style={{display:'flex',gap:10,width:'100%'}}>
              <button className="btn btn-o" style={{flex:1}} onClick={()=>setShowSub(false)}>Quay lại</button>
              <button className="btn btn-g" style={{flex:1}} onClick={submit}>Nộp bài nhóm! 🎉</button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

/* ═══════════════ RESULT ═══════════════ */
function ResultScreen({go,rd,session}){
  const QS=window.QS, L=window.L, CF_COLORS=window.CF_COLORS;
  const partner=session?.partner||{name:'Mai Anh',initials:'MA',color:'#f59e0b'};
  const {myA={},timeout=false}=rd||{};
  const correct=QS.filter((_,i)=>window.isCorrect(QS[i],myA[i])).length;
  const total=QS.length;
  const pct=Math.round(correct/total*100);
  const pass=pct>=60;
  const [review,setReview]=useStateQ(false);
  const [count,setCount]=useStateQ(0);
  const [showConf,setShowConf]=useStateQ(false);

  useEffectQ(()=>{
    if(pass)setTimeout(()=>setShowConf(true),300);
    if(correct<=0){setCount(0);return;}
    let n=0,t=setInterval(()=>{n++;setCount(n);if(n>=correct)clearInterval(t);},80);
    return()=>clearInterval(t);
  },[]);

  const cPieces=pass?Array.from({length:30},(_,i)=>({id:i,color:CF_COLORS[i%CF_COLORS.length],left:Math.random()*100,delay:Math.random()*1.5,dur:2+Math.random()*2,shape:Math.random()>.5?'50%':'3px'})):[];

  return(
    <div className="result-wrap">
      <div className={`result-card ${pass?'result-pass':'result-fail'}`}>
        {showConf&&cPieces.map(p=>(
          <div key={p.id} className="cf" style={{left:`${p.left}%`,background:p.color,borderRadius:p.shape,animationDuration:`${p.dur}s`,animationDelay:`${p.delay}s`}}></div>
        ))}
        <div style={{position:'relative',zIndex:2,textAlign:'center'}}>
          {/* group badge */}
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',borderRadius:99,background:'rgba(255,255,255,.18)',marginBottom:18}}>
            <div style={{width:28,height:28,borderRadius:8,background:'var(--k-primary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:12}}>TT</div>
            <span style={{fontSize:13,fontWeight:800,opacity:.9}}>+</span>
            <div style={{width:28,height:28,borderRadius:8,background:partner.color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:12}}>{partner.initials}</div>
            <span style={{fontSize:13,fontWeight:800,opacity:.9}}>Kết quả nhóm</span>
          </div>

          <div style={{fontSize:72,lineHeight:1}}>{pass?'🏆':'💪'}</div>
          <div style={{fontSize:'clamp(64px,9vw,96px)',fontWeight:900,lineHeight:1,marginTop:8,fontVariantNumeric:'tabular-nums'}}>{count}</div>
          <div style={{fontSize:19,opacity:.78,marginTop:2}}>/ {total} câu đúng</div>

          <div style={{display:'flex',gap:14,justifyContent:'center',marginTop:22,flexWrap:'wrap'}}>
            <div className="result-stat"><div style={{fontWeight:900,fontSize:24}}>{pct}%</div><div style={{fontSize:12.5,opacity:.78}}>Điểm nhóm</div></div>
            <div className="result-stat" style={{background:pass?'rgba(255,255,255,.95)':'rgba(255,255,255,.18)',color:pass?'#065f46':'#fff'}}>
              <div style={{fontWeight:900,fontSize:18}}>{pass?'✅ Đạt':'❌ Chưa đạt'}</div><div style={{fontSize:12.5,opacity:.78}}>Kết quả</div>
            </div>
          </div>

          {timeout&&<div style={{display:'inline-block',marginTop:18,padding:'10px 18px',borderRadius:12,background:'rgba(255,255,255,.15)',fontSize:13.5,fontWeight:800}}>⏰ Đã hết giờ, bài được nộp tự động</div>}

          <div style={{display:'flex',gap:11,justifyContent:'center',marginTop:24,flexWrap:'wrap'}}>
            <button className="btn btn-ghost" onClick={()=>setReview(r=>!r)}>{review?'Ẩn đáp án':'🔍 Xem đáp án nhóm'}</button>
            <button className="btn btn-w" style={{color:pass?'#065f46':'#991b1b'}} onClick={()=>go('dashboard',{view:'results'})}>Về trang chủ →</button>
          </div>

          {review&&(
            <div style={{marginTop:22,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:10,textAlign:'left'}}>
              {QS.map((q,i)=>{
                const ans=myA[i];
                const isOk=window.isCorrect(q,ans);
                const isAns=window.isAnswered(q,ans);
                const qLbl=q.type==='fill-blank'?q.sentence:q.type==='true-false'?q.statement:q.type==='word-order'?q.question:q.type==='pronunciation'||q.type==='spelling'?q.word:q.question||`Câu ${i+1}`;
                const myLbl=!isAns?'(chưa trả lời)':q.type==='pronunciation'?`${ans}/100`:q.type==='spelling'?ans:q.type==='word-order'?ans.map(k=>q.words[k]).join(' '):q.type==='matching'?`${ans.score}/${ans.total} cặp`:q.type==='true-false'?ans===0?'Đúng':'Sai':`${L[ans]}: ${q.opts[ans]}`;
                const okLbl=q.type==='word-order'?q.answer:q.type==='true-false'?q.ok===0?'Đúng':'Sai':q.type==='matching'||q.type==='pronunciation'||q.type==='spelling'?null:`${L[q.ok]}: ${q.opts[q.ok]}`;
                return(
                  <div key={i} style={{background:'rgba(255,255,255,.13)',borderRadius:14,padding:'13px 15px'}}>
                    <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                      <span style={{fontSize:13,flex:'none',marginTop:2}}>{isOk?'✅':'❌'}</span>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6,flexWrap:'wrap'}}>
                          <span style={{fontSize:10,fontWeight:800,background:'rgba(255,255,255,.16)',padding:'2px 7px',borderRadius:99}}>{window.typeIcon(q.type)} {i+1}/{QS.length}</span>
                          <span style={{fontSize:13,fontWeight:800,opacity:.9,lineHeight:1.3}}>{qLbl.length>54?qLbl.slice(0,54)+'…':qLbl}</span>
                        </div>
                        <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                          <span style={{padding:'3px 9px',borderRadius:8,fontSize:12,fontWeight:800,background:isOk?'rgba(16,185,129,.4)':'rgba(239,68,68,.4)',border:`1.5px solid ${isOk?'rgba(16,185,129,.6)':'rgba(239,68,68,.6)'}`}}>Nhóm: {myLbl}</span>
                          {!isOk&&okLbl&&<span style={{padding:'3px 9px',borderRadius:8,fontSize:12,fontWeight:800,background:'rgba(255,255,255,.18)',border:'1.5px solid rgba(255,255,255,.28)'}}>Đúng: {okLbl}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window,{QuizScreen,ResultScreen});
