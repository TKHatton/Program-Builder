// API routes for the Program Builder application

import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { getDatabase, executeQuery, querySingle, insertRecord, updateRecord, deleteRecord } from '@/lib/db';
import { hashPassword, comparePasswords, generateToken } from '@/lib/auth';

// Helper function to handle errors
function handleError(error: any) {
  console.error('API Error:', error);
  return NextResponse.json(
    { error: error.message || 'An unexpected error occurred' },
    { status: 500 }
  );
}

// User authentication
export async function login(request: NextRequest) {
  try {
    const context = getCloudflareContext();
    const db = await getDatabase(context);
    
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    
    const { usernameOrEmail, password } = await request.json();
    
    if (!usernameOrEmail || !password) {
      return NextResponse.json({ error: 'Username/email and password are required' }, { status: 400 });
    }
    
    const user = await querySingle(
      db,
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [usernameOrEmail, usernameOrEmail]
    );
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const passwordMatch = await comparePasswords(password, user.password_hash);
    
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user data (excluding password) and token
    const { password_hash, ...userData } = user;
    
    return NextResponse.json({
      user: userData,
      token
    });
  } catch (error) {
    return handleError(error);
  }
}

// User registration
export async function register(request: NextRequest) {
  try {
    const context = getCloudflareContext();
    const db = await getDatabase(context);
    
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    
    const { username, email, password, fullName } = await request.json();
    
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }
    
    // Check if username or email already exists
    const existingUser = await querySingle(
      db,
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUser) {
      return NextResponse.json({ error: 'Username or email already in use' }, { status: 409 });
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Insert new user
    const userId = await insertRecord(db, 'users', {
      username,
      email,
      password_hash: passwordHash,
      full_name: fullName || null,
      role: 'learner'
    });
    
    // Get the created user
    const newUser = await querySingle(db, 'SELECT * FROM users WHERE id = ?', [userId]);
    
    if (!newUser) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
    
    // Generate JWT token
    const token = generateToken(newUser);
    
    // Return user data (excluding password) and token
    const { password_hash, ...userData } = newUser;
    
    return NextResponse.json({
      user: userData,
      token
    });
  } catch (error) {
    return handleError(error);
  }
}

// Program CRUD operations
export async function getPrograms(request: NextRequest) {
  try {
    const context = getCloudflareContext();
    const db = await getDatabase(context);
    
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    
    // Get query parameters
    const url = new URL(request.url);
    const creatorId = url.searchParams.get('creatorId');
    const isPublished = url.searchParams.get('isPublished');
    
    let query = 'SELECT * FROM programs';
    const params = [];
    const conditions = [];
    
    if (creatorId) {
      conditions.push('creator_id = ?');
      params.push(creatorId);
    }
    
    if (isPublished) {
      conditions.push('is_published = ?');
      params.push(isPublished === 'true' ? 1 : 0);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const programs = await executeQuery(db, query, params);
    
    return NextResponse.json({ programs });
  } catch (error) {
    return handleError(error);
  }
}

export async function getProgram(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = getCloudflareContext();
    const db = await getDatabase(context);
    
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    
    const programId = parseInt(params.id);
    
    if (isNaN(programId)) {
      return NextResponse.json({ error: 'Invalid program ID' }, { status: 400 });
    }
    
    const program = await querySingle(db, 'SELECT * FROM programs WHERE id = ?', [programId]);
    
    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }
    
    // Get courses for this program
    const courses = await executeQuery(
      db,
      'SELECT * FROM courses WHERE program_id = ? ORDER BY sequence_order ASC',
      [programId]
    );
    
    // Get enhancement materials for this program
    const materials = await executeQuery(
      db,
      'SELECT * FROM enhancement_materials WHERE program_id = ?',
      [programId]
    );
    
    return NextResponse.json({
      program,
      courses,
      materials
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function createProgram(request: NextRequest) {
  try {
    const context = getCloudflareContext();
    const db = await getDatabase(context);
    
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    
    const { title, description, objectives, targetAudience, creatorId, isPublished } = await request.json();
    
    if (!title || !creatorId) {
      return NextResponse.json({ error: 'Title and creator ID are required' }, { status: 400 });
    }
    
    const programId = await insertRecord(db, 'programs', {
      title,
      description: description || null,
      objectives: objectives || null,
      target_audience: targetAudience || null,
      creator_id: creatorId,
      is_published: isPublished ? 1 : 0
    });
    
    const program = await querySingle(db, 'SELECT * FROM programs WHERE id = ?', [programId]);
    
    return NextResponse.json({ program });
  } catch (error) {
    return handleError(error);
  }
}

export async function updateProgram(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = getCloudflareContext();
    const db = await getDatabase(context);
    
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    
    const programId = parseInt(params.id);
    
    if (isNaN(programId)) {
      return NextResponse.json({ error: 'Invalid program ID' }, { status: 400 });
    }
    
    const { title, description, objectives, targetAudience, isPublished } = await request.json();
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const success = await updateRecord(db, 'programs', programId, {
      title,
      description: description || null,
      objectives: objectives || null,
      target_audience: targetAudience || null,
      is_published: isPublished ? 1 : 0,
      updated_at: new Date().toISOString()
    });
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
    }
    
    const program = await querySingle(db, 'SELECT * FROM programs WHERE id = ?', [programId]);
    
    return NextResponse.json({ program });
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteProgram(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = getCloudflareContext();
    const db = await getDatabase(context);
    
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    
    const programId = parseInt(params.id);
    
    if (isNaN(programId)) {
      return NextResponse.json({ error: 'Invalid program ID' }, { status: 400 });
    }
    
    // Delete related records first (cascade delete)
    await executeQuery(db, 'DELETE FROM enhancement_materials WHERE program_id = ?', [programId]);
    
    // Get courses to delete their related records
    const courses = await executeQuery(db, 'SELECT id FROM courses WHERE program_id = ?', [programId]);
    
    for (const course of courses) {
      const courseId = course.id;
      
      // Delete lessons
      await executeQuery(db, 'DELETE FROM lesson_completions WHERE lesson_id IN (SELECT id FROM lessons WHERE course_id = ?)', [courseId]);
      await executeQuery(db, 'DELETE FROM lessons WHERE course_id = ?', [courseId]);
      
      // Delete assessments and related records
      const assessments = await executeQuery(db, 'SELECT id FROM assessments WHERE course_id = ?', [courseId]);
      
      for (const assessment of assessments) {
        const assessmentId = assessment.id;
        await executeQuery(db, 'DELETE FROM assessment_questions WHERE assessment_id = ?', [assessmentId]);
        await executeQuery(db, 'DELETE FROM assessment_submissions WHERE assessment_id = ?', [assessmentId]);
      }
      
      await executeQuery(db, 'DELETE FROM assessments WHERE course_id = ?', [courseId]);
      
      // Delete course enrollments
      await executeQuery(db, 'DELETE FROM course_enrollments WHERE course_id = ?', [courseId]);
    }
    
    // Delete courses
    await executeQuery(db, 'DELETE FROM courses WHERE program_id = ?', [programId]);
    
    // Delete program enrollments
    await executeQuery(db, 'DELETE FROM program_enrollments WHERE program_id = ?', [programId]);
    
    // Finally delete the program
    const success = await deleteRecord(db, 'programs', programId);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}

// Course CRUD operations
export async function getCourses(request: NextRequest) {
  try {
    const context = getCloudflareContext();
    const db = await getDatabase(context);
    
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    
    // Get query parameters
    const url = new URL(request.url);
    const programId = url.searchParams.get('programId');
    const isPublished = url.searchParams.get('isPublished');
    
    let query = 'SELECT * FROM courses';
    const params = [];
    const conditions = [];
    
    if (programId) {
      conditions.push('program_id = ?');
      params.push(programId);
    }
    
    if (isPublished) {
      conditions.push('is_published = ?');
      params.push(isPublished === 'true' ? 1 : 0);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY sequence_order ASC';
    
    const courses = await executeQuery(db, query, params);
    
    return NextResponse.json({ courses });
  } catch (error) {
    return handleError(error);
  }
}

// Similar CRUD operations for lessons, assessments, etc.
// ...

// User progress and enrollment
export async function enrollInProgram(request: NextRequest) {
  try {
    const context = getCloudflareContext();
    const db = await getDatabase(context);
    
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    
    const { userId, programId } = await request.json();
    
    if (!userId || !programId) {
      return NextResponse.json({ error: 'User ID and program ID are required' }, { status: 400 });
    }
    
    // Check if already enrolled
    const existingEnrollment = await querySingle(
      db,
      'SELECT * FROM program_enrollments WHERE user_id = ? AND program_id = ?',
      [userId, programId]
    );
    
    if (existingEnrollment) {
      return NextResponse.json({ error: 'User is already enrolled in this program' }, { status: 409 });
    }
    
    // Enroll in program
    const enrollmentId = await insertRecord(db, 'program_enrollments', {
      user_id: userId,
      program_id: programId,
      status: 'active'
    });
    
    // Auto-enroll in all published courses in this program
    const courses = await executeQuery(
      db,
      'SELECT id FROM courses WHERE program_id = ? AND is_published = 1',
      [programId]
    );
    
    for (const course of courses) {
      await insertRecord(db, 'course_enrollments', {
        user_id: userId,
        course_id: course.id,
        status: 'active'
      });
    }
    
    return NextResponse.json({ success: true, enrollmentId });
  } catch (error) {
    return handleError(error);
  }
}

export async function getUserProgress(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const context = getCloudflareContext();
    const db = await getDatabase(context);
    
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    
    const userId = parseInt(params.userId);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    // Get enrolled programs
    const programEnrollments = await executeQuery(
      db,
      `SELECT pe.*, p.title as program_title 
       FROM program_enrollments pe
       JOIN programs p ON pe.program_id = p.id
       WHERE pe.user_id = ?`,
      [userId]
    );
    
    // Get completed courses
    const completedCourses = await executeQuery(
      db,
      `SELECT COUNT(*) as count FROM course_enrollments 
       WHERE user_id = ? AND status = 'completed'`,
      [userId]
    );
    
    // Get completed lessons
    const completedLessons = await executeQuery(
      db,
      `SELECT COUNT(*) as count FROM lesson_completions 
       WHERE user_id = ?`,
      [userId]
    );
    
    // Get badges
    const badges = await executeQuery(
      db,
      `SELECT b.* FROM badges b
       JOIN user_badges ub ON b.id = ub.badge_id
       WHERE ub.user_id = ?
       ORDER BY ub.earned_at DESC`,
      [userId]
    );
    
    // Get points
    const pointsResult = await querySingle(
      db,
      'SELECT SUM(points) as total_points FROM points_transactions WHERE user_id = ?',
      [userId]
    );
    
    const totalPoints = pointsResult ? (pointsResult.total_points || 0) : 0;
    
    return NextResponse.json({
      userId,
      programEnrollments,
      completedCourses: completedCourses[0].count,
      completedLessons: completedLessons[0].count,
      badges,
      totalPoints
    });
  } catch (error) {
    return handleError(error);
  }
}
