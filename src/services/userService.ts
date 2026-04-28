import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export async function createUser(data: { name: string; email: string; password: string }) {
  const existing = await db.select().from(users).where(eq(users.email, data.email));
  if (existing.length > 0) {
    throw new Error('Email already in use');
  }
  const id = generateId();
  await db.insert(users).values({ id, ...data });
  return { id, name: data.name, email: data.email };
}

export async function getUsers() {
  const result = await db.select({ id: users.id, name: users.name, email: users.email }).from(users);
  return result;
}

export async function getUserById(id: string) {
  const result = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.id, id));
  if (result.length === 0) {
    throw new Error('User not found');
  }
  return result[0];
}

export async function authenticateUser(email: string, password: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  if (result.length === 0 || result[0].password !== password) {
    throw new Error('Invalid email or password');
  }
  return { id: result[0].id, name: result[0].name, email: result[0].email };
}