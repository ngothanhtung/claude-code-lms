export default function init(root) {
  // ---- Filter: tabs + search ----
    const list = document.getElementById('grpList');
    const items = Array.from(list.querySelectorAll('.grp'));
    const tabs = document.getElementById('grpTabs');
    const searchInput = document.getElementById('grpFilter');
    const emptyState = document.getElementById('emptyState');
    let activeFilter = 'all';
  
    function applyFilter() {
      const q = searchInput.value.trim().toLowerCase();
      let visible = 0;
      items.forEach(item => {
        const matchStatus = activeFilter === 'all' || item.dataset.status === activeFilter;
        const matchSearch = !q || item.dataset.name.includes(q);
        const show = matchStatus && matchSearch;
        item.classList.toggle('is-hidden', !show);
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
}
