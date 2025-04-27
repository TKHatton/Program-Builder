-- Migration number: 0001 	 2025-04-27T08:34:00.000Z
-- Program Builder Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS counters;
DROP TABLE IF EXISTS access_logs;
DROP TABLE IF EXISTS badges;
DROP TABLE IF EXISTS points_transactions;
DROP TABLE IF EXISTS assessment_submissions;
DROP TABLE IF EXISTS assessment_questions;
DROP TABLE IF EXISTS assessments;
DROP TABLE IF EXISTS lesson_completions;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS course_enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS program_enrollments;
DROP TABLE IF EXISTS enhancement_materials;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'learner', -- 'admin', 'instructor', 'learner'
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  objectives TEXT,
  target_audience TEXT,
  creator_id INTEGER NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- Enhancement Materials table
CREATE TABLE IF NOT EXISTS enhancement_materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  material_type TEXT NOT NULL, -- 'document', 'video', 'link', etc.
  content_url TEXT,
  content_text TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- Program Enrollments table
CREATE TABLE IF NOT EXISTS program_enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'dropped'
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sequence_order INTEGER NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- Course Enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'dropped'
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  sequence_order INTEGER NOT NULL,
  estimated_duration INTEGER, -- in minutes
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Lesson Completions table
CREATE TABLE IF NOT EXISTS lesson_completions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assessment_type TEXT NOT NULL, -- 'quiz', 'assignment', 'project', etc.
  passing_score INTEGER,
  time_limit INTEGER, -- in minutes, NULL for no limit
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Assessment Questions table
CREATE TABLE IF NOT EXISTS assessment_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assessment_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- 'multiple_choice', 'true_false', 'essay', etc.
  options TEXT, -- JSON string for multiple choice options
  correct_answer TEXT, -- For objective questions
  points INTEGER NOT NULL DEFAULT 1,
  sequence_order INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);

-- Assessment Submissions table
CREATE TABLE IF NOT EXISTS assessment_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assessment_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  answers TEXT, -- JSON string of answers
  score INTEGER,
  feedback TEXT,
  graded_by INTEGER, -- User ID of grader, NULL for auto-graded
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  graded_at DATETIME,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (graded_by) REFERENCES users(id)
);

-- Gamification: Points Transactions table
CREATE TABLE IF NOT EXISTS points_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'course_completion', 'assessment_completion', 'participation', etc.
  reference_id INTEGER, -- ID of the related entity (course, assessment, etc.)
  reference_type TEXT, -- Type of the related entity ('course', 'assessment', etc.)
  description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Gamification: Badges table
CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  badge_type TEXT NOT NULL, -- 'achievement', 'milestone', 'participation', etc.
  requirements TEXT, -- JSON string of requirements to earn the badge
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Gamification: User Badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  badge_id INTEGER NOT NULL,
  earned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (badge_id) REFERENCES badges(id)
);

-- Access Logs table (for analytics)
CREATE TABLE IF NOT EXISTS access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  ip TEXT,
  path TEXT,
  accessed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_programs_creator ON programs(creator_id);
CREATE INDEX idx_courses_program ON courses(program_id);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_assessments_course ON assessments(course_id);
CREATE INDEX idx_program_enrollments_user ON program_enrollments(user_id);
CREATE INDEX idx_program_enrollments_program ON program_enrollments(program_id);
CREATE INDEX idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_lesson_completions_user ON lesson_completions(user_id);
CREATE INDEX idx_assessment_submissions_user ON assessment_submissions(user_id);
CREATE INDEX idx_points_transactions_user ON points_transactions(user_id);
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_access_logs_user ON access_logs(user_id);
CREATE INDEX idx_access_logs_accessed_at ON access_logs(accessed_at);

-- Insert initial badge data
INSERT INTO badges (title, description, image_url, badge_type, requirements) VALUES 
  ('First Course Completed', 'Awarded when you complete your first course', '/badges/first-course.svg', 'milestone', '{"course_completions": 1}'),
  ('Program Master', 'Awarded when you complete an entire program', '/badges/program-master.svg', 'achievement', '{"program_completions": 1}'),
  ('Perfect Score', 'Awarded when you get 100% on an assessment', '/badges/perfect-score.svg', 'achievement', '{"assessment_score": 100}'),
  ('Consistent Learner', 'Awarded for logging in 5 days in a row', '/badges/consistent-learner.svg', 'participation', '{"consecutive_logins": 5}'),
  ('Top Project Submission', 'Awarded for outstanding project work', '/badges/top-project.svg', 'achievement', '{"instructor_awarded": true}');

-- Insert sample admin user
INSERT INTO users (username, email, password_hash, full_name, role) VALUES 
  ('admin', 'admin@programbuilder.com', '$2a$10$dRFLSkYedQ.s9jnVsp0BO.NhMZ4vbEeQ4xI9hPxWK/HFQc8X9PHcO', 'System Administrator', 'admin');
