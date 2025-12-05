-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT,
  email TEXT
);

-- Create goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create habits table
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create habit_logs table
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

-- Create indexes for better query performance
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_habits_goal_id ON habits(goal_id);
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX idx_habit_logs_date ON habit_logs(date);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS Policies for profiles table
-- ==========================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- RLS Policies for goals table
-- ==========================================

-- Users can view their own goals
CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create goals
CREATE POLICY "Users can create goals" ON goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own goals
CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own goals
CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- RLS Policies for habits table
-- ==========================================

-- Users can view their own habits
CREATE POLICY "Users can view own habits" ON habits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create habits
CREATE POLICY "Users can create habits" ON habits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own habits
CREATE POLICY "Users can update own habits" ON habits
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own habits
CREATE POLICY "Users can delete own habits" ON habits
  FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- RLS Policies for habit_logs table
-- ==========================================

-- Users can view their own habit logs
CREATE POLICY "Users can view own habit logs" ON habit_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create habit logs
CREATE POLICY "Users can create habit logs" ON habit_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own habit logs (for unchecking)
CREATE POLICY "Users can delete own habit logs" ON habit_logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- Function to automatically create profile on user signup
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
