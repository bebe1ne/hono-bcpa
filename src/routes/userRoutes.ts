import { Hono } from 'hono';
import { createUser, getUsers, getUserById, authenticateUser } from '../services/userService';

const userRoutes = new Hono();

userRoutes.get('/users', async (c) => {
  try {
    const users = await getUsers();
    return c.json(users);
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

userRoutes.get('/users/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const user = await getUserById(id);
    return c.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

userRoutes.post('/signup', async (c) => {
  try {
    const body = await c.req.json<{ name: string; email: string; password: string }>();
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return c.json({ error: 'name, email, and password are required' }, 400);
    }
    const user = await createUser({ name, email, password });
    return c.json(user, 201);
  } catch (error) {
    if (error.message === 'Email already in use') {
      return c.json({ error: 'Email is already in use' }, 409);
    }
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

userRoutes.post('/signin', async (c) => {
  try {
    const body = await c.req.json<{ email: string; password: string }>();
    const { email, password } = body;
    if (!email || !password) {
      return c.json({ error: 'email and password are required' }, 400);
    }
    const user = await authenticateUser(email, password);
    return c.json({ message: 'Signin successful', user });
  } catch (error) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }
});

export default userRoutes;