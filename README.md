# Hono Modular REST API

A comprehensive REST API built with Hono framework, featuring modular routing, Drizzle ORM with relational database design, and a clean service layer architecture.

## Features

- **Modular Routing**: Separate route modules for users, posts, and comments
- **Relational Database**: SQLite with Drizzle ORM supporting Users, Posts, and Comments with proper foreign key relationships
- **Service Layer**: Business logic abstracted into reusable service functions
- **Authentication**: User signup and signin functionality
- **Full CRUD Operations**: Create and retrieve users, posts, and comments
- **Relationship Queries**: Fetch posts by user and comments by post

## Tech Stack

- **Framework**: Hono (Fast web framework for Cloudflare Workers, Fastly Compute, Deno, Bun, Vercel, Netlify, AWS Lambda, Lambda@Edge, and Node.js)
- **Database**: SQLite with Drizzle ORM
- **Language**: TypeScript
- **Runtime**: Node.js

## Project Structure

```
src/
├── db/
│   ├── index.ts          # Database connection
│   └── schema.ts         # Database schema with relationships
├── routes/
│   ├── userRoutes.ts     # User-related endpoints
│   ├── postRoutes.ts     # Post-related endpoints
│   └── commentRoutes.ts  # Comment-related endpoints
├── services/
│   ├── userService.ts    # User business logic
│   ├── postService.ts    # Post business logic
│   └── commentService.ts # Comment business logic
└── index.ts              # Main application entry point
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Database Setup

1. Generate database migrations:
```bash
npm run db:generate
```

2. Apply migrations to create tables:
```bash
npm run db:migrate
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /signup` - Create new user
- `POST /signin` - Authenticate user

### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `GET /users/:userId/posts` - Get posts by user
- `POST /posts` - Create new post

### Comments
- `GET /comments` - Get all comments
- `GET /comments/:id` - Get comment by ID
- `GET /posts/:postId/comments` - Get comments by post
- `POST /comments` - Create new comment

## API Usage Examples

### Create User
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my post",
    "userId": "user-id-here"
  }'
```

### Get Posts by User
```bash
curl http://localhost:3000/users/{userId}/posts
```

## Database Schema

### Users Table
- `id` (string, primary key)
- `name` (string, not null)
- `email` (string, not null, unique)
- `password` (string, not null)

### Posts Table
- `id` (string, primary key)
- `title` (string, not null)
- `content` (string, not null)
- `userId` (string, foreign key to users.id)

### Comments Table
- `id` (string, primary key)
- `content` (string, not null)
- `postId` (string, foreign key to posts.id)
- `userId` (string, foreign key to users.id)

## Architecture Principles

- **Separation of Concerns**: Routes handle HTTP logic, services handle business logic, database operations are abstracted
- **Modular Design**: Each entity (users, posts, comments) has its own route and service modules
- **Relational Integrity**: Foreign keys ensure data consistency across tables
- **Error Handling**: Proper HTTP status codes and error messages
- **Type Safety**: Full TypeScript implementation for better development experience

## Development

This project demonstrates:
- Modular REST API design
- Relational database modeling with ORM
- Service layer pattern implementation
- Clean code architecture principles
- Modern JavaScript/TypeScript development practices
