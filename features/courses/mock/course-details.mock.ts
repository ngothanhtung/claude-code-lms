// features/courses/mock/course-details.mock.ts

export interface PostAttachment {
  name: string
  sub: string
  type: "pdf" | "doc" | "zip" | "video" | "xls"
}

export interface StreamPost {
  id: string
  author: string
  role: string
  avatar: string
  time: string
  text: string
  attach?: PostAttachment
  likes: number
  comments: number
  liked: boolean
}

export interface LessonItem {
  id: string
  name: string
  duration: string
  type: "play" | "file" | "code" | "lock"
  done: boolean
}

export interface SyllabusWeek {
  id: string
  title: string
  subtitle: string
  status: "done" | "learning" | "locked"
  lessons: LessonItem[]
}

export interface AssignmentItem {
  id: string
  title: string
  type: "group" | "individual" | "quiz"
  typeLabel: string
  dueLabel: string
  status: "not_submitted" | "submitted" | "graded"
  statusLabel: string
  statusColor: string // "red" | "amber" | "green"
  score?: number
  submittedTime?: string
}

export interface MaterialFile {
  id: string
  name: string
  meta: string
  type: "pdf" | "ppt" | "zip" | "video" | "xls"
}

export interface GradeComponent {
  name: string
  weight: string
  score: string
  isMuted?: boolean
}

export interface DueSoonItem {
  id: string
  title: string
  dueMeta: string
  type: "red" | "amber" | "blue"
}

export interface CourseDetailStatic {
  code: string
  group: string
  room: string
  totalStudents: number
  timeRange: string
  activeLecture: {
    title: string
    studentsCount: number
  }
  instructorInfo: {
    name: string
    department: string
    email: string
    officeHours: string
    office: string
    initials: string
  }
}

export interface CourseFullDetails {
  posts: StreamPost[]
  syllabus: SyllabusWeek[]
  assignments: AssignmentItem[]
  materials: MaterialFile[]
  grades: GradeComponent[]
  dueSoon: DueSoonItem[]
}

export const COURSE_FULL_DETAILS_MAP: Record<string, CourseFullDetails> = {
  violet: {
    posts: [
      {
        id: "p1",
        author: "TS. Nguyễn Minh Tuấn",
        role: "Giảng viên",
        avatar: "NT",
        time: "2 giờ trước",
        text: "Chào các em, tuần này chúng ta sẽ học về <strong>Kế thừa và Đa hình (Inheritance & Polymorphism)</strong>. Các em xem trước slide bài giảng số 7 và chuẩn bị câu hỏi cho buổi học thứ 2 nhé. Bài tập lớn số 2 cũng đã được giao, hạn nộp là <strong>09/06</strong>.",
        attach: {
          name: "Lecture 7 - Inheritance & Polymorphism.pdf",
          sub: "PDF · 3.2 MB",
          type: "pdf",
        },
        likes: 24,
        comments: 6,
        liked: false,
      },
      {
        id: "p2",
        author: "TS. Nguyễn Minh Tuấn",
        role: "Giảng viên",
        avatar: "NT",
        time: "Hôm qua",
        text: "Đã giao bài tập mới: <strong>BTL2 — Xây dựng hệ thống quản lý thư viện bằng Java</strong>. Các em làm theo nhóm 3 người, nộp file mã nguồn kèm báo cáo.",
        attach: {
          name: "BTL2 - Quản lý thư viện.docx",
          sub: "Bài tập · Hạn nộp 09/06/2026",
          type: "doc",
        },
        likes: 18,
        comments: 12,
        liked: false,
      },
      {
        id: "p3",
        author: "Phan Anh",
        role: "Sinh viên",
        avatar: "PA",
        time: "2 ngày trước",
        text: "Thầy ơi cho em hỏi, phần <strong>abstract class</strong> và <strong>interface</strong> khác nhau như thế nào ạ? Em vẫn hơi nhầm lẫn khi nào nên dùng cái nào.",
        likes: 9,
        comments: 3,
        liked: false,
      },
    ],
    syllabus: [
      {
        id: "T1",
        title: "Giới thiệu OOP & Lớp – Đối tượng",
        subtitle: "3 bài học · Đã hoàn thành",
        status: "done",
        lessons: [
          { id: "l1", name: "Bài 1: Tổng quan lập trình hướng đối tượng", duration: "24 phút", type: "play", done: true },
          { id: "l2", name: "Bài 2: Class, Object, thuộc tính và phương thức", duration: "18 phút", type: "file", done: true },
          { id: "l3", name: "Bài 3: Thực hành tạo lớp đầu tiên", duration: "32 phút", type: "code", done: true },
        ],
      },
      {
        id: "T2",
        title: "Đóng gói & Constructor",
        subtitle: "3 bài học · Đã hoàn thành",
        status: "done",
        lessons: [
          { id: "l4", name: "Bài 4: Tính đóng gói (Encapsulation)", duration: "21 phút", type: "play", done: true },
          { id: "l5", name: "Bài 5: Access modifiers & getter/setter", duration: "19 phút", type: "play", done: true },
          { id: "l6", name: "Bài 6: Constructor & nạp chồng hàm", duration: "27 phút", type: "code", done: true },
        ],
      },
      {
        id: "T3",
        title: "Kế thừa & Đa hình",
        subtitle: "3 bài học · Đang học",
        status: "learning",
        lessons: [
          { id: "l7", name: "Bài 7: Tính kế thừa (Inheritance)", duration: "26 phút", type: "play", done: true },
          { id: "l8", name: "Bài 8: Ghi đè phương thức (Override)", duration: "23 phút", type: "play", done: true },
          { id: "l9", name: "Bài 9: Tính đa hình (Polymorphism)", duration: "29 phút", type: "play", done: false },
        ],
      },
      {
        id: "T4",
        title: "Abstract Class & Interface",
        subtitle: "3 bài học · Chưa mở khóa",
        status: "locked",
        lessons: [
          { id: "l10", name: "Bài 10: Lớp trừu tượng (Abstract)", duration: "25 phút", type: "lock", done: false },
          { id: "l11", name: "Bài 11: Interface trong Java", duration: "22 phút", type: "lock", done: false },
          { id: "l12", name: "Bài 12: So sánh Abstract vs Interface", duration: "17 phút", type: "lock", done: false },
        ],
      },
    ],
    assignments: [
      {
        id: "a1",
        title: "BTL2 — Quản lý thư viện (Java)",
        type: "group",
        typeLabel: "Bài tập nhóm",
        dueLabel: "Còn 9 ngày",
        status: "not_submitted",
        statusLabel: "Chưa nộp",
        statusColor: "red",
      },
      {
        id: "a2",
        title: "Bài tập 1 — Kế thừa & đa hình",
        type: "individual",
        typeLabel: "Cá nhân",
        dueLabel: "Đã nộp 28/05",
        status: "submitted",
        statusLabel: "Đang chấm",
        statusColor: "amber",
        submittedTime: "Nộp lúc 23:14",
      },
      {
        id: "a3",
        title: "Quiz 1 — Lớp & Đối tượng",
        type: "quiz",
        typeLabel: "20 câu trắc nghiệm",
        dueLabel: "15/05",
        status: "graded",
        statusLabel: "Đã chấm",
        statusColor: "green",
        score: 9.0,
      },
      {
        id: "a4",
        title: "Bài thực hành — Constructor & Encapsulation",
        type: "individual",
        typeLabel: "Cá nhân",
        dueLabel: "08/05",
        status: "graded",
        statusLabel: "Đã chấm",
        statusColor: "green",
        score: 8.5,
      },
    ],
    materials: [
      {
        id: "f1",
        name: "Lecture 7 - Inheritance & Polymorphism.pdf",
        meta: "PDF · 3.2 MB · 2 giờ trước",
        type: "pdf",
      },
      {
        id: "f2",
        name: "Slide chương 3 - Đóng gói.pptx",
        meta: "PowerPoint · 5.8 MB · 1 tuần trước",
        type: "ppt",
      },
      {
        id: "f3",
        name: "Demo_Inheritance.zip",
        meta: "Mã nguồn · 124 KB · 1 tuần trước",
        type: "zip",
      },
      {
        id: "f4",
        name: "Buổi học 06 - Ghi hình.mp4",
        meta: "Video · 412 MB · 1 tuần trước",
        type: "video",
      },
      {
        id: "f5",
        name: "Giáo trình OOP - Bản đầy đủ.pdf",
        meta: "PDF · 18 MB · Đầu kỳ",
        type: "pdf",
      },
      {
        id: "f6",
        name: "Đề cương chi tiết môn học.xlsx",
        meta: "Excel · 64 KB · Đầu kỳ",
        type: "xls",
      },
    ],
    grades: [
      { name: "Chuyên cần", weight: "10%", score: "10.0" },
      { name: "Quiz & bài thực hành", weight: "20%", score: "8.8" },
      { name: "Bài tập lớn (BTL)", weight: "30%", score: "—", isMuted: true },
      { name: "Thi cuối kỳ", weight: "40%", score: "—", isMuted: true },
    ],
    dueSoon: [
      {
        id: "d1",
        title: "BTL2 — Quản lý thư viện",
        dueMeta: "Hạn 09/06 · còn 9 ngày",
        type: "red",
      },
      {
        id: "d2",
        title: "Đọc trước Lecture 7",
        dueMeta: "Trước buổi học thứ 2",
        type: "amber",
      },
      {
        id: "d3",
        title: "Kiểm tra giữa kỳ",
        dueMeta: "20/06 · Phòng D9-401",
        type: "blue",
      },
    ],
  },
  green: {
    posts: [
      {
        id: "p1",
        author: "TS. Trần Thị Hương",
        role: "Giảng viên",
        avatar: "TH",
        time: "1 giờ trước",
        text: "Các em lưu ý đã có Slide bài giảng <strong>Chương 4: Chuẩn hóa cơ sở dữ liệu (Database Normalization)</strong>. Các em cần hoàn thành bài tập thực hành SQL phần Join & Group By trước buổi học tiếp theo.",
        attach: {
          name: "Lecture 4 - Database Normalization.pdf",
          sub: "PDF · 2.8 MB",
          type: "pdf",
        },
        likes: 19,
        comments: 4,
        liked: false,
      },
      {
        id: "p2",
        author: "TS. Trần Thị Hương",
        role: "Giảng viên",
        avatar: "TH",
        time: "Hôm trước",
        text: "Đã giao đề tài <strong>BTL1 — Thiết kế CSDL hệ thống quản lý bán hàng siêu thị</strong>. Các nhóm nhanh chóng đăng ký danh sách thành viên và tên đề tài trước ngày thứ 6 tuần này.",
        attach: {
          name: "De_tai_BTL_CSDL.pdf",
          sub: "Tài liệu · Hạn nộp 10/06/2026",
          type: "pdf",
        },
        likes: 15,
        comments: 8,
        liked: false,
      },
    ],
    syllabus: [
      {
        id: "T1",
        title: "Tổng quan hệ CSDL & Mô hình ERD",
        subtitle: "3 bài học · Đã hoàn thành",
        status: "done",
        lessons: [
          { id: "l1", name: "Bài 1: Giới thiệu chung về Cơ sở dữ liệu", duration: "20 phút", type: "play", done: true },
          { id: "l2", name: "Bài 2: Mô hình thực thể liên kết ERD", duration: "25 phút", type: "file", done: true },
          { id: "l3", name: "Bài 3: Thực hành vẽ ERD bằng Draw.io", duration: "30 phút", type: "code", done: true },
        ],
      },
      {
        id: "T2",
        title: "Mô hình quan hệ & Ngôn ngữ SQL",
        subtitle: "3 bài học · Đã hoàn thành",
        status: "done",
        lessons: [
          { id: "l4", name: "Bài 4: Chuyển đổi ERD sang Mô hình quan hệ", duration: "22 phút", type: "play", done: true },
          { id: "l5", name: "Bài 5: Ngôn ngữ SQL định nghĩa dữ liệu (DDL)", duration: "18 phút", type: "play", done: true },
          { id: "l6", name: "Bài 6: Ngôn ngữ truy vấn dữ liệu (DML)", duration: "35 phút", type: "code", done: true },
        ],
      },
      {
        id: "T3",
        title: "Chuẩn hóa CSDL (Dạng chuẩn 1NF, 2NF, 3NF)",
        subtitle: "3 bài học · Đang học",
        status: "learning",
        lessons: [
          { id: "l7", name: "Bài 7: Phụ thuộc hàm & Khóa của quan hệ", duration: "28 phút", type: "play", done: true },
          { id: "l8", name: "Bài 8: Dạng chuẩn 1NF và 2NF", duration: "24 phút", type: "play", done: true },
          { id: "l9", name: "Bài 9: Dạng chuẩn 3NF & BCNF", duration: "30 phút", type: "play", done: false },
        ],
      },
      {
        id: "T4",
        title: "Giao dịch & An toàn thông tin CSDL",
        subtitle: "3 bài học · Chưa mở khóa",
        status: "locked",
        lessons: [
          { id: "l10", name: "Bài 10: Khái niệm Giao dịch (Transaction) & ACID", duration: "25 phút", type: "lock", done: false },
          { id: "l11", name: "Bài 11: Điều khiển tương tranh & Khóa", duration: "22 phút", type: "lock", done: false },
          { id: "l12", name: "Bài 12: An toàn thông tin & Sao lưu dữ liệu", duration: "20 phút", type: "lock", done: false },
        ],
      },
    ],
    assignments: [
      {
        id: "a1",
        title: "BTL1 — Thiết kế CSDL Quản lý bán hàng",
        type: "group",
        typeLabel: "Bài tập nhóm",
        dueLabel: "Còn 10 ngày",
        status: "not_submitted",
        statusLabel: "Chưa nộp",
        statusColor: "red",
      },
      {
        id: "a2",
        title: "Bài tập thực hành SQL (Join, Subquery, Group By)",
        type: "individual",
        typeLabel: "Cá nhân",
        dueLabel: "Đã nộp 29/05",
        status: "submitted",
        statusLabel: "Đang chấm",
        statusColor: "amber",
        submittedTime: "Nộp lúc 21:05",
      },
      {
        id: "a3",
        title: "Quiz 1 — Mô hình ERD và Ràng buộc dữ liệu",
        type: "quiz",
        typeLabel: "15 câu trắc nghiệm",
        dueLabel: "12/05",
        status: "graded",
        statusLabel: "Đã chấm",
        statusColor: "green",
        score: 8.5,
      },
    ],
    materials: [
      {
        id: "f1",
        name: "Lecture 4 - Database Normalization.pdf",
        meta: "PDF · 2.8 MB · 1 giờ trước",
        type: "pdf",
      },
      {
        id: "f2",
        name: "Slide chương 2 - Mô hình ERD.pptx",
        meta: "PowerPoint · 4.2 MB · 2 tuần trước",
        type: "ppt",
      },
      {
        id: "f3",
        name: "Demo_SQL_Scripts_Join.sql",
        meta: "Mã nguồn · 45 KB · 1 tuần trước",
        type: "zip",
      },
      {
        id: "f4",
        name: "Giáo trình CSDL - Bản dịch tiếng Việt.pdf",
        meta: "PDF · 12 MB · Đầu kỳ",
        type: "pdf",
      },
    ],
    grades: [
      { name: "Chuyên cần", weight: "10%", score: "9.0" },
      { name: "Thực hành & Quiz", weight: "20%", score: "8.5" },
      { name: "Bài tập lớn (BTL)", weight: "30%", score: "—", isMuted: true },
      { name: "Thi cuối kỳ", weight: "40%", score: "—", isMuted: true },
    ],
    dueSoon: [
      {
        id: "d1",
        title: "BTL1 — Thiết kế CSDL quản lý siêu thị",
        dueMeta: "Hạn 10/06 · còn 10 ngày",
        type: "red",
      },
      {
        id: "d2",
        title: "Hoàn thành bài tập SQL thực hành",
        dueMeta: "Trước thứ 3",
        type: "amber",
      },
    ],
  },
  blue: {
    posts: [
      {
        id: "p1",
        author: "TS. Lê Văn Nam",
        role: "Giảng viên",
        avatar: "LN",
        time: "3 giờ trước",
        text: "Chào các em, slide bài giảng về <strong>Cây nhị phân tìm kiếm (BST) & Cây AVL</strong> đã được tải lên hệ thống. Các em tự code thử thuật toán xoay cây AVL trước khi lên lớp thực hành nhé.",
        attach: {
          name: "Lecture 8 - Binary Trees and AVL.pdf",
          sub: "PDF · 4.1 MB",
          type: "pdf",
        },
        likes: 32,
        comments: 5,
        liked: false,
      },
      {
        id: "p2",
        author: "TS. Lê Văn Nam",
        role: "Giảng viên",
        avatar: "LN",
        time: "3 ngày trước",
        text: "Kết quả chấm <strong>Bài tập lớn số 1: Ứng dụng Danh sách liên kết kép</strong> đã hoàn tất. Các em kiểm tra điểm trong tab Điểm số nhé. Có thắc mắc gì thì gửi email hoặc gặp thầy vào giờ làm việc.",
        likes: 21,
        comments: 15,
        liked: false,
      },
    ],
    syllabus: [
      {
        id: "T1",
        title: "Phân tích thuật toán & Mảng/DS liên kết",
        subtitle: "3 bài học · Đã hoàn thành",
        status: "done",
        lessons: [
          { id: "l1", name: "Bài 1: Phân tích độ phức tạp thuật toán (Big-O)", duration: "30 phút", type: "play", done: true },
          { id: "l2", name: "Bài 2: Cấu trúc mảng tĩnh và mảng động", duration: "20 phút", type: "file", done: true },
          { id: "l3", name: "Bài 3: Danh sách liên kết đơn và kép", duration: "40 phút", type: "code", done: true },
        ],
      },
      {
        id: "T2",
        title: "Ngăn xếp, Hàng đợi & Bảng băm",
        subtitle: "3 bài học · Đã hoàn thành",
        status: "done",
        lessons: [
          { id: "l4", name: "Bài 4: Ngăn xếp (Stack) và Hàng đợi (Queue)", duration: "25 phút", type: "play", done: true },
          { id: "l5", name: "Bài 5: Hàng đợi ưu tiên (Priority Queue) & Heap", duration: "28 phút", type: "play", done: true },
          { id: "l6", name: "Bài 6: Cấu trúc bảng băm (Hash Table)", duration: "32 phút", type: "code", done: true },
        ],
      },
      {
        id: "T3",
        title: "Cấu trúc cây & Đồ thị",
        subtitle: "3 bài học · Đang học",
        status: "learning",
        lessons: [
          { id: "l7", name: "Bài 7: Cây nhị phân và Cây tìm kiếm nhị phân", duration: "26 phút", type: "play", done: true },
          { id: "l8", name: "Bài 8: Cây AVL tự cân bằng", duration: "35 phút", type: "play", done: true },
          { id: "l9", name: "Bài 9: Biểu diễn đồ thị và Duyệt DFS/BFS", duration: "30 phút", type: "play", done: false },
        ],
      },
      {
        id: "T4",
        title: "Các thuật toán Quy hoạch động & Đồ thị nâng cao",
        subtitle: "3 bài học · Chưa mở khóa",
        status: "locked",
        lessons: [
          { id: "l10", name: "Bài 10: Thuật toán đường đi ngắn nhất (Dijkstra, Bellman-Ford)", duration: "35 phút", type: "lock", done: false },
          { id: "l11", name: "Bài 11: Cây bao trùm tối tiểu (Kruskal, Prim)", duration: "30 phút", type: "lock", done: false },
          { id: "l12", name: "Bài 12: Tổng quan Thuật toán quy hoạch động", duration: "40 phút", type: "lock", done: false },
        ],
      },
    ],
    assignments: [
      {
        id: "a1",
        title: "BTL2 — Ứng dụng cây AVL xây dựng bộ từ điển thông minh",
        type: "group",
        typeLabel: "Bài tập nhóm",
        dueLabel: "Còn 12 ngày",
        status: "not_submitted",
        statusLabel: "Chưa nộp",
        statusColor: "red",
      },
      {
        id: "a2",
        title: "BTL1 — Quản lý lịch trình xe buýt bằng LinkedList kép",
        type: "group",
        typeLabel: "Bài tập nhóm",
        dueLabel: "Đã chấm 25/05",
        status: "graded",
        statusLabel: "Đã chấm",
        statusColor: "green",
        score: 9.5,
      },
      {
        id: "a3",
        title: "Quiz 2 — Độ phức tạp thuật toán và Hash Table",
        type: "quiz",
        typeLabel: "20 câu trắc nghiệm",
        dueLabel: "10/05",
        status: "graded",
        statusLabel: "Đã chấm",
        statusColor: "green",
        score: 8.0,
      },
    ],
    materials: [
      {
        id: "f1",
        name: "Lecture 8 - Binary Trees and AVL.pdf",
        meta: "PDF · 4.1 MB · 3 giờ trước",
        type: "pdf",
      },
      {
        id: "f2",
        name: "Demo_AVL_Tree_Rotations.zip",
        meta: "Mã nguồn · 250 KB · 1 tuần trước",
        type: "zip",
      },
      {
        id: "f3",
        name: "Slide chương 4 - Stack & Queue.pptx",
        meta: "PowerPoint · 3.5 MB · 2 tuần trước",
        type: "ppt",
      },
      {
        id: "f4",
        name: "Video chữa bài tập đệ quy nâng cao.mp4",
        meta: "Video · 350 MB · 3 tuần trước",
        type: "video",
      },
    ],
    grades: [
      { name: "Chuyên cần", weight: "10%", score: "10.0" },
      { name: "Thực hành & Quiz", weight: "20%", score: "8.5" },
      { name: "Bài tập lớn (BTL)", weight: "30%", score: "9.5" },
      { name: "Thi cuối kỳ", weight: "40%", score: "—", isMuted: true },
    ],
    dueSoon: [
      {
        id: "d1",
        title: "BTL2 — Ứng dụng cây AVL làm từ điển",
        dueMeta: "Hạn 14/06 · còn 12 ngày",
        type: "red",
      },
      {
        id: "d2",
        title: "Thực hành Đồ thị DFS/BFS trực tuyến",
        dueMeta: "Trước thứ 4 tuần sau",
        type: "amber",
      },
    ],
  },
  amber: {
    posts: [
      {
        id: "p1",
        author: "TS. Phạm Quốc Bảo",
        role: "Giảng viên",
        avatar: "PB",
        time: "4 giờ trước",
        text: "Bài giảng <strong>Chương 6: Lập trình đa luồng (Multithreading) & Đồng bộ hóa</strong> đã sẵn sàng. Các em nhớ cài đặt trước JDK 17+ và Intellij IDEA Community để thực hành nhé.",
        attach: {
          name: "Lecture 6 - Java Multithreading.pdf",
          sub: "PDF · 3.5 MB",
          type: "pdf",
        },
        likes: 12,
        comments: 2,
        liked: false,
      },
      {
        id: "p2",
        author: "TS. Phạm Quốc Bảo",
        role: "Giảng viên",
        avatar: "PB",
        time: "3 ngày trước",
        text: "Đề bài tập tuần này: <strong>Xây dựng ứng dụng Chat Server-Client đơn giản bằng Socket</strong>. Hạn nộp là tối chủ nhật tuần tới nhé các em.",
        attach: {
          name: "Assignment_Socket_Chat.pdf",
          sub: "Bài tập · Hạn nộp 15/06/2026",
          type: "pdf",
        },
        likes: 10,
        comments: 5,
        liked: false,
      },
    ],
    syllabus: [
      {
        id: "T1",
        title: "Cú pháp Java Core & Hướng đối tượng",
        subtitle: "3 bài học · Đã hoàn thành",
        status: "done",
        lessons: [
          { id: "l1", name: "Bài 1: Giới thiệu ngôn ngữ Java & JVM/JRE/JDK", duration: "18 phút", type: "play", done: true },
          { id: "l2", name: "Bài 2: Kiểu dữ liệu, Biến, Cấu trúc điều khiển", duration: "22 phút", type: "file", done: true },
          { id: "l3", name: "Bài 3: Áp dụng OOP trong Java (Encapsulation, Inheritance)", duration: "30 phút", type: "code", done: true },
        ],
      },
      {
        id: "T2",
        title: "Java Collections Framework & Generic",
        subtitle: "3 bài học · Đã hoàn thành",
        status: "done",
        lessons: [
          { id: "l4", name: "Bài 4: Interface List, Set, Map trong Java", duration: "25 phút", type: "play", done: true },
          { id: "l5", name: "Bài 5: Tìm hiểu Generic & Wildcard", duration: "20 phút", type: "play", done: true },
          { id: "l6", name: "Bài 6: Sắp xếp phần tử với Comparable và Comparator", duration: "28 phút", type: "code", done: true },
        ],
      },
      {
        id: "T3",
        title: "Exception Handling, IO Streams & Multithreading",
        subtitle: "3 bài học · Đang học",
        status: "learning",
        lessons: [
          { id: "l7", name: "Bài 7: Cơ chế xử lý ngoại lệ (Try-Catch-Finally)", duration: "21 phút", type: "play", done: true },
          { id: "l8", name: "Bài 8: Đọc/Ghi File với Java IO & NIO", duration: "26 phút", type: "play", done: true },
          { id: "l9", name: "Bài 9: Tạo Thread và đồng bộ hóa (Synchronized)", duration: "32 phút", type: "play", done: false },
        ],
      },
      {
        id: "T4",
        title: "Lập trình mạng & Giao diện Swing/JavaFX",
        subtitle: "3 bài học · Chưa mở khóa",
        status: "locked",
        lessons: [
          { id: "l10", name: "Bài 10: Lập trình mạng TCP/UDP Socket", duration: "30 phút", type: "lock", done: false },
          { id: "l11", name: "Bài 11: Kết nối Cơ sở dữ liệu qua JDBC", duration: "28 phút", type: "lock", done: false },
          { id: "l12", name: "Bài 12: Thiết kế giao diện với Java Swing", duration: "35 phút", type: "lock", done: false },
        ],
      },
    ],
    assignments: [
      {
        id: "a1",
        title: "BTL — Game bắn máy bay (Java Swing)",
        type: "group",
        typeLabel: "Bài tập nhóm",
        dueLabel: "Còn 13 ngày",
        status: "not_submitted",
        statusLabel: "Chưa nộp",
        statusColor: "red",
      },
      {
        id: "a2",
        title: "Bài tập 2 — Thiết kế mô hình quản lý nhân sự với Collections",
        type: "individual",
        typeLabel: "Cá nhân",
        dueLabel: "Đã nộp 27/05",
        status: "submitted",
        statusLabel: "Đang chấm",
        statusColor: "amber",
        submittedTime: "Nộp lúc 20:45",
      },
      {
        id: "a3",
        title: "Quiz 1 — Java Basic & Access Modifiers",
        type: "quiz",
        typeLabel: "15 câu trắc nghiệm",
        dueLabel: "05/05",
        status: "graded",
        statusLabel: "Đã chấm",
        statusColor: "green",
        score: 6.5,
      },
    ],
    materials: [
      {
        id: "f1",
        name: "Lecture 6 - Java Multithreading.pdf",
        meta: "PDF · 3.5 MB · 4 giờ trước",
        type: "pdf",
      },
      {
        id: "f2",
        name: "Slide chương 4 - Collections Framework.pptx",
        meta: "PowerPoint · 4.8 MB · 2 tuần trước",
        type: "ppt",
      },
      {
        id: "f3",
        name: "Demo_Collections_Sort.zip",
        meta: "Mã nguồn · 80 KB · 2 tuần trước",
        type: "zip",
      },
      {
        id: "f4",
        name: "Java_Core_CheatSheet.pdf",
        meta: "PDF · 1.2 MB · Đầu kỳ",
        type: "pdf",
      },
    ],
    grades: [
      { name: "Chuyên cần", weight: "10%", score: "9.0" },
      { name: "Thuyết trình & Quiz", weight: "20%", score: "6.5" },
      { name: "Bài tập lớn (BTL)", weight: "30%", score: "—", isMuted: true },
      { name: "Thi cuối kỳ", weight: "40%", score: "—", isMuted: true },
    ],
    dueSoon: [
      {
        id: "d1",
        title: "BTL — Game Swing hoàn chỉnh",
        dueMeta: "Hạn 15/06 · còn 13 ngày",
        type: "red",
      },
      {
        id: "d2",
        title: "Tìm hiểu cơ chế Socket trong Java",
        dueMeta: "Trước buổi học thứ 5",
        type: "amber",
      },
    ],
  },
  teal: {
    posts: [
      {
        id: "p1",
        author: "ThS. Đỗ Thu Trang",
        role: "Giảng viên",
        avatar: "TT",
        time: "5 giờ trước",
        text: "Hello everyone, please read the guideline for <strong>Academic Essay Writing (APA style)</strong> before our class on Monday. You must choose your presentation topic by tonight.",
        attach: {
          name: "Guidelines for Academic Writing (APA).pdf",
          sub: "PDF · 1.8 MB",
          type: "pdf",
        },
        likes: 15,
        comments: 3,
        liked: false,
      },
      {
        id: "p2",
        author: "ThS. Đỗ Thu Trang",
        role: "Giảng viên",
        avatar: "TT",
        time: "4 ngày trước",
        text: "I have uploaded the vocabulary list for Unit 3: Technology and Innovation. Prepare the reading exercises on page 45-50.",
        attach: {
          name: "Unit 3 - Vocabulary & Reading.pdf",
          sub: "Tài liệu · Học liệu",
          type: "pdf",
        },
        likes: 11,
        comments: 1,
        liked: false,
      },
    ],
    syllabus: [
      {
        id: "T1",
        title: "Academic Vocabulary & Active Reading",
        subtitle: "3 bài học · Đã hoàn thành",
        status: "done",
        lessons: [
          { id: "l1", name: "Lesson 1: Introduction to Academic English & Context Clues", duration: "20 phút", type: "play", done: true },
          { id: "l2", name: "Lesson 2: Identifying Main Ideas & Scanning/Skimming", duration: "18 phút", type: "file", done: true },
          { id: "l3", name: "Lesson 3: Vocabulary Acquisition for Scientific Fields", duration: "25 phút", type: "code", done: true },
        ],
      },
      {
        id: "T2",
        title: "Sentence Structures & Synthesis Writing",
        subtitle: "3 bài học · Đã hoàn thành",
        status: "done",
        lessons: [
          { id: "l4", name: "Lesson 4: Building Complex Sentences & Cohesive Devices", duration: "22 phút", type: "play", done: true },
          { id: "l5", name: "Lesson 5: Paraphrasing & Summarizing Techniques", duration: "19 phút", type: "play", done: true },
          { id: "l6", name: "Lesson 6: Synthesis Writing based on Multiple Sources", duration: "30 phút", type: "code", done: true },
        ],
      },
      {
        id: "T3",
        title: "Essay Structure & Academic Referencing",
        subtitle: "3 bài học · Đang học",
        status: "learning",
        lessons: [
          { id: "l7", name: "Lesson 7: Structure of an Academic Essay & Thesis Statement", duration: "24 phút", type: "play", done: true },
          { id: "l8", name: "Lesson 8: Citations & Bibliography (APA Style 7th)", duration: "28 phút", type: "play", done: true },
          { id: "l9", name: "Lesson 9: Drafting and Peer-Editing Essays", duration: "20 phút", type: "play", done: false },
        ],
      },
      {
        id: "T4",
        title: "Presentation Skills & Project Defense",
        subtitle: "3 bài học · Chưa mở khóa",
        status: "locked",
        lessons: [
          { id: "l10", name: "Lesson 10: Organizing Academic Presentations", duration: "25 phút", type: "lock", done: false },
          { id: "l11", name: "Lesson 11: Body Language & Visual Aids Optimization", duration: "22 phút", type: "lock", done: false },
          { id: "l12", name: "Lesson 12: Question & Answer (Q&A) Handling Skills", duration: "26 phút", type: "lock", done: false },
        ],
      },
    ],
    assignments: [
      {
        id: "a1",
        title: "Academic Essay — The Impact of AI on Modern Education",
        type: "individual",
        typeLabel: "Cá nhân",
        dueLabel: "Còn 6 ngày",
        status: "not_submitted",
        statusLabel: "Chưa nộp",
        statusColor: "red",
      },
      {
        id: "a2",
        title: "Presentation — Pitching a Research Topic Outline",
        type: "group",
        typeLabel: "Bài tập nhóm",
        dueLabel: "Đã nộp 30/05",
        status: "submitted",
        statusLabel: "Đang chấm",
        statusColor: "amber",
        submittedTime: "Nộp lúc 16:30",
      },
      {
        id: "a3",
        title: "Quiz 1 — APA Citation & Paraphrasing Skills",
        type: "quiz",
        typeLabel: "10 câu trắc nghiệm",
        dueLabel: "14/05",
        status: "graded",
        statusLabel: "Đã chấm",
        statusColor: "green",
        score: 9.0,
      },
    ],
    materials: [
      {
        id: "f1",
        name: "Guidelines for Academic Writing (APA).pdf",
        meta: "PDF · 1.8 MB · 5 giờ trước",
        type: "pdf",
      },
      {
        id: "f2",
        name: "Academic Vocabulary List - Band 6.5+.pdf",
        meta: "PDF · 950 KB · 1 tuần trước",
        type: "pdf",
      },
      {
        id: "f3",
        name: "Essay_Draft_Feedback_Format.docx",
        meta: "Word · 120 KB · 2 tuần trước",
        type: "pdf",
      },
      {
        id: "f4",
        name: "Sample Oral Presentation Video.mp4",
        meta: "Video · 150 MB · 3 tuần trước",
        type: "video",
      },
    ],
    grades: [
      { name: "Attendance & Participation", weight: "10%", score: "9.5" },
      { name: "Academic Quizzes", weight: "20%", score: "9.0" },
      { name: "Midterm Essay Paper", weight: "30%", score: "—", isMuted: true },
      { name: "Final Presentation Oral", weight: "40%", score: "—", isMuted: true },
    ],
    dueSoon: [
      {
        id: "d1",
        title: "Essay Draft Submission (AI Impact)",
        dueMeta: "Hạn 08/06 · còn 6 ngày",
        type: "red",
      },
      {
        id: "d2",
        title: "Finalize Presentation Slides",
        dueMeta: "Trước buổi thuyết trình thứ 6",
        type: "amber",
      },
    ],
  },
  rust: {
    posts: [
      {
        id: "p1",
        author: "TS. Hoàng Anh Khoa",
        role: "Giảng viên",
        avatar: "AK",
        time: "6 giờ trước",
        text: "Chào các em, Slide và Mã nguồn mẫu cho buổi học <strong>REST API & Prisma ORM</strong> đã được cập nhật. Cả lớp nhớ kéo code về và chạy thử với Docker local PostgreSQL trước khi học nhé.",
        attach: {
          name: "Lecture 2 - REST API and Prisma ORM.pdf",
          sub: "PDF · 3.8 MB",
          type: "pdf",
        },
        likes: 18,
        comments: 4,
        liked: false,
      },
      {
        id: "p2",
        author: "TS. Hoàng Anh Khoa",
        role: "Giảng viên",
        avatar: "AK",
        time: "2 ngày trước",
        text: "Bài tập tuần này: <strong>Viết Docker Compose cấu hình Node.js API kết nối PostgreSQL</strong>. Gửi link Git repository lên bảng bài tập, hạn chót là 11/06.",
        attach: {
          name: "Assignment_Docker_Compose.docx",
          sub: "Bài tập · Hạn nộp 11/06/2026",
          type: "doc",
        },
        likes: 14,
        comments: 6,
        liked: false,
      },
    ],
    syllabus: [
      {
        id: "T1",
        title: "Node.js & Express.js Cơ bản",
        subtitle: "3 bài học · Đã hoàn thành",
        status: "done",
        lessons: [
          { id: "l1", name: "Bài 1: Kiến trúc Node.js Event Loop & Module", duration: "25 phút", type: "play", done: true },
          { id: "l2", name: "Bài 2: Tạo HTTP Web Server cơ bản với Express.js", duration: "20 phút", type: "file", done: true },
          { id: "l3", name: "Bài 3: Thực hành Middleware & Lắng nghe cổng REST", duration: "30 phút", type: "code", done: true },
        ],
      },
      {
        id: "T2",
        title: "REST API & JWT Security",
        subtitle: "3 bài học · Đang học",
        status: "learning",
        lessons: [
          { id: "l4", name: "Bài 4: Quy chuẩn xây dựng RESTful API", duration: "22 phút", type: "play", done: true },
          { id: "l5", name: "Bài 5: Xác thực và Phân quyền sử dụng JWT", duration: "28 phút", type: "play", done: true },
          { id: "l6", name: "Bài 6: Phối hợp Prisma ORM kết nối cơ sở dữ liệu", duration: "35 phút", type: "code", done: false },
        ],
      },
      {
        id: "T3",
        title: "Dockerize API & Claude CLI Integration",
        subtitle: "3 bài học · Chưa mở khóa",
        status: "locked",
        lessons: [
          { id: "l7", name: "Bài 7: Viết Dockerfile đóng gói ứng dụng Node.js", duration: "24 phút", type: "lock", done: false },
          { id: "l8", name: "Bài 8: Khởi động Multiple Services bằng Docker Compose", duration: "30 phút", type: "lock", done: false },
          { id: "l9", name: "Bài 9: Điều hành triển khai tự động với Claude CLI", duration: "27 phút", type: "lock", done: false },
        ],
      },
      {
        id: "T4",
        title: "Performance Optimization & CI/CD Pipelines",
        subtitle: "3 bài học · Chưa mở khóa",
        status: "locked",
        lessons: [
          { id: "l10", name: "Bài 10: Tối ưu Caching bằng Redis", duration: "32 phút", type: "lock", done: false },
          { id: "l11", name: "Bài 11: Unit Test API & Integration Testing", duration: "28 phút", type: "lock", done: false },
          { id: "l12", name: "Bài 12: Thiết lập CI/CD thông qua GitHub Actions", duration: "40 phút", type: "lock", done: false },
        ],
      },
    ],
    assignments: [
      {
        id: "a1",
        title: "BTL — Xây dựng E-commerce Backend REST API hoàn chỉnh",
        type: "group",
        typeLabel: "Bài tập nhóm",
        dueLabel: "Còn 9 ngày",
        status: "not_submitted",
        statusLabel: "Chưa nộp",
        statusColor: "red",
      },
      {
        id: "a2",
        title: "Bài tập 1 — Thiết kế Docker Compose cho cụm API Node-PostgreSQL",
        type: "individual",
        typeLabel: "Cá nhân",
        dueLabel: "Đã nộp 28/05",
        status: "submitted",
        statusLabel: "Đang chấm",
        statusColor: "amber",
        submittedTime: "Nộp lúc 22:30",
      },
      {
        id: "a3",
        title: "Quiz 1 — REST API standards & HTTP status codes",
        type: "quiz",
        typeLabel: "15 câu trắc nghiệm",
        dueLabel: "18/05",
        status: "graded",
        statusLabel: "Đã chấm",
        statusColor: "green",
        score: 10.0,
      },
    ],
    materials: [
      {
        id: "f1",
        name: "Lecture 2 - REST API and Prisma ORM.pdf",
        meta: "PDF · 3.8 MB · 6 giờ trước",
        type: "pdf",
      },
      {
        id: "f2",
        name: "Sample_Prisma_Postgres_Schema.prisma",
        meta: "Schema · 12 KB · 1 tuần trước",
        type: "zip",
      },
      {
        id: "f3",
        name: "Docker_NodeJS_Production_Config.zip",
        meta: "Mã nguồn · 140 KB · 1 tuần trước",
        type: "zip",
      },
      {
        id: "f4",
        name: "Rest_API_Design_CheatSheet.pdf",
        meta: "PDF · 1.5 MB · Đầu kỳ",
        type: "pdf",
      },
    ],
    grades: [
      { name: "Chuyên cần", weight: "10%", score: "10.0" },
      { name: "Thực hành & Quiz", weight: "20%", score: "10.0" },
      { name: "Bài tập lớn (BTL)", weight: "30%", score: "—", isMuted: true },
      { name: "Thi cuối kỳ", weight: "40%", score: "—", isMuted: true },
    ],
    dueSoon: [
      {
        id: "d1",
        title: "BTL — REST API thương mại điện tử",
        dueMeta: "Hạn 11/06 · còn 9 ngày",
        type: "red",
      },
      {
        id: "d2",
        title: "Viết test case cho Authentication routes",
        dueMeta: "Trước thứ 7 tuần này",
        type: "amber",
      },
    ],
  },
}

// Global aliases to maintain backwards compatibility
export const INITIAL_STREAM_POSTS = COURSE_FULL_DETAILS_MAP.violet.posts
export const SYLLABUS_WEEKS = COURSE_FULL_DETAILS_MAP.violet.syllabus
export const CLASSROOM_ASSIGNMENTS = COURSE_FULL_DETAILS_MAP.violet.assignments
export const CLASSROOM_MATERIALS = COURSE_FULL_DETAILS_MAP.violet.materials
export const GRADES_COMPONENTS = COURSE_FULL_DETAILS_MAP.violet.grades
export const DUE_SOON_ITEMS = COURSE_FULL_DETAILS_MAP.violet.dueSoon

export const COURSE_DETAILS_MAP: Record<string, CourseDetailStatic> = {
  violet: {
    code: "IT3100",
    group: "Nhóm 02",
    room: "Phòng D9-401",
    totalStudents: 48,
    timeRange: "07:00 – 09:30",
    activeLecture: {
      title: "Buổi 9 — Tính đa hình",
      studentsCount: 41,
    },
    instructorInfo: {
      name: "TS. Nguyễn Minh Tuấn",
      department: "Bộ môn Công nghệ phần mềm",
      email: "tuan.nm@soict.hust.edu.vn",
      officeHours: "Thứ 4, 14:00–16:00",
      office: "Văn phòng B1-305",
      initials: "NT",
    },
  },
  green: {
    code: "IT3210",
    group: "Nhóm 01",
    room: "Phòng D9-402",
    totalStudents: 45,
    timeRange: "09:30 – 12:00",
    activeLecture: {
      title: "Buổi 6 — Thiết kế Schema",
      studentsCount: 38,
    },
    instructorInfo: {
      name: "TS. Trần Thị Hương",
      department: "Bộ môn Hệ thống thông tin",
      email: "huong.tt@soict.hust.edu.vn",
      officeHours: "Thứ 3, 14:00–16:00",
      office: "Văn phòng B1-306",
      initials: "TH",
    },
  },
  blue: {
    code: "IT3011",
    group: "Nhóm 03",
    room: "Phòng D9-403",
    totalStudents: 50,
    timeRange: "13:00 – 15:30",
    activeLecture: {
      title: "Buổi 8 — Cây nhị phân tìm kiếm",
      studentsCount: 43,
    },
    instructorInfo: {
      name: "TS. Lê Văn Nam",
      department: "Bộ môn Khoa học máy tính",
      email: "nam.lv@soict.hust.edu.vn",
      officeHours: "Thứ 5, 09:00–11:00",
      office: "Văn phòng B1-308",
      initials: "LN",
    },
  },
  amber: {
    code: "IT3110",
    group: "Nhóm 02",
    room: "Phòng D9-404",
    totalStudents: 42,
    timeRange: "07:00 – 09:30",
    activeLecture: {
      title: "Buổi 4 — Lập trình đa luồng",
      studentsCount: 35,
    },
    instructorInfo: {
      name: "TS. Phạm Quốc Bảo",
      department: "Bộ môn Công nghệ phần mềm",
      email: "bao.pq@soict.hust.edu.vn",
      officeHours: "Thứ 6, 14:00–16:00",
      office: "Văn phòng B1-305",
      initials: "PB",
    },
  },
  teal: {
    code: "FL2112",
    group: "Nhóm 05",
    room: "Phòng D1-301",
    totalStudents: 30,
    timeRange: "09:30 – 12:00",
    activeLecture: {
      title: "Buổi 7 — Writing Academic Reports",
      studentsCount: 28,
    },
    instructorInfo: {
      name: "ThS. Đỗ Thu Trang",
      department: "Bộ môn Ngoại ngữ",
      email: "trang.dt@soict.hust.edu.vn",
      officeHours: "Thứ 2, 14:00–16:00",
      office: "Văn phòng D1-201",
      initials: "TT",
    },
  },
  rust: {
    code: "IT4501",
    group: "Nhóm 01",
    room: "Phòng D9-405",
    totalStudents: 15,
    timeRange: "13:00 – 15:30",
    activeLecture: {
      title: "Buổi 2 — Khởi tạo REST API",
      studentsCount: 12,
    },
    instructorInfo: {
      name: "TS. Hoàng Anh Khoa",
      department: "Bộ môn Kỹ thuật máy tính",
      email: "khoa.ha@soict.hust.edu.vn",
      officeHours: "Thứ 7, 09:00–11:00",
      office: "Văn phòng B1-309",
      initials: "AK",
    },
  },
}
