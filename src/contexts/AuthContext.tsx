import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Company } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  company: Company | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      console.log('🔄 Refreshing user data...');
      
      // Get current auth user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('❌ Auth error:', authError);
        setUser(null);
        setCompany(null);
        setLoading(false);
        return;
      }

      if (!authUser) {
        console.log('👤 No authenticated user');
        setUser(null);
        setCompany(null);
        setLoading(false);
        return;
      }

      console.log('👤 Auth user found:', authUser.id);

      // Get user profile from database
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError) {
        console.error('❌ Error fetching user profile:', userError);
        setUser(null);
        setCompany(null);
        setLoading(false);
        return;
      }

      if (!userProfile) {
        console.log('❌ User profile not found');
        setUser(null);
        setCompany(null);
        setLoading(false);
        return;
      }

      console.log('✅ User profile loaded');

      // Get company data if user has company_id
      if (userProfile.company_id) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', userProfile.company_id)
          .single();

        if (companyError) {
          console.error('❌ Error fetching company:', companyError);
          setUser(userProfile);
          setCompany(null);
        } else {
          setUser(userProfile);
          setCompany(companyData);
        }
      } else {
        setUser(userProfile);
        setCompany(null);
      }

      setLoading(false);

    } catch (error) {
      console.error('💥 Error refreshing user:', error);
      setUser(null);
      setCompany(null);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign out error:', error);
      } else {
        console.log('✅ Signed out successfully');
        setUser(null);
        setCompany(null);
        // Navigation will be handled by the component that calls signOut
        window.location.href = '/';
      }
    } catch (error) {
      console.error('💥 Sign out error:', error);
    }
  };

  useEffect(() => {
    console.log('🔐 Initializing auth context...');

    // Initial load
    refreshUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        console.log('🔐 Auth state changed:', event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await refreshUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setCompany(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    company,
    loading,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
