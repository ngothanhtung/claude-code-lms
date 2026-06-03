# LMS Portal — React + Vite

Bản chuyển đổi của LMS Portal (trước đây là các trang HTML tĩnh) sang **React + Vite**
với điều hướng SPA bằng `react-router-dom`.

## Chạy dự án

```bash
npm install
npm run dev      # mở http://localhost:5173
npm run build    # build production vào dist/
npm run preview  # xem thử bản build
```

> Yêu cầu Node.js 18+.

## Kiến trúc

```
src/
  main.jsx                 # mount React + import CSS toàn cục (theme.css, dashboard.css)
  App.jsx                  # bảng <Routes> sinh từ routes.js
  routes.js                # 1 nguồn sự thật cho route + map "*.html" → đường dẫn SPA
  styles/                  # theme.css + dashboard.css (giữ nguyên design tokens)
  components/
    AppLayout.jsx          # khung dùng chung: Sidebar + Topbar + <Outlet/>
    Sidebar.jsx            # menu trái (React thật, active/nhóm theo route)
    Topbar.jsx             # thanh trên (React thật, dropdown hồ sơ)
    Page.jsx               # nạp nội dung từng trang theo slug
    HtmlPage.jsx           # render fragment + chạy script riêng + bắt link nội bộ
  pages/
    content/<slug>.html    # phần nội dung gốc của mỗi trang (kèm CSS riêng)
    scripts/<slug>.js      # logic riêng của trang, export default init(root)
```

### Cách hoạt động
- **Khung (Sidebar/Topbar)** đã được viết lại thành **React component thật**, dùng chung
  cho mọi trang — thay vì lặp lại ở 21 file HTML. Trạng thái thu gọn sidebar, dropdown hồ sơ,
  mở/đóng nhóm menu, active theo route đều bằng React state.
- **Nội dung từng trang** được tách thành 2 phần: `content/<slug>.html` (markup + CSS riêng)
  và `scripts/<slug>.js` (logic riêng — lọc, tab, modal, accordion…). `HtmlPage` chèn nội dung
  và chạy `init(root)` khi mount, dọn dẹp khi rời trang.
- **Icon**: dùng Lucide bản global (nạp 1 lần trong `index.html`); `lucide.createIcons()`
  được gọi lại sau mỗi lần render trang.
- **Liên kết nội bộ**: các `<a href="x.html">` trong nội dung được tự động chuyển sang
  route SPA tương ứng (xem `routes.js`); điều hướng bằng `window.location.href` trong script
  cũ được viết lại thành `window.__spaNav('x.html')`.

## Lộ trình hoàn thiện (khuyến nghị)
Đây là **nền tảng chạy được** cho toàn bộ 21 trang. Để tiến tới React thuần (và dễ chuyển
sang Next.js sau này), nên dần thay từng cặp `content/<slug>.html` + `scripts/<slug>.js`
bằng **một component JSX viết tay**, rồi trỏ route trong `App.jsx`/`routes.js` sang component đó.
Ưu tiên các trang tương tác nhiều: `tai-lieu-*`, `ai-chat`, `calendar`, `support`.

## Chuyển sang Next.js sau này
- `react-router` routes → thư mục `app/` (App Router) của Next.js.
- `AppLayout` → `app/layout.jsx`.
- Mỗi trang → `app/<route>/page.jsx`.
- `theme.css` + `dashboard.css` → `app/globals.css`.
- Đổi `lucide` global sang package `lucide-react`.
