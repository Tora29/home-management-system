# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
All responses will be in Japanese.

## Commands

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build production bundle with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint checks
```

## Architecture Overview

This is a Next.js 15 project using App Router with a Feature-Sliced Design (FSD) architecture. The codebase follows strict layered architecture rules to maintain clean separation of concerns.

### Layer Structure

The project follows a strict dependency hierarchy:
```
app → features → entities → shared
```
- Upper layers can import from lower layers
- Lower layers CANNOT import from upper layers
- Cross-imports within the same layer are forbidden

### Directory Structure Requirements

```
src/
├── app/                  # Next.js routing layer
│   ├── (routes)/         # Route groups
│   ├── api/              # Route Handlers
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
├── features/             # Business features
│   └── [feature-name]/
│       ├── api/
│       │   ├── actions.ts  # Server Actions ('use server')
│       │   ├── queries.ts  # Data fetching (RSC)
│       │   └── client.ts   # Client API calls
│       ├── hooks/          # Custom hooks
│       ├── model/          # Type definitions only
│       └── ui/             # Feature UI components
├── entities/             # Business entities
│   └── [entity-name]/
│       ├── model/          # Type definitions only
│       └── ui/             # Entity UI components
└── shared/               # Shared utilities
    ├── components/ui/      # UI primitives
    ├── lib/               # Libraries
    ├── utils/             # Utilities
    └── types/             # Shared types
```

### Critical Rules

1. **Page Component Restrictions**
   - `page.tsx` can ONLY import from:
     - `features/ui` for UI components
     - `features/api/queries` for data fetching

2. **Server Actions Placement**
   - Must be in `features/api/actions.ts` or `app/actions.ts`
   - Never in `entities` layer
   - Always use `'use server'` directive

3. **Form Handling**
   - Server-side: `<form action={serverAction}>`
   - Client-side: `<form onSubmit={handleSubmit}>`
   - Never pass client functions to `action` attribute

4. **Server/Client Component Boundaries**
   - Client Components cannot import Server Components
   - Boundaries must be created on the Server side
   - Use `'use client'` directive sparingly, prefer Server Components

5. **UI Component Hierarchy**
   - `shared/components/ui`: Basic UI primitives (Button, Input, etc.)
   - `entities/ui`: Combines shared primitives for domain-specific UI
   - `features/ui`: Combines entities/ui for feature-specific UI
   - Light primitives can be imported directly from shared

## Technology Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Build Tool**: Turbopack
- **React**: v19.1.0

## MCP Servers

The project is configured with three MCP servers:
- **context7**: Documentation retrieval
- **supabase**: Database operations (project: audmlwmanbwacwxgttgc)
- **github**: Repository operations

## Path Aliases

- `@/*` maps to `./src/*`

## Important Notes

- This is a home management system project
- Follows Feature-Sliced Design (FSD) architecture strictly
- Architecture rules are documented in `.claude/agents/00-Architechture-Rules/FSD-ARCHITECTURE-RULES.md`
- Default to Server Components, use Client Components only when necessary
- All mutations should use Server Actions with proper revalidation