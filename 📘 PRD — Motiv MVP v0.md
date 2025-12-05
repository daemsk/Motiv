📘 PRD — Motiv MVP v0.1 (Ultra-Minimum Version)
🎯 Goal of MVP
Deliver the simplest goal + habit tracker that lets users:
Create goals
Attach habits
Check habits off daily
See a simple streak/progress indicator
Access a premium upgrade via Stripe Checkout (no backend syncing)
This version has no inspiration packs, no templates, no analytics, no subscription state checks, and only core CRUD flows.
🧩 1. Core Features (Only the Essentials)
⭐ A. Goal Creation
User can create a goal with:
Title (required)
Description (optional)
That's it.
⭐ B. Habit Creation (Linked to a Goal)
Each habit consists of:
Habit name (required)
Frequency = Daily
(no weekly options, no schedules yet)
⭐ C. Daily Habit Check-In
User can:
View today’s habits
Tap to mark habit as completed today
That creates a log entry
Display streak count (read from logs)
⭐ D. Progress View
A simple daily dashboard showing:
List of today’s habits
Completion status (checked/unchecked)
Streak number per habit
No rings, no complex visuals.
⭐ E. Stripe Upgrade Screen (Checkout Only)
Shows benefits of future premium
When user taps “Upgrade” → opens a Stripe Checkout Session URL in webview/browser
No backend syncing
No subscription verification in app
Non-premium status is ALWAYS assumed since we’re not storing subscription state.
This is a soft launch monetization test, not a functional premium tier yet.
🗄️ 2. Minimum Database Tables (Only 4)
This is the absolute smallest schema possible.
1. profiles
Stores authenticated user basics.
column	type	notes
id	uuid (pk)	FK to auth.users
created_at	timestamp	
name	text	optional
email	text	optional
is_premium	boolean	remove for now — not needed
For this MVP, we can omit is_premium entirely since the app doesn't unlock premium functionality yet.
2. goals
column	type	notes
id	uuid pk	
user_id	uuid	owner
title	text	required
description	text	optional
created_at	timestamp	
3. habits
column	type	notes
id	uuid pk	
goal_id	uuid	FK → goals
user_id	uuid	Redundant, but useful
name	text	required
created_at	timestamp	
4. habit_logs
Stores each day the user completes a habit.
column	type	notes
id	uuid pk	
habit_id	uuid	FK → habits
user_id	uuid	
date	date	the day user completed the habit
created_at	timestamp	
Primary logic:
A streak = count of consecutive days in habit_logs for that habit.
🔌 3. Integrations
⭐ Supabase
Auth (email + OAuth optional)
CRUD for goals
CRUD for habits
CRUD for habit logs
RLS policies required for multi-tenant safety
No functions, no webhooks.
⭐ Stripe
User clicks “Upgrade to Premium”
App calls Supabase Edge Function or simple backend endpoint that creates a Stripe Checkout Session
Endpoint returns session URL
App opens it in browser/webview
No webhook.
No subscription syncing.
No premium gating.
Just generating revenue data for later.
🎨 4. Minimum UI Screens
1. Sign In / Sign Up
Supabase auth (email magic link is simplest)
2. Goals List
List of goals
Button: “Add Goal”
3. Goal Detail
Goal title
Habits under the goal
Button: “Add Habit”
4. Daily Dashboard
Shows all habits scheduled today
Tap → check in
Show streak number
Very simple UI
5. Premium Screen
Short text on planned premium features
“Upgrade” button → launches Stripe Checkout Session
6. Settings
Sign out
App version
Nothing else.
⏱️ 5. Build Time Estimate
This is super lean.
Database + Supabase config: 0.5–1 day
CRUD flows: 2–3 days
Habit logging: 1–2 days
UI screens: 4–7 days
Stripe checkout session: 1–2 days
QA + TestFlight: 2–3 days
Total realistic time: ~10–14 days.
🧪 6. Non-Goals for MVP 0.1
These explicitly ARE NOT included yet:
Inspiration Packs
Templates
Analytics
Weekly summaries
Motiv Score
Notifications
Themes
Premium paywall enforcement
Social features
Creator monetization
Webhooks
Subscription validation
AI assistant
Multi-device syncing (Supabase handles basic syncing automatically)
🚀 7. Success Criteria
A user can create 1 goal
A user can create 1–5 habits
A user can check in at least 1 habit per day
A user returns for 3 days in the first week
At least some users click the “upgrade” button (monetization interest signal)