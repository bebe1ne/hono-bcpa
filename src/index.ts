import { Hono } from 'hono';

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const users: User[] = [];

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const app = new Hono();

app.get('/', (c) => {
  return c.text('Simple Auth API with Hono');
});

app.get('/users', (c) => {
  const safeUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));
  return c.json(safeUsers);
});

app.get('/users/:id', (c) => {
  const id = c.req.param('id');
  const user = users.find((u) => u.id === id);
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  return c.json(safeUser);
});

app.post('/signup', async (c) => {
  const body = await c.req.json<{
    name?: string;
    email?: string;
    password?: string;
  }>();

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return c.json({ error: 'name, email, and password are required' }, 400);
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return c.json({ error: 'Email is already in use' }, 409);
  }

  const newUser: User = {
    id: generateId(),
    name,
    email,
    password,
  };

  users.push(newUser);

  const safeUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };

  return c.json(safeUser, 201);
});

app.post('/signin', async (c) => {
  const body = await c.req.json<{
    email?: string;
    password?: string;
  }>();

  const { email, password } = body;

  if (!email || !password) {
    return c.json({ error: 'email and password are required' }, 400);
  }

  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  return c.json({
    message: 'Signin successful',
    user: safeUser,
  });
});

export default app;