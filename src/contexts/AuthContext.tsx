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
        console.error('❌ Auth error details:', {
          message: authError.message,
          status: authError.status,
          name: authError.name
        });
        setUser(null);
        setCompany(null);
        return;
      }

      if (!authUser) {
        console.log('👤 No authenticated user');
        setUser(null);
        setCompany(null);
        return;
      }

      console.log('👤 Auth user found:', {
        id: authUser.id,
        email: authUser.email,
        email_confirmed_at: authUser.email_confirmed_at
      });

      // Get user profile from database
      console.log('🔍 Looking for user profile with ID:', authUser.id);
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError) {
        console.error('❌ Error fetching user profile:', userError);
        console.error('❌ User error details:', {
          message: userError.message,
          details: userError.details,
          hint: userError.hint,
          code: userError.code
        });
        setUser(null);
        setCompany(null);
        return;
      }

      if (!userProfile) {
        console.log('❌ User profile not found in database for ID:', authUser.id);
        console.log('🔍 Let me check what users exist in the database...');
        
        // Debug: Check what users exist
        const { data: allUsers, error: allUsersError } = await supabase
          .from('users')
          .select('id, email, name')
          .limit(5);
        
        if (allUsersError) {
          console.error('❌ Error fetching all users:', allUsersError);
        } else {
          console.log('📋 Available users in database:', allUsers);
        }
        
        setUser(null);
        setCompany(null);
        return;
      }

      console.log('✅ User profile loaded:', userProfile);

      // Get company data
      console.log('🔍 Looking for company with ID:', userProfile.company_id);
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', userProfile.company_id)
        .single();

      if (companyError) {
        console.error('❌ Error fetching company:', companyError);
        console.error('❌ Company error details:', {
          message: companyError.message,
          details: companyError.details,
          hint: companyError.hint,
          code: companyError.code
        });
        setUser(userProfile);
        setCompany(null);
        return;
      }

      if (!companyData) {
        console.log('❌ Company not found for ID:', userProfile.company_id);
        setUser(userProfile);
        setCompany(null);
        return;
      }

      console.log('✅ Company data loaded:', companyData);

      setUser(userProfile);
      setCompany(companyData);

    } catch (error) {
      console.error('💥 Error refreshing user:', error);
      setUser(null);
      setCompany(null);
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
    refreshUser().finally(() => setLoading(false));

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.id);
        console.log('🔐 Session details:', {
          user: session?.user?.id,
          expires_at: session?.expires_at,
          access_token: session?.access_token ? 'Present' : 'Missing'
        });
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('🔄 Auth state change: SIGNED_IN/TOKEN_REFRESHED, refreshing user...');
          await refreshUser();
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 Auth state change: SIGNED_OUT, clearing user data...');
          setUser(null);
          setCompany(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('🔐 Cleaning up auth subscription');
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
