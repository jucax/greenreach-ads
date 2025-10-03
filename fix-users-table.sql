-- Fix users table to work with Supabase auth user IDs
-- ============================================

-- Drop existing foreign key constraints that reference users.id
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_user_id_fkey;

-- Drop the existing users table
DROP TABLE IF EXISTS users CASCADE;

-- Recreate users table with correct schema
CREATE TABLE users (
    id UUID PRIMARY KEY, -- This will be the Supabase auth user ID
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    is_company_admin BOOLEAN DEFAULT false,
    is_demo BOOLEAN DEFAULT false,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate foreign key constraint for campaigns
ALTER TABLE campaigns ADD CONSTRAINT campaigns_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Drop existing views first to avoid column conflicts
DROP VIEW IF EXISTS company_leaderboard CASCADE;
DROP VIEW IF EXISTS employee_leaderboard CASCADE;

-- Recreate the views that depend on users table
CREATE VIEW company_leaderboard AS
SELECT 
    c.id,
    c.name,
    c.industry,
    COUNT(DISTINCT u.id) as total_employees,
    COUNT(DISTINCT camp.id) as total_campaigns,
    COALESCE(SUM(camp.energy_used_kwh), 0) as total_energy_saved,
    COALESCE(SUM(camp.co2_avoided_kg), 0) as total_co2_avoided,
    CASE 
        WHEN COUNT(DISTINCT camp.id) = 0 THEN 'N/A'
        ELSE MODE() WITHIN GROUP (ORDER BY camp.green_score)
    END as most_common_score,
    c.created_at
FROM companies c
LEFT JOIN users u ON c.id = u.company_id
LEFT JOIN campaigns camp ON u.id = camp.user_id
GROUP BY c.id, c.name, c.industry, c.created_at
ORDER BY total_energy_saved DESC;

CREATE VIEW employee_leaderboard AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.position,
    u.company_id,
    c.name as company_name,
    COUNT(camp.id) as total_campaigns,
    COALESCE(SUM(camp.energy_used_kwh), 0) as total_energy_saved,
    COALESCE(SUM(camp.co2_avoided_kg), 0) as total_co2_avoided,
    CASE 
        WHEN COUNT(camp.id) = 0 THEN 'N/A'
        ELSE MODE() WITHIN GROUP (ORDER BY camp.green_score)
    END as most_common_score,
    u.created_at
FROM users u
LEFT JOIN companies c ON u.company_id = c.id
LEFT JOIN campaigns camp ON u.id = camp.user_id
WHERE u.is_demo = false
GROUP BY u.id, u.name, u.email, u.position, u.company_id, c.name, u.created_at
ORDER BY total_energy_saved DESC;

-- Disable RLS for all tables
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their company's data" ON users;
DROP POLICY IF EXISTS "Users can view their company's campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can view their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can view their company" ON companies;
DROP POLICY IF EXISTS "Users can view company leaderboard" ON companies;
DROP POLICY IF EXISTS "Users can view employee leaderboard" ON users;

-- Insert sample data (only if they don't exist)
INSERT INTO companies (name, industry, size, website, has_ad_experience, current_platforms, company_code) VALUES
('TechCorp Inc.', 'Technology', '51-200', 'https://techcorp.com', true, ARRAY['Google Ads', 'Facebook Ads'], 'GR-ABC123'),
('GreenStart Co.', 'Sustainability', '11-50', 'https://greenstart.com', true, ARRAY['Instagram Ads', 'LinkedIn Ads'], 'GR-DEF456'),
('EcoRetail LLC', 'Retail', '201-500', 'https://ecoretail.com', false, ARRAY['Google Ads'], 'GR-GHI789')
ON CONFLICT (company_code) DO NOTHING;

-- Note: We can't insert sample users without valid Supabase auth user IDs
-- Users will be created through the registration process

-- Note: Sample campaigns will be created when users register and create their first campaigns
-- This ensures proper foreign key relationships with real user IDs

COMMIT;
