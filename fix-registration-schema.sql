-- Fix registration schema issues for GreenReach Ads
-- This script fixes the users table to work with Supabase Auth

-- ============================================
-- 1. DROP EXISTING CONSTRAINTS AND TABLES
-- ============================================

-- Drop foreign key constraints that reference users.id
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_user_id_fkey;

-- Drop the existing users table
DROP TABLE IF EXISTS users CASCADE;

-- Drop campaigns table to avoid foreign key issues
DROP TABLE IF EXISTS campaigns CASCADE;

-- ============================================
-- 2. RECREATE USERS TABLE WITH CORRECT SCHEMA
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY, -- This will be the Supabase auth user ID (auth.uid())
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    is_company_admin BOOLEAN DEFAULT false,
    is_demo BOOLEAN DEFAULT false,
    profile_picture_url TEXT, -- For profile pictures
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. RECREATE CAMPAIGNS TABLE
-- ============================================

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    objective TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    ai_generated_content JSONB,
    energy_saved_kwh DECIMAL(10, 2),
    co2_reduced_kg DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_company_id ON campaigns(company_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

-- ============================================
-- 4. ADD MISSING COLUMNS TO COMPANIES TABLE
-- ============================================

-- Add logo_url column if it doesn't exist
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- ============================================
-- 5. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_is_company_admin ON users(is_company_admin);
CREATE INDEX IF NOT EXISTS idx_users_is_demo ON users(is_demo);
CREATE INDEX IF NOT EXISTS idx_users_profile_picture_url ON users(profile_picture_url) WHERE profile_picture_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_companies_logo_url ON companies(logo_url) WHERE logo_url IS NOT NULL;

-- ============================================
-- 6. UPDATE TRIGGERS
-- ============================================

-- Create trigger for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. DISABLE RLS FOR DEVELOPMENT
-- ============================================

-- Disable RLS on all tables for development
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own company" ON companies;
DROP POLICY IF EXISTS "Company admins can update own company" ON companies;
DROP POLICY IF EXISTS "Users can read users in own company" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can read company campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete own campaigns" ON campaigns;

-- ============================================
-- 8. VERIFY SCHEMA
-- ============================================

-- Check users table structure
SELECT 
    'Users table structure:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Check companies table structure
SELECT 
    'Companies table structure:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'companies' 
ORDER BY ordinal_position;

-- Check campaigns table structure
SELECT 
    'Campaigns table structure:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'campaigns' 
ORDER BY ordinal_position;

-- Check if required functions exist
SELECT 
    'Required functions:' as info,
    proname as function_name
FROM pg_proc 
WHERE proname IN ('generate_company_code', 'calculate_sustainability_metrics', 'create_demo_user')
ORDER BY proname;

COMMIT;
