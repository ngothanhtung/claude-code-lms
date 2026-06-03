export default function init(root) {
  // Payment method selection
    document.querySelectorAll('#pmList .pm').forEach(pm => {
      pm.addEventListener('click', () => {
        document.querySelectorAll('#pmList .pm').forEach(x => x.classList.remove('sel'));
        pm.classList.add('sel');
      });
    });
  
    // Pay buttons → scroll to summary
    ['payBtn'].forEach(id => {
      const b = document.getElementById(id);
      if (b) b.addEventListener('click', () => {
        const sel = document.querySelector('.pm.sel');
        if (sel) sel.scrollIntoView ? null : null; // avoid scrollIntoView
        const card = document.querySelector('.sum-card');
        if (card) window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
      });
    });
}
