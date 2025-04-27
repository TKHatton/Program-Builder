// Gamification system for the Program Builder application

import { D1Database } from '@cloudflare/workers-types';
import { executeQuery, querySingle, insertRecord, getUserById } from './db';
import { Badge, UserBadge, PointsTransaction } from './types';

// Points configuration
const POINTS_CONFIG = {
  COURSE_COMPLETION: 10,
  LESSON_COMPLETION: 2,
  ASSESSMENT_COMPLETION: 5,
  PERFECT_SCORE: 5,
  PROGRAM_COMPLETION: 20,
  DAILY_LOGIN: 1
};

// Badge requirements
const BADGE_REQUIREMENTS = {
  FIRST_COURSE: { course_completions: 1 },
  PROGRAM_MASTER: { program_completions: 1 },
  PERFECT_SCORE: { assessment_score: 100 },
  CONSISTENT_LEARNER: { consecutive_logins: 5 },
  TOP_PROJECT: { instructor_awarded: true }
};

// Award points to a user
export async function awardPoints(
  db: D1Database,
  userId: number,
  points: number,
  transactionType: string,
  referenceId?: number,
  referenceType?: string,
  description?: string
): Promise<number> {
  try {
    // Insert points transaction
    const transactionId = await insertRecord(db, 'points_transactions', {
      user_id: userId,
      points,
      transaction_type: transactionType,
      reference_id: referenceId || null,
      reference_type: referenceType || null,
      description: description || null
    });
    
    // Check if user qualifies for any badges based on points
    await checkAndAwardBadges(db, userId);
    
    return transactionId;
  } catch (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
}

// Award points for course completion
export async function awardCourseCompletionPoints(
  db: D1Database,
  userId: number,
  courseId: number
): Promise<number> {
  return awardPoints(
    db,
    userId,
    POINTS_CONFIG.COURSE_COMPLETION,
    'course_completion',
    courseId,
    'course',
    'Completed a course'
  );
}

// Award points for lesson completion
export async function awardLessonCompletionPoints(
  db: D1Database,
  userId: number,
  lessonId: number
): Promise<number> {
  return awardPoints(
    db,
    userId,
    POINTS_CONFIG.LESSON_COMPLETION,
    'lesson_completion',
    lessonId,
    'lesson',
    'Completed a lesson'
  );
}

// Award points for assessment completion
export async function awardAssessmentCompletionPoints(
  db: D1Database,
  userId: number,
  assessmentId: number,
  score: number
): Promise<number[]> {
  const transactionIds = [];
  
  // Base points for completing the assessment
  const basePointsId = await awardPoints(
    db,
    userId,
    POINTS_CONFIG.ASSESSMENT_COMPLETION,
    'assessment_completion',
    assessmentId,
    'assessment',
    'Completed an assessment'
  );
  
  transactionIds.push(basePointsId);
  
  // Bonus points for perfect score
  if (score === 100) {
    const bonusPointsId = await awardPoints(
      db,
      userId,
      POINTS_CONFIG.PERFECT_SCORE,
      'perfect_score',
      assessmentId,
      'assessment',
      'Achieved a perfect score on an assessment'
    );
    
    transactionIds.push(bonusPointsId);
  }
  
  return transactionIds;
}

// Award points for program completion
export async function awardProgramCompletionPoints(
  db: D1Database,
  userId: number,
  programId: number
): Promise<number> {
  return awardPoints(
    db,
    userId,
    POINTS_CONFIG.PROGRAM_COMPLETION,
    'program_completion',
    programId,
    'program',
    'Completed a program'
  );
}

// Award a badge to a user
export async function awardBadge(
  db: D1Database,
  userId: number,
  badgeId: number
): Promise<number | null> {
  try {
    // Check if user already has this badge
    const existingBadge = await querySingle(
      db,
      'SELECT * FROM user_badges WHERE user_id = ? AND badge_id = ?',
      [userId, badgeId]
    );
    
    if (existingBadge) {
      return null; // User already has this badge
    }
    
    // Award the badge
    const userBadgeId = await insertRecord(db, 'user_badges', {
      user_id: userId,
      badge_id: badgeId
    });
    
    return userBadgeId;
  } catch (error) {
    console.error('Error awarding badge:', error);
    throw error;
  }
}

// Check if user qualifies for any badges they don't already have
export async function checkAndAwardBadges(db: D1Database, userId: number): Promise<number[]> {
  try {
    // Get all badges
    const allBadges = await executeQuery(db, 'SELECT * FROM badges', []);
    
    // Get user's current badges
    const userBadgeIds = (await executeQuery(
      db,
      'SELECT badge_id FROM user_badges WHERE user_id = ?',
      [userId]
    )).map((ub: any) => ub.badge_id);
    
    // Get user stats
    const courseCompletions = await querySingle(
      db,
      'SELECT COUNT(*) as count FROM course_enrollments WHERE user_id = ? AND status = "completed"',
      [userId]
    );
    
    const programCompletions = await querySingle(
      db,
      'SELECT COUNT(*) as count FROM program_enrollments WHERE user_id = ? AND status = "completed"',
      [userId]
    );
    
    const perfectScores = await querySingle(
      db,
      'SELECT COUNT(*) as count FROM assessment_submissions WHERE user_id = ? AND score = 100',
      [userId]
    );
    
    // Check each badge the user doesn't have yet
    const newlyAwardedBadgeIds = [];
    
    for (const badge of allBadges) {
      if (userBadgeIds.includes(badge.id)) {
        continue;
      }
      
      // Parse requirements
      const requirements = JSON.parse(badge.requirements);
      let qualifies = false;
      
      // Check different badge types
      if (requirements.course_completions && courseCompletions.count >= requirements.course_completions) {
        qualifies = true;
      } else if (requirements.program_completions && programCompletions.count >= requirements.program_completions) {
        qualifies = true;
      } else if (requirements.assessment_score && perfectScores.count > 0) {
        qualifies = true;
      }
      // Note: consecutive_logins and instructor_awarded badges are handled separately
      
      if (qualifies) {
        const badgeId = await awardBadge(db, userId, badge.id);
        if (badgeId) {
          newlyAwardedBadgeIds.push(badgeId);
        }
      }
    }
    
    return newlyAwardedBadgeIds;
  } catch (error) {
    console.error('Error checking and awarding badges:', error);
    throw error;
  }
}

// Award a specific badge to a user (for instructor-awarded badges)
export async function awardSpecificBadge(
  db: D1Database,
  userId: number,
  badgeType: string
): Promise<number | null> {
  try {
    // Find the badge by type
    const badge = await querySingle(
      db,
      'SELECT * FROM badges WHERE badge_type = ?',
      [badgeType]
    );
    
    if (!badge) {
      return null;
    }
    
    return awardBadge(db, userId, badge.id);
  } catch (error) {
    console.error('Error awarding specific badge:', error);
    throw error;
  }
}

// Get user's total points
export async function getUserTotalPoints(db: D1Database, userId: number): Promise<number> {
  try {
    const result = await querySingle(
      db,
      'SELECT SUM(points) as total_points FROM points_transactions WHERE user_id = ?',
      [userId]
    );
    
    return result ? (result.total_points || 0) : 0;
  } catch (error) {
    console.error('Error getting user total points:', error);
    throw error;
  }
}

// Get user's badges
export async function getUserBadges(db: D1Database, userId: number): Promise<any[]> {
  try {
    return executeQuery(
      db,
      `SELECT b.*, ub.earned_at 
       FROM badges b
       JOIN user_badges ub ON b.id = ub.badge_id
       WHERE ub.user_id = ?
       ORDER BY ub.earned_at DESC`,
      [userId]
    );
  } catch (error) {
    console.error('Error getting user badges:', error);
    throw error;
  }
}

// Get user's points history
export async function getUserPointsHistory(db: D1Database, userId: number): Promise<any[]> {
  try {
    return executeQuery(
      db,
      `SELECT * FROM points_transactions 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );
  } catch (error) {
    console.error('Error getting user points history:', error);
    throw error;
  }
}

// Get user's gamification summary
export async function getUserGamificationSummary(db: D1Database, userId: number): Promise<any> {
  try {
    const totalPoints = await getUserTotalPoints(db, userId);
    const badges = await getUserBadges(db, userId);
    const pointsHistory = await getUserPointsHistory(db, userId);
    
    // Get user progress stats
    const courseCompletions = await querySingle(
      db,
      'SELECT COUNT(*) as count FROM course_enrollments WHERE user_id = ? AND status = "completed"',
      [userId]
    );
    
    const programCompletions = await querySingle(
      db,
      'SELECT COUNT(*) as count FROM program_enrollments WHERE user_id = ? AND status = "completed"',
      [userId]
    );
    
    const lessonCompletions = await querySingle(
      db,
      'SELECT COUNT(*) as count FROM lesson_completions WHERE user_id = ?',
      [userId]
    );
    
    const assessmentCompletions = await querySingle(
      db,
      'SELECT COUNT(*) as count FROM assessment_submissions WHERE user_id = ?',
      [userId]
    );
    
    return {
      userId,
      totalPoints,
      badges,
      pointsHistory,
      stats: {
        courseCompletions: courseCompletions.count,
        programCompletions: programCompletions.count,
        lessonCompletions: lessonCompletions.count,
        assessmentCompletions: assessmentCompletions.count
      }
    };
  } catch (error) {
    console.error('Error getting user gamification summary:', error);
    throw error;
  }
}

// Get leaderboard
export async function getLeaderboard(db: D1Database, limit: number = 10): Promise<any[]> {
  try {
    return executeQuery(
      db,
      `SELECT u.id, u.username, u.full_name, 
              SUM(pt.points) as total_points,
              COUNT(DISTINCT ub.badge_id) as badge_count
       FROM users u
       LEFT JOIN points_transactions pt ON u.id = pt.user_id
       LEFT JOIN user_badges ub ON u.id = ub.user_id
       GROUP BY u.id
       ORDER BY total_points DESC
       LIMIT ?`,
      [limit]
    );
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
}
