export default function init(root) {
  // FAQ accordion
    document.querySelectorAll('.faq-q').forEach(q => {
      q.addEventListener('click', () => q.closest('.faq-item').classList.toggle('open'));
    });
  
    // FAQ category filter
    const faqTabs = document.getElementById('faqTabs');
    const faqItems = Array.from(document.querySelectorAll('#faqList .faq-item'));
    const faqEmpty = document.getElementById('faqEmpty');
    let activeCat = 'all';
    let activeQuery = '';
  
    function applyFaqFilter() {
      let shown = 0;
      faqItems.forEach(item => {
        const matchCat = activeCat === 'all' || item.dataset.cat === activeCat;
        const text = item.querySelector('.fq-text').textContent.toLowerCase() + ' ' + item.querySelector('.faq-a').textContent.toLowerCase();
        const matchQuery = !activeQuery || text.includes(activeQuery);
        const show = matchCat && matchQuery;
        item.classList.toggle('faq-hidden', !show);
        if (show) shown++;
      });
      faqEmpty.classList.toggle('show', shown === 0);
    }
  
    faqTabs.addEventListener('click', e => {
      const btn = e.target.closest('.faq-tab');
      if (!btn) return;
      faqTabs.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      applyFaqFilter();
    });
  
    // Category cards → set FAQ filter
    document.querySelectorAll('.cat-card').forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.dataset.cat;
        const tab = faqTabs.querySelector('.faq-tab[data-cat="' + cat + '"]');
        if (tab) { faqTabs.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); activeCat = cat; applyFaqFilter(); }
      });
    });
  
    // Help search
    const helpSearch = document.getElementById('helpSearch');
    function runSearch() {
      activeQuery = helpSearch.value.trim().toLowerCase();
      // reset category to all when searching so results aren't double-filtered
      if (activeQuery) { faqTabs.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active')); faqTabs.querySelector('.faq-tab[data-cat="all"]').classList.add('active'); activeCat = 'all'; }
      document.getElementById('faqSection').scrollIntoView ? null : null;
      applyFaqFilter();
    }
    helpSearch.addEventListener('input', runSearch);
    document.getElementById('helpSearchBtn').addEventListener('click', e => { e.preventDefault(); runSearch(); document.getElementById('faqSection').classList.add('flash'); });
    document.querySelectorAll('.sup-suggest a').forEach(a => {
      a.addEventListener('click', e => { e.preventDefault(); helpSearch.value = a.dataset.q; runSearch(); });
    });
  
    // Chat button → AI assistant cue
    document.getElementById('openChat').addEventListener('click', () => {
      const btn = document.querySelector('.assistant-btn');
      if (btn) { btn.style.outline = '3px solid hsl(var(--ring) / .5)'; btn.style.outlineOffset = '2px'; setTimeout(() => { btn.style.outline = ''; }, 1400); }
    });
  
    // Ticket form
    const ticketForm = document.getElementById('ticketForm');
    const ticketSuccess = document.getElementById('ticketSuccess');
    ticketForm.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      const cat = document.getElementById('tkCat');
      const subject = document.getElementById('tkSubject');
      const msg = document.getElementById('tkMsg');
      [[cat, cat.closest('.select-wrap')], [subject, subject], [msg, msg]].forEach(([input, target]) => {
        if (!input.value.trim()) { target.classList.add('invalid'); ok = false; } else { target.classList.remove('invalid'); }
      });
      if (!ok) return;
      document.getElementById('tkCode').textContent = '#YC-' + Math.floor(200000 + Math.random() * 800000);
      ticketForm.style.display = 'none';
      ticketSuccess.classList.add('show');
    });
    [['tkSubject'], ['tkMsg']].forEach(([id]) => document.getElementById(id).addEventListener('input', e => e.target.classList.remove('invalid')));
    document.getElementById('tkCat').addEventListener('change', e => e.target.closest('.select-wrap').classList.remove('invalid'));
    document.getElementById('tkNew').addEventListener('click', () => {
      ticketForm.reset();
      ticketForm.style.display = '';
      ticketSuccess.classList.remove('show');
    });
}
