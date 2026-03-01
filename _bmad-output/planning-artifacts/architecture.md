---
stepsCompleted:
  - step-01-init
  - step-01b-continue
  - step-02-context
  - step-03-starter
  - step-04-decisions
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
workflowType: 'architecture'
project_name: 'Todo_App'
user_name: 'ferdus615'
date: '2026-03-01'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- Interactive Kanban board for managing personal tasks (drag-and-drop).
- Social community feed/view to see peers' progress.
- Frictionless interaction features: Liking and commenting on specific tasks.

**Non-Functional Requirements:**
- Highly responsive UI optimized for mobile touch/swipe interactions as well as desktop pointer inputs.
- Snappy, instant UI feedback (micro-interactions, haptics) for social engagements.
- Seamless integration with the existing backend system.

**Scale & Complexity:**
- Primary domain: Frontend Web App (Next.js)
- Complexity level: Medium
- Estimated architectural components: ~15-20 (Kanban board, columns, cards, comment threads, interaction badges, API service layer, state stores).

### Technical Constraints & Dependencies

- Must use Next.js architecture (Client vs. Server components balancing).
- Must integrate with the pre-existing backend architecture (API contracts dictating data fetching/mutation).

### Cross-Cutting Concerns Identified

- **State Management:** Complex client-side state required for fluid drag-and-drop Kanban interactions intersecting with incoming social data.
- **Data Fetching & Mutation:** Optimistic UI updates required for "likes" and task movements to ensure the "frictionless" emotional goal is met.
- **Component Architecture:** Strict separation needed between interactive Client components (drag-and-drop, like buttons) and data-fetching Server components.

## Starter Template Evaluation

### Primary Technology Domain

Frontend Web App (Next.js) based on project requirements analysis.

### Starter Options Considered

- **Option 1 (Clean Slate):** Official Next.js CLI + manual wiring of shadcn/ui, Zustand, and React Query v5.
- **Option 2 (Pre-configured):** Community boilerplates like `nizam` (Next.js + shadcn + Zustand + React Query).

### Selected Starter: Official Next.js CLI (Clean Slate)

**Rationale for Selection:**
Using the official `create-next-app` combined with manual installations ensures zero bloat. We avoid inheriting opinionated folder structures or outdated dependencies from third-party boilerplates, keeping the architecture modular and explicitly tailored for our AI agents to build upon.

**Initialization Command:**

```bash
# Initialize Next.js in the current directory
npx create-next-app@latest ./ --typescript --tailwind --eslint --app

# Initialize shadcn/ui
npx shadcn@latest init

# Install State Management & Data Fetching
npm install zustand @tanstack/react-query
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript enabled by default with Next.js App Router (React Server Components).

**Styling Solution:**
Tailwind CSS configured globally, supplemented by `shadcn/ui` for accessible, unstyled, and fully customizable base components.

**Build Tooling:**
Next.js compiler (SWC based) for ultra-fast builds and optimized production bundling.

**Testing Framework:**
None included by default (will be decided in later architectural steps if needed).

**Code Organization:**
Standard Next.js `app/` directory paradigm utilized. Strict separation of Client Components (`"use client"`) and Server Components.

**Development Experience:**
Fast Refresh enabled natively by Next.js. Absolute imports and ESLint automatically configured for clean code formatting.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Starter CLI & Base Stack (Next.js, TypeScript, Tailwind)
- API Interaction Layer (React Query v5)
- Authentication Strategy (Custom JWT via HttpOnly Cookies)

**Important Decisions (Shape Architecture):**
- State Management (Zustand + React Query)
- Validation Framework (Zod + React Hook Form)
- Component Library (shadcn/ui)

**Deferred Decisions (Post-MVP):**
- Complex real-time WebSocket integrations (start with optimistic UI and polling first).
- Extensive E2E Testing Framework (defer to QA steps later).

### Data Architecture & Validation

- **Validation:** Zod (v3.23+)
- **Form Handling:** React Hook Form (v7.51+)
- **Rationale:** Zod provides seamless runtime and compile-time type safety. Integrating it with React Hook Form is the official, path-of-least-resistance approach within the Next.js and shadcn/ui ecosystems.
- **Provided by Starter:** No (Manual install required).

### Authentication & Security

- **Authentication Method:** Custom JWT / Server Actions with HTTP-Only Cookies.
- **Rationale:** The backend API already exists. Intercepting its tokens via Next.js Server Actions and securely storing them as unreadable HTTP-Only cookies prevents XSS attacks and sidesteps the often-complex custom credential overrides required by NextAuth.js.
- **Provided by Starter:** No.

### API & Communication Patterns

- **API Library:** TanStack React Query (v5.x) + Native `fetch`.
- **Rationale:** React Query provides built-in mechanisms for optimistic UI updates—an absolute necessity to achieve the "frictionless" and snappy UX required for community commenting, liking, and drag-and-drop Kanban interactions.
- **Affects:** Every interactive component in the app.
- **Provided by Starter:** No (Manual install required).

### Frontend Architecture

- **State Management:** Zustand (v4.5+) for global UI state + React Query for server state.
- **Rationale:** Zustand is extremely lightweight, hook-based, and avoids the boilerplate of Redux. It perfectly coordinates with React Query's caching layer.
- **Component Architecture:** Heavily utilizing Server Components for initial fetches and SEO, while keeping Client Components leaf-level for interactions (Kanban elements, like buttons).
- **Provided by Starter:** No.

### Infrastructure & Deployment

- **Hosting Strategy:** Vercel (Recommended standard for Next.js App Router applications).
- **Rationale:** Zero-config deployment for Next.js, automatically optimizing Server Components and Edge functions.
- **Provided by Starter:** Not natively, but initialized Next.js apps are primed for it.

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialize Project (Starter template command).
2. Wire up Next.js Server Actions for Authentication (Login/Register bridging to backend).
3. Connect React Query Provider globally.
4. Set up base layout + generic UI components via shadcn/ui.
5. Build Kanban structure + Drag-and-drop Zustand state.
6. Connect React Query endpoints for tasks and social features.

**Cross-Component Dependencies:**
- React Query controls the server state which directly feeds into the Client Components handling the Kanban board.
- The Authentication HttpOnly cookie dictates all backend `fetch` calls through React Query.
