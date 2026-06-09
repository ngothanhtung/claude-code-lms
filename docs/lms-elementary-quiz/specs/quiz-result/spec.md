## ADDED Requirements

### Requirement: Quiz result is saved to the database upon submission

The system SHALL persist all quiz attempt data to the database when a quiz is submitted or auto-submitted.

#### Scenario: Save attempt result
- **WHEN** a quiz is submitted
- **THEN** the system SHALL persist: `QuizAttempt` record (groupId, quizId, totalScore, maxScore, startedAt, completedAt, status: SUBMITTED) and `QuizAnswer` records for each question (attemptId, questionId, selectedOption, isCorrect, answeredByStudentId)

#### Scenario: Auto-submit saves partial answers
- **WHEN** a quiz is auto-submitted due to timeout
- **THEN** the system SHALL save all answers that were selected (unanswered questions SHALL have selectedOption = null) and mark the attempt as TIMEOUT

#### Scenario: Each answer tracked by student
- **WHEN** a QuizAnswer is saved
- **THEN** it SHALL record which student selected the answer (answeredByStudentId), allowing audit of each student's contributions

### Requirement: Result screen is displayed after quiz completion

The system SHALL show a result screen to both students immediately after submission.

#### Scenario: Result screen shows score
- **WHEN** a quiz is submitted
- **THEN** the system SHALL display a result screen showing: total score (e.g., "8/10"), percentage, pass/fail status (e.g., "Đạt" / "Không đạt" based on passing score threshold), and a list of questions with correct/incorrect indicators

#### Scenario: Result screen is synchronized
- **WHEN** a quiz is submitted
- **THEN** both students SHALL see the result screen simultaneously

#### Scenario: Review answers
- **WHEN** student views the result screen
- **THEN** they SHALL be able to scroll through each question to see their selected answer and the correct answer highlighted

#### Scenario: Return to quiz list
- **WHEN** student clicks "Quay lại danh sách" on the result screen
- **THEN** the system SHALL navigate them back to the quiz list, where the completed quiz now shows their score
