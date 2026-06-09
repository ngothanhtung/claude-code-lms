## ADDED Requirements

### Requirement: Student can select grade and class after login

The system SHALL allow a logged-in student to select their Grade (Khối, 1-5) and then their specific Class (Lớp) to proceed to group selection.

#### Scenario: Grade list after login
- **WHEN** student completes login and is redirected to grade selection
- **THEN** the system SHALL display grades 1 through 5 as selectable options

#### Scenario: Class list loads after grade selection
- **WHEN** student selects a Grade
- **THEN** the system SHALL fetch and display classes belonging to that grade at the student's school, and only classes the student is enrolled in

#### Scenario: Proceed to group selection
- **WHEN** student selects a Class
- **THEN** the system SHALL navigate them to the Group selection screen for that class

### Requirement: Student can create a group of 2

The system SHALL allow a student to create a new group with WAITING status, visible to other students in the same class.

#### Scenario: Create group
- **WHEN** student clicks "Tạo nhóm" on the group selection screen
- **THEN** the system SHALL create a new group with status WAITING and add the student as the first member; the group SHALL be visible to other classmates

#### Scenario: Student already in active group
- **WHEN** student clicks "Tạo nhóm" but they are already a member of an ACTIVE group
- **THEN** the system SHALL display "Bạn đã có nhóm rồi" and not create a new group

#### Scenario: Student already has a WAITING group
- **WHEN** student clicks "Tạo nhóm" but they already have a WAITING group in the same class
- **THEN** the system SHALL display "Bạn đã tạo nhóm trước đó" and redirect to that group

#### Scenario: Maximum group size enforced
- **WHEN** the system attempts to add a third member to a group
- **THEN** the system SHALL reject the addition with error "Nhóm đã đủ 2 thành viên"

### Requirement: Student can join a WAITING group

The system SHALL allow a student to join an existing group with WAITING status, from the same class.

#### Scenario: Join a waiting group
- **WHEN** student clicks "Tham gia" on a WAITING group
- **THEN** the system SHALL add the student as the second member and set group status to ACTIVE

#### Scenario: Join a full group
- **WHEN** student clicks "Tham gia" on a group that already has 2 members
- **THEN** the system SHALL display "Nhóm đã đủ thành viên" and not join

#### Scenario: View waiting groups list
- **WHEN** student is on the group selection screen
- **THEN** the system SHALL display all WAITING groups in the class that the student is eligible to join

### Requirement: Student can leave a group

The system SHALL allow a student to leave a WAITING group.

#### Scenario: Leave waiting group
- **WHEN** student clicks "Rời nhóm" on a WAITING group they created
- **THEN** the system SHALL remove the student from the group and delete the group if it becomes empty

#### Scenario: Cannot leave active group during quiz
- **WHEN** student clicks "Rời nhóm" on an ACTIVE group that has an in-progress quiz session
- **THEN** the system SHALL display "Không thể rời nhóm khi đang làm bài"
