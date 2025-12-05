import React, { createContext, useContext, ReactNode } from 'react';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types';

interface GoalsContextType {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  createGoal: (title: string, description?: string) => Promise<Goal | null>;
  updateGoal: (id: string, title: string, description?: string) => Promise<boolean>;
  deleteGoal: (id: string) => Promise<boolean>;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const goalsData = useGoals();

  return (
    <GoalsContext.Provider value={goalsData}>
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoalsContext(): GoalsContextType {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoalsContext must be used within a GoalsProvider');
  }
  return context;
}

export default GoalsContext;
