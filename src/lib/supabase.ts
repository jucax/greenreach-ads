import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  website?: string;
  monthly_budget_range: string;
  has_ad_experience: boolean;
  current_platforms?: string[];
  company_code: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  position: string;
  company_id: string;
  is_company_admin: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  company_id: string;
  name: string;
  product_name: string;
  product_description: string;
  product_category: string;
  budget: number;
  objective: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'paused' | 'draft';
  target_audience?: any;
  geographic_targeting?: any;
  posting_schedule?: any;
  platform_allocation?: any;
  ad_variations?: any;
  image_urls?: string[];
  selected_image_index?: number;
  actual_reach: number;
  actual_impressions: number;
  actual_clicks: number;
  actual_conversions: number;
  actual_spend: number;
  energy_used_kwh: number;
  co2_avoided_kg: number;
  green_score: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyLeaderboard {
  id: string;
  name: string;
  total_campaigns: number;
  total_energy_saved: number;
  avg_score_numeric: number;
  most_common_score: string;
}

export interface EmployeeLeaderboard {
  id: string;
  name: string;
  company_id: string;
  total_campaigns: number;
  total_energy_saved: number;
  avg_score_numeric: number;
}

// Helper function to check if user is in demo mode
export const isDemoMode = (): boolean => {
  return localStorage.getItem('demoMode') === 'true';
};

// Helper function to set demo mode
export const setDemoMode = (isDemo: boolean): void => {
  if (isDemo) {
    localStorage.setItem('demoMode', 'true');
  } else {
    localStorage.removeItem('demoMode');
  }
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to get user profile
export const getUserProfile = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

// Helper function to get company
export const getCompany = async (companyId: string): Promise<Company | null> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single();
  
  if (error) {
    console.error('Error fetching company:', error);
    return null;
  }
  
  return data;
};

// Helper function to get company campaigns
export const getCompanyCampaigns = async (companyId: string): Promise<Campaign[]> => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
  
  return data || [];
};

// Helper function to get user campaigns
export const getUserCampaigns = async (userId: string): Promise<Campaign[]> => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user campaigns:', error);
    return [];
  }
  
  return data || [];
};

// Helper function to create campaign
export const createCampaign = async (campaignData: Partial<Campaign>): Promise<Campaign | null> => {
  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaignData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating campaign:', error);
    return null;
  }
  
  return data;
};

// Helper function to update campaign
export const updateCampaign = async (campaignId: string, updates: Partial<Campaign>): Promise<Campaign | null> => {
  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', campaignId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating campaign:', error);
    return null;
  }
  
  return data;
};

// Helper function to get company leaderboard
export const getCompanyLeaderboard = async (): Promise<CompanyLeaderboard[]> => {
  const { data, error } = await supabase
    .from('company_leaderboard')
    .select('*')
    .limit(50);
  
  if (error) {
    console.error('Error fetching company leaderboard:', error);
    return [];
  }
  
  return data || [];
};

// Helper function to get employee leaderboard
export const getEmployeeLeaderboard = async (companyId: string): Promise<EmployeeLeaderboard[]> => {
  const { data, error } = await supabase
    .from('employee_leaderboard')
    .select('*')
    .eq('company_id', companyId)
    .limit(50);
  
  if (error) {
    console.error('Error fetching employee leaderboard:', error);
    return [];
  }
  
  return data || [];
};

// Helper function to calculate sustainability metrics
export const calculateSustainabilityMetrics = async (budget: number) => {
  const { data, error } = await supabase.rpc('calculate_sustainability_metrics', {
    campaign_budget: budget
  });
  
  if (error) {
    console.error('Error calculating sustainability metrics:', error);
    // Fallback to client-side calculation
    const traditionalEnergy = budget * 0.076;
    const optimizedEnergy = traditionalEnergy * 0.4;
    const co2Saved = (traditionalEnergy - optimizedEnergy) * 0.5;
    
    let score = 'C';
    if (optimizedEnergy < traditionalEnergy * 0.35) score = 'A+';
    else if (optimizedEnergy < traditionalEnergy * 0.40) score = 'A';
    else if (optimizedEnergy < traditionalEnergy * 0.45) score = 'A-';
    else if (optimizedEnergy < traditionalEnergy * 0.50) score = 'B+';
    else if (optimizedEnergy < traditionalEnergy * 0.60) score = 'B';
    
    return {
      energy_used_kwh: optimizedEnergy,
      co2_avoided_kg: co2Saved,
      green_score: score
    };
  }
  
  return data;
};

// Helper function to generate company code
export const generateCompanyCode = async (): Promise<string> => {
  const { data, error } = await supabase.rpc('generate_company_code');
  
  if (error) {
    console.error('Error generating company code:', error);
    // Fallback to client-side generation
    return 'GR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  return data;
};

// Helper function to verify company code
export const verifyCompanyCode = async (code: string): Promise<Company | null> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('company_code', code)
    .single();
  
  if (error) {
    return null;
  }
  
  return data;
};

// Helper function to create company
export const createCompany = async (companyData: Partial<Company>): Promise<Company | null> => {
  // Generate company code if not provided
  if (!companyData.company_code) {
    companyData.company_code = await generateCompanyCode();
  }
  
  const { data, error } = await supabase
    .from('companies')
    .insert(companyData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating company:', error);
    return null;
  }
  
  return data;
};

// Helper function to create user profile
export const createUserProfile = async (userData: Partial<User>): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
  
  return data;
};
