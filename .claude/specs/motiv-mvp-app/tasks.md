# Implementation Plan

## Phase 1: Project Setup and Foundation

- [x] 1. Initialize React Native project with Expo and TypeScript
  - Run `npx create-expo-app motiv-app --template expo-template-blank-typescript`
  - Configure TypeScript strict mode in tsconfig.json
  - Install core dependencies: @react-navigation/native, @react-navigation/bottom-tabs, @supabase/supabase-js
  - Create .env.example file with placeholder environment variables
  - _Requirements: Foundation for all development_

- [x] 2. Set up project directory structure
  - Create src/ directory with subdirectories: components/, screens/, navigation/, contexts/, hooks/, services/, types/, utils/, theme/
  - Create index.ts barrel exports for each directory
  - Set up absolute imports configuration in tsconfig.json
  - _Requirements: Clean code organization_

- [x] 3. Configure Supabase project and database schema
  - Create new Supabase project via dashboard
  - Execute SQL to create profiles table with RLS policies
  - Execute SQL to create goals table with RLS policies
  - Execute SQL to create habits table with RLS policies
  - Execute SQL to create habit_logs table with RLS policies and UNIQUE constraint
  - Enable Row Level Security on all tables
  - Test RLS policies with different user contexts
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 4. Create TypeScript type definitions
  - Define Profile, Goal, Habit, HabitLog interfaces in types/index.ts
  - Define HabitWithStreak and GoalWithHabits composite types
  - Define AuthContextType, GoalsContextType, HabitsContextType
  - Export all types from types/index.ts
  - _Requirements: Type safety for all development_

- [x] 5. Set up Supabase client service
  - Create services/supabase.ts with Supabase client initialization
  - Configure environment variables for SUPABASE_URL and SUPABASE_ANON_KEY
  - Create helper functions for type-safe queries
  - Write unit tests for Supabase client configuration
  - _Requirements: Foundation for all backend operations_

## Phase 2: Authentication Implementation

- [x] 6. Implement authentication context and hooks
  - Create contexts/AuthContext.tsx with session state management
  - Implement useAuth hook with signIn, signOut, and session methods
  - Handle Supabase auth state changes with onAuthStateChange listener
  - Write unit tests for auth context logic
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 7. Build authentication screen UI
  - Create screens/AuthScreen.tsx with email input form
  - Implement email validation logic
  - Add "Sign In with Magic Link" button with loading state
  - Display success message after magic link sent
  - Display error messages for failed authentication attempts
  - Write component tests for AuthScreen
  - _Requirements: 1.1, 1.2_

- [x] 8. Implement profile creation flow
  - Create profile record in database after successful authentication
  - Handle profile creation errors gracefully
  - Add optional name and email fields to profile
  - Write integration tests for profile creation
  - _Requirements: 1.3_

## Phase 3: Navigation and App Shell

- [ ] 9. Set up React Navigation structure
  - Create navigation/AppNavigator.tsx with stack and tab navigators
  - Implement conditional rendering: AuthScreen vs Main App (tabs)
  - Configure tab navigator with 4 tabs: Goals, Dashboard, Premium, Settings
  - Set up navigation types for type-safe navigation
  - _Requirements: Navigation foundation_

- [ ] 10. Create basic theme and styling system
  - Create theme/index.ts with colors, spacing, typography constants
  - Define reusable style utilities
  - Create basic Button component with theme integration
  - Create basic Input component with theme integration
  - _Requirements: Consistent UI styling_

## Phase 4: Goals Management

- [ ] 11. Implement goals data layer and context
  - Create hooks/useGoals.ts with fetchGoals, createGoal, updateGoal, deleteGoal functions
  - Create contexts/GoalsContext.tsx for global goals state
  - Implement Supabase queries with RLS filtering (user_id = auth.uid())
  - Write unit tests for goals CRUD operations
  - _Requirements: 2.1, 2.4, 8.2_

- [ ] 12. Build Goals List screen
  - Create screens/GoalsListScreen.tsx displaying all user goals
  - Implement FlatList with GoalCard components
  - Add "Add Goal" floating action button
  - Display empty state when no goals exist
  - Handle loading and error states
  - Write component tests for GoalsListScreen
  - _Requirements: 2.1_

- [ ] 13. Create Goal Card component
  - Create components/GoalCard.tsx with title and description display
  - Add tap handler to navigate to Goal Detail screen
  - Style card with theme colors and spacing
  - Write component tests for GoalCard
  - _Requirements: 2.5, 2.6_

- [ ] 14. Build Add/Edit Goal form
  - Create modal or separate screen for goal creation
  - Implement title input field (required) with validation
  - Implement description textarea field (optional)
  - Add form validation logic (title must not be empty)
  - Display validation errors inline
  - Add "Save" button with loading state
  - Call createGoal on form submission
  - Write integration tests for goal creation flow
  - _Requirements: 2.2, 2.3, 2.4_

- [ ] 15. Build Goal Detail screen
  - Create screens/GoalDetailScreen.tsx showing goal title and description
  - Display list of habits associated with the goal
  - Add "Add Habit" button
  - Implement navigation from Goals List to Goal Detail
  - Handle empty state when no habits exist for goal
  - _Requirements: 2.6_

## Phase 5: Habits Management

- [ ] 16. Implement habits data layer and context
  - Create hooks/useHabits.ts with fetchHabits, createHabit, updateHabit, deleteHabit functions
  - Create contexts/HabitsContext.tsx for global habits state
  - Implement Supabase queries with RLS filtering and goal_id filtering
  - Write unit tests for habits CRUD operations
  - _Requirements: 3.1, 3.4, 8.3_

- [ ] 17. Build Add Habit form
  - Create modal or separate screen for habit creation
  - Implement habit name input field (required) with validation
  - Display validation errors inline
  - Add "Save" button with loading state
  - Call createHabit with goal_id and user_id
  - Write integration tests for habit creation flow
  - _Requirements: 3.2, 3.3, 3.4_

- [ ] 18. Create Habit Card component
  - Create components/HabitCard.tsx displaying habit name and streak
  - Add checkbox/toggle for completion status
  - Display streak badge with number
  - Style card with theme colors
  - Write component tests for HabitCard
  - _Requirements: 3.5_

## Phase 6: Habit Logging and Streaks

- [ ] 19. Implement habit logs data layer
  - Create functions in hooks/useHabits.ts: createHabitLog, deleteHabitLog, fetchHabitLogs
  - Implement Supabase queries with RLS filtering
  - Handle UNIQUE constraint on (habit_id, date) for duplicate prevention
  - Write unit tests for habit log operations
  - _Requirements: 4.2, 4.4, 8.4_

- [ ] 20. Build streak calculation utility
  - Create utils/streakCalculator.ts with calculateStreak function
  - Implement algorithm: count consecutive days from today backwards
  - Handle edge cases: empty logs, gaps in dates, first check-in
  - Write comprehensive unit tests for all streak scenarios
  - _Requirements: 4.6, 5.3, 5.4_

- [ ] 21. Create useStreak custom hook
  - Create hooks/useStreak.ts that fetches habit_logs for a habit
  - Call calculateStreak function with fetched logs
  - Return streak count and isCompletedToday flag
  - Implement caching/memoization for performance
  - Write unit tests for useStreak hook
  - _Requirements: 5.2, 5.5_

- [ ] 22. Implement habit check-in toggle functionality
  - Add onPress handler to HabitCard checkbox
  - If unchecked: call createHabitLog with today's date
  - If checked: call deleteHabitLog for today's date
  - Update UI optimistically, then sync with database
  - Handle errors and rollback on failure
  - Write integration tests for toggle functionality
  - _Requirements: 4.2, 4.3, 4.4_

## Phase 7: Daily Dashboard

- [ ] 23. Build Daily Dashboard screen
  - Create screens/DailyDashboardScreen.tsx displaying all habits for today
  - Fetch all user habits with their check-in status for today
  - Display HabitCard components with streak and completion status
  - Handle empty state when no habits exist
  - Add pull-to-refresh functionality
  - Write component tests for DailyDashboardScreen
  - _Requirements: 4.1, 5.1_

- [ ] 24. Implement dashboard data fetching logic
  - Create custom hook to fetch all habits with today's completion status
  - Join habits with habit_logs WHERE date = today
  - Calculate streak for each habit using useStreak
  - Sort habits by goal or creation date
  - Handle loading and error states
  - Write integration tests for dashboard data fetching
  - _Requirements: 5.1, 5.2_

- [ ] 25. Add streak display to dashboard
  - Display streak number for each habit using StreakBadge component
  - Create components/StreakBadge.tsx with visual streak indicator
  - Style badge with theme colors (e.g., fire icon + number)
  - Write component tests for StreakBadge
  - _Requirements: 4.6, 5.2, 5.5_

## Phase 8: Stripe Integration

- [ ] 26. Create Stripe Checkout Session Edge Function
  - In Supabase dashboard, create new Edge Function: create-checkout-session
  - Implement Deno function that creates Stripe Checkout Session
  - Configure success_url and cancel_url with deep links (motivapp://)
  - Add error handling for Stripe API failures
  - Store STRIPE_SECRET_KEY in Supabase environment variables
  - Test Edge Function with curl or Postman
  - _Requirements: 6.2, 6.3_

- [ ] 27. Build Premium screen UI
  - Create screens/PremiumScreen.tsx with premium features description
  - Add compelling copy explaining future premium benefits
  - Create "Upgrade to Premium" button
  - Style screen with attractive visual design
  - Write component tests for PremiumScreen
  - _Requirements: 6.1_

- [ ] 28. Implement Stripe Checkout flow in app
  - Create services/stripe.ts with function to call create-checkout-session Edge Function
  - Add onPress handler to "Upgrade" button
  - Call Edge Function and receive session URL
  - Open session URL in WebView or external browser using Linking API
  - Display loading state during session creation
  - Handle errors and display user-friendly error messages
  - Write integration tests for Stripe Checkout flow
  - _Requirements: 6.2, 6.3, 6.4, 6.5_

- [ ] 29. Handle Stripe Checkout deep link returns
  - Configure deep linking in app.json for motivapp:// scheme
  - Listen for deep link events (success/cancel)
  - Display appropriate message on return from Stripe
  - No subscription verification (per MVP requirements)
  - Write integration tests for deep link handling
  - _Requirements: 6.6_

## Phase 9: Settings and Polish

- [ ] 30. Build Settings screen
  - Create screens/SettingsScreen.tsx with "Sign Out" button and app version
  - Display app version from app.json or expo-constants
  - Implement sign out button that calls useAuth.signOut()
  - Navigate to AuthScreen after sign out
  - Write component tests for SettingsScreen
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 31. Implement error handling and user feedback
  - Create global error handler utility (utils/errorHandler.ts)
  - Display toast notifications or alerts for errors
  - Add retry buttons for failed operations
  - Implement network error detection and messaging
  - Write tests for error handling scenarios
  - _Requirements: Error handling for all operations_

- [ ] 32. Add loading states and indicators
  - Implement loading spinners for all async operations
  - Add skeleton screens for data loading
  - Implement pull-to-refresh on list screens
  - Ensure smooth transitions between loading and loaded states
  - _Requirements: User experience polish_

- [ ] 33. Implement empty states for all screens
  - Create empty state components with helpful messages and CTAs
  - Add "Create your first goal" message to empty Goals List
  - Add "Add habits to get started" message to empty Goal Detail
  - Add "No habits for today" message to empty Dashboard
  - Write component tests for empty states
  - _Requirements: User experience guidance_

## Phase 10: Testing and Quality Assurance

- [ ] 34. Write integration tests for critical user flows
  - Test: Create goal → Create habit → Check in habit → Verify streak
  - Test: Check in habit for 3 consecutive days → Verify streak = 3
  - Test: Check in, skip day, check in → Verify streak resets
  - Test: Create multiple goals and habits → Verify data isolation
  - Test: Sign out and sign in → Verify data persists
  - _Requirements: All core requirements validation_

- [ ] 35. Write RLS policy tests
  - Test: User A cannot access User B's goals
  - Test: User A cannot access User B's habits
  - Test: User A cannot access User B's habit logs
  - Test: Unauthenticated user cannot access any data
  - Test: User can only create records with their own user_id
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 36. Perform manual QA on iOS simulator
  - Execute complete user journey: sign up → create goals → create habits → check in for 3 days
  - Test all navigation paths
  - Test error scenarios (network off, invalid input)
  - Test Stripe Checkout flow with test mode
  - Verify UI on different iPhone screen sizes
  - _Requirements: All requirements_

- [ ] 37. Perform manual QA on Android emulator
  - Execute complete user journey on Android
  - Test all navigation paths
  - Test error scenarios (network off, invalid input)
  - Test Stripe Checkout flow with test mode
  - Verify UI on different Android screen sizes
  - _Requirements: All requirements_

## Phase 11: Build and Deployment Preparation

- [ ] 38. Configure app icons and splash screens
  - Create app icon in required sizes for iOS and Android
  - Create splash screen assets
  - Update app.json with icon and splash configuration
  - Test app icon and splash on both platforms
  - _Requirements: Production readiness_

- [ ] 39. Set up environment variables for production
  - Create .env.production with production Supabase credentials
  - Create .env.staging with staging Supabase credentials
  - Configure Stripe production publishable key
  - Document environment setup in README
  - _Requirements: Production deployment_

- [ ] 40. Build production iOS binary with EAS
  - Install and configure EAS CLI
  - Configure eas.json for iOS production build
  - Run `eas build --platform ios --profile production`
  - Test built .ipa file on physical iOS device
  - _Requirements: iOS deployment_

- [ ] 41. Build production Android binary with EAS
  - Configure eas.json for Android production build
  - Run `eas build --platform android --profile production`
  - Test built .apk or .aab file on physical Android device
  - _Requirements: Android deployment_

- [ ] 42. Create TestFlight build for iOS beta testing
  - Configure App Store Connect account
  - Upload build to TestFlight
  - Add internal testers
  - Distribute build and gather feedback
  - _Requirements: Beta testing_

- [ ] 43. Perform final QA and bug fixes
  - Test all features on production builds
  - Fix any critical bugs discovered during testing
  - Verify Stripe integration works with live mode (test small transaction)
  - Verify all success criteria are met
  - _Requirements: Production quality assurance_

## Success Criteria Validation

After completing all tasks, validate:
- [ ] A user can successfully create at least 1 goal ✓
- [ ] A user can successfully create 1-5 habits linked to a goal ✓
- [ ] A user can check in at least 1 habit per day ✓
- [ ] A user returns and checks in habits for at least 3 days within the first week (behavioral test)
- [ ] At least some users click the "Upgrade" button (analytics/monitoring)
