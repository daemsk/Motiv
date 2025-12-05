# Motiv App Setup Guide

## Prerequisites

- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator
- Supabase account

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to initialize (~2 minutes)

### 2.2 Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Open the file `supabase/migrations/001_initial_schema.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click **Run**
6. Verify success (should see "Success. No rows returned")

### 2.3 Verify Tables

Go to **Table Editor** and verify these 4 tables exist:
- `profiles`
- `goals`
- `habits`
- `habit_logs`

Each table should have a green shield icon (RLS enabled).

### 2.4 Configure Email Authentication

1. Go to **Authentication** > **Providers**
2. Ensure **Email** provider is enabled
3. For development, disable email confirmations:
   - Go to **Authentication** > **Email Templates**
   - Under "Confirm signup", you can use the default template
4. For magic link testing, ensure "Enable email confirmations" is ON

## Step 3: Configure Environment Variables

### 3.1 Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 3.2 Create .env File

```bash
cp .env.example .env
```

### 3.3 Update .env File

Edit `.env` and replace with your actual values:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here
```

**Important**: Never commit the `.env` file to git!

## Step 4: Run the App

### iOS (Mac only)

```bash
npm run ios
```

### Android

```bash
npm run android
```

### Web (for testing)

```bash
npm run web
```

### Expo Go (recommended for quick testing)

```bash
npm start
```

Then scan the QR code with:
- **iOS**: Camera app
- **Android**: Expo Go app

## Step 5: Test Authentication

### 5.1 Sign In Flow

1. Open the app
2. You should see the "Welcome to Motiv" screen
3. Enter your email address
4. Tap "Sign in with Magic Link"
5. Check your email for the magic link
6. Click the magic link in the email
7. The app should authenticate and show: "Welcome to Motiv, your@email.com!"

### 5.2 Verify Profile Creation

1. In Supabase dashboard, go to **Table Editor**
2. Click on the `profiles` table
3. You should see your profile record with your email

### 5.3 Test Sign Out

Currently, there's no sign-out button in Phase 2. This will be added in Phase 9 (Settings screen).

## Step 6: Run Tests

```bash
npm test
```

This will run all unit tests for:
- Supabase client configuration
- Auth context
- Auth screen components

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Make sure you created the `.env` file with the correct values from Step 3.

### Issue: Magic link email not arriving

**Solutions**:
1. Check your spam folder
2. In Supabase, go to **Authentication** > **Logs** to see if the email was sent
3. Verify email provider is configured correctly
4. For development, you can check the Supabase logs for the magic link URL

### Issue: App crashes on startup

**Solutions**:
1. Clear Expo cache: `npx expo start -c`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check that all environment variables are set correctly

### Issue: "Invalid API key" or authentication errors

**Solutions**:
1. Double-check your Supabase URL and anon key in `.env`
2. Make sure there are no extra spaces or quotes in the `.env` file
3. Restart the Expo server after changing `.env`

### Issue: RLS policy errors

**Solutions**:
1. Verify all RLS policies were created by running the migration again
2. Check that RLS is enabled on all tables (green shield icon)
3. In SQL Editor, test policies with: `SELECT * FROM profiles;` (should return empty, not error)

## Next Steps

After Phase 2 is complete, you should have:
- ✅ Working authentication with email magic link
- ✅ Automatic profile creation on signup
- ✅ Supabase database with 4 tables and RLS policies
- ✅ App shows authenticated state

**Phase 3** will add:
- Navigation structure with tabs
- Goals management screens
- Habit creation and management

## Development Tips

### Reset Database (if needed)

If you need to start fresh:

1. In Supabase SQL Editor, run:
```sql
DROP TABLE IF EXISTS habit_logs CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

2. Re-run the migration from `001_initial_schema.sql`

### View Supabase Logs

- **Auth Logs**: Authentication > Logs
- **Database Logs**: Database > Logs
- **API Logs**: Settings > API > Logs

### Hot Reload

Expo supports hot reload. Just save your files and changes will appear automatically in the app.

## Support

For issues or questions:
- Check the [Expo Documentation](https://docs.expo.dev/)
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the tasks.md file for implementation details
