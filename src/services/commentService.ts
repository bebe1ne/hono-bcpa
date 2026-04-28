import { eq } from 'drizzle-orm';
import { db } from '../db';
import { comments } from '../db/schema';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export async function createComment(data: { content: string; postId: string; userId: string }) {
  const id = generateId();
  await db.insert(comments).values({ id, ...data });
  return { id, ...data };
}

export async function getComments() {
  const result = await db.select().from(comments);
  return result;
}

export async function getCommentById(id: string) {
  const result = await db.select().from(comments).where(eq(comments.id, id));
  if (result.length === 0) {
    throw new Error('Comment not found');
  }
  return result[0];
}

export async function getCommentsByPostId(postId: string) {
  const result = await db.select().from(comments).where(eq(comments.postId, postId));
  return result;
}