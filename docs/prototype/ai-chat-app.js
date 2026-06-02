/* ai-chat-app.js — AI chat page behavior */
(function () {
  lucide.createIcons();

  /* ---- Shared chrome: sidebar collapse, profile, nav groups ---- */
  const menuToggle = document.getElementById('menuToggle');
  const appEl = document.querySelector('.app');
  if (menuToggle && appEl) {
    if (localStorage.getItem('sidebarCollapsed') === '1') appEl.classList.add('collapsed');
    menuToggle.addEventListener('click', () => {
      appEl.classList.toggle('collapsed');
      localStorage.setItem('sidebarCollapsed', appEl.classList.contains('collapsed') ? '1' : '0');
    });
  }
  const profileMenu = document.getElementById('profileMenu');
  const profileTrigger = document.getElementById('profileTrigger');
  if (profileMenu && profileTrigger) {
    profileTrigger.addEventListener('click', e => { e.stopPropagation(); profileMenu.classList.toggle('open'); });
    document.addEventListener('click', e => { if (!profileMenu.contains(e.target)) profileMenu.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') profileMenu.classList.remove('open'); });
  }
  document.querySelectorAll('.nav-group .nav-parent').forEach(p => {
    p.addEventListener('click', () => p.closest('.nav-group').classList.toggle('open'));
  });

  /* ---- Chat state ---- */
  const DATA = window.CHAT_DATA;
  const convList = document.getElementById('convList');
  const msgsInner = document.getElementById('msgsInner');
  const msgsScroll = document.getElementById('msgs');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const composer = document.getElementById('composer');
  const suggestRow = document.getElementById('suggestRow');
  const suggestWrap = document.getElementById('suggestWrap');
  let activeId = DATA.active;

  const SUGGESTIONS = [
    { icon: 'book-open', text: 'Giải thích bài học tuần này' },
    { icon: 'calendar-clock', text: 'Deadline sắp tới của mình?' },
    { icon: 'bar-chart-3', text: 'GPA học kỳ này của mình?' },
    { icon: 'file-code-2', text: 'Giúp mình gỡ lỗi code Java' }
  ];

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function curTime() { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function getConv(id) { return DATA.conversations.find(c => c.id === id); }

  /* ---- Render conversation list ---- */
  function renderConvList(filter) {
    filter = (filter || '').toLowerCase();
    convList.innerHTML = '';
    const groups = [
      { key: 'today', label: 'Hôm nay' },
      { key: 'earlier', label: 'Trước đó' }
    ];
    groups.forEach(g => {
      const items = DATA.conversations.filter(c => c.group === g.key && (!filter || c.title.toLowerCase().includes(filter)));
      if (!items.length) return;
      const lbl = document.createElement('div');
      lbl.className = 'conv-group-label';
      lbl.textContent = g.label;
      convList.appendChild(lbl);
      items.forEach(c => {
        const last = c.messages[c.messages.length - 1];
        const snip = last ? last.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
        const el = document.createElement('div');
        el.className = 'conv-item' + (c.id === activeId ? ' active' : '');
        el.innerHTML =
          '<div class="ci-ico"><i data-lucide="message-square"></i></div>' +
          '<div class="ci-body">' +
            '<div class="ci-title">' + esc(c.title) + '</div>' +
            '<div class="ci-snip">' + esc(snip.slice(0, 48)) + '</div>' +
          '</div>' +
          '<div class="ci-time">' + esc(c.time) + '</div>';
        el.addEventListener('click', () => { activeId = c.id; renderConvList(document.getElementById('convSearch').value); renderThread(); });
        convList.appendChild(el);
      });
    });
    lucide.createIcons();
  }

  /* ---- Render thread ---- */
  function msgNode(m) {
    const wrap = document.createElement('div');
    wrap.className = 'msg ' + m.role;
    if (m.role === 'ai') {
      wrap.innerHTML =
        '<div class="m-ava ai"><i data-lucide="sparkles"></i></div>' +
        '<div><div class="bubble">' + m.html + '</div>' +
          '<div class="m-foot">' +
            '<button data-act="copy"><i data-lucide="copy"></i> Sao chép</button>' +
            '<button data-act="good"><i data-lucide="thumbs-up"></i></button>' +
            '<button data-act="bad"><i data-lucide="thumbs-down"></i></button>' +
          '</div></div>';
    } else {
      wrap.innerHTML =
        '<div><div class="bubble">' + m.html + '</div>' +
        (m.time ? '<div class="m-time">' + esc(m.time) + '</div>' : '') + '</div>';
    }
    return wrap;
  }

  function renderThread() {
    const conv = getConv(activeId);
    msgsInner.innerHTML = '';
    conv.messages.forEach(m => msgsInner.appendChild(msgNode(m)));
    lucide.createIcons();
    bindMsgActions();
    scrollBottom(false);
    toggleSuggestions();
  }

  function toggleSuggestions() {
    const conv = getConv(activeId);
    suggestWrap.style.display = conv.messages.length <= 1 ? '' : 'none';
  }

  function scrollBottom(smooth) {
    msgsScroll.scrollTo({ top: msgsScroll.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }

  function bindMsgActions() {
    msgsInner.querySelectorAll('.m-foot button').forEach(b => {
      b.addEventListener('click', () => {
        const act = b.dataset.act;
        if (act === 'copy') {
          const txt = b.closest('div').parentElement.querySelector('.bubble').innerText;
          navigator.clipboard && navigator.clipboard.writeText(txt);
          b.innerHTML = '<i data-lucide="check"></i> Đã chép'; lucide.createIcons();
          setTimeout(() => { b.innerHTML = '<i data-lucide="copy"></i> Sao chép'; lucide.createIcons(); }, 1500);
        } else {
          b.style.color = act === 'good' ? 'hsl(142 71% 40%)' : 'hsl(0 72% 51%)';
        }
      });
    });
  }

  /* ---- Suggestions ---- */
  function renderSuggestions() {
    suggestRow.innerHTML = '';
    SUGGESTIONS.forEach(s => {
      const b = document.createElement('button');
      b.className = 'sugg';
      b.innerHTML = '<i data-lucide="' + s.icon + '"></i> ' + s.text;
      b.addEventListener('click', () => { send(s.text); });
      suggestRow.appendChild(b);
    });
    lucide.createIcons();
  }

  /* ---- AI reply logic ---- */
  function pickReply(text) {
    const t = text.toLowerCase();
    for (const r of DATA.replies) {
      if (r.match.some(m => t.includes(m))) return r.html;
    }
    return DATA.fallback;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'msg ai typing';
    el.id = 'typingMsg';
    el.innerHTML = '<div class="m-ava ai"><i data-lucide="sparkles"></i></div><div class="bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
    msgsInner.appendChild(el);
    lucide.createIcons();
    scrollBottom(true);
  }
  function removeTyping() { const t = document.getElementById('typingMsg'); if (t) t.remove(); }

  /* ---- Send ---- */
  function send(text) {
    text = (text || input.value).trim();
    if (!text) return;
    const conv = getConv(activeId);
    const userMsg = { role: 'user', time: curTime(), html: '<p>' + esc(text).replace(/\n/g, '<br>') + '</p>' };
    conv.messages.push(userMsg);
    msgsInner.appendChild(msgNode(userMsg));
    lucide.createIcons();
    input.value = '';
    autosize();
    updateSendState();
    toggleSuggestions();
    scrollBottom(true);

    setTimeout(showTyping, 220);
    setTimeout(() => {
      removeTyping();
      const html = pickReply(text);
      const aiMsg = { role: 'ai', time: curTime(), html: html };
      conv.messages.push(aiMsg);
      msgsInner.appendChild(msgNode(aiMsg));
      lucide.createIcons();
      bindMsgActions();
      scrollBottom(true);
      // update list snippet/title
      renderConvList(document.getElementById('convSearch').value);
    }, 1150);
  }

  /* ---- New chat ---- */
  function newChat() {
    const id = 'c' + Date.now();
    const conv = { id: id, title: 'Cuộc trò chuyện mới', time: curTime(), group: 'today', messages: [{ role: 'ai', time: curTime(), html: DATA.greeting }] };
    DATA.conversations.unshift(conv);
    activeId = id;
    renderConvList();
    renderThread();
    input.focus();
  }

  /* ---- Composer behavior ---- */
  function autosize() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 160) + 'px'; }
  function updateSendState() { sendBtn.disabled = input.value.trim().length === 0; }

  input.addEventListener('input', () => { autosize(); updateSendState(); });
  input.addEventListener('focus', () => composer.classList.add('focus'));
  input.addEventListener('blur', () => composer.classList.remove('focus'));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  sendBtn.addEventListener('click', () => send());
  document.getElementById('newChatBtn').addEventListener('click', newChat);
  document.getElementById('clearBtn').addEventListener('click', () => {
    const conv = getConv(activeId);
    conv.messages = [{ role: 'ai', time: curTime(), html: DATA.greeting }];
    renderThread();
    renderConvList(document.getElementById('convSearch').value);
  });
  document.getElementById('convSearch').addEventListener('input', e => renderConvList(e.target.value));

  /* ---- Init ---- */
  renderSuggestions();
  renderConvList();
  renderThread();
  updateSendState();
  input.focus();
})();
