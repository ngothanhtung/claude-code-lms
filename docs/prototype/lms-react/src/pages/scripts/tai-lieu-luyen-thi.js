export default function init(root) {
  const DOCS = [
      { title: 'Đề thi cuối kỳ OOP (2021–2025)', subj: 'oop', subjLabel: 'Lập trình HĐT', type: 'pdf', size: '4.2 MB', dl: 1840, date: '1 tuần trước', folder: 'oop/dethi', ky: 'cuoi' },
      { title: '120 câu trắc nghiệm OOP có đáp án', subj: 'oop', subjLabel: 'Lập trình HĐT', type: 'doc', size: '1.1 MB', dl: 1320, date: '3 ngày trước', folder: 'oop/luyentap', ky: 'giua' },
      { title: 'Tóm tắt lý thuyết OOP — sơ đồ tư duy', subj: 'oop', subjLabel: 'Lập trình HĐT', type: 'pdf', size: '2.3 MB', dl: 980, date: '2 ngày trước', folder: 'oop/tomtat', ky: 'cuoi' },
      { title: 'Đề thi Cơ sở dữ liệu các năm', subj: 'csdl', subjLabel: 'Cơ sở dữ liệu', type: 'pdf', size: '5.6 MB', dl: 1610, date: '5 ngày trước', folder: 'csdl/dethi', ky: 'cuoi' },
      { title: 'Bộ đề SQL luyện tập có đáp án', subj: 'csdl', subjLabel: 'Cơ sở dữ liệu', type: 'doc', size: '1.4 MB', dl: 1450, date: '1 tuần trước', folder: 'csdl/luyentap', ky: 'giua' },
      { title: 'Tóm tắt chuẩn hóa & truy vấn SQL', subj: 'csdl', subjLabel: 'Cơ sở dữ liệu', type: 'pdf', size: '1.8 MB', dl: 870, date: '4 ngày trước', folder: 'csdl/tomtat', ky: 'cuoi' },
      { title: 'Đề thi CTDL & Giải thuật 2024–2025', subj: 'ctdl', subjLabel: 'CTDL & GT', type: 'pdf', size: '3.1 MB', dl: 1230, date: '1 tuần trước', folder: 'ctdl/dethi', ky: 'cuoi' },
      { title: 'Bài tập thuật toán luyện thi (có lời giải)', subj: 'ctdl', subjLabel: 'CTDL & GT', type: 'doc', size: '2.0 MB', dl: 1040, date: '6 ngày trước', folder: 'ctdl/luyentap', ky: 'giua' },
      { title: 'Đề thi Mạng máy tính các năm', subj: 'net', subjLabel: 'Mạng máy tính', type: 'pdf', size: '3.4 MB', dl: 760, date: '1 tuần trước', folder: 'net/dethi', ky: 'cuoi' },
      { title: 'Tóm tắt mô hình OSI/TCP-IP & công thức', subj: 'net', subjLabel: 'Mạng máy tính', type: 'pdf', size: '1.2 MB', dl: 690, date: '3 ngày trước', folder: 'net/tomtat', ky: 'cuoi' },
      { title: 'Đề thi thử TOEIC (Listening & Reading)', subj: 'eng', subjLabel: 'Tiếng Anh', type: 'pdf', size: '6.8 MB', dl: 1180, date: '2 tuần trước', folder: 'eng/dethi', ky: 'cuoi' },
      { title: 'Bộ đề luyện ngữ pháp có đáp án', subj: 'eng', subjLabel: 'Tiếng Anh', type: 'doc', size: '900 KB', dl: 940, date: '2 tuần trước', folder: 'eng/luyentap', ky: 'giua' }
    ];
  
    const TYPE_META = {
      pdf: { ico: 'file-text', tint: 'ico-tint-red', ext: 'PDF', extc: 'pdf' },
      ppt: { ico: 'presentation', tint: 'ico-tint-amber', ext: 'PPT', extc: 'ppt' },
      doc: { ico: 'file-text', tint: 'ico-tint-blue', ext: 'DOC', extc: 'doc' },
      zip: { ico: 'file-code-2', tint: 'ico-tint-indigo', ext: 'ZIP', extc: 'zip' }
    };
  
    const grid = document.getElementById('docGrid');
    const emptyEl = document.getElementById('libEmpty');
    const libSearch = document.getElementById('libSearch');
    const libCount = document.getElementById('libCount');
    const ftree = document.getElementById('ftree');
    let fQuery = '', fFilter = '';
  
    function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function inFolder(d) { if (!fFilter) return true; const p = fFilter.split(':'); if (p[0] === 'ky') return d.ky === p[1]; if (p[0] === 'mon') return d.subj === p[1]; return true; }
  
    function render() {
      const items = DOCS.filter(d => inFolder(d) && (!fQuery || d.title.toLowerCase().includes(fQuery)));
      grid.innerHTML = '';
      items.forEach(d => {
        const t = TYPE_META[d.type];
        const card = document.createElement('div');
        card.className = 'doc-card';
        card.innerHTML =
          '<div class="doc-ico ' + t.tint + '"><i data-lucide="' + t.ico + '"></i><span class="doc-ext ' + t.extc + '">' + t.ext + '</span></div>' +
          '<div class="doc-body">' +
            '<div class="doc-title">' + esc(d.title) + '</div>' +
            '<div class="doc-meta"><span class="dm"><i data-lucide="hard-drive"></i>' + d.size + '</span>' +
              '<span class="dm"><i data-lucide="download"></i>' + d.dl.toLocaleString('vi-VN') + ' lượt tải</span>' +
              '<span class="dm"><i data-lucide="clock"></i>' + d.date + '</span></div>' +
            '<span class="doc-subj">' + esc(d.subjLabel) + '</span>' +
          '</div>' +
          '<div class="doc-actions">' +
            '<button class="doc-btn dl" title="Tải xuống"><i data-lucide="download"></i></button>' +
            '<button class="doc-btn bm" title="Lưu"><i data-lucide="bookmark"></i></button>' +
          '</div>';
        grid.appendChild(card);
      });
      emptyEl.classList.toggle('show', items.length === 0);
      if (libCount) libCount.textContent = items.length + ' tài liệu';
      lucide.createIcons();
      bindCardActions();
    }
  
    function bindCardActions() {
      grid.querySelectorAll('.doc-btn.bm').forEach(b => {
        b.addEventListener('click', () => { const on = b.classList.toggle('saved'); b.title = on ? 'Đã lưu' : 'Lưu'; });
      });
      grid.querySelectorAll('.doc-btn.dl').forEach(b => {
        b.addEventListener('click', () => { const orig = b.innerHTML; b.innerHTML = '<i data-lucide="check"></i>'; b.classList.add('saved'); lucide.createIcons(); setTimeout(() => { b.innerHTML = orig; b.classList.remove('saved'); lucide.createIcons(); }, 1300); });
      });
    }
  
    libSearch.addEventListener('input', e => { fQuery = e.target.value.trim().toLowerCase(); render(); });
    ftree.addEventListener('click', e => {
      const row = e.target.closest('.frow'); if (!row) return;
      ftree.querySelectorAll('.frow').forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      fFilter = row.dataset.filter;
      render();
    });
  
    render();
}
