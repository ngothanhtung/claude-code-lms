## ADDED Requirements

### Requirement: Two students can take a quiz together in real-time

The system SHALL allow two members of an ACTIVE group to take a quiz simultaneously, with synchronized question state via WebSocket.

#### Scenario: Start quiz session
- **WHEN** both students are in the group and one clicks "Bắt đầu" / "Tiếp tục" on a quiz
- **THEN** the system SHALL create a new QuizAttempt, assign both students to it, open a Socket.IO room, and display the first question to both students

#### Scenario: Both see the same question
- **WHEN** a quiz session is active
- **THEN** both students SHALL see the same current question number and content simultaneously

#### Scenario: Student selects an answer
- **WHEN** student A selects an answer option
- **THEN** the system SHALL broadcast that selection to student B in real-time, showing which option student A chose

#### Scenario: Student changes answer
- **WHEN** student A changes their selected answer before final submission
- **THEN** the system SHALL update and broadcast the new selection to student B

#### Scenario: Both students must be connected
- **WHEN** a quiz session is active and student B disconnects
- **THEN** the system SHALL display a warning to student A: "Bạn của bạn đã mất kết nối. Đang chờ kết nối lại..." and the timer SHALL pause

#### Scenario: Reconnect after disconnection
- **WHEN** student B reconnects to the same session within 5 minutes
- **THEN** the system SHALL restore the current state (current question, selections, remaining time) for student B

#### Scenario: Navigate between questions
- **WHEN** both students are in an active session
- **THEN** either student can navigate to the next or previous question; the navigation SHALL synchronize to both screens

#### Scenario: Submit quiz
- **WHEN** both students have confirmed they are done (e.g., click "Nộp bài" button on the last question or summary screen)
- **THEN** the system SHALL submit the QuizAttempt, calculate the score, and redirect both to the result screen

#### Scenario: Auto-submit on timeout
- **WHEN** the quiz time limit is reached
- **THEN** the system SHALL automatically submit the QuizAttempt with whatever answers have been selected, and redirect both to the result screen

#### Scenario: Single confirmation required
- **WHEN** one student clicks "Nộp bài"
- **THEN** the system SHALL show a confirmation prompt to BOTH students: "Bạn của bạn muốn nộp bài. Bạn có đồng ý?" Both must confirm to submit

### Requirement: Quiz questions and answers are displayed appropriately for elementary students

The system SHALL display quiz questions in an elementary-student-friendly format.

#### Scenario: Question display
- **WHEN** a question is shown during a quiz session
- **THEN** it SHALL display: question number (e.g., "Câu 1/10"), question text (large font), and answer options (A/B/C/D) as large tappable buttons

#### Scenario: Progress indicator
- **WHEN** a quiz session is active
- **THEN** the system SHALL display a progress bar or step indicator showing which question the student is on

#### Scenario: Question navigation
- **WHEN** a quiz session is active
- **THEN** the system SHALL display "<" and ">" buttons for navigating between questions, plus numbered question dots showing which questions have been answered
