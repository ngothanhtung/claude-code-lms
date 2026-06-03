export default function init(root) {
  // ---- Notifications logic ----
    const catBar = document.getElementById('catBar');
    const rows = Array.from(document.querySelectorAll('.nrow'));
    const groups = Array.from(document.querySelectorAll('.notif-group'));
    const emptyState = document.getElementById('emptyState');
    const unreadLead = document.getElementById('unreadLead');
    let activeCat = 'all';
  
    function updateUnreadCount() {
      const n = document.querySelectorAll('.nrow.unread').length;
      unreadLead.textContent = n;
      document.querySelectorAll('.nav-badge, .dot-badge').forEach(b => {
        if (n > 0) { b.textContent = n; b.style.display = ''; } else { b.style.display = 'none'; }
      });
    }
  
    function applyFilter() {
      let anyVisible = false;
      rows.forEach(r => {
        const show = activeCat === 'all' || r.dataset.cat === activeCat;
        r.classList.toggle('is-hidden', !show);
        if (show) anyVisible = true;
      });
      // Hide groups that have no visible rows
      groups.forEach(g => {
        const hasVisible = g.querySelectorAll('.nrow:not(.is-hidden)').length > 0;
        g.classList.toggle('is-hidden', !hasVisible);
      });
      emptyState.classList.toggle('show', !anyVisible);
    }
  
    // Category chips
    catBar.querySelectorAll('.cat').forEach(c => {
      c.addEventListener('click', () => {
        catBar.querySelectorAll('.cat').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        activeCat = c.dataset.cat;
        applyFilter();
      });
    });
  
    // Click a row → mark read
    rows.forEach(r => {
      r.addEventListener('click', e => {
        if (e.target.closest('.nrow-x') || e.target.closest('a')) return;
        r.classList.remove('unread');
        const dot = r.querySelector('.nrow-dot'); if (dot) dot.remove();
        updateUnreadCount();
      });
      // Dismiss
      const x = r.querySelector('.nrow-x');
      if (x) x.addEventListener('click', e => {
        e.stopPropagation();
        r.remove();
        applyFilter(); updateUnreadCount();
      });
    });
  
    // Mark all read
    document.getElementById('markAllBtn').addEventListener('click', () => {
      document.querySelectorAll('.nrow.unread').forEach(r => {
        r.classList.remove('unread');
        const dot = r.querySelector('.nrow-dot'); if (dot) dot.remove();
      });
      updateUnreadCount();
    });
  
    updateUnreadCount();
}
