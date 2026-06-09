## ADDED Requirements

### Requirement: Student can login by selecting location hierarchy and entering password

The system SHALL allow a student to authenticate by navigating a location hierarchy (Province → District → Ward → School) and entering the school password (plus optionally a personal student code/password).

#### Scenario: Successful full login flow
- **WHEN** student selects a Province, then a District, then a Ward, then a School, enters the correct school password, and clicks "Login"
- **THEN** the system authenticates the student, creates a session, and redirects to the "Select Grade" page

#### Scenario: Login with student code
- **WHEN** student selects a Province, District, Ward, School, enters the correct school password AND enters their student code and student password
- **THEN** the system authenticates the specific student, creates a session, and redirects to the "Select Grade" page

#### Scenario: Wrong school password
- **WHEN** student enters an incorrect school password
- **THEN** the system SHALL display an error message "Mật khẩu trường không đúng" and not proceed

#### Scenario: Empty location selection
- **WHEN** student attempts to login without fully selecting Province-District-Ward-School
- **THEN** the system SHALL disable the Login button and show "Vui lòng chọn đầy đủ thông tin"

#### Scenario: Province list loads on page open
- **WHEN** student opens the login page
- **THEN** the system SHALL fetch and display the list of provinces (Tỉnh/Thành phố) sorted alphabetically

#### Scenario: District list loads after province selection
- **WHEN** student selects a Province
- **THEN** the system SHALL fetch and display districts belonging to that province; the Ward and School dropdowns SHALL reset

#### Scenario: Ward list loads after district selection
- **WHEN** student selects a District
- **THEN** the system SHALL fetch and display wards belonging to that district; the School dropdown SHALL reset

#### Scenario: School list loads after ward selection
- **WHEN** student selects a Ward
- **THEN** the system SHALL fetch and display schools belonging to that ward

### Requirement: Location data must be seeded from the Vietnam administrative divisions dataset

The system SHALL use the official Vietnam administrative divisions data (Tỉnh/Huyện/Xã) for the location hierarchy.

#### Scenario: Seed provinces
- **WHEN** the system is initialized with the administrative data
- **THEN** the system SHALL populate the Provinces table with all 63 provinces and municipalities of Vietnam

#### Scenario: Seed districts
- **WHEN** the system is initialized with the administrative data
- **THEN** the system SHALL populate the Districts table with all districts belonging to each province

#### Scenario: Seed wards
- **WHEN** the system is initialized with the administrative data
- **THEN** the system SHALL populate the Wards table with all wards/communes belonging to each district

### Requirement: School data must be pre-seeded

The system MUST have Schools pre-seeded with each school assigned to a ward. Each school MUST have a school_password field.

#### Scenario: School belongs to ward
- **WHEN** a school is created in the system
- **THEN** it MUST be linked to exactly one ward via wardId

#### Scenario: School password exists
- **WHEN** a school record is created
- **THEN** it MUST have a non-empty school_password field (bcrypt-hashed)
