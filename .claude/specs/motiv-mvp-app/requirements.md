# Requirements Document

## Introduction

Motiv MVP v0.1 is an ultra-minimum viable product for a goal and habit tracking mobile application. The primary objective is to deliver the simplest possible system that allows users to create goals, attach daily habits to those goals, check in on habits daily, view streak progress, and explore premium upgrade options via Stripe Checkout. This MVP explicitly excludes advanced features such as inspiration packs, templates, analytics, notifications, and functional premium tier enforcement to focus on validating core user behavior and monetization interest.

## Requirements

### 1. User Authentication and Profile Management

**User Story:** As a new user, I want to sign up and authenticate securely, so that I can access my personal goals and habits across sessions.

#### Acceptance Criteria
1. WHEN a user visits the app for the first time THEN the system SHALL display a sign-in/sign-up screen
2. WHEN a user enters their email THEN the system SHALL authenticate via Supabase Auth using email magic link
3. IF authentication succeeds THEN the system SHALL create a profile record with id, created_at, name (optional), and email (optional)
4. WHEN a user is authenticated THEN the system SHALL grant access to the main application screens
5. WHEN a user selects "Sign Out" from settings THEN the system SHALL terminate the session and return to sign-in screen

### 2. Goal Management

**User Story:** As a user, I want to create and view goals, so that I can organize my habits around specific objectives.

#### Acceptance Criteria
1. WHEN a user navigates to the Goals List screen THEN the system SHALL display all goals created by that user
2. WHEN a user taps "Add Goal" THEN the system SHALL present a form with fields for title (required) and description (optional)
3. IF a user submits a goal without a title THEN the system SHALL display a validation error
4. WHEN a user submits a valid goal THEN the system SHALL create a goals record with id, user_id, title, description, and created_at
5. WHEN a goal is created THEN the system SHALL display it in the Goals List screen
6. WHEN a user taps on a goal THEN the system SHALL navigate to the Goal Detail screen showing the goal title and associated habits

### 3. Habit Management

**User Story:** As a user, I want to create daily habits linked to my goals, so that I can track specific actions that support my objectives.

#### Acceptance Criteria
1. WHEN a user is viewing a Goal Detail screen THEN the system SHALL display all habits associated with that goal
2. WHEN a user taps "Add Habit" on a Goal Detail screen THEN the system SHALL present a form with a field for habit name (required)
3. IF a user submits a habit without a name THEN the system SHALL display a validation error
4. WHEN a user submits a valid habit THEN the system SHALL create a habits record with id, goal_id, user_id, name, and created_at
5. WHEN a habit is created THEN the system SHALL display it under the associated goal in Goal Detail screen
6. WHEN a habit is created THEN the system SHALL automatically set its frequency to Daily (no other frequency options in MVP)

### 4. Daily Habit Check-In and Logging

**User Story:** As a user, I want to check in on my habits each day, so that I can track my consistency and build streaks.

#### Acceptance Criteria
1. WHEN a user navigates to the Daily Dashboard THEN the system SHALL display all habits scheduled for today
2. WHEN a user taps on an unchecked habit THEN the system SHALL create a habit_logs record with id, habit_id, user_id, date (today), and created_at
3. WHEN a habit log is created THEN the system SHALL mark the habit as completed for today on the Daily Dashboard
4. WHEN a user taps on a checked habit THEN the system SHALL remove the habit_logs record for that habit and today's date
5. IF a user has already checked in a habit for today THEN the system SHALL display a checked/completed status indicator
6. WHEN a user views a habit on any screen THEN the system SHALL calculate and display the current streak count based on consecutive days in habit_logs

### 5. Progress and Streak Display

**User Story:** As a user, I want to see my habit completion status and streaks, so that I stay motivated to maintain consistency.

#### Acceptance Criteria
1. WHEN the Daily Dashboard loads THEN the system SHALL display each habit with its completion status (checked/unchecked)
2. WHEN the Daily Dashboard loads THEN the system SHALL display the current streak number for each habit
3. WHEN calculating a streak THEN the system SHALL count consecutive days from today backwards where habit_logs exist for that habit
4. IF there is a gap in consecutive days THEN the system SHALL reset the streak count to start from the most recent consecutive sequence
5. WHEN a habit is displayed THEN the system SHALL show streak count alongside the habit name

### 6. Premium Upgrade Flow (Stripe Checkout)

**User Story:** As a user, I want to explore premium features and initiate an upgrade, so that I can signal my interest in paying for enhanced functionality.

#### Acceptance Criteria
1. WHEN a user navigates to the Premium Screen THEN the system SHALL display text describing planned premium features
2. WHEN a user taps "Upgrade" on the Premium Screen THEN the system SHALL call a Supabase Edge Function or backend endpoint to create a Stripe Checkout Session
3. WHEN the Stripe Checkout Session is created THEN the endpoint SHALL return a session URL
4. WHEN the session URL is received THEN the system SHALL open it in a webview or external browser
5. IF the Stripe Checkout Session creation fails THEN the system SHALL display an error message to the user
6. WHEN a user completes or cancels the Stripe Checkout THEN the system SHALL NOT verify subscription status or unlock premium features (monetization test only)

### 7. Settings and Application Information

**User Story:** As a user, I want to access basic settings and app information, so that I can manage my session and understand the app version.

#### Acceptance Criteria
1. WHEN a user navigates to Settings THEN the system SHALL display a "Sign Out" option and app version number
2. WHEN a user taps "Sign Out" THEN the system SHALL log the user out and return to the sign-in screen
3. WHEN the Settings screen loads THEN the system SHALL display the current app version number

### 8. Data Security and Multi-Tenancy

**User Story:** As a user, I want my data to be secure and private, so that other users cannot access or modify my goals and habits.

#### Acceptance Criteria
1. WHEN any database operation is performed THEN the system SHALL enforce Row Level Security (RLS) policies in Supabase
2. WHEN a user queries goals THEN the system SHALL only return goals where user_id matches the authenticated user's id
3. WHEN a user queries habits THEN the system SHALL only return habits where user_id matches the authenticated user's id
4. WHEN a user queries habit_logs THEN the system SHALL only return logs where user_id matches the authenticated user's id
5. WHEN a user attempts to create or modify records THEN the system SHALL only allow operations on records owned by that user

## Edge Cases and Constraints

### Edge Cases
- **No habits for a day**: IF a user has no habits THEN the Daily Dashboard SHALL display a message prompting them to create goals and habits
- **Streak calculation on first check-in**: WHEN a user checks in a habit for the first time THEN the system SHALL display a streak count of 1
- **Multiple check-ins same day**: IF a user attempts to check in the same habit multiple times on the same day THEN the system SHALL toggle between checked and unchecked states
- **Deleted goals**: IF a goal is deleted THEN the system SHALL handle cascading deletes for associated habits and habit_logs (or prevent deletion if habits exist)
- **Network failures**: IF network connectivity is lost during operations THEN the system SHALL display appropriate error messages and allow retry

### Constraints
- **Frequency limitation**: All habits MUST be daily frequency only in this MVP
- **No premium enforcement**: The app SHALL NOT verify subscription status or gate any features behind premium
- **No backend webhook integration**: Stripe webhook events SHALL NOT be processed in this MVP
- **No notifications**: The app SHALL NOT send push notifications or reminders
- **No analytics**: The app SHALL NOT include analytics dashboards or summary views
- **Single device focus**: While Supabase provides basic syncing, multi-device experience is not a primary focus or requirement
- **Mobile-first**: The application is designed primarily for mobile platforms (iOS/Android)

## Success Criteria
1. A user can successfully create at least 1 goal
2. A user can successfully create 1-5 habits linked to a goal
3. A user can check in at least 1 habit per day
4. A user returns and checks in habits for at least 3 days within the first week
5. At least some users click the "Upgrade" button, providing a signal of monetization interest
