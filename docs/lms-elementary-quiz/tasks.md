## 1. Project Scaffolding

- [ ] 1.1 Initialize NestJS backend project with Prisma ORM configuration
- [ ] 1.2 Initialize Next.js frontend project with Tailwind CSS + shadcn/ui
- [ ] 1.3 Set up Socket.IO integration in backend and frontend
- [ ] 1.4 Configure PostgreSQL database connection and Prisma schema
- [ ] 1.5 Create project directory structure (modules: auth, location, school, class, group, quiz, session)

## 2. Database Schema (Prisma)

- [ ] 2.1 Define Provinces, Districts, Wards models with location hierarchy relationships
- [ ] 2.2 Define Schools model with wardId FK and school_password field
- [ ] 2.3 Define Students model with schoolId FK and student_code + student_password fields
- [ ] 2.4 Define Grades and Classes models with school relationship
- [ ] 2.5 Define StudentClasses junction table for student-class enrollment
- [ ] 2.6 Define Groups model (status: WAITING/ACTIVE/DISBANDED) and GroupMembers model
- [ ] 2.7 Define Quizzes and Questions models
- [ ] 2.8 Define QuizAttempts model (status: IN_PROGRESS/TIMEOUT/SUBMITTED) and QuizAnswers model
- [ ] 2.9 Create seed script for Vietnam administrative divisions data
- [ ] 2.10 Create seed script for sample schools, grades, classes, students, and quizzes
- [ ] 2.11 Generate and run Prisma migrations

## 3. Location-Based Auth Module (Backend API)

- [ ] 3.1 Implement GET /api/provinces endpoint
- [ ] 3.2 Implement GET /api/districts?provinceId= endpoint
- [ ] 3.3 Implement GET /api/wards?districtId= endpoint
- [ ] 3.4 Implement GET /api/schools?wardId= endpoint
- [ ] 3.5 Implement POST /api/auth/student-login (validate school password, optionally validate student credentials, issue session token)
- [ ] 3.6 Implement session management (JWT token generation, expiry, auth middleware)
- [ ] 3.7 Write unit tests for location and auth endpoints

## 4. Location-Based Auth Module (Frontend)

- [ ] 4.1 Build "Chọn Tỉnh/Thành phố" dropdown page (autocomplete, searchable)
- [ ] 4.2 Build "Chọn Quận/Huyện" dropdown (filtered by selected province)
- [ ] 4.3 Build "Chọn Phường/Xã" dropdown (filtered by selected district)
- [ ] 4.4 Build "Chọn Trường học" dropdown (filtered by selected ward)
- [ ] 4.5 Build password input and login button screen
- [ ] 4.6 Build login flow state management (React context/hooks for auth state)
- [ ] 4.7 Wire up all API calls and implement loading/error states

## 5. Class & Group Selection (Backend API)

- [ ] 5.1 Implement GET /api/grades (grades 1-5)
- [ ] 5.2 Implement GET /api/classes?gradeId=&schoolId= (filtered classes for student)
- [ ] 5.3 Implement GET /api/groups?classId=&studentId= (list groups for class, including WAITING groups)
- [ ] 5.4 Implement POST /api/groups (create group — enforce max 1 active/waiting group per student)
- [ ] 5.5 Implement POST /api/groups/join (join WAITING group, enforce 2-member limit)
- [ ] 5.6 Implement group leave/disband logic
- [ ] 5.7 Write unit tests for class and group endpoints

## 6. Class & Group Selection (Frontend)

- [ ] 6.1 Build "Chọn Khối" screen (large buttons for grades 1-5)
- [ ] 6.2 Build "Chọn Lớp" screen (class list filtered by grade)
- [ ] 6.3 Build "Nhóm của tôi" screen showing current group status
- [ ] 6.4 Build group creation flow (button + confirmation)
- [ ] 6.5 Build group lobby showing WAITING groups available to join
- [ ] 6.6 Build real-time updates for group status changes (via Socket.IO or polling)
- [ ] 6.7 Wire up all API calls and implement loading/error states

## 7. Quiz List (Backend API & Frontend)

- [ ] 7.1 Implement GET /api/quizzes?groupId= with quiz status (group-specific: completed/in-progress/not-started)
- [ ] 7.2 Implement GET /api/quizzes/:id/questions (fetch questions for a quiz)
- [ ] 7.3 Build quiz list UI with status indicators and score display for completed quizzes
- [ ] 7.4 Build "Bắt đầu" / "Tiếp tục" button logic based on quiz attempt status
- [ ] 7.5 Wire up quiz list API calls and loading/error states

## 8. Paired Quiz Taking — Real-time (Backend)

- [ ] 8.1 Implement Socket.IO gateway for quiz sessions (create/join/leave rooms)
- [ ] 8.2 Implement POST /api/quiz-sessions (create QuizAttempt, start session)
- [ ] 8.3 Handle student connect/disconnect events with room synchronization
- [ ] 8.4 Implement question state synchronization (current question index, navigation)
- [ ] 8.5 Implement answer selection events (select, change, real-time broadcast)
- [ ] 8.6 Handle reconnection: restore session state (current question, selections, timer)
- [ ] 8.7 Implement submit flow: confirm dialog to both students, require both confirmations
- [ ] 8.8 Implement auto-submit on timer expiry
- [ ] 8.9 Implement POST /api/quiz-attempts/:id/submit (calculate score, persist results)
- [ ] 8.10 Write integration/unit tests for quiz session socket events

## 9. Paired Quiz Taking — Real-time (Frontend)

- [ ] 9.1 Build quiz-taking screen layout (question area, options, progress bar, navigation)
- [ ] 9.2 Build question display component (large text, 4 answer option buttons)
- [ ] 9.3 Build progress indicator (question dots showing answered/unanswered)
- [ ] 9.4 Build partner's selection indicator (show which option the other student chose)
- [ ] 9.5 Build navigation controls (prev/next buttons, numbered question grid)
- [ ] 9.6 Build timer display component
- [ ] 9.7 Build disconnection warning overlay with reconnection logic
- [ ] 9.8 Build submit confirmation dialog (2-step for both students)
- [ ] 9.9 Wire up Socket.IO client events to all UI components

## 10. Quiz Results (Backend & Frontend)

- [ ] 10.1 Build result screen: score, percentage, pass/fail status
- [ ] 10.2 Build answer review: scrollable question-by-question with correct/incorrect indicators
- [ ] 10.3 Implement "Quay lại danh sách" button to return to quiz list
- [ ] 10.4 Write unit tests for result calculation logic
- [ ] 10.5 Wire up result API calls and Socket.IO events

## 11. Integration & Polish

- [ ] 11.1 End-to-end testing: full user flow from login → grade/class selection → group creation → quiz taking → result view
- [ ] 11.2 Mobile-responsive UI testing on multiple screen sizes
- [ ] 11.3 Error boundary implementation for all screens
- [ ] 11.4 Loading state and skeleton UI for slow connections
- [ ] 11.5 Accessibility: large touch targets, legible font sizes for elementary students
- [ ] 11.6 Final review against all spec scenarios
