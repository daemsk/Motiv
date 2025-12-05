import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { supabase, getCurrentUserProfile, createProfile } from '../services/supabase';
import { AuthContextType, Profile } from '../types';

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      // Check for auth tokens in URL (for web/Expo Go magic link callback)
      if (Platform.OS === 'web') {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const access_token = hashParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token');

        if (access_token && refresh_token) {
          console.log('Found tokens in URL, setting session...');
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error('Error setting session:', error);
          } else {
            console.log('Session set from URL tokens');
            // Clear hash from URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Don't proceed - let onAuthStateChange handle it
            return;
          }
        }
      }

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session:', session?.user?.email || 'No session');

      if (session?.user) {
        // Create a minimal profile from session data
        const profileFromSession: Profile = {
          id: session.user.id,
          email: session.user.email || null,
          name: session.user.user_metadata?.name || null,
          created_at: session.user.created_at || new Date().toISOString(),
        };
        setUser(profileFromSession);
        setSession(session);
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email || 'No user');
      setSession(session);

      if (session?.user) {
        // Create profile from session immediately - no async delays
        const profileFromSession: Profile = {
          id: session.user.id,
          email: session.user.email || null,
          name: session.user.user_metadata?.name || null,
          created_at: session.user.created_at || new Date().toISOString(),
        };
        setUser(profileFromSession);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle deep links for magic link authentication (mobile)
  useEffect(() => {
    if (Platform.OS === 'web') return; // Skip deep linking on web

    const handleDeepLink = async (event: { url: string }) => {
      console.log('Deep link received:', event.url);
      
      if (event.url.includes('access_token')) {
        try {
          const hashPart = event.url.split('#')[1] || '';
          const params = new URLSearchParams(hashPart);
          
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          console.log('Extracted tokens:', { 
            has_access: !!access_token, 
            has_refresh: !!refresh_token 
          });

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) {
              console.error('Error setting session:', error);
            } else {
              console.log('Session set successfully');
            }
          }
        } catch (error) {
          console.error('Error parsing deep link:', error);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial URL:', url);
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Sign in with magic link
  const signIn = async (email: string): Promise<void> => {
    setLoading(true);
    try {
      const redirectUrl = Platform.OS === 'web' 
        ? window.location.origin 
        : Linking.createURL('/');
      
      console.log('Sending magic link with redirect:', redirectUrl);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    console.log('[AuthContext] signOut() called');
    setLoading(true);
    try {
      console.log('[AuthContext] Calling supabase.auth.signOut()');
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('[AuthContext] Supabase signOut error:', error);
        throw error;
      }

      console.log('[AuthContext] Supabase signOut successful, clearing local state');
      setUser(null);
      setSession(null);
      console.log('[AuthContext] Local state cleared');
    } catch (error) {
      console.error('[AuthContext] Sign out error:', error);
      throw error;
    } finally {
      console.log('[AuthContext] signOut() complete, setting loading=false');
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signOut,
  };

  console.log('AuthContext state:', { user: user?.email || 'No user', loading });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
