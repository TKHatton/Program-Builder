// Types for the Program Builder application

// User types
export type UserRole = 'admin' | 'instructor' | 'learner';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Program types
export interface Program {
  id: number;
  title: string;
  description?: string;
  objectives?: string;
  targetAudience?: string;
  creatorId: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Course types
export interface Course {
  id: number;
  programId: number;
  title: string;
  description?: string;
  sequenceOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Lesson types
export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  content?: string;
  sequenceOrder: number;
  estimatedDuration?: number; // in minutes
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Assessment types
export type AssessmentType = 'quiz' | 'assignment' | 'project';
export type QuestionType = 'multiple_choice' | 'true_false' | 'essay' | 'short_answer';

export interface Assessment {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  assessmentType: AssessmentType;
  passingScore?: number;
  timeLimit?: number; // in minutes
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentQuestion {
  id: number;
  assessmentId: number;
  questionText: string;
  questionType: QuestionType;
  options?: string[]; // For multiple choice
  correctAnswer?: string;
  points: number;
  sequenceOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentSubmission {
  id: number;
  assessmentId: number;
  userId: number;
  answers: Record<string, any>; // Question ID to answer mapping
  score?: number;
  feedback?: string;
  gradedBy?: number;
  submittedAt: Date;
  gradedAt?: Date;
}

// Enrollment types
export type EnrollmentStatus = 'active' | 'completed' | 'dropped';

export interface ProgramEnrollment {
  id: number;
  programId: number;
  userId: number;
  status: EnrollmentStatus;
  enrolledAt: Date;
  completedAt?: Date;
}

export interface CourseEnrollment {
  id: number;
  courseId: number;
  userId: number;
  status: EnrollmentStatus;
  enrolledAt: Date;
  completedAt?: Date;
}

export interface LessonCompletion {
  id: number;
  lessonId: number;
  userId: number;
  completedAt: Date;
}

// Enhancement Materials types
export type MaterialType = 'document' | 'video' | 'link' | 'image';

export interface EnhancementMaterial {
  id: number;
  programId: number;
  title: string;
  description?: string;
  materialType: MaterialType;
  contentUrl?: string;
  contentText?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Gamification types
export type BadgeType = 'achievement' | 'milestone' | 'participation';
export type TransactionType = 'course_completion' | 'assessment_completion' | 'participation' | 'other';

export interface Badge {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  badgeType: BadgeType;
  requirements: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserBadge {
  id: number;
  userId: number;
  badgeId: number;
  earnedAt: Date;
}

export interface PointsTransaction {
  id: number;
  userId: number;
  points: number;
  transactionType: TransactionType;
  referenceId?: number;
  referenceType?: string;
  description?: string;
  createdAt: Date;
}

// User progress and stats
export interface UserProgress {
  userId: number;
  totalPoints: number;
  programsEnrolled: number;
  programsCompleted: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  assessmentsCompleted: number;
  badges: UserBadge[];
}
