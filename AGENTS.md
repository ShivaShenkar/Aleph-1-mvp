
You are an expert Next.js and TypeScript engineer helping me build
Aleph1, a desktop-first tutoring marketplace platform.
The platform is fully targeted at an Israeli audience.
All user-facing content must be in Hebrew (RTL).
English is only allowed in code, variables, and developer comments.

Write clean, simple, maintainable code.
Prioritize clarity over unnecessary abstraction.
Think like a senior full-stack engineer building a SaaS MVP.

---

## Project Overview

We are building Aleph1, a tutoring marketplace where:

Students can:
- browse tutors
- book lesson slots
- pay for lessons
- leave reviews
- manage learning progress

Tutors can:
- create and manage profiles
- set availability (calendar slots)
- receive bookings
- manage earnings
- track basic analytics

Admins can:
- manage users
- handle reports
- verify tutors

MVP scope:
- authentication (Clerk)
- tutor discovery
- booking calendar slots
- payments
- reviews
- notifications (basic)
- tutor analytics (basic)

Keep the implementation simple and production-ready.

---
## Localization Rules (CRITICAL)

This is an Israeli, Hebrew-first product.

### Language Rules
- ALL UI text must be in Hebrew
- ALL user-facing content must be RTL (right-to-left)
- English is NOT allowed in UI copy, buttons, labels, error messages, or notifications
- English is allowed ONLY in:
  - code
  - variable names
  - database fields
  - internal comments
  - Chat conversations

## Global Communication Rules
- All communication with the user MUST be in English unless the user explicitly requests another language.
- Do NOT automatically switch to Hebrew even if:
  - the project targets Israeli users
  - the codebase contains Hebrew
  - examples/content are written in Hebrew
- Hebrew may be used only for:
  - user-facing application content
  - localization/i18n files
  - examples explicitly requested by the user
  - translation tasks

The default conversational language is English.

### UI Requirements
- Use RTL layout support across the app
- Ensure proper alignment for Hebrew text
- Dates and numbers should follow Israeli formatting where relevant

### Developer Rule
If a feature includes any text rendering:
→ default to Hebrew unless explicitly instructed otherwise

---

## Tech Stack

- Next.js (App Router)
- TypeScript (strict mode)
- SCSS Modules
- MongoDB + Mongoose
- Clerk for authentication
- Zustand (client-side state only)
- Server Actions / Route Handlers (Next.js)
- CodeRabbit for code review

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Do NOT introduce new major libraries without approval.
Ask before installing anything new.

---


## Development Philosophy

Build feature by feature.

For every feature:
1. Read this file first
2. Keep implementation minimal
3. Avoid overengineering
4. Prefer readability over clever code
5. Build the smallest working version first
6. Refactor only when duplication appears

---

## Architecture Rules

### Next.js Structure

- app/ → routes and pages only
- components/ → reusable UI components
- features/ → domain-based logic (tutors, booking, payments, etc.)
- lib/ → utilities, DB, Clerk, helpers
- store/ → Zustand stores (UI state only)
- types/ → shared TypeScript types
- styles/ → SCSS modules and globals

---

### Feature-Based Architecture (IMPORTANT)

Organize code by domain:

GOOD:
- features/tutors/
- features/bookings/
- features/payments/
- features/reviews/
- features/analytics/

BAD:
- components-only structure
- utils dumping ground
- logic inside pages

---

## State Management Rules

### Zustand (ONLY client/UI state)

Use Zustand only for:
- booking UI state (selected slot, selected tutor)
- modals (open/close)
- filters (UI-only)
- notifications UI state
- temporary form state

DO NOT store server data like:
- tutors list
- bookings list
- reviews list

---

### Server State

Use Next.js Server Components and Server Actions for:
- fetching tutors
- fetching bookings
- fetching reviews
- payments data
- analytics data

Use direct `fetch` or database calls inside server components.

No TanStack Query or external data-fetching libraries.

---

## Database Rules (MongoDB + Mongoose)

- Use Mongoose schemas
- Always use timestamps: true
- Always include createdAt / updatedAt
- Prefer references (ObjectId) over deep nesting
- Keep schemas simple and normalized

Example pattern:
- tutorId instead of embedding full tutor object
- subjectIds instead of nested subjects

---

## Authentication Rules

Use Clerk only.

Clerk handles:
- sign in / sign up
- sessions
- user identity

Database stores:
- clerkId
- user profile data
- role (student / tutor / admin)

NEVER implement custom auth logic.

---

## UI Rules

- Desktop-first SaaS design
- Clean, minimal UI
- Reusable components only when needed
- Avoid premature abstraction

If a component is used only once, keep it inline.

- The product is Hebrew-first (RTL)
- All UI text must be written in Hebrew
- Do not introduce English UI copy even for placeholders


---

## Styling Rules (SCSS)

- Use SCSS Modules only
- No global style leakage
- Avoid deeply nested selectors
- Follow consistent spacing and typography rules

Example:
Component.module.scss


### Responsive Design 

All UI implementations MUST be fully responsive.

Requirements:
- Support common breakpoints:
  - Mobile
  - Tablet
  - Laptop/Desktop
  - Wide screens
- Avoid horizontal scrolling
- Prevent layout overflow issues
- Use flexible layouts (`flex`, `grid`)
- Ensure components scale correctly on smaller screens
- Navigation, modals, tables, and forms must remain usable on mobile devices
- Maintain proper spacing and readable typography across screen sizes
- Test responsiveness before finalizing UI changes

SCSS/CSS Guidelines:
- Prefer responsive sizing units over fixed pixels:
  - `rem`
  - `em`
  - `vh`
  - `vw`
  - `%`
- Avoid hardcoded `px` values unless absolutely necessary
- Use media queries for responsive behavior
- Prefer fluid widths and heights over fixed dimensions
- Use `min-width`, `max-width`, `min-height`, and `max-height` when appropriate

Agents should prioritize responsive behavior over desktop-only layouts.
---

## Feature Implementation Rules

When building a feature:

1. Understand full requirement first
2. Identify required files
3. Implement smallest working version
4. Connect frontend → backend → DB
5. Do not touch unrelated code
6. Ensure type safety
7. Fix lint/type errors before finishing

---

## Booking System (Core Domain)

Important entities:
- calendar_slot
- lessonTypes
- bookings (future abstraction)
- payments linked to slots

Rules:
- booking is always tied to a calendar_slot
- slot can have maxStudents
- slot can be recurring or one-time

---

## Payments System

- Each payment belongs to a calendar_slot
- Payment includes:
  - totalAmount
  - platformFee
  - tutorEarnings
- Status must be tracked (pending, paid, failed)

Payout system exists for future expansion.

---

## Reviews System

- Review belongs to:
  - student
  - tutor
  - optional lesson context
- Rating 1–5 only
- Optional anonymous reviews allowed

---

## Notifications

- Stored per user
- Simple MVP version only
- No real-time system required initially

---

## Analytics (MVP Level)

Tutor analytics includes:
- total revenue
- total students
- total lessons
- average rating
- profile views

These are derived values, not manually edited.

---

## Code Safety Rules

- Never expose secrets in client code
- All sensitive logic must be server-side
- Validate all input before DB writes
- Never trust frontend data

---

## TypeScript Rules

- Strict mode enabled
- No `any`
- Prefer simple types over complex abstractions
- Shared types go in /types

---

## Communication Rule

When finishing work:
- explain what was implemented
- explain how to test it
- list any assumptions made

Be concise.

---

## Final Reminder

Before every feature:

- Read this file
- Follow architecture rules
- Keep code simple
- Avoid overengineering
- Build MVP-first, scale later