export default function init(root) {
  // ---- Registration logic ----
    const RATE = 850000;
    const MAX_CRED = 24;
    const cart = new Map(); // id -> {name, code, credits}
  
    const cartList = document.getElementById('cartList');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFoot = document.getElementById('cartFoot');
    const credNow = document.getElementById('credNow');
    const credFill = document.getElementById('credFill');
    const cartCount = document.getElementById('cartCount');
    const footCred = document.getElementById('footCred');
    const footFee = document.getElementById('footFee');
  
    function fmt(n) { return n.toLocaleString('vi-VN') + 'đ'; }
  
    function render() {
      const totalCred = [...cart.values()].reduce((s, c) => s + c.credits, 0);
      credNow.textContent = totalCred;
      footCred.textContent = totalCred;
      footFee.textContent = fmt(totalCred * RATE);
      credFill.style.width = Math.min(100, (totalCred / MAX_CRED) * 100) + '%';
      cartCount.textContent = cart.size + ' môn';
  
      cartEmpty.style.display = cart.size ? 'none' : 'block';
      cartFoot.style.display = cart.size ? 'block' : 'none';
  
      cartList.innerHTML = '';
      cart.forEach((c, id) => {
        const el = document.createElement('div');
        el.className = 'citem';
        el.innerHTML = `
          <div class="citem-body">
            <div class="citem-name">${c.name}</div>
            <div class="citem-sub">${c.code}</div>
          </div>
          <span class="citem-cr">${c.credits} TC</span>
          <button class="citem-x" data-rm="${id}" aria-label="Xóa"><i data-lucide="x"></i></button>`;
        cartList.appendChild(el);
      });
      lucide.createIcons();
  
      cartList.querySelectorAll('[data-rm]').forEach(b => {
        b.addEventListener('click', () => toggle(b.dataset.rm));
      });
    }
  
    function toggle(id) {
      const row = document.querySelector(`.crow[data-id="${id}"]`);
      if (!row) return;
      const btn = row.querySelector('.reg-btn');
      if (btn.classList.contains('disabled')) return;
  
      if (cart.has(id)) {
        cart.delete(id);
        row.classList.remove('added');
        btn.classList.remove('remove');
        btn.innerHTML = '<i data-lucide="plus"></i> Đăng ký';
      } else {
        const totalCred = [...cart.values()].reduce((s, c) => s + c.credits, 0);
        const credits = +row.dataset.credits;
        if (totalCred + credits > MAX_CRED) {
          alert('Vượt quá giới hạn ' + MAX_CRED + ' tín chỉ mỗi học kỳ.');
          return;
        }
        cart.set(id, {
          name: row.querySelector('.crow-name').textContent,
          code: row.querySelector('.crow-code').textContent,
          credits
        });
        row.classList.add('added');
        btn.classList.add('remove');
        btn.innerHTML = '<i data-lucide="check"></i> Đã chọn';
      }
      lucide.createIcons();
      render();
    }
  
    document.querySelectorAll('.crow .reg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.crow');
        toggle(row.dataset.id);
      });
    });
  
    // Filters + search
    const chips = document.getElementById('filterChips');
    const searchInput = document.getElementById('courseSearch');
    const noResults = document.getElementById('noResults');
    let activeFilter = 'all';
  
    function applyFilter() {
      const q = searchInput.value.trim().toLowerCase();
      let visible = 0;
      document.querySelectorAll('.crow').forEach(row => {
        const matchType =
          activeFilter === 'all' ? true :
          activeFilter === 'open' ? +row.dataset.slots > 0 :
          row.dataset.type === activeFilter;
        const text = (row.querySelector('.crow-name').textContent + ' ' + row.querySelector('.crow-code').textContent).toLowerCase();
        const matchSearch = !q || text.includes(q);
        const show = matchType && matchSearch;
        row.style.display = show ? 'flex' : 'none';
        if (show) visible++;
      });
      noResults.style.display = visible ? 'none' : 'block';
    }
  
    chips.querySelectorAll('.fchip').forEach(c => {
      c.addEventListener('click', () => {
        chips.querySelectorAll('.fchip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        activeFilter = c.dataset.filter;
        applyFilter();
      });
    });
    searchInput.addEventListener('input', applyFilter);
  
    document.getElementById('confirmBtn').addEventListener('click', () => {
      alert('Đã gửi phiếu đăng ký ' + cart.size + ' học phần. Vui lòng kiểm tra email xác nhận.');
    });
  
    render();
}
