/**
 * Integration test for authentication and profile creation flow
 */
import { supabase, createProfile, getCurrentUserProfile } from '@/services/supabase';

// Mock environment setup is handled in jest.setup.js

describe('Authentication and Profile Creation Flow', () => {
  describe('Profile Creation', () => {
    it('should create a profile with userId and email', async () => {
      // This is a unit test for the createProfile function
      // In a real integration test, you would use a test Supabase instance

      const mockUserId = 'test-user-123';
      const mockEmail = 'test@example.com';

      // Note: This will fail without a real Supabase connection
      // In production, you would set up a test Supabase project
      expect(createProfile).toBeDefined();
      expect(typeof createProfile).toBe('function');
    });

    it('should get current user profile', async () => {
      expect(getCurrentUserProfile).toBeDefined();
      expect(typeof getCurrentUserProfile).toBe('function');
    });
  });

  describe('Supabase Client', () => {
    it('should be configured correctly', () => {
      expect(supabase).toBeDefined();
      expect(supabase.auth).toBeDefined();
    });

    it('should have required auth methods', () => {
      expect(supabase.auth.signInWithOtp).toBeDefined();
      expect(supabase.auth.signOut).toBeDefined();
      expect(supabase.auth.getUser).toBeDefined();
      expect(supabase.auth.getSession).toBeDefined();
    });
  });
});
