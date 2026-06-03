export default function init(root) {
  // Check-in
    const checkinBtn = document.getElementById('checkinBtn');
    checkinBtn.addEventListener('click', () => {
      if (checkinBtn.classList.contains('done')) return;
      checkinBtn.classList.add('done');
      checkinBtn.innerHTML = '<i data-lucide="check-check"></i> Đã điểm danh · 13:02';
      lucide.createIcons();
    });
}
