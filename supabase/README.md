# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the details:
   - **Name**: Motiv MVP
   - **Database Password**: Create a strong password (save it securely)
   - **Region**: Choose closest to your users
5. Click "Create new project" and wait for it to initialize

## 2. Run the Database Migration

1. In your Supabase dashboard, navigate to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `migrations/001_initial_schema.sql`
4. Click "Run" to execute the migration
5. Verify success - you should see "Success. No rows returned"

## 3. Verify Tables and RLS

1. Navigate to **Table Editor** in the Supabase dashboard
2. You should see 4 tables:
   - `profiles`
   - `goals`
   - `habits`
   - `habit_logs`
3. Click on each table and verify the RLS is enabled (green shield icon)

## 4. Get Your API Credentials

1. Navigate to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## 5. Configure Your App

1. In the root of the `motiv-app` directory, create a `.env` file
2. Copy the contents of `.env.example`
3. Replace the placeholder values:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here
```

## 6. Test the Database

You can test the setup by running a simple query in the SQL Editor:

```sql
SELECT * FROM profiles;
```

It should return an empty result set (no rows) but no errors.

## Database Schema Overview

### Tables

- **profiles**: User profile information (linked to auth.users)
- **goals**: User-created goals
- **habits**: Daily habits linked to goals
- **habit_logs**: Daily check-in records for habits

### Security

All tables have Row Level Security (RLS) enabled, ensuring users can only access their own data. The policies enforce:

- Users can only view/edit their own data
- All operations are filtered by `auth.uid() = user_id`
- Profile creation is automatic via trigger on user signup

### Indexes

Indexes are created on foreign keys and frequently queried columns for optimal performance.
