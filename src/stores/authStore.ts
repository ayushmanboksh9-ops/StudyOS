import { create } from 'zustand';
import { AuthState, User } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Map Supabase user to app user
const mapSupabaseUser = (user: SupabaseUser): User => {
  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email!.split('@')[0],
    avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    googleId: user.user_metadata?.sub,
    createdAt: user.created_at,
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  // Email OTP Login (Passwordless)
  login: async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      toast.success('Check your email for the login code!', {
        description: 'A 4-digit code has been sent to your email.',
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to send login code');
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (email: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) throw error;

      if (data.user) {
        const appUser = mapSupabaseUser(data.user);
        set({ user: appUser, isAuthenticated: true, loading: false });
        toast.success('Welcome to StudyOS! 🎉');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'Invalid or expired code');
      throw error;
    }
  },

  // Google OAuth Login
  loginWithGoogle: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

      // OAuth redirects automatically, no need to handle success here
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Google login failed');
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({ user: null, isAuthenticated: false });
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  },

  // Update user profile
  updateProfile: async (data: Partial<User>) => {
    try {
      const currentUser = get().user;
      if (!currentUser) throw new Error('No user logged in');

      // Update user_metadata in Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: data.name,
        },
      });

      if (authError) throw authError;

      // Update user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          username: data.name,
          email: data.email,
        })
        .eq('id', currentUser.id);

      if (profileError) throw profileError;

      // Update local state
      set({ user: { ...currentUser, ...data } });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  },

  // Update user (for custom subjects and other profile updates)
  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...userData } });
    }
  },
}));

// Initialize auth state on app load
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    const appUser = mapSupabaseUser(session.user);
    useAuthStore.setState({ user: appUser, isAuthenticated: true, loading: false });
  } else {
    useAuthStore.setState({ loading: false });
  }
});

// Listen to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);

  if (event === 'SIGNED_IN' && session?.user) {
    const appUser = mapSupabaseUser(session.user);
    useAuthStore.setState({ user: appUser, isAuthenticated: true, loading: false });
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, isAuthenticated: false, loading: false });
  } else if (event === 'TOKEN_REFRESHED' && session?.user) {
    const appUser = mapSupabaseUser(session.user);
    useAuthStore.setState({ user: appUser, isAuthenticated: true });
  }
});
