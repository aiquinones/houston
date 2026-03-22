---
name: Acme SaaS App
version: 1.0
description: A Next.js SaaS starter with auth, billing, and a dashboard
---

## Authentication

Handles user registration, login, sessions, and password reset. Built on Supabase Auth with custom middleware for role-based access.

### User Signup

- [POST /auth/signup](src/app/api/auth/signup/route.ts) → Entry point for new user registration
  - [validateSignupInput](src/lib/validation.ts#validateSignupInput) → Zod schema validation (email, password strength)
  - [createUser](src/lib/auth.ts#createUser) → Supabase auth.signUp call
  - [createProfile](src/db/profiles.ts#create) → Insert default profile into profiles table
  - [sendWelcomeEmail](src/services/email.ts#sendWelcome) → Queue welcome email via Resend

### User Login

- [POST /auth/login](src/app/api/auth/login/route.ts) → Entry point for login
  - [validateLoginInput](src/lib/validation.ts#validateLoginInput) → Validate email + password
  - [signIn](src/lib/auth.ts#signIn) → Supabase auth.signInWithPassword
  - [Set session cookie](src/middleware.ts:28) → Write auth token to httpOnly cookie

### Auth Middleware

- [middleware](src/middleware.ts) → Next.js middleware, runs on every request
  - [Check session](src/middleware.ts:15) → Validate Supabase session from cookie
  - [Redirect if unauthenticated](src/middleware.ts:22) → Send to /login
  - [Attach user to request](src/middleware.ts:30) → Add user context for downstream routes

### Connections

- [Authentication] → [Database] : reads/writes users and profiles
- [Authentication] → [Email Service] : sends welcome and password reset emails

## Database

Supabase Postgres with row-level security. Schema managed via migrations.

### Schema

- [Users table](supabase/migrations/001_users.sql) → Base auth users (managed by Supabase)
- [Profiles table](supabase/migrations/002_profiles.sql) → Extended user data (name, avatar, role)
- [Subscriptions table](supabase/migrations/003_subscriptions.sql) → Stripe subscription state
- [RLS policies](supabase/migrations/004_rls.sql) → Users can only access own data

### Connections

- [Database] ← [Authentication] : user/profile CRUD
- [Database] ← [Billing] : subscription state sync
- [Database] ← [Dashboard] : read-only queries for display

## Billing

Stripe integration for subscriptions. Webhooks sync state to Supabase.

### Checkout Flow

- [Create checkout](src/app/api/billing/checkout/route.ts) → Create Stripe Checkout Session
  - [getOrCreateCustomer](src/lib/stripe.ts#getOrCreateCustomer) → Find or create Stripe customer
  - [createCheckoutSession](src/lib/stripe.ts#createCheckoutSession) → Build session with price ID
- [Redirect to Stripe](src/components/PricingCard.tsx:42) → Client-side redirect to Stripe hosted checkout

### Webhook Handler

- [POST /api/webhooks/stripe](src/app/api/webhooks/stripe/route.ts) → Stripe webhook endpoint
  - [Verify signature](src/app/api/webhooks/stripe/route.ts:12) → Validate webhook authenticity
  - [Handle checkout.session.completed](src/lib/billing-events.ts#handleCheckoutComplete) → Activate subscription
  - [Handle customer.subscription.updated](src/lib/billing-events.ts#handleSubscriptionUpdate) → Sync plan changes
  - [Handle customer.subscription.deleted](src/lib/billing-events.ts#handleSubscriptionDelete) → Mark as cancelled

### Connections

- [Billing] → [Database] : writes subscription state
- [Billing] ← [Dashboard] : reads current plan for display

## Dashboard

The main authenticated UI. Server-rendered with Next.js App Router.

### Page Load

- [Dashboard layout](src/app/dashboard/layout.tsx) → Shared layout with sidebar nav
  - [getUser](src/lib/auth.ts#getUser) → Fetch current user from session
  - [getSubscription](src/db/subscriptions.ts#getByUserId) → Fetch current plan
- [Dashboard home](src/app/dashboard/page.tsx) → Overview with stats and recent activity
  - [getStats](src/db/analytics.ts#getStats) → Aggregate usage metrics
  - [getRecentActivity](src/db/activity.ts#getRecent) → Last 10 actions

### Settings

- [Settings page](src/app/dashboard/settings/page.tsx) → User profile and preferences
  - [updateProfile](src/db/profiles.ts#update) → Save name, avatar changes
  - [ManageBilling](src/components/ManageBilling.tsx) → Link to Stripe Customer Portal

## Email Service

Transactional emails via Resend. Templates in React Email.

### Connections

- [Email Service] ← [Authentication] : welcome + password reset emails
- [Email Service] ← [Billing] : receipt + plan change notifications
