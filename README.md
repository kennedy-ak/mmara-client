# MMara Client

A modern React web application for testing and interacting with the MMara Backend - a multi-agent RAG (Retrieval-Augmented Generation) system for Ghanaian legal assistance.

## Features

- **Authentication System**
  - User registration with email validation
  - Secure login with JWT tokens
  - Password reset via email
  - Token refresh mechanism

- **Chat Interface**
  - Real-time AI-powered legal assistance
  - Session management (create, view, delete conversations)
  - Category selection (Criminal, Road Traffic, General)
  - Citation display from legal documents
  - Confidence and urgency indicators
  - Message feedback system

- **Admin Panel**
  - Document upload (PDF)
  - Document management (view, delete)
  - Process pending documents
  - Test retrieval system
  - System statistics dashboard

- **UI/UX**
  - Modern design with shadcn/ui components
  - Dark mode support
  - Responsive layout (mobile-friendly)
  - Toast notifications
  - Loading states and error handling

## Tech Stack

- **Framework:** Next.js 16+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui
- **State Management:** React Context API
- **HTTP Client:** Axios with interceptors
- **Forms:** React Hook Form + Zod validation
- **Theming:** next-themes
- **Notifications:** Sonner

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MMara Backend running on `http://localhost:8000`
- PostgreSQL database configured
- Redis server running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (edit `.env.local` if needed):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
mmara-client/
├── app/                      # Next.js app router
│   ├── about/                # About page
│   ├── admin/                # Admin panel
│   ├── dashboard/            # Main dashboard & chat
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── forgot-password/      # Password reset request
│   └── reset-password/       # Password reset form
├── components/               # React components
│   ├── chat/                 # Chat-related components
│   ├── dashboard/            # Dashboard components
│   ├── ui/                   # shadcn/ui components
│   └── providers.tsx         # Global providers wrapper
├── contexts/                 # React contexts
│   └── AuthContext.tsx       # Authentication context
├── lib/                      # Utilities and services
│   ├── api-client.ts         # Axios instance with auth
│   ├── auth.ts               # Authentication service
│   ├── chat.ts               # Chat service
│   ├── admin.ts              # Admin service
│   └── types.ts              # TypeScript types
└── providers/                # Context providers
    └── ThemeProvider.tsx     # Dark mode provider
```

## License

This project is part of the MMara legal assistance system.
