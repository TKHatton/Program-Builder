// Authentication utilities for the Program Builder application

import { User } from './types';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// Secret key for JWT signing - in production, this would be an environment variable
const JWT_SECRET = 'program-builder-secret-key';

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare a password with a hash
export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate a JWT token for a user
export function generateToken(user: any): string {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify a JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Extract user from request headers
export function getUserFromRequest(request: Request): any {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  return verifyToken(token);
}

// Middleware to check if user is authenticated
export function requireAuth(handler: Function) {
  return async (request: Request, context: any) => {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Add user to request for downstream handlers
    context.user = user;
    
    return handler(request, context);
  };
}

// Middleware to check if user has admin role
export function requireAdmin(handler: Function) {
  return async (request: Request, context: any) => {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Add user to request for downstream handlers
    context.user = user;
    
    return handler(request, context);
  };
}
