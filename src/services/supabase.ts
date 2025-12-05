import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Profile, Goal, Habit, HabitLog } from '../types';

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ==========================================
// Database Types (for Supabase client)
// ==========================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      goals: {
        Row: Goal;
        Insert: Omit<Goal, 'id' | 'created_at'>;
        Update: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at'>>;
      };
      habits: {
        Row: Habit;
        Insert: Omit<Habit, 'id' | 'created_at'>;
        Update: Partial<Omit<Habit, 'id' | 'goal_id' | 'user_id' | 'created_at'>>;
      };
      habit_logs: {
        Row: HabitLog;
        Insert: Omit<HabitLog, 'id' | 'created_at'>;
        Update: never; // Logs are never updated, only created or deleted
      };
    };
  };
}

// ==========================================
// Helper Functions for Type-Safe Queries
// ==========================================

/**
 * Get the current authenticated user's profile
 * @param userId - Optional user ID. If not provided, will fetch from auth session
 */
export async function getCurrentUserProfile(userId?: string): Promise<Profile | null> {
  try {
    console.log('[getCurrentUserProfile] Starting...', userId ? `with userId: ${userId}` : 'fetching userId');

    // Wait for auth session to be fully available in Supabase client
    // This is necessary because RLS policies check auth.uid() which needs the session to be set
    console.log('[getCurrentUserProfile] Waiting for auth session to be available...');
    const { data: { session } } = await supabase.auth.getSession();
    console.log('[getCurrentUserProfile] Session check:', session ? 'Has session' : 'No session');

    if (!session) {
      console.log('[getCurrentUserProfile] No session available, cannot query with RLS');
      return null;
    }

    let id = userId || session.user.id;
    console.log('[getCurrentUserProfile] Using user ID:', id);

    console.log('[getCurrentUserProfile] Querying profiles table for user:', id);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    console.log('[getCurrentUserProfile] Query completed');

    if (error) {
      console.error('[getCurrentUserProfile] Error fetching user profile:', error);
      console.error('[getCurrentUserProfile] Error details:', JSON.stringify(error));
      return null;
    }

    console.log('[getCurrentUserProfile] Profile query result:', data ? 'Found profile' : 'No profile in DB');
    console.log('[getCurrentUserProfile] Data:', data);
    return data;
  } catch (error) {
    console.error('[getCurrentUserProfile] Exception:', error);
    return null;
  }
}

/**
 * Create a new user profile (called after signup)
 */
export async function createProfile(userId: string, email?: string): Promise<Profile | null> {
  try {
    console.log('Creating profile for:', userId, email);
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({ id: userId, email })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    console.log('Profile created successfully:', data);
    return data;
  } catch (error) {
    console.error('Exception in createProfile:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: { name?: string; email?: string }): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    return false;
  }

  return true;
}

/**
 * Get all goals for the current user
 */
export async function getGoals(): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching goals:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all habits for a specific goal
 */
export async function getHabitsByGoal(goalId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('goal_id', goalId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching habits:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all habits for the current user
 */
export async function getAllHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching all habits:', error);
    return [];
  }

  return data || [];
}

/**
 * Get habit logs for a specific habit
 */
export async function getHabitLogs(habitId: string, limit?: number): Promise<HabitLog[]> {
  let query = supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId)
    .order('date', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching habit logs:', error);
    return [];
  }

  return data || [];
}

/**
 * Check if a habit is completed on a specific date
 */
export async function isHabitCompletedOnDate(habitId: string, date: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('id')
    .eq('habit_id', habitId)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking habit completion:', error);
    return false;
  }

  return !!data;
}

/**
 * Get all habit logs for today for the current user
 */
export async function getTodayHabitLogs(): Promise<HabitLog[]> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('date', today);

  if (error) {
    console.error('Error fetching today\'s habit logs:', error);
    return [];
  }

  return data || [];
}

// Export the client as default
export default supabase;
