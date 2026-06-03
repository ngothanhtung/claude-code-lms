export default function init(root) {
  // ---- Filter: tabs + search ----
    const list = document.getElementById('asgList');
    const items = Array.from(list.querySelectorAll('.asg'));
    const tabs = document.getElementById('asgTabs');
    const searchInput = document.getElementById('asgFilter');
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
  
    // ---- Submit modal ----
    const modal = document.getElementById('submitModal');
    const smForm = document.getElementById('smForm');
    const smDone = document.getElementById('smDone');
    const smTitle = document.getElementById('smTitle');
    const smSub = document.getElementById('smSub');
    const smDue = document.getElementById('smDue');
    const smDoneSub = document.getElementById('smDoneSub');
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const fileChips = document.getElementById('fileChips');
    const smNote = document.getElementById('smNote');
    const smAgree = document.getElementById('smAgree');
    const smSubmit = document.getElementById('smSubmit');
    let files = [];
  
    const fmtSize = b => b < 1024 ? b + ' B' : b < 1048576 ? (b/1024).toFixed(0) + ' KB' : (b/1048576).toFixed(1) + ' MB';
  
    function renderFiles() {
      fileChips.innerHTML = '';
      files.forEach((f, i) => {
        const chip = document.createElement('div');
        chip.className = 'file-chip';
        chip.innerHTML = '<span class="fc-ico"><i data-lucide="file"></i></span>' +
          '<span class="fc-name"></span>' +
          '<span class="fc-size">' + fmtSize(f.size) + '</span>' +
          '<button class="fc-rm" aria-label="Xóa"><i data-lucide="x"></i></button>';
        chip.querySelector('.fc-name').textContent = f.name;
        chip.querySelector('.fc-rm').addEventListener('click', () => { files.splice(i, 1); renderFiles(); updateSubmit(); });
        fileChips.appendChild(chip);
      });
      lucide.createIcons();
    }
    function addFiles(list) { files = files.concat(Array.from(list)); renderFiles(); updateSubmit(); }
    function updateSubmit() { smSubmit.disabled = !(files.length > 0 && smAgree.checked); }
  
    function openModal(title, sub, due) {
      smTitle.textContent = title;
      smSub.textContent = sub;
      if (due) { smDue.style.display = 'flex'; smDue.innerHTML = '<i data-lucide="clock"></i> ' + due; }
      else { smDue.style.display = 'none'; }
      files = []; renderFiles(); smNote.value = ''; smAgree.checked = false; updateSubmit();
      smForm.style.display = ''; smDone.style.display = 'none';
      modal.classList.add('open'); document.body.style.overflow = 'hidden';
      lucide.createIcons();
    }
    function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
  
    // Open from each "Nộp bài" button
    document.querySelectorAll('.asg').forEach(card => {
      const btn = card.querySelector('.asg-side .btn.primary');
      if (!btn || btn.textContent.trim() !== 'Nộp bài') return;
      btn.addEventListener('click', () => {
        const title = card.querySelector('.am-title').textContent.trim();
        const sub = card.querySelector('.am-sub').textContent.trim();
        const dueEl = card.querySelector('.asg-meta .mm');
        const dueText = dueEl ? 'Hạn nộp: ' + dueEl.textContent.trim().replace(/^Hạn\s*/i, '') : '';
        openModal(title, sub, dueText);
      });
    });
  
    // Dropzone interactions
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => { if (e.target.files.length) addFiles(e.target.files); fileInput.value = ''; });
    ['dragover','dragenter'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.add('drag'); }));
    ['dragleave','drop'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.remove('drag'); }));
    dropzone.addEventListener('drop', e => { if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); });
  
    smAgree.addEventListener('change', updateSubmit);
    document.getElementById('smClose').addEventListener('click', closeModal);
    document.getElementById('smCancel').addEventListener('click', closeModal);
    document.getElementById('smFinish').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  
    smSubmit.addEventListener('click', () => {
      smDoneSub.textContent = 'Đã nộp ' + files.length + ' tệp cho “' + smTitle.textContent + '”. Hệ thống đã ghi nhận lúc ' +
        new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + '.';
      smForm.style.display = 'none'; smDone.style.display = 'block';
      lucide.createIcons();
    });
}
