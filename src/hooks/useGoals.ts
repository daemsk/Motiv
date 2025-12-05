import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Goal } from '../types';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all goals for the current user
  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setGoals(data || []);
    } catch (err: any) {
      console.error('Error fetching goals:', err);
      setError(err.message || 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new goal
  const createGoal = useCallback(async (title: string, description?: string): Promise<Goal | null> => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: createError } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          title,
          description: description || null,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Add to local state
      setGoals((prev) => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating goal:', err);
      setError(err.message || 'Failed to create goal');
      return null;
    }
  }, []);

  // Update a goal
  const updateGoal = useCallback(async (id: string, title: string, description?: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('goals')
        .update({
          title,
          description: description || null,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Update local state
      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === id
            ? { ...goal, title, description: description || null }
            : goal
        )
      );

      return true;
    } catch (err: any) {
      console.error('Error updating goal:', err);
      setError(err.message || 'Failed to update goal');
      return false;
    }
  }, []);

  // Delete a goal
  const deleteGoal = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Remove from local state
      setGoals((prev) => prev.filter((goal) => goal.id !== id));

      return true;
    } catch (err: any) {
      console.error('Error deleting goal:', err);
      setError(err.message || 'Failed to delete goal');
      return false;
    }
  }, []);

  // Fetch goals on mount
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    error,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  };
}
