export default function init(root) {
  // Tabs
    const tabs = document.getElementById('chTabs');
    const panels = document.querySelectorAll('.panel');
    tabs.addEventListener('click', e => {
      const btn = e.target.closest('.ch-tab');
      if (!btn) return;
      tabs.querySelectorAll('.ch-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const name = btn.dataset.tab;
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === name));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  
    // Lesson weeks accordion
    document.querySelectorAll('.week-head').forEach(h => {
      h.addEventListener('click', () => h.closest('.week').classList.toggle('open'));
    });
  
    // Like buttons
    document.querySelectorAll('.post-act[data-like]').forEach(b => {
      b.addEventListener('click', () => {
        const span = b.querySelector('span');
        const liked = b.classList.toggle('liked');
        if (span) span.textContent = parseInt(span.textContent, 10) + (liked ? 1 : -1);
      });
    });
  
    // Join live (mock)
    ['joinLive', 'joinLive2'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => {
        el.disabled = true;
        const original = el.innerHTML;
        el.innerHTML = '<i data-lucide="loader-2" class="icon-sm"></i> Đang kết nối...';
        lucide.createIcons();
        setTimeout(() => { el.innerHTML = original; el.disabled = false; lucide.createIcons(); }, 1800);
      });
    });
}
