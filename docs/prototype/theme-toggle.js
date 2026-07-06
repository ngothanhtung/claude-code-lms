/* Light / Dark theme toggle — shared across all pages */
(function () {
  function current() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  function setIcon() {
    var b = document.getElementById('themeToggle');
    if (!b) return;
    b.innerHTML = '<i data-lucide="' + (current() === 'dark' ? 'sun' : 'moon') + '" class="icon-lg"></i>';
    if (window.lucide) window.lucide.createIcons();
  }
  function apply(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }
    setIcon();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#themeToggle');
    if (b) apply(current() === 'dark' ? 'light' : 'dark');
  });
  // initial icon (theme class was applied early in <head>)
  if (document.readyState !== 'loading') setIcon();
  else document.addEventListener('DOMContentLoaded', setIcon);
})();
