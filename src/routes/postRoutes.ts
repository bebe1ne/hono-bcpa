import { Hono } from 'hono';
import { createPost, getPosts, getPostById, getPostsByUserId } from '../services/postService';

const postRoutes = new Hono();

postRoutes.get('/posts', async (c) => {
  try {
    const posts = await getPosts();
    return c.json(posts);
  } catch (error) {
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});

postRoutes.get('/posts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const post = await getPostById(id);
    return c.json(post);
  } catch (error) {
    if (error.message === 'Post not found') {
      return c.json({ error: 'Post not found' }, 404);
    }
    return c.json({ error: 'Failed to fetch post' }, 500);
  }
});

postRoutes.get('/users/:userId/posts', async (c) => {
  try {
    const userId = c.req.param('userId');
    const posts = await getPostsByUserId(userId);
    return c.json(posts);
  } catch (error) {
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});

postRoutes.post('/posts', async (c) => {
  try {
    const body = await c.req.json<{ title: string; content: string; userId: string }>();
    const { title, content, userId } = body;
    if (!title || !content || !userId) {
      return c.json({ error: 'title, content, and userId are required' }, 400);
    }
    const post = await createPost({ title, content, userId });
    return c.json(post, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

export default postRoutes;