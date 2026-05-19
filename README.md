# OpsNest

Full-stack operations hub for Tech9Labs with a React dashboard, Node.js API, Prisma ORM, PostgreSQL database, JWT authentication, Docker support, and a premium pink glass UI.

## Overview

Tech9Labs Ops Hub is a service-operations portal for managing account access, operational entries, and contact submissions. The application includes a public landing page, authentication flow, protected dashboard, searchable work entries, contact inbox, and profile/settings view.

## Features

- Public landing page with Tech9Labs service information and contact form
- Premium pink glass UI inspired by modern iOS-style translucent surfaces
- User registration and login with JWT-based authentication
- Password hashing with `bcryptjs`
- Protected dashboard routes
- Dashboard overview with entry, completed-entry, and contact-submission counts
- Create, complete, delete, and search operational entries
- Contact form submission storage
- Contact inbox for authenticated users
- Profile/settings screen
- Responsive layout with collapsible desktop/mobile sidebar
- Dockerized app and PostgreSQL database
- Prisma schema, migrations, and generated client support
- React build served by the Express backend in production

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React icons
- Radix UI primitives
- Base UI menu primitives

### Backend

- Node.js
- Express 5
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcrypt password hashing

### Infrastructure

- Docker
- Docker Compose
- PostgreSQL 13 Alpine container
- Node 22 Alpine application image

## Project Structure

```text
.
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   ├── hooks/           # React hooks
│   │   ├── lib/             # API/auth/utils helpers
│   │   ├── pages/           # Landing, auth, and dashboard pages
│   │   ├── App.tsx          # Frontend routes
│   │   └── main.tsx         # React entry point
│   ├── package.json
│   └── tailwind.config.ts
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Prisma migrations
├── public/                  # Legacy/static fallback assets
├── src/
│   ├── middleware/          # Express auth middleware
│   ├── routes/              # API route handlers
│   ├── prismaClient.js      # Prisma client instance
│   └── server.js            # Express server
├── Dockerfile
├── docker-compose.yaml
├── package.json
└── README.md
```

## Requirements

- Node.js 22+
- npm
- Docker and Docker Compose
- PostgreSQL, if running without Docker

## Environment Variables

Create a `.env` file in the project root for local development.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todoapp"
JWT_SECRET="replace_with_a_secure_secret"
PORT=5001
NODE_ENV=development
```

Docker Compose provides container-specific environment values automatically for the app service.

## Installation

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
npm install --prefix client
```

Generate Prisma client:

```bash
npx prisma generate
```

Apply the Prisma schema to the database:

```bash
npx prisma db push
```

## Run Locally

Start the backend:

```bash
npm run dev
```

Start the frontend development server:

```bash
npm run client:dev
```

Default local URLs:

- Frontend dev server: `http://localhost:5173`
- Backend API/server: `http://localhost:5001`

## Run With Docker

Build and start the app and database:

```bash
docker compose up -d --build
```

The application will be available at:

```text
http://localhost:5001
```

Stop containers:

```bash
docker compose down
```

Stop containers and remove the PostgreSQL volume:

```bash
docker compose down -v
```

## Available Scripts

### Root

```bash
npm run dev             # Start Express server in watch mode
npm run client:dev      # Start Vite dev server
npm run client:build    # Build React frontend
npm run client:preview  # Preview built frontend
```

### Client

```bash
npm run dev       # Start Vite
npm run build     # Build production frontend
npm run preview   # Preview production build
```

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Create an account and return a JWT |
| `POST` | `/auth/login` | No | Authenticate an account and return a JWT |

Register/login body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Successful response:

```json
{
  "token": "jwt_token"
}
```

### Dashboard

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/dashboard` | Yes | Return account, entries, and contact submissions |

### Entries

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/todos` | Yes | List authenticated user's entries |
| `POST` | `/todos` | Yes | Create a new entry |
| `PUT` | `/todos/:id` | Yes | Update entry completion status |
| `DELETE` | `/todos/:id` | Yes | Delete an entry |

Create entry body:

```json
{
  "title": "Prepare client infrastructure review"
}
```

Update entry body:

```json
{
  "completed": true
}
```

### Contact

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/contact` | Optional | Submit a public contact message |
| `GET` | `/contact` | Yes | Fetch authenticated user's contact submissions |

Contact body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "We need help with cloud modernization."
}
```

## Authentication

Protected API routes expect a JWT in the `Authorization` header.

```http
Authorization: Bearer <token>
```

The token is issued during login/register and expires after 24 hours.

## Database Schema

### Account

Stores authenticated user accounts.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `Int` | Primary key |
| `email` | `String` | Unique |
| `passwordHash` | `String` | Hashed password |

### Entry

Stores operational dashboard entries.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `Int` | Primary key |
| `title` | `String` | Entry text |
| `completed` | `Boolean` | Defaults to `false` |
| `accountId` | `Int` | Owner account ID |

### ContactSubmission

Stores public contact messages.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `Int` | Primary key |
| `name` | `String` | Sender name |
| `email` | `String` | Sender email |
| `message` | `String` | Submitted message |
| `createdAt` | `DateTime` | Defaults to current timestamp |
| `accountId` | `Int?` | Optional linked account |

## Production Build

Build the React client:

```bash
npm run client:build
```

The Express server serves the built client from:

```text
client/dist
```

## UI Specification

- Pink-first premium visual system
- Glassmorphism panels using translucent white surfaces and blur
- Gradient primary buttons
- iOS-inspired rounded controls and soft shadows
- Responsive sidebar with smooth open/close transition
- Dashboard cards optimized for quick scanning
- Lucide icons used for navigation, metrics, actions, and service cards

## Security Notes

- Keep `.env` out of version control
- Use a strong `JWT_SECRET` in production
- Passwords are stored as bcrypt hashes
- Authenticated routes verify JWTs and account existence
- Do not commit database credentials or production secrets

## Deployment Notes

The included Docker setup builds the React frontend, starts the Express server, generates the Prisma client, syncs the database schema, and serves the app on port `5001`.

For production deployments, replace the default Compose secrets with secure environment variables and review Prisma migration strategy before using `db push`.

## License

ISC
