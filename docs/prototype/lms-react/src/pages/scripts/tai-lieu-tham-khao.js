export default function init(root) {
  const DOCS = [
      { title: 'Giáo trình Lập trình hướng đối tượng (Java)', subj: 'oop', subjLabel: 'Lập trình HĐT', type: 'pdf', size: '18 MB', dl: 1240, date: 'Đầu kỳ', folder: 'oop/giaotrinh' },
      { title: 'Slide bài giảng chương 1–7 (OOP)', subj: 'oop', subjLabel: 'Lập trình HĐT', type: 'ppt', size: '12 MB', dl: 980, date: '1 tuần trước', folder: 'oop/slide' },
      { title: 'Demo_Inheritance — mã nguồn ví dụ', subj: 'oop', subjLabel: 'Lập trình HĐT', type: 'zip', size: '240 KB', dl: 612, date: '3 ngày trước', folder: 'oop/manguon' },
      { title: 'Giáo trình Cơ sở dữ liệu', subj: 'csdl', subjLabel: 'Cơ sở dữ liệu', type: 'pdf', size: '22 MB', dl: 1105, date: 'Đầu kỳ', folder: 'csdl/giaotrinh' },
      { title: 'Bài giảng SQL nâng cao', subj: 'csdl', subjLabel: 'Cơ sở dữ liệu', type: 'pdf', size: '6.4 MB', dl: 740, date: '5 ngày trước', folder: 'csdl/giaotrinh' },
      { title: 'Bộ đề SQL có lời giải', subj: 'csdl', subjLabel: 'Cơ sở dữ liệu', type: 'doc', size: '1.2 MB', dl: 856, date: '2 tuần trước', folder: 'csdl/de' },
      { title: 'Giáo trình Cấu trúc dữ liệu & Giải thuật', subj: 'ctdl', subjLabel: 'CTDL & GT', type: 'pdf', size: '16 MB', dl: 990, date: 'Đầu kỳ', folder: 'ctdl/giaotrinh' },
      { title: 'Slide thuật toán sắp xếp & tìm kiếm', subj: 'ctdl', subjLabel: 'CTDL & GT', type: 'ppt', size: '8 MB', dl: 533, date: 'Hôm qua', folder: 'ctdl/slide' },
      { title: 'Computer Networking — A Top-Down Approach', subj: 'net', subjLabel: 'Mạng máy tính', type: 'pdf', size: '28 MB', dl: 421, date: 'Đầu kỳ', folder: 'net/giaotrinh' },
      { title: 'Hướng dẫn thực hành Wireshark', subj: 'net', subjLabel: 'Mạng máy tính', type: 'pdf', size: '3 MB', dl: 318, date: '1 tuần trước', folder: 'net/giaotrinh' },
      { title: 'Academic Vocabulary — danh sách từ vựng', subj: 'eng', subjLabel: 'Tiếng Anh', type: 'pdf', size: '900 KB', dl: 690, date: '2 tuần trước', folder: 'eng/luyenky' },
      { title: 'IELTS Speaking — bộ chủ đề luyện tập', subj: 'eng', subjLabel: 'Tiếng Anh', type: 'doc', size: '600 KB', dl: 745, date: '3 tuần trước', folder: 'eng/luyenky' }
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
    let fType = 'all', fSubj = 'all', fQuery = '', fFolder = '';
  
    const FOLDER_LABELS = {
      '': 'Tất cả tài liệu',
      'oop': 'Lập trình HĐT', 'oop/giaotrinh': 'Giáo trình', 'oop/slide': 'Slide bài giảng', 'oop/manguon': 'Mã nguồn',
      'csdl': 'Cơ sở dữ liệu', 'csdl/giaotrinh': 'Giáo trình', 'csdl/de': 'Đề & lời giải',
      'ctdl': 'CTDL & GT', 'ctdl/giaotrinh': 'Giáo trình', 'ctdl/slide': 'Slide bài giảng',
      'net': 'Mạng máy tính', 'net/giaotrinh': 'Giáo trình & Lab',
      'eng': 'Tiếng Anh', 'eng/luyenky': 'Luyện kỹ năng'
    };
    const SUBJ_LABELS = {};
    const libLoc = document.getElementById('libLoc');
    const libCount = document.getElementById('libCount');
    const ftree = document.getElementById('ftree');
    function inFolder(d) { if (!fFolder) return true; return d.folder === fFolder || d.folder.indexOf(fFolder + '/') === 0; }
    function locLabel() {
      if (fFolder) { if (fFolder.indexOf('/') > -1) { return FOLDER_LABELS[fFolder.split('/')[0]] + ' / ' + FOLDER_LABELS[fFolder]; } return FOLDER_LABELS[fFolder]; }
      if (fSubj !== 'all') return SUBJ_LABELS[fSubj] || 'Tài liệu';
      return 'Tất cả tài liệu';
    }
    function updateLoc(n) { if (libLoc) libLoc.textContent = locLabel(); if (libCount) libCount.textContent = n + ' tài liệu'; }
  
    function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    DOCS.forEach(d => { SUBJ_LABELS[d.subj] = d.subjLabel; });
  
    function render() {
      const items = DOCS.filter(d =>
        inFolder(d) &&
        (fType === 'all' || d.type === fType) &&
        (fSubj === 'all' || d.subj === fSubj) &&
        (!fQuery || d.title.toLowerCase().includes(fQuery))
      );
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
      updateLoc(items.length);
      lucide.createIcons();
      bindCardActions();
    }
  
    function bindCardActions() {
      grid.querySelectorAll('.doc-btn.bm').forEach(b => {
        b.addEventListener('click', () => {
          const on = b.classList.toggle('saved');
          b.title = on ? 'Đã lưu' : 'Lưu';
        });
      });
      grid.querySelectorAll('.doc-btn.dl').forEach(b => {
        b.addEventListener('click', () => {
          const orig = b.innerHTML;
          b.innerHTML = '<i data-lucide="check"></i>'; b.classList.add('saved'); lucide.createIcons();
          setTimeout(() => { b.innerHTML = orig; b.classList.remove('saved'); lucide.createIcons(); }, 1300);
        });
      });
    }
  
    libSearch.addEventListener('input', e => { fQuery = e.target.value.trim().toLowerCase(); render(); });
  
    // Folder tree → browse folder, show matching files
    ftree.addEventListener('click', e => {
      const row = e.target.closest('.frow'); if (!row) return;
      if (row.classList.contains('fparent')) row.closest('.fnode').classList.toggle('open');
      ftree.querySelectorAll('.frow').forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      fFolder = row.dataset.folder;
      fSubj = 'all';
      render();
    });
  
    render();
}
