## ADDED Requirements

### Requirement: System displays quiz list for the student's group

The system SHALL display a list of quizzes assigned to the student's class and available for their group to take.

#### Scenario: Quiz list shown after group is active
- **WHEN** student has an ACTIVE group and navigates to the quiz list screen
- **THEN** the system SHALL display all quizzes assigned to the class with status indicators (Chưa làm, Đang làm, Đã làm)

#### Scenario: Each quiz shows title and question count
- **WHEN** quiz list is displayed
- **THEN** each quiz SHALL show: quiz title, number of questions (n câu hỏi), and time limit (if any)

#### Scenario: Completed quiz shows score
- **WHEN** quiz list is displayed and the group has completed a quiz
- **THEN** that quiz SHALL display the group's score (e.g., "8/10") and a "Xem lại" button

#### Scenario: In-progress quiz shows resume button
- **WHEN** quiz list is displayed and the group has an in-progress quiz session
- **THEN** that quiz SHALL display a "Tiếp tục" button instead of "Bắt đầu"

#### Scenario: Quiz with due date shows remaining time
- **WHEN** a quiz has a due date
- **THEN** the system SHALL display the remaining time (e.g., "Còn 2 ngày") or "Quá hạn" if past due

### Requirement: Quiz list is filtered by class and ordered

The system SHALL filter quizzes by the student's class and order them logically.

#### Scenario: Filter by class
- **WHEN** quiz list is displayed
- **THEN** the system SHALL only show quizzes assigned to the student's current class

#### Scenario: Order quizzes
- **WHEN** quiz list is displayed
- **THEN** quizzes SHALL be ordered: in-progress first, then not-started (sorted by due date ascending), then completed (sorted by completion date descending)
