// ==========================================
// Database Model Types
// ==========================================

export interface Profile {
  id: string;
  created_at: string;
  name?: string | null;
  email?: string | null;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  created_at: string;
}

export interface Habit {
  id: string;
  goal_id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  created_at: string;
}

// ==========================================
// Extended Types with Computed Fields
// ==========================================

export interface HabitWithStreak extends Habit {
  streak: number;
  isCompletedToday: boolean;
}

export interface GoalWithHabits extends Goal {
  habits: HabitWithStreak[];
}

// ==========================================
// Context Types
// ==========================================

export interface AuthContextType {
  user: Profile | null;
  session: any | null; // Supabase session type
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface GoalsContextType {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  createGoal: (title: string, description?: string) => Promise<Goal | null>;
  updateGoal: (id: string, title: string, description?: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export interface HabitsContextType {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  fetchHabits: (goalId?: string) => Promise<void>;
  createHabit: (goalId: string, name: string) => Promise<Habit | null>;
  updateHabit: (id: string, name: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  checkInHabit: (habitId: string, date: string) => Promise<void>;
  uncheckHabit: (habitId: string, date: string) => Promise<void>;
  getHabitLogs: (habitId: string) => Promise<HabitLog[]>;
}

// ==========================================
// Form Types
// ==========================================

export interface GoalFormData {
  title: string;
  description?: string;
}

export interface HabitFormData {
  name: string;
  goalId: string;
}

// ==========================================
// Error Types
// ==========================================

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  retry?: () => void;
}

export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// ==========================================
// Navigation Types
// ==========================================

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Goals: undefined;
  Dashboard: undefined;
  Premium: undefined;
  Settings: undefined;
};

export type GoalsStackParamList = {
  GoalsList: undefined;
  GoalDetail: { goalId: string };
  AddGoal: undefined;
  AddHabit: { goalId: string };
};

// ==========================================
// Utility Types
// ==========================================

export interface StreakData {
  habitId: string;
  streak: number;
  lastCheckIn: string | null;
  isCompletedToday: boolean;
}

export interface DashboardHabit extends HabitWithStreak {
  goalTitle: string;
}
