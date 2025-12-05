import { supabase } from '../supabase';

describe('Supabase Client', () => {
  it('should be initialized', () => {
    expect(supabase).toBeDefined();
  });

  it('should have auth methods', () => {
    expect(supabase.auth).toBeDefined();
    expect(supabase.auth.signInWithOtp).toBeDefined();
    expect(supabase.auth.signOut).toBeDefined();
  });

  it('should have database methods', () => {
    expect(supabase.from).toBeDefined();
  });
});
