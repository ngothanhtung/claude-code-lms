## Why

Học sinh tiểu học cần một nền tảng làm bài quiz theo nhóm đơn giản, phù hợp với lứa tuổi. Hiện tại chưa có công cụ nào cho phép học sinh đăng nhập bằng thông tin địa phương (tỉnh/thành → phường/xã → trường học), chọn nhóm 2 bạn cùng lớp, và cùng nhau làm quiz. Giải pháp này giúp tăng tính tương tác, giảm áp lực thi cử cá nhân, và tạo thói quen học nhóm ngay từ bậc tiểu học.

## What Changes

- **Hệ thống đăng nhập theo địa bàn**: Học sinh login qua 4 bước — chọn Tỉnh/Thành phố → chọn Phường/Xã → chọn Trường học → nhập Password (mật khẩu do trường cấp).
- **Cơ chế chọn nhóm 2 người**: Sau login, học sinh chọn Khối (lớp 1-5), chọn Lớp, sau đó ghép nhóm với 1 bạn khác hoặc tạo nhóm mới (mỗi nhóm tối đa 2 thành viên).
- **Danh sách Quiz theo lớp/nhóm**: Hiển thị các quiz được giao cho lớp/nhóm, mỗi quiz gồm n câu hỏi trắc nghiệm.
- **Làm bài theo cặp**: Hai học sinh cùng nhóm làm chung 1 bài quiz trên cùng một phiên làm bài. Kết quả được ghi nhận cho cả nhóm.
- **Lưu kết quả & thống kê**: Điểm số, thời gian hoàn thành, đáp án được lưu vào database để giáo viên/theo dõi.

## Capabilities

### New Capabilities
- `location-based-auth`: Đăng nhập theo địa bàn hành chính — Tỉnh/Thành → Phường/Xã → Trường học → mật khẩu. Dữ liệu địa bàn được import từ danh mục hành chính Việt Nam.
- `class-grouping`: Chọn Khối, Lớp, và ghép nhóm 2 học sinh. Quản lý trạng thái nhóm (chưa có nhóm, đang chờ, đã ghép).
- `quiz-list`: Hiển thị danh sách quiz theo lớp/nhóm — bao gồm trạng thái (chưa làm, đã làm, đang làm), thời hạn, số câu hỏi.
- `paired-quiz-taking`: Hai học sinh cùng làm 1 quiz trên cùng một phiên — đồng bộ trạng thái câu hỏi, hiển thị câu hỏi, chọn đáp án, chuyển câu.
- `quiz-result`: Lưu kết quả bài làm (điểm số, đáp án từng câu, thời gian) vào database; hiển thị kết quả sau khi hoàn thành.

### Modified Capabilities
- <!-- Không có spec nào hiện tại bị thay đổi — đây là feature hoàn toàn mới -->

## Impact

- **Mới**: Backend API mới (Node.js/NestJS hoặc tương đương), cơ sở dữ liệu (PostgreSQL/MySQL) với các bảng users, locations, schools, classes, groups, quizzes, questions, quiz_attempts, answers.
- **Mới**: Frontend UI dạng mobile-first web app (React/Vue), tối ưu cho màn hình nhỏ, thao tác đơn giản cho học sinh tiểu học.
- **Phụ thuộc mới**: Dữ liệu danh mục hành chính Việt Nam (tỉnh/huyện/xã), danh sách trường học.
- **Không ảnh hưởng**: Feature độc lập, không sửa đổi hệ thống hiện có.
