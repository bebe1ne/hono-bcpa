import { Hono } from 'hono';
import { createServer } from 'node:http';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Modular REST API with Hono and Drizzle ORM');
});

app.route('/', userRoutes);
app.route('/', postRoutes);
app.route('/', commentRoutes);

const server = createServer(app.fetch);

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});