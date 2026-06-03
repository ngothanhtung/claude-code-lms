export default function init(root) {
  // Theme picker
    document.querySelectorAll('#themeOpts .theme-opt').forEach(o => {
      o.addEventListener('click', () => {
        document.querySelectorAll('#themeOpts .theme-opt').forEach(x => x.classList.remove('sel'));
        o.classList.add('sel');
      });
    });
  
    // Accent picker
    document.querySelectorAll('#accentOpts .accent-dot').forEach(o => {
      o.addEventListener('click', () => {
        document.querySelectorAll('#accentOpts .accent-dot').forEach(x => x.classList.remove('sel'));
        o.classList.add('sel');
      });
    });
  
    // Section nav active state via scroll
    const setNav = document.getElementById('setNav');
    const navLinks = [...setNav.querySelectorAll('a')];
    const sections = navLinks.map(a => document.querySelector(a.getAttribute('href')));
    const mainEl = document.querySelector('.main');
  
    navLinks.forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  
    function onScroll() {
      let current = sections[0];
      const y = window.scrollY + 90;
      sections.forEach((s, i) => { if (s && s.offsetTop <= y) current = sections[i]; });
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + (current ? current.id : '')));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  
    // Save / reset feedback
    document.getElementById('saveBtn').addEventListener('click', () => {
      const note = document.querySelector('.sb-note');
      note.innerHTML = '<i data-lucide="check-circle-2" style="color:hsl(142 71% 40%)"></i> Đã lưu thay đổi.';
      lucide.createIcons();
    });
    document.getElementById('resetBtn').addEventListener('click', () => {
      const note = document.querySelector('.sb-note');
      note.innerHTML = '<i data-lucide="info"></i> Thay đổi chưa được lưu.';
      lucide.createIcons();
    });
}
