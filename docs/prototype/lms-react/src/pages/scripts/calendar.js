export default function init(root) {
  // View mode toggle: week / month
    const viewBtns = document.querySelectorAll('.view-btn');
    const weekView = document.getElementById('weekView');
    const monthView = document.getElementById('monthView');
    const calSubtitle = document.getElementById('calSubtitle');
    const calRangeText = document.getElementById('calRangeText');
  
    const VIEW = {
      week:  { sub: 'Học kỳ II, năm học 2025 - 2026 · Thời khóa biểu tuần',  range: '01/06 – 06/06/2026' },
      month: { sub: 'Học kỳ II, năm học 2025 - 2026 · Thời khóa biểu tháng', range: 'Tháng 6, 2026' }
    };
  
    function setView(view) {
      const isWeek = view === 'week';
      weekView.style.display = isWeek ? '' : 'none';
      monthView.style.display = isWeek ? 'none' : '';
      viewBtns.forEach(b => b.classList.toggle('active', b.dataset.view === view));
      calSubtitle.textContent = VIEW[view].sub;
      calRangeText.textContent = VIEW[view].range;
      try { localStorage.setItem('calView', view); } catch (e) {}
    }
  
    viewBtns.forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
  
    // Restore last-used view
    let savedView = 'week';
    try { savedView = localStorage.getItem('calView') || 'week'; } catch (e) {}
    setView(savedView);
}
