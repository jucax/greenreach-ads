import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isDemoMode, setDemoMode, User, Company } from '../lib/supabase';

interface AppContextType {
  isDemo: boolean;
  setIsDemo: (isDemo: boolean) => void;
  currentUser: User | null;
  currentCompany: Company | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemo, setIsDemoState] = useState<boolean>(isDemoMode());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setIsDemo = (demo: boolean) => {
    setDemoMode(demo);
    setIsDemoState(demo);
  };

  const refreshUser = async () => {
    if (isDemo) {
      // Use demo data
      setCurrentUser({
        id: 'demo-user-id',
        email: 'john.martinez@acme.com',
        name: 'John Martinez',
        position: 'Marketing Manager',
        company_id: 'demo-company-id',
        is_company_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setCurrentCompany({
        id: 'demo-company-id',
        name: 'Acme Inc.',
        industry: 'E-commerce',
        size: '51-200',
        monthly_budget_range: '$2,000-$10,000',
        has_ad_experience: true,
        current_platforms: ['Instagram', 'Facebook', 'Google'],
        company_code: 'GR-DEMO00',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setIsLoading(false);
      return;
    }

    // Production mode - fetch from Supabase
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setCurrentUser(null);
        setCurrentCompany(null);
        setIsLoading(false);
        return;
      }

      // Fetch user profile
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError || !userProfile) {
        console.error('Error fetching user profile:', userError);
        setCurrentUser(null);
        setCurrentCompany(null);
        setIsLoading(false);
        return;
      }

      setCurrentUser(userProfile);

      // Fetch company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', userProfile.company_id)
        .single();

      if (companyError || !company) {
        console.error('Error fetching company:', companyError);
        setCurrentCompany(null);
      } else {
        setCurrentCompany(company);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    // Listen for auth changes (only in production mode)
    if (!isDemo) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        refreshUser();
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isDemo]);

  return (
    <AppContext.Provider
      value={{
        isDemo,
        setIsDemo,
        currentUser,
        currentCompany,
        isLoading,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
