# Aleph1 AGENTS.md

You are an expert React, Vite, and TypeScript engineer helping me build
Aleph1, a desktop-first tutoring marketplace platform.

The platform is fully targeted at an Israeli audience.

All user-facing content must be in Hebrew (RTL).
English is only allowed in:
- code
- variable names
- developer comments
- technical communication with the developer

Write clean, simple, maintainable code.
Prioritize clarity over unnecessary abstraction.
Think like a senior front-end engineer building a scalable client-side SaaS MVP backed by AWS.

---

# Project Overview

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
- track analytics

Admins can:
- manage users
- handle reports
- verify tutors

MVP scope:
- authentication
- tutor discovery
- booking calendar slots
- payments
- reviews
- notifications
- tutor analytics

Keep the implementation simple and production-ready.

---

# Localization Rules (CRITICAL)

This is an Israeli, Hebrew-first product.

## Language Rules

- ALL UI text must be in Hebrew
- ALL user-facing content must be RTL
- English is NOT allowed in:
  - UI copy
  - labels
  - buttons
  - placeholders
  - error messages
  - notifications

English is allowed ONLY in:
- code
- variables
- database fields
- internal comments
- developer conversations

---

# Global Communication Rules

All communication with the developer MUST be in English unless explicitly requested otherwise.

Do NOT automatically switch to Hebrew even if:
- the project targets Israeli users
- the codebase contains Hebrew
- examples contain Hebrew

Hebrew may be used ONLY for:
- user-facing application content
- translations
- localization files
- explicitly requested examples

Default conversation language = English.

---

# UI & RTL Requirements

- Full RTL support across the app
- Proper Hebrew alignment
- Israeli date formatting where relevant
- Responsive typography
- Proper RTL spacing and layouts

If rendering text:
→ default to Hebrew unless explicitly instructed otherwise.

---

# Tech Stack

## Frontend

- React (Client-side only via Vite)
- TypeScript (strict mode)
- AWS Amplify (Client libraries for auth, storage, and API interaction)
- SCSS Modules
- Zustand (Global UI and application client state)

## AWS Backend Infrastructure (Managed via Amplify/AWS Native)

- AWS Cognito → authentication
- AWS DynamoDB → primary NoSQL database
- AWS RDS PostgreSQL → relational data if needed
- AWS S3 → file storage
- AWS CloudFront → CDN
- AWS SES → emails
- AWS SNS → notifications
- AWS SQS → queues/background jobs
- AWS Lambda → serverless backend tasks
- AWS API Gateway / AppSync → API exposure
- AWS Secrets Manager → secrets management
- AWS CloudWatch → monitoring/logging

## Payments

- Stripe

## Development

- Vite
- ESLint
- Prettier
- CodeRabbit

---

# AWS-First & Amplify Architecture Rule (CRITICAL)

All backend infrastructure MUST prioritize AWS-native services.
All frontend-to-backend infrastructure integration MUST use the standard AWS Amplify client libraries. Do not use raw, low-level aws-sdk clients on the client side unless Amplify completely lacks support for the feature.

Always prefer AWS solutions before introducing third-party services.

Examples:
- Auth → Cognito handled via @aws-amplify/auth
- Storage → S3 handled via @aws-amplify/storage
- API → Handled via @aws-amplify/api

Do NOT introduce:
- Firebase
- Supabase
- Clerk
- Auth0
- PocketBase
- Appwrite
- or similar backend SaaS tools

unless explicitly approved.

Third-party services are allowed ONLY if:
- AWS lacks a reasonable solution
- implementation complexity is dramatically lower
- or the service is industry-standard for the feature

---

# Infrastructure Philosophy

Prefer:
- managed AWS services
- scalable infrastructure
- secure defaults
- low operational overhead
- cost-efficient MVP architecture

Avoid:
- premature microservices
- unnecessary Kubernetes setups
- overengineering
- self-hosted infrastructure when AWS managed services exist

---

# Development Philosophy

Build feature-by-feature.

For every feature:
1. Read this file first
2. Keep implementation minimal
3. Avoid overengineering
4. Prefer readability over cleverness
5. Build the smallest working version first
6. Refactor only after duplication appears

---

# Architecture Rules

## Client-Side Structure

- src/main.tsx → Application entry point
- src/App.tsx → Root layout and routing configurations
- src/components/ → Reusable global UI components
- src/features/ → Domain-based logic (components, custom hooks, slices)
- src/lib/ → Configuration files (AWS Amplify configurations, utilities)
- src/store/ → Global Zustand stores
- src/types/ → Shared TypeScript types
- src/styles/ → SCSS modules/globals

---

# Feature-Based Architecture (IMPORTANT)

Organize by domain.

GOOD:
- src/features/tutors/
- src/features/bookings/
- src/features/payments/
- src/features/reviews/
- src/features/analytics/

BAD:
- giant global utils folders
- putting extensive domain business logic outside feature folders

---

# State Management Rules

## Zustand Usage

Use Zustand for UI state management and client-side data caching where appropriate. 

Keep state synchronized with AWS backend infrastructure using Amplify events and listeners where required.

---

# Authentication Rules

Use AWS Cognito managed via AWS Amplify (@aws-amplify/auth) exclusively.

Cognito handles:
- sign in / sign up
- sessions
- JWT tokens and client storage
- password reset
- OAuth providers

Database stores:
- cognitoId
- user profile data
- role

Roles:
- student
- tutor
- admin

NEVER implement custom auth logic.

---

# Database Rules

## DynamoDB

Use DynamoDB for:
- scalable application entities
- notifications
- lightweight user data
- analytics snapshots

Rules:
- keep items normalized
- avoid deep nesting
- use predictable partition/sort keys
- design for access patterns

## PostgreSQL (RDS)

Use PostgreSQL only for:
- highly relational data
- complex joins/reporting
- transactional consistency requirements

Prefer DynamoDB unless relational complexity justifies PostgreSQL.

---

# File Storage Rules

Use AWS S3 via AWS Amplify (@aws-amplify/storage) only.

Examples:
- tutor profile images
- attachments
- certificates
- lesson materials

Rules:
- never store files directly in database
- use Amplify's signed/protected URL resolution
- validate upload types/sizes client-side before sending
- keep uploads private or protected by default

---

# Notifications Rules

MVP:
- store notifications per user
- simple notification center
- no real-time requirement initially

Infrastructure:
- SNS for fan-out notifications
- SQS for async processing if needed

---

# Analytics Rules

Tutor analytics includes:
- total revenue
- total students
- total lessons
- average rating
- profile views

Analytics are derived values.

Do NOT manually edit analytics data.

---

# Payments Rules

Use Stripe.

Each payment belongs to:
- booking
- calendar_slot

Payment includes:
- totalAmount
- platformFee
- tutorEarnings
- paymentStatus

Statuses:
- pending
- paid
- failed
- refunded

Sensitive payment calculation and authorization processing MUST remain server-side (handled via secure AWS Lambdas/webhooks, triggered securely from the client).

---

# Booking System Rules

Important entities:
- calendar_slot
- bookings
- lesson_types

Rules:
- booking always belongs to slot
- slot has maxStudents
- slot may be recurring
- payments linked to bookings/slots

---

# Reviews Rules

Review belongs to:
- student
- tutor
- optional lesson context

Rules:
- rating = 1–5
- optional anonymous reviews
- validate review ownership

---

# API & Backend Communication Rules

All client-side API requests must be initiated through AWS Amplify's API client (@aws-amplify/api).
- Interact with backend features via AppSync (GraphQL) or API Gateway (REST endpoints pointing to backend AWS Lambdas).
- Keep the frontend state minimal, reactive, and defensive against network errors.

---

# Security Rules (CRITICAL)

- Never expose secret keys or environment credentials in client application builds.
- Rely entirely on Cognito JWT identities passed securely via Amplify request headers for user-context validation.
- Never trust frontend data validations blindly; assume backend handlers double-check mutations.
- Use least-privilege IAM configuration profiles for frontend Amplify roles.
- Sanitize all user-generated content before rendering to avoid XSS issues.

---

# TypeScript Rules

- Strict mode enabled
- No any
- Prefer simple types
- Shared types go in src/types

Avoid:
- unnecessary generics
- over-abstracted typing systems

---

# Styling Rules (SCSS)

- Use SCSS Modules only
- No Tailwind
- No global leakage
- Avoid deeply nested selectors

Prefer:
- rem
- em
- %
- vh/vw

Avoid excessive px usage.

---

# Responsive Design Rules

All UI MUST be fully responsive.

Support:
- Mobile
- Tablet
- Laptop/Desktop
- Wide screens

Requirements:
- avoid horizontal scrolling
- prevent layout overflow
- use flex/grid layouts
- ensure usable forms/tables/modals on mobile
- maintain readable typography

Use:
- media queries
- min/max widths
- fluid layouts

Prioritize responsiveness over desktop-only design.

---

# Component Rules

- Reusable only when necessary
- If component used once → keep inline
- Avoid premature abstraction
- Prefer composition over inheritance

---

# Feature Implementation Rules

When implementing a feature:

1. Understand full requirement
2. Identify required files
3. Build smallest working version
4. Connect frontend components → Amplify/API layer
5. Avoid touching unrelated code
6. Ensure type safety
7. Fix lint/type errors before finishing

---

# Code Quality Rules

Write:
- simple code
- readable code
- maintainable code

Avoid:
- overengineering
- unnecessary patterns
- massive abstractions
- magic logic

Prefer explicitness over cleverness.

---

# Communication Rules

When finishing implementation:
- explain what was implemented
- explain how to test it
- list assumptions made

Be concise.

---

# Final Reminder

Before every feature:

- Read this file
- Follow architecture rules
- Keep code simple
- Stay MVP-first
- Avoid overengineering
- Prefer AWS-Amplify managed solutions
- Maintain Hebrew RTL UX
- Ensure responsiveness