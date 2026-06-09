## Context

Feature LMS Quiz dành cho học sinh tiểu học — platform cho phép học sinh đăng nhập theo địa bàn hành chính (Tỉnh/Thành → Phường/Xã → Trường học), ghép nhóm 2 người cùng lớp, và làm bài quiz theo cặp. Đây là một hệ thống độc lập, được xây dựng mới hoàn toàn.

Yêu cầu phi chức năng:
- UI đơn giản, dễ thao tác — học sinh lớp 1-5 có thể tự dùng được.
- Mobile-first — học sinh dùng trên tablet/điện thoại của phụ huynh hoặc máy tính trong phòng tin.
- Đồng bộ trạng thái làm bài theo thời gian thực giữa 2 học sinh trong cùng nhóm.
- Dữ liệu kết quả bài làm phải được lưu bền vững, phục vụ thống kê và báo cáo.

## Goals / Non-Goals

**Goals:**
- Học sinh có thể login bằng luồng Tỉnh/Thành → Phường/Xã → Trường học → Password.
- Học sinh có thể chọn Khối, Lớp và ghép nhóm với 1 bạn khác (tối đa 2 người/nhóm).
- Học sinh có thể xem danh sách quiz được giao.
- Hai học sinh cùng nhóm có thể làm chung 1 bài quiz với trạng thái đồng bộ real-time.
- Kết quả quiz (điểm, đáp án, thời gian) được lưu vào database.

**Non-Goals:**
- Quản lý người dùng (CRUD học sinh/giáo viên) — dữ liệu seed từ nguồn khác.
- Tạo quiz và quản lý câu hỏi — giả định quiz, câu hỏi đã được tạo sẵn bởi admin.
- Phân quyền phức tạp (RBAC) — chỉ có 1 role học sinh trong phạm vi feature này.
- Giao tiếp real-time video/audio giữa 2 học sinh.
- Bảng điều khiển admin, dashboard giáo viên.

## Decisions

### 1. Tech Stack: NestJS + PostgreSQL + React (Next.js)

| Thành phần | Công nghệ | Lý do |
|---|---|---|
| Backend | NestJS (Node.js) | Cấu trúc module rõ ràng, hỗ trợ WebSocket tốt qua Socket.IO |
| Database | PostgreSQL | Dữ liệu quan hệ phức tạp (địa bàn → trường → lớp → nhóm → quiz → kết quả) |
| ORM | Prisma | Type-safe, migration tự động, phù hợp với schema phức tạp |
| Frontend | Next.js (React) | SSR, routing đơn giản, có thể deploy dưới dạng web app |
| Real-time | Socket.IO | Đồng bộ trạng thái làm bài giữa 2 học sinh |
| UI Kit | Tailwind CSS + shadcn/ui | Giao diện thân thiện, responsive, tối ưu mobile |

**Alternative considered**: Firebase Realtime Database — loại bỏ vì cấu trúc dữ liệu quan hệ phức tạp và cần kiểm soát server-side.

### 2. Auth: Location-based password (không OAuth)

Học sinh không có email, không dùng OAuth được. Luồng login dựa trên:
- Dữ liệu địa bàn hành chính (tỉnh/huyện/xã) được seed từ danh mục chuẩn của Việt Nam.
- Mỗi trường có một password chung (do admin/giáo viên quản lý).
- Mỗi học sinh có mã định danh riêng (ví dụ: `MSSV`) + password cá nhân (hoặc dùng chung password của trường nếu đơn giản).

**Quyết định**: Dùng password cấp trường (1 password cho tất cả học sinh của trường) để đơn giản hóa luồng đăng nhập cho học sinh tiểu học. Nếu cần bảo mật cao hơn, mỗi học sinh có thể có password riêng — thiết kế DB đã hỗ trợ.

### 3. Nhóm 2 người: Join-based, không ghép tự động

Học sinh chủ động tạo nhóm hoặc join nhóm của bạn:
- **Tạo nhóm**: Học sinh A chọn "Tạo nhóm" → nhóm được tạo với trạng thái `WAITING` → hiển thị mã/giao diện để học sinh B join.
- **Join nhóm**: Học sinh B thấy danh sách nhóm đang chờ của lớp → chọn "Tham gia" → nhóm chuyển trạng thái `ACTIVE`.
- Nếu 1 học sinh rời đi/disconnect, nhóm chuyển về `WAITING` và học sinh còn lại được thông báo.

### 4. Đồng bộ real-time khi làm quiz qua Socket.IO

- Khi bắt đầu quiz, server tạo một `quiz session` và emit sự kiện qua Socket.IO room.
- Cả 2 học sinh join room → state câu hỏi hiện tại, đáp án đã chọn, timer được đồng bộ.
- **Chốt đáp án**: Học sinh A chọn đáp án → emit event → server broadcast cho học sinh B thấy lựa chọn. Mỗi câu hỏi chỉ nhận 1 lần chốt đáp án cuối cùng (có thể thay đổi trước khi submit).
- **Kết thúc**: Cả 2 học sinh phải confirm kết thúc, hoặc timeout.

### 5. Database Schema (Prisma)

**Core tables:**

- `Provinces` — tỉnh/thành phố
- `Districts` — quận/huyện
- `Wards` — phường/xã
- `Schools` — trường học (thuộc xã, có school_password)
- `Students` — học sinh (thuộc trường, có student_code, student_password)
- `Grades` — khối lớp (1-5)
- `Classes` — lớp học
- `StudentClasses` — học sinh thuộc lớp nào
- `Groups` — nhóm 2 người (status: WAITING | ACTIVE | DISBANDED)
- `GroupMembers` — thành viên nhóm
- `Quizzes` — bài quiz (thuộc lớp, gồm nhiều câu hỏi)
- `Questions` — câu hỏi trong quiz (thuộc quiz)
- `QuizAttempts` — phiên làm quiz (thuộc nhóm, ghi lại điểm tổng)
- `QuizAnswers` — đáp án từng câu trong phiên làm

### 6. API Design (RESTful)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/provinces` | Danh sách tỉnh/thành |
| GET | `/api/districts?provinceId=` | Danh sách quận/huyện theo tỉnh |
| GET | `/api/wards?districtId=` | Danh sách phường/xã theo quận/huyện |
| GET | `/api/schools?wardId=` | Danh sách trường theo xã |
| POST | `/api/auth/student-login` | Login (schoolId + schoolPassword + studentCode + studentPassword) |
| GET | `/api/grades` | Danh sách khối |
| GET | `/api/classes?gradeId=&schoolId=` | Danh sách lớp theo khối và trường |
| GET | `/api/groups?classId=&studentId=` | Danh sách nhóm + trạng thái |
| POST | `/api/groups` | Tạo nhóm mới |
| POST | `/api/groups/join` | Tham gia nhóm |
| GET | `/api/quizzes?groupId=` | Danh sách quiz cho nhóm |
| POST | `/api/quiz-sessions` | Bắt đầu làm quiz (tạo session) |
| WS | `socket.io` | Đồng bộ làm bài real-time |
| POST | `/api/quiz-attempts/:id/submit` | Nộp bài |

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| **Mất kết nối mạng khi đang làm quiz** | Session state được lưu trên server; khi reconnect, khôi phục trạng thái câu hỏi hiện tại. Học sinh không bị mất tiến độ. |
| **Cả 2 học sinh chọn đáp án khác nhau** | Mỗi câu hỏi lưu lịch sử chọn của từng học sinh. Đáp án cuối cùng là đáp án của lần chốt gần nhất (last-write-wins). Có thể config: ưu tiên đáp án của học sinh A nếu cần. |
| **Deadlock khi cả 2 cùng tạo nhóm** | Server đảm bảo mỗi học sinh chỉ ở trong 1 nhóm ACTIVE tại 1 thời điểm; tạo nhóm mới tự động rời nhóm cũ (nếu là WAITING). |
| **Dữ liệu địa bàn hành chính thay đổi** | Dùng danh mục chuẩn của Bộ TTTT; seed 1 lần và chỉ cập nhật khi có phiên bản mới. Không cho phép sửa qua UI. |
| **Password cấp trường bị lộ** | School password có thể đổi được (qua admin). Nếu cần security cao hơn, mỗi học sinh có password riêng — schema DB đã hỗ trợ sẵn. |
| **Học sinh chưa biết đọc/viết (lớp 1)** | UI dùng icon/hình ảnh nhiều, chữ to, có thể thêm hướng dẫn bằng giọng nói (out of scope hiện tại, note cho UX phase). |
