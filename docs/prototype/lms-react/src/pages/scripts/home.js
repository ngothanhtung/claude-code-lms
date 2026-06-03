export default function init(root) {
  // Hôm nay: hiển thị ngày hiện tại
    (function(){
      const el = document.getElementById('gdValue');
      if (!el) return;
      const d = new Date();
      const thu = d.getDay() === 0 ? 'Chủ nhật' : 'Thứ ' + (d.getDay() + 1);
      const p = n => String(n).padStart(2, '0');
      el.textContent = thu + ', ' + p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear();
    })();
    // Dismiss announcement banner
    const bc = document.getElementById('bannerClose');
    if (bc) bc.addEventListener('click', () => {
      const b = document.getElementById('banner');
      b.style.transition = 'opacity .2s, transform .2s';
      b.style.opacity = '0'; b.style.transform = 'translateY(-6px)';
      setTimeout(() => b.remove(), 200);
    });
    // Active nav switching (top-level items, excluding the expandable parent)
    document.querySelectorAll('.nav-item:not(.nav-parent)').forEach(n => {
      n.addEventListener('click', e => {
        // Let real links (with a non-"#" href) navigate normally
        const href = n.getAttribute('href');
        if (href && href !== '#') return;
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
        document.querySelectorAll('.nav-subitem').forEach(x => x.classList.remove('active'));
        n.classList.add('active');
      });
    });
     (topbar menu button → icon-only rail)
    
    // Submenu item active state
    // ---- Contact instructor modal ----
    (function(){
      const overlay = document.getElementById('contactModal');
      if (!overlay) return;
      const openBtn = document.getElementById('contactTeacherBtn');
      const form = document.getElementById('contactForm');
      const fileInput = document.getElementById('cmFile');
      const fileList = document.getElementById('cmFileList');
      const dropzone = document.querySelector('.dropzone');
      const success = document.getElementById('cmSuccess');
      let files = [];
      let lastFocus = null;
  
      function open(e){ if (e) e.preventDefault(); lastFocus = document.activeElement; overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; setTimeout(()=>document.getElementById('cmTeacher').focus(), 60); }
      function close(){ overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); setTimeout(reset, 220); }
      function reset(){ form.reset(); files = []; renderFiles(); success.hidden = true; form.hidden = false; document.querySelector('.modal-foot').hidden = false; document.querySelectorAll('#contactForm .invalid').forEach(el=>el.classList.remove('invalid')); document.querySelectorAll('#cmPriority .chip').forEach((c,i)=>c.classList.toggle('active', i===0)); }
  
      openBtn.addEventListener('click', open);
      document.getElementById('cmClose').addEventListener('click', close);
      document.getElementById('cmCancel').addEventListener('click', close);
      document.getElementById('cmDone').addEventListener('click', close);
      overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });
  
      // Priority chips
      document.querySelectorAll('#cmPriority .chip').forEach(chip => {
        chip.addEventListener('click', () => {
          document.querySelectorAll('#cmPriority .chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        });
      });
  
      // File handling
      function fmtSize(b){ return b < 1024 ? b + ' B' : b < 1048576 ? (b/1024).toFixed(0) + ' KB' : (b/1048576).toFixed(1) + ' MB'; }
      function renderFiles(){
        fileList.innerHTML = '';
        files.forEach((f, i) => {
          const row = document.createElement('div');
          row.className = 'file-chip';
          row.innerHTML = '<i data-lucide="file"></i><span class="fc-name"></span><span class="fc-size"></span><button type="button" class="fc-x" aria-label="Xóa"><i data-lucide="x" class="icon-sm"></i></button>';
          row.querySelector('.fc-name').textContent = f.name;
          row.querySelector('.fc-size').textContent = fmtSize(f.size);
          row.querySelector('.fc-x').addEventListener('click', () => { files.splice(i,1); renderFiles(); });
          fileList.appendChild(row);
        });
        if (window.lucide) lucide.createIcons();
      }
      fileInput.addEventListener('change', () => { files = files.concat(Array.from(fileInput.files)); fileInput.value = ''; renderFiles(); });
      ['dragover','dragenter'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.add('drag'); }));
      ['dragleave','drop'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.remove('drag'); }));
      dropzone.addEventListener('drop', e => { if (e.dataTransfer.files.length) { files = files.concat(Array.from(e.dataTransfer.files)); renderFiles(); } });
  
      // Submit
      form.addEventListener('submit', e => {
        e.preventDefault();
        let ok = true;
        const teacher = document.getElementById('cmTeacher');
        const subject = document.getElementById('cmSubject');
        const message = document.getElementById('cmMessage');
        [['cmTeacher', teacher.value], ['cmSubject', subject.value.trim()], ['cmMessage', message.value.trim()]].forEach(([id, val]) => {
          const el = document.getElementById(id);
          const target = id === 'cmTeacher' ? el.closest('.select-wrap') : el;
          if (!val) { target.classList.add('invalid'); ok = false; } else { target.classList.remove('invalid'); }
        });
        if (!ok) return;
        form.hidden = true;
        document.querySelector('.modal-foot').hidden = true;
        success.hidden = false;
        if (window.lucide) lucide.createIcons();
      });
      [['cmSubject','cmSubject'],['cmMessage','cmMessage']].forEach(([id]) => {
        document.getElementById(id).addEventListener('input', e => e.target.classList.remove('invalid'));
      });
      document.getElementById('cmTeacher').addEventListener('change', e => e.target.closest('.select-wrap').classList.remove('invalid'));
    })();
}
