-- Seed Users (password_hash is 'password123' hashed with bcrypt)
INSERT INTO users (student_id, name, email, password_hash, role, department, year_level) VALUES
('STU001', 'Valerie Mensah', 'valerie@university.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSm2eI8jKlFyiGj1234567', 'student', 'Computer Science', 'Year 2'),
('STU002', 'Kwame Asante', 'kwame@university.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSm2eI8jKlFyiGj1234567', 'student', 'Engineering', 'Year 3'),
('STU003', 'Abena Osei', 'abena@university.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSm2eI8jKlFyiGj1234567', 'student', 'Business', 'Year 1'),
('STU004', 'Kofi Boateng', 'kofi@university.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSm2eI8jKlFyiGj1234567', 'student', 'Law', 'Year 4'),
('STU005', 'Ama Darko', 'ama@university.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSm2eI8jKlFyiGj1234567', 'student', 'Medicine', 'Year 2'),
('ADM001', 'Admin User', 'admin@university.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSm2eI8jKlFyiGj1234567', 'election_admin', 'Administration', NULL),
('SUP001', 'Super Admin', 'superadmin@university.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSm2eI8jKlFyiGj1234567', 'super_admin', 'Administration', NULL);

-- Seed Elections
INSERT INTO elections (title, description, start_date, end_date, status, eligibility_rules, created_by)
VALUES (
    'Student Representative Council 2026',
    'Annual election for student council positions',
    '2026-06-10 08:00:00',
    '2026-06-11 18:00:00',
    'upcoming',
    '{"year_levels": ["Year 1", "Year 2", "Year 3", "Year 4"], "departments": "all"}',
    (SELECT id FROM users WHERE student_id = 'ADM001')
);

-- Seed Candidates
INSERT INTO candidates (election_id, name, position, manifesto) VALUES
(
    (SELECT id FROM elections WHERE title = 'Student Representative Council 2026'),
    'James Otieno',
    'President',
    'I will fight for better facilities and student welfare.'
),
(
    (SELECT id FROM elections WHERE title = 'Student Representative Council 2026'),
    'Grace Nkrumah',
    'President',
    'My focus is academic excellence and mental health support.'
),
(
    (SELECT id FROM elections WHERE title = 'Student Representative Council 2026'),
    'Daniel Adjei',
    'Vice President',
    'I will bridge the gap between students and administration.'
),
(
    (SELECT id FROM elections WHERE title = 'Student Representative Council 2026'),
    'Efua Mensah',
    'Vice President',
    'Transparency and accountability are my core values.'
),
(
    (SELECT id FROM elections WHERE title = 'Student Representative Council 2026'),
    'Yaw Amponsah',
    'Secretary',
    'I will ensure every student voice is heard and documented.'
);
