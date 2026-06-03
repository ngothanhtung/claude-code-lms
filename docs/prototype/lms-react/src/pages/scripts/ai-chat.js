export default function init(root) {
  /* ai-chat-data.js — sample conversations for the AI chat page */
  window.CHAT_DATA = {
    active: 'c1',
    conversations: [
      {
        id: 'c1',
        title: 'Abstract class vs Interface',
        time: '09:24',
        group: 'today',
        messages: [
          { role: 'ai', time: '09:20', html: '<p>Chào Tùng 👋 Mình là trợ lý học tập AI của LMS Portal. Mình có thể giúp bạn giải thích bài học, nhắc deadline, tra cứu điểm và lịch học. Bạn cần hỗ trợ gì hôm nay?</p>' },
          { role: 'user', time: '09:23', html: '<p>Giải thích giúp mình sự khác nhau giữa abstract class và interface trong Java với.</p>' },
          { role: 'ai', time: '09:24', html: '<p>Câu hỏi rất hay — đây cũng là nội dung tuần này của môn <strong>Lập trình hướng đối tượng</strong>. Tóm tắt nhanh:</p><table class="b-table"><thead><tr><th>Tiêu chí</th><th>Abstract class</th><th>Interface</th></tr></thead><tbody><tr><td>Kế thừa</td><td>Đơn kế thừa (1 lớp cha)</td><td>Đa kế thừa (nhiều interface)</td></tr><tr><td>Thuộc tính</td><td>Có thể có biến thường</td><td>Chỉ hằng <code>public static final</code></td></tr><tr><td>Phương thức</td><td>Có thể có thân hàm</td><td>Chủ yếu là khai báo (từ Java 8 có <code>default</code>)</td></tr><tr><td>Dùng khi</td><td>Các lớp <em>cùng loại</em>, chia sẻ code chung</td><td>Định nghĩa <em>khả năng</em> (hợp đồng) cho nhiều lớp khác loại</td></tr></tbody></table><p>Ví dụ minh hoạ:</p><pre><code><span class="tok-k">abstract class</span> <span class="tok-t">Animal</span> {\n  <span class="tok-k">abstract void</span> sound();      <span class="tok-c">// chưa có thân</span>\n  <span class="tok-k">void</span> breathe() { ... }       <span class="tok-c">// code dùng chung</span>\n}\n\n<span class="tok-k">interface</span> <span class="tok-t">Swimmable</span> {\n  <span class="tok-k">void</span> swim();                  <span class="tok-c">// chỉ là hợp đồng</span>\n}</code></pre><p><strong>Mẹo nhớ:</strong> dùng <em>abstract class</em> khi trả lời được câu “<strong>là một</strong>” (Dog <em>là một</em> Animal); dùng <em>interface</em> khi trả lời “<strong>có khả năng</strong>” (Dog <em>có thể</em> bơi).</p>' }
        ]
      },
      {
        id: 'c2',
        title: 'Deadline bài tập tuần này',
        time: '08:05',
        group: 'today',
        messages: [
          { role: 'user', time: '08:04', html: '<p>Tuần này mình có deadline nào không?</p>' },
          { role: 'ai', time: '08:05', html: '<p>Mình kiểm tra rồi, bạn có <strong>3 mốc</strong> sắp tới:</p><ul><li>📌 <strong>BTL2 — Quản lý thư viện (Java)</strong> · môn OOP · hạn <strong>09/06</strong> (còn 8 ngày), làm nhóm.</li><li>📝 <strong>Bài tập 1 — Kế thừa &amp; đa hình</strong> · đã nộp, đang chờ chấm.</li><li>🧪 <strong>Quiz chương 3 — Cơ sở dữ liệu</strong> · mở đến <strong>05/06</strong>.</li></ul><p>Bạn muốn mình thêm nhắc nhở cho BTL2 vào lịch không?</p>' }
        ]
      },
      {
        id: 'c3',
        title: 'Cách tính điểm trung bình (GPA)',
        time: 'Hôm qua',
        group: 'earlier',
        messages: [
          { role: 'user', time: 'Hôm qua', html: '<p>GPA học kỳ này của mình đang được tính thế nào?</p>' },
          { role: 'ai', time: 'Hôm qua', html: '<p>GPA được tính theo trung bình có trọng số tín chỉ:</p><pre><code>GPA = Σ(điểm hệ 4 × số tín chỉ) / Σ(số tín chỉ)</code></pre><p>Theo dữ liệu hiện tại, điểm tạm tính của bạn là <strong>3.42 / 4.0</strong> (xếp loại <strong>Giỏi</strong>). Môn OOP đang 8.5 (B+), Cơ sở dữ liệu 8.8 (A). Cần mình gợi ý cách kéo điểm các môn còn lại không?</p>' }
        ]
      },
      {
        id: 'c4',
        title: 'Tóm tắt bài giảng Lecture 7',
        time: 'Hôm qua',
        group: 'earlier',
        messages: [
          { role: 'user', time: 'Hôm qua', html: '<p>Tóm tắt giúp mình Lecture 7 về Inheritance.</p>' },
          { role: 'ai', time: 'Hôm qua', html: '<p><strong>Lecture 7 — Kế thừa &amp; Đa hình</strong> gồm 3 ý chính:</p><ul><li><strong>Kế thừa (extends):</strong> lớp con tái sử dụng thuộc tính/phương thức của lớp cha.</li><li><strong>Ghi đè (override):</strong> lớp con định nghĩa lại hành vi của phương thức cha.</li><li><strong>Đa hình (polymorphism):</strong> cùng một lời gọi, hành vi khác nhau tuỳ đối tượng thực tế.</li></ul><p>Tài liệu đầy đủ nằm ở tab <em>Tài liệu</em> của lớp OOP nhé.</p>' }
        ]
      },
      {
        id: 'c5',
        title: 'Phòng thi cuối kỳ ở đâu?',
        time: '28/05',
        group: 'earlier',
        messages: [
          { role: 'user', time: '28/05', html: '<p>Lịch thi cuối kỳ môn Cơ sở dữ liệu khi nào, ở phòng nào?</p>' },
          { role: 'ai', time: '28/05', html: '<p>Môn <strong>Cơ sở dữ liệu</strong> thi cuối kỳ ngày <strong>20/06/2026</strong>, ca sáng <strong>07:30</strong>, phòng <strong>D9-401</strong>. Hình thức: tự luận 90 phút, được dùng 1 tờ A4 viết tay. Chúc bạn ôn tốt! 📚</p>' }
        ]
      }
    ],
    // canned replies for live typing
    greeting: '<p>Chào Tùng 👋 Mình là trợ lý học tập AI. Hỏi mình về bài học, deadline, điểm số hay lịch thi nhé — mình sẽ trả lời ngay.</p>',
    replies: [
      { match: ['abstract', 'interface'], html: '<p>Ngắn gọn: <strong>abstract class</strong> dùng khi các lớp <em>cùng loại</em> chia sẻ code chung (đơn kế thừa, có thể chứa biến và phương thức có thân). <strong>Interface</strong> là một “hợp đồng” mô tả <em>khả năng</em> mà nhiều lớp khác loại cùng cài đặt (đa kế thừa). Mẹo: “<strong>là một</strong>” → abstract class; “<strong>có khả năng</strong>” → interface.</p>' },
      { match: ['deadline', 'hạn', 'bài tập', 'nộp'], html: '<p>Bạn đang có các mốc gần nhất:</p><ul><li><strong>BTL2 (OOP)</strong> — hạn <strong>09/06</strong>, làm nhóm.</li><li><strong>Quiz chương 3 (CSDL)</strong> — mở đến <strong>05/06</strong>.</li></ul><p>Muốn mình đặt nhắc nhở không?</p>' },
      { match: ['điểm', 'gpa', 'trung bình'], html: '<p>GPA tạm tính học kỳ này của bạn là <strong>3.42 / 4.0</strong> (Giỏi). Cao nhất là Cơ sở dữ liệu (A · 8.8), thấp nhất cần chú ý là các môn chưa có điểm thi cuối kỳ.</p>' },
      { match: ['lịch', 'học hôm nay', 'thi', 'phòng'], html: '<p>Hôm nay (Thứ 2, 01/06) bạn có: <strong>07:00 OOP</strong> (A2-201) và buổi tự học buổi chiều. Thi cuối kỳ CSDL: <strong>20/06</strong>, phòng D9-401. Cần lịch chi tiết hơn không?</p>' },
      { match: ['java', 'code', 'lập trình'], html: '<p>Mình có thể giúp giải thích cú pháp, gỡ lỗi, hoặc gợi ý cấu trúc chương trình Java. Bạn dán đoạn code hoặc mô tả lỗi cụ thể nhé — mình sẽ phân tích từng bước.</p>' }
    ],
    fallback: '<p>Mình đã ghi nhận câu hỏi của bạn. Đây là một chủ đề học tập thú vị! Bạn có thể nói rõ hơn một chút (môn học, bài cụ thể) để mình trả lời chính xác hơn không? Mình có thể giải thích lý thuyết, tóm tắt bài giảng, nhắc deadline hoặc tra cứu điểm/lịch thi.</p>'
  };
  
  
  /* ai-chat-app.js — AI chat page behavior */
  (function () {
    lucide.createIcons();
  
    /* ---- Shared chrome: sidebar collapse, profile, nav groups ---- */
    
  
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
}
