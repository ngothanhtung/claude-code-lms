export default function init(root) {
  optionsEl.appendChild(el);
      });
      flagBtn.classList.toggle('on', state.flagged.includes(i));
      flagBtn.innerHTML = state.flagged.includes(i) ? '<i data-lucide="flag"></i> Đã đánh dấu' : '<i data-lucide="flag"></i> Đánh dấu';
      prevBtn.disabled = i === 0;
      nextBtn.style.visibility = i === TOTAL - 1 ? 'hidden' : 'visible';
      lucide.createIcons();
    }
    function renderPalette() {
      palette.innerHTML = '';
      for (let i = 0; i < TOTAL; i++) {
        const b = document.createElement('button');
        b.className = 'pal' + (state.answers[i] !== undefined ? ' answered' : '') + (i === state.cur ? ' current' : '') + (state.flagged.includes(i) ? ' flagged' : '');
        b.textContent = i + 1;
        b.addEventListener('click', () => { state.cur = i; save(); renderQuestion(); renderPalette(); });
        palette.appendChild(b);
      }
    }
    function renderProg() {
      const c = answeredCount();
      progCnt.textContent = c + '/' + TOTAL;
      progBar.style.width = (c / TOTAL * 100) + '%';
    }
  
    flagBtn.addEventListener('click', () => {
      const i = state.cur, idx = state.flagged.indexOf(i);
      if (idx >= 0) state.flagged.splice(idx, 1); else state.flagged.push(i);
      save(); renderQuestion(); renderPalette();
    });
    prevBtn.addEventListener('click', () => { if (state.cur > 0) { state.cur--; save(); renderQuestion(); renderPalette(); } });
    nextBtn.addEventListener('click', () => { if (state.cur < TOTAL - 1) { state.cur++; save(); renderQuestion(); renderPalette(); } });
  
    // ---- Timer ----
    function fmt(s) { return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); }
    function tick() {
      timerVal.textContent = fmt(state.remaining);
      timerEl.classList.toggle('low', state.remaining <= 120);
      if (state.remaining <= 0) { doSubmit(true); return; }
      state.remaining--; save();
    }
    let timerId = setInterval(tick, 1000); tick();
  
    // ---- Submit flow ----
    const confirmModal = document.getElementById('confirmModal'), resultModal = document.getElementById('resultModal');
    document.getElementById('submitBtn').addEventListener('click', () => {
      document.getElementById('confirmText').innerHTML = 'Bạn đã trả lời <b>' + answeredCount() + '/' + TOTAL + '</b> câu' +
        (state.flagged.length ? ', còn <b>' + state.flagged.length + '</b> câu đánh dấu' : '') + '. Sau khi nộp, bạn không thể chỉnh sửa.';
      confirmModal.classList.add('open');
    });
    document.getElementById('confirmCancel').addEventListener('click', () => confirmModal.classList.remove('open'));
    confirmModal.addEventListener('click', e => { if (e.target === confirmModal) confirmModal.classList.remove('open'); });
    document.getElementById('confirmSubmit').addEventListener('click', () => doSubmit(false));
  
    function doSubmit(timeUp) {
      clearInterval(timerId);
      confirmModal.classList.remove('open');
      let correct = 0;
      QUESTIONS.forEach((Q, i) => { if (state.answers[i] === Q.a) correct++; });
      const wrong = TOTAL - correct, score = (correct / TOTAL * 10).toFixed(1);
      const elapsed = 1500 - state.remaining; // started from 25:00 → but seeded 14:32; show elapsed of session
      document.getElementById('resScore').textContent = score;
      document.getElementById('resCorrect').textContent = correct;
      document.getElementById('resWrong').textContent = wrong;
      document.getElementById('resTime').textContent = fmt(Math.max(0, 600 - state.remaining));
      const ring = document.getElementById('resRing');
      const good = correct >= 7;
      ring.style.background = good ? 'hsl(var(--success-muted))' : 'hsl(var(--warning-muted))';
      ring.style.color = good ? 'hsl(142 71% 36%)' : 'hsl(32 80% 44%)';
      document.getElementById('resTitle').textContent = timeUp ? 'Hết giờ!' : (good ? 'Làm tốt lắm!' : 'Đã nộp bài');
      document.getElementById('resMsg').textContent = (timeUp ? 'Bài đã tự động nộp khi hết giờ. ' : '') + 'Bạn trả lời đúng ' + correct + '/' + TOTAL + ' câu.';
      localStorage.removeItem(KEY);
      resultModal.classList.add('open');
      lucide.createIcons();
    }
  
    // Init
    renderQuestion(); renderPalette(); renderProg();
}
