export default function init(root) {
  // ---- Project tabs ----
    const projTabs = document.getElementById('projTabs');
    const panels = document.querySelectorAll('.panel');
    projTabs.querySelectorAll('.ptab').forEach(t => {
      t.addEventListener('click', () => {
        projTabs.querySelectorAll('.ptab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        const target = t.dataset.panel;
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
      });
    });
}
