export default function init(root) {
  // ---- Filter: tabs + search ----
    const grid = document.getElementById('courseGrid');
    const cards = Array.from(grid.querySelectorAll('.course'));
    const tabs = document.getElementById('courseTabs');
    const searchInput = document.getElementById('courseFilter');
    const emptyState = document.getElementById('emptyState');
    let activeFilter = 'all';
  
    function applyFilter() {
      const q = searchInput.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const matchStatus = activeFilter === 'all' || card.dataset.status === activeFilter;
        const matchSearch = !q || card.dataset.name.includes(q);
        const show = matchStatus && matchSearch;
        card.classList.toggle('is-hidden', !show);
        if (show) visible++;
      });
      emptyState.classList.toggle('show', visible === 0);
    }
  
    tabs.querySelectorAll('.tab').forEach(t => {
      t.addEventListener('click', () => {
        tabs.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        activeFilter = t.dataset.filter;
        applyFilter();
      });
    });
    searchInput.addEventListener('input', applyFilter);
  
    // ---- "Vào lớp" → mở trang lớp học ----
    cards.forEach(card => {
      const btn = card.querySelector('.ccard-foot .btn');
      if (!btn) return;
      const isOOP = (card.dataset.name || '').includes('lập trình hướng đối tượng');
      btn.addEventListener('click', () => {
        if (isOOP) {
          window.__spaNav('classroom-oop.html');
        } else {
          const name = card.querySelector('.course-name')?.textContent || 'môn học này';
          alert('Lớp học trực tuyến cho "' + name + '" sẽ sớm được mở. Hiện đã có sẵn lớp môn Lập trình hướng đối tượng.');
        }
      });
    });
}
