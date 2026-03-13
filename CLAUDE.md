# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## Repository Overview

**MMara Client** is the web admin panel for the MMara legal AI system. Built with Next.js 16, TypeScript, and shadcn/ui.

**Related projects**:
- `../mmara-backend/` - FastAPI backend this app connects to
- `../mmara/` - Flutter mobile app
- `../CLAUDE.md` - Parent project documentation

---

## Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run with Turbopack (faster refresh)
npm run dev:turbo

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## Architecture

### Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (Radix UI primitives)
- **State**: React Context API
- **HTTP**: Axios with interceptors
- **Forms**: React Hook Form + Zod validation
- **Theming**: next-themes (dark mode)
- **Notifications**: Sonner (toasts)

### Key Services

| Service | File | Purpose |
|---------|------|---------|
| apiClient | `lib/api-client.ts` | Axios with auth interceptors |
| authService | `lib/auth.ts` | Login, register, password reset |
| chatService | `lib/chat.ts` | Chat API, WebSocket streaming |
| adminService | `lib/admin.ts` | Document upload, management, stats |

### Auth Flow

1. Login → JWT stored in localStorage + Context
2. Axios interceptor attaches Bearer token to requests
3. 401 responses trigger token refresh
4. Refresh failure → logout and redirect to login

---

## Project Structure

```
mmara-client/
├── app/                      # Next.js App Router
│   ├── admin/                # Admin panel
│   │   ├── documents/        # Document management
│   │   ├── retrieval/        # Retrieval testing
│   │   └── page.tsx          # Admin dashboard
│   ├── dashboard/            # Main chat interface
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── forgot-password/      # Password reset request
│   ├── reset-password/       # Password reset form
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── chat/                 # Chat-related components
│   ├── dashboard/            # Dashboard widgets
│   ├── ui/                   # shadcn/ui components
│   └── providers.tsx         # Global providers wrapper
├── contexts/
│   └── AuthContext.tsx       # Authentication state
├── lib/
│   ├── api-client.ts         # Axios with interceptors
│   ├── auth.ts               # Auth service
│   ├── chat.ts               # Chat service
│   ├── admin.ts              # Admin service
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utilities
├── providers/
│   └── ThemeProvider.tsx     # Dark mode provider
├── .env.local                # Environment variables (gitignored)
├── .env.local.example        # Environment template
└── package.json
```

---

## Environment Variables

Create `.env.local` from `.env.local.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

**Production**: Update `NEXT_PUBLIC_API_URL` to production backend URL.

---

## API Endpoints

Base URL: `NEXT_PUBLIC_API_URL/api/v1`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login/json` | POST | Login (JSON format) |
| `/auth/register` | POST | Register new user |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/me` | GET | Get current user |
| `/chat/query` | POST | Send chat message |
| `/chat/stream` | WS | Streaming chat |
| `/chat/sessions` | GET | List chat sessions |
| `/admin/documents` | GET/POST | List/upload documents |
| `/admin/retrieval` | POST | Test retrieval |
| `/admin/stats` | GET | System statistics |

---

## Admin Panel

### Document Management

- Upload PDF documents
- View processed documents
- Delete documents
- Trigger reindexing

### Retrieval Testing

Test the RAG system by:
1. Entering a query
2. Selecting category (criminal/road_traffic)
3. Viewing retrieved chunks with scores

### Stats Dashboard

View system metrics:
- Total documents
- Total chunks
- Total users
- Total queries

---

## UI Components

Uses shadcn/ui pattern. Components in `components/ui/`:
- Button, Input, Textarea
- Card, Dialog
- Table, Badge
- Form, Label
- Toast (via Sonner)

Add new components:
```bash
npx shadcn@latest add [component-name]
```

---

## Important Notes

- **Middleware**: `middleware.ts` handles auth redirects
- **Dark mode**: Enabled via next-themes, persists in localStorage
- **WebSocket**: Chat uses WebSocket for streaming responses
- **Admin routes**: Protected by middleware, redirect to login if unauthenticated
- **API URL**: Must use `NEXT_PUBLIC_API_URL` (not hardcoded)
