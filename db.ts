// Database utility functions for the Program Builder application

import { D1Database } from '@cloudflare/workers-types';

// Get the database instance from the Cloudflare context
export async function getDatabase(context: any): Promise<D1Database | null> {
  try {
    // Check if DB binding exists in the context
    if (context.env && context.env.DB) {
      return context.env.DB;
    }
    return null;
  } catch (error) {
    console.error('Error getting database:', error);
    return null;
  }
}

// Generic query executor with error handling
export async function executeQuery(db: D1Database, query: string, params: any[] = []): Promise<any> {
  try {
    const result = await db.prepare(query).bind(...params).all();
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error(`Database query failed: ${error.message}`);
  }
}

// Generic single row query
export async function querySingle(db: D1Database, query: string, params: any[] = []): Promise<any> {
  try {
    const result = await db.prepare(query).bind(...params).first();
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error(`Database query failed: ${error.message}`);
  }
}

// Insert a record and return the inserted ID
export async function insertRecord(db: D1Database, table: string, data: Record<string, any>): Promise<number> {
  try {
    const columns = Object.keys(data);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(data);
    
    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`;
    const result = await db.prepare(query).bind(...values).first();
    
    return result.id;
  } catch (error) {
    console.error('Database insert error:', error);
    throw new Error(`Database insert failed: ${error.message}`);
  }
}

// Update a record by ID
export async function updateRecord(
  db: D1Database, 
  table: string, 
  id: number, 
  data: Record<string, any>
): Promise<boolean> {
  try {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];
    
    const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    const result = await db.prepare(query).bind(...values).run();
    
    return result.success;
  } catch (error) {
    console.error('Database update error:', error);
    throw new Error(`Database update failed: ${error.message}`);
  }
}

// Delete a record by ID
export async function deleteRecord(db: D1Database, table: string, id: number): Promise<boolean> {
  try {
    const query = `DELETE FROM ${table} WHERE id = ?`;
    const result = await db.prepare(query).bind(id).run();
    
    return result.success;
  } catch (error) {
    console.error('Database delete error:', error);
    throw new Error(`Database delete failed: ${error.message}`);
  }
}

// Get user by ID
export async function getUserById(db: D1Database, userId: number) {
  return querySingle(db, 'SELECT * FROM users WHERE id = ?', [userId]);
}

// Get user by username or email
export async function getUserByCredentials(db: D1Database, usernameOrEmail: string) {
  return querySingle(
    db, 
    'SELECT * FROM users WHERE username = ? OR email = ?', 
    [usernameOrEmail, usernameOrEmail]
  );
}

// Get programs created by a user
export async function getProgramsByCreator(db: D1Database, creatorId: number) {
  return executeQuery(db, 'SELECT * FROM programs WHERE creator_id = ? ORDER BY created_at DESC', [creatorId]);
}

// Get courses for a program
export async function getCoursesByProgram(db: D1Database, programId: number) {
  return executeQuery(
    db, 
    'SELECT * FROM courses WHERE program_id = ? ORDER BY sequence_order ASC', 
    [programId]
  );
}

// Get lessons for a course
export async function getLessonsByCourse(db: D1Database, courseId: number) {
  return executeQuery(
    db, 
    'SELECT * FROM lessons WHERE course_id = ? ORDER BY sequence_order ASC', 
    [courseId]
  );
}

// Get assessments for a course
export async function getAssessmentsByCourse(db: D1Database, courseId: number) {
  return executeQuery(
    db, 
    'SELECT * FROM assessments WHERE course_id = ? ORDER BY created_at ASC', 
    [courseId]
  );
}

// Get questions for an assessment
export async function getQuestionsByAssessment(db: D1Database, assessmentId: number) {
  return executeQuery(
    db, 
    'SELECT * FROM assessment_questions WHERE assessment_id = ? ORDER BY sequence_order ASC', 
    [assessmentId]
  );
}

// Get user progress for a program
export async function getUserProgramProgress(db: D1Database, userId: number, programId: number) {
  // Get program enrollment
  const enrollment = await querySingle(
    db,
    'SELECT * FROM program_enrollments WHERE user_id = ? AND program_id = ?',
    [userId, programId]
  );
  
  if (!enrollment) {
    return null;
  }
  
  // Get courses in the program
  const courses = await getCoursesByProgram(db, programId);
  
  // Get course enrollments for this user and program
  const courseEnrollments = await executeQuery(
    db,
    `SELECT ce.* FROM course_enrollments ce
     JOIN courses c ON ce.course_id = c.id
     WHERE ce.user_id = ? AND c.program_id = ?`,
    [userId, programId]
  );
  
  // Calculate completion percentage
  const completedCourses = courseEnrollments.filter(ce => ce.status === 'completed').length;
  const completionPercentage = courses.length > 0 ? (completedCourses / courses.length) * 100 : 0;
  
  return {
    enrollment,
    completedCourses,
    totalCourses: courses.length,
    completionPercentage
  };
}

// Get user badges
export async function getUserBadges(db: D1Database, userId: number) {
  return executeQuery(
    db,
    `SELECT b.* FROM badges b
     JOIN user_badges ub ON b.id = ub.badge_id
     WHERE ub.user_id = ?
     ORDER BY ub.earned_at DESC`,
    [userId]
  );
}

// Get user points total
export async function getUserPoints(db: D1Database, userId: number) {
  const result = await querySingle(
    db,
    'SELECT SUM(points) as total_points FROM points_transactions WHERE user_id = ?',
    [userId]
  );
  
  return result ? (result.total_points || 0) : 0;
}

// Award points to a user
export async function awardPoints(
  db: D1Database, 
  userId: number, 
  points: number, 
  transactionType: string,
  referenceId?: number,
  referenceType?: string,
  description?: string
) {
  return insertRecord(db, 'points_transactions', {
    user_id: userId,
    points,
    transaction_type: transactionType,
    reference_id: referenceId,
    reference_type: referenceType,
    description
  });
}

// Award a badge to a user
export async function awardBadge(db: D1Database, userId: number, badgeId: number) {
  // Check if user already has this badge
  const existingBadge = await querySingle(
    db,
    'SELECT * FROM user_badges WHERE user_id = ? AND badge_id = ?',
    [userId, badgeId]
  );
  
  if (existingBadge) {
    return existingBadge.id;
  }
  
  // Award the badge
  return insertRecord(db, 'user_badges', {
    user_id: userId,
    badge_id: badgeId
  });
}

// Check if user qualifies for any badges they don't already have
export async function checkAndAwardBadges(db: D1Database, userId: number) {
  // Get all badges
  const allBadges = await executeQuery(db, 'SELECT * FROM badges', []);
  
  // Get user's current badges
  const userBadgeIds = (await executeQuery(
    db,
    'SELECT badge_id FROM user_badges WHERE user_id = ?',
    [userId]
  )).map(ub => ub.badge_id);
  
  // Get user stats
  const courseCompletions = await executeQuery(
    db,
    'SELECT COUNT(*) as count FROM course_enrollments WHERE user_id = ? AND status = "completed"',
    [userId]
  );
  
  const programCompletions = await executeQuery(
    db,
    'SELECT COUNT(*) as count FROM program_enrollments WHERE user_id = ? AND status = "completed"',
    [userId]
  );
  
  const perfectScores = await executeQuery(
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
    if (requirements.course_completions && courseCompletions[0].count >= requirements.course_completions) {
      qualifies = true;
    } else if (requirements.program_completions && programCompletions[0].count >= requirements.program_completions) {
      qualifies = true;
    } else if (requirements.assessment_score && perfectScores[0].count > 0) {
      qualifies = true;
    }
    // Note: consecutive_logins and instructor_awarded badges are handled separately
    
    if (qualifies) {
      const badgeId = await awardBadge(db, userId, badge.id);
      newlyAwardedBadgeIds.push(badgeId);
    }
  }
  
  return newlyAwardedBadgeIds;
}
