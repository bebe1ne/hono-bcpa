import { Hono } from 'hono';
import { createComment, getComments, getCommentById, getCommentsByPostId } from '../services/commentService';

const commentRoutes = new Hono();

commentRoutes.get('/comments', async (c) => {
  try {
    const comments = await getComments();
    return c.json(comments);
  } catch (error) {
    return c.json({ error: 'Failed to fetch comments' }, 500);
  }
});

commentRoutes.get('/comments/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const comment = await getCommentById(id);
    return c.json(comment);
  } catch (error) {
    if (error.message === 'Comment not found') {
      return c.json({ error: 'Comment not found' }, 404);
    }
    return c.json({ error: 'Failed to fetch comment' }, 500);
  }
});

commentRoutes.get('/posts/:postId/comments', async (c) => {
  try {
    const postId = c.req.param('postId');
    const comments = await getCommentsByPostId(postId);
    return c.json(comments);
  } catch (error) {
    return c.json({ error: 'Failed to fetch comments' }, 500);
  }
});

commentRoutes.post('/comments', async (c) => {
  try {
    const body = await c.req.json<{ content: string; postId: string; userId: string }>();
    const { content, postId, userId } = body;
    if (!content || !postId || !userId) {
      return c.json({ error: 'content, postId, and userId are required' }, 400);
    }
    const comment = await createComment({ content, postId, userId });
    return c.json(comment, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create comment' }, 500);
  }
});

export default commentRoutes;