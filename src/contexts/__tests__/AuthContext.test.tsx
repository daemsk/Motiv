import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '@/services/supabase';

// Mock the supabase service
jest.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signInWithOtp: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
  },
  getCurrentUserProfile: jest.fn(),
  createProfile: jest.fn(),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    });

    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });
  });

  it('should provide auth context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.signIn).toBeDefined();
    expect(result.current.signOut).toBeDefined();
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleError.mockRestore();
  });

  it('should initialize with loading state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);
  });

  it('should call signInWithOtp when signing in', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ error: null });
    (supabase.auth.signInWithOtp as jest.Mock).mockImplementation(mockSignIn);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn('test@example.com');
    });

    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      options: {
        emailRedirectTo: undefined,
      },
    });
  });

  it('should call signOut when signing out', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: null });
    (supabase.auth.signOut as jest.Mock).mockImplementation(mockSignOut);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });
});
