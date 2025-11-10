# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 application for shift scheduling management ("Programador de Turnos"). Built with TypeScript, React 19, and Tailwind CSS v4, using the App Router architecture.

## Development Commands

```bash
# Development
pnpm dev              # Start dev server on http://localhost:3000

# Build & Production
pnpm build            # Build for production
pnpm start            # Start production server

# Linting
pnpm lint             # Run ESLint
```

## Architecture

### UI Framework
- **shadcn/ui**: Component library based on Radix UI primitives
  - Config: `components.json` (New York style, RSC, CSS variables)
  - Add components: Use MCP shadcn tools or `npx shadcn@latest add [component]`
  - Custom components in `components/ui/`
  - Pre-configured sidebar components in `components/` (nav-main, nav-user, app-sidebar, etc.)

### Styling
- Tailwind CSS v4 with PostCSS
- Global styles: `app/globals.css`
- Utility: `lib/utils.ts` exports `cn()` for className merging

### Path Aliases
- `@/*` resolves to project root
- `@/components` for components
- `@/lib` for utilities
- `@/hooks` for custom hooks

### App Structure
- `app/`: Next.js App Router pages and layouts
  - `app/layout.tsx`: Root layout with Geist fonts
  - `app/page.tsx`: Landing page
  - `app/dashboard/page.tsx`: Dashboard with sidebar layout
- `components/`: Reusable React components (UI and custom)
- `lib/`: Utility functions
- `hooks/`: Custom React hooks

### Key Patterns
- Client components use `"use client"` directive (e.g., app-sidebar.tsx)
- Dashboard uses SidebarProvider pattern with collapsible sidebar
- Icons from lucide-react

## Code Style

- Evita el sobre comentarios de las cosas, mantenlo al minimo