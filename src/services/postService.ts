import { eq } from 'drizzle-orm';
import { db } from '../db';
import { posts } from '../db/schema';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export async function createPost(data: { title: string; content: string; userId: string }) {
  const id = generateId();
  await db.insert(posts).values({ id, ...data });
  return { id, ...data };
}

export async function getPosts() {
  const result = await db.select().from(posts);
  return result;
}

export async function getPostById(id: string) {
  const result = await db.select().from(posts).where(eq(posts.id, id));
  if (result.length === 0) {
    throw new Error('Post not found');
  }
  return result[0];
}

export async function getPostsByUserId(userId: string) {
  const result = await db.select().from(posts).where(eq(posts.userId, userId));
  return result;
}