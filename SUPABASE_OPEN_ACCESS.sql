-- GreenReach Ads - Open Access Database Schema
-- This script creates all tables with open access (no RLS restrictions)
-- ============================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS company_leaderboard CASCADE;
DROP TABLE IF EXISTS employee_leaderboard CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS generate_company_code();
DROP FUNCTION IF EXISTS calculate_sustainability_metrics(numeric);
DROP FUNCTION IF EXISTS get_company_rank(uuid);
DROP FUNCTION IF EXISTS create_demo_user(uuid, text, text);

-- ============================================
-- CREATE TABLES
-- ============================================

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    size TEXT NOT NULL,
    website TEXT,
    monthly_budget_range TEXT,
    has_ad_experience BOOLEAN NOT NULL DEFAULT false,
    current_platforms TEXT[],
    company_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
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

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_description TEXT NOT NULL,
    product_category TEXT NOT NULL,
    budget NUMERIC NOT NULL,
    objective TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'completed', 'paused', 'draft')),
    target_audience JSONB,
    geographic_targeting JSONB,
    posting_schedule JSONB,
    platform_allocation JSONB,
    ad_variations JSONB,
    image_urls TEXT[],
    selected_image_index INTEGER,
    actual_reach INTEGER DEFAULT 0,
    actual_impressions INTEGER DEFAULT 0,
    actual_clicks INTEGER DEFAULT 0,
    actual_conversions INTEGER DEFAULT 0,
    actual_spend NUMERIC DEFAULT 0,
    energy_used_kwh NUMERIC DEFAULT 0,
    co2_avoided_kg NUMERIC DEFAULT 0,
    green_score TEXT DEFAULT 'C',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company leaderboard view
CREATE VIEW company_leaderboard AS
SELECT 
    c.id,
    c.name,
    COUNT(ca.id) as total_campaigns,
    COALESCE(SUM(ca.energy_used_kwh), 0) as total_energy_saved,
    COALESCE(AVG(
        CASE ca.green_score
            WHEN 'A+' THEN 10
            WHEN 'A' THEN 9
            WHEN 'A-' THEN 8
            WHEN 'B+' THEN 7
            WHEN 'B' THEN 6
            WHEN 'B-' THEN 5
            WHEN 'C+' THEN 4
            WHEN 'C' THEN 3
            WHEN 'C-' THEN 2
            WHEN 'D' THEN 1
            ELSE 0
        END
    ), 0) as avg_score_numeric,
    MODE() WITHIN GROUP (ORDER BY ca.green_score) as most_common_score
FROM companies c
LEFT JOIN campaigns ca ON c.id = ca.company_id AND ca.status != 'draft'
GROUP BY c.id, c.name
ORDER BY total_energy_saved DESC;

-- Employee leaderboard view
CREATE VIEW employee_leaderboard AS
SELECT 
    u.id,
    u.name,
    u.company_id,
    COUNT(ca.id) as total_campaigns,
    COALESCE(SUM(ca.energy_used_kwh), 0) as total_energy_saved,
    COALESCE(AVG(
        CASE ca.green_score
            WHEN 'A+' THEN 10
            WHEN 'A' THEN 9
            WHEN 'A-' THEN 8
            WHEN 'B+' THEN 7
            WHEN 'B' THEN 6
            WHEN 'B-' THEN 5
            WHEN 'C+' THEN 4
            WHEN 'C' THEN 3
            WHEN 'C-' THEN 2
            WHEN 'D' THEN 1
            ELSE 0
        END
    ), 0) as avg_score_numeric
FROM users u
LEFT JOIN campaigns ca ON u.id = ca.user_id AND ca.status != 'draft'
GROUP BY u.id, u.name, u.company_id
ORDER BY total_energy_saved DESC;

-- ============================================
-- CREATE FUNCTIONS
-- ============================================

-- Generate unique company code
CREATE OR REPLACE FUNCTION generate_company_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        new_code := 'GR-' || UPPER(substring(md5(random()::text) from 1 for 6));
        SELECT EXISTS(SELECT 1 FROM companies WHERE company_code = new_code) INTO code_exists;
        EXIT WHEN NOT code_exists;
    END LOOP;
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Calculate sustainability metrics
CREATE OR REPLACE FUNCTION calculate_sustainability_metrics(campaign_budget NUMERIC)
RETURNS TABLE(
    energy_used_kwh NUMERIC,
    co2_avoided_kg NUMERIC,
    green_score TEXT
) AS $$
DECLARE
    traditional_energy NUMERIC;
    optimized_energy NUMERIC;
    co2_saved NUMERIC;
    score TEXT;
BEGIN
    -- Traditional energy consumption (kWh per $1000 budget)
    traditional_energy := campaign_budget * 0.076;
    
    -- Optimized energy consumption (60% reduction)
    optimized_energy := traditional_energy * 0.4;
    
    -- CO2 saved (kg per kWh)
    co2_saved := (traditional_energy - optimized_energy) * 0.5;
    
    -- Calculate green score
    IF optimized_energy < traditional_energy * 0.35 THEN
        score := 'A+';
    ELSIF optimized_energy < traditional_energy * 0.40 THEN
        score := 'A';
    ELSIF optimized_energy < traditional_energy * 0.45 THEN
        score := 'A-';
    ELSIF optimized_energy < traditional_energy * 0.50 THEN
        score := 'B+';
    ELSIF optimized_energy < traditional_energy * 0.60 THEN
        score := 'B';
    ELSE
        score := 'C';
    END IF;
    
    RETURN QUERY SELECT optimized_energy, co2_saved, score;
END;
$$ LANGUAGE plpgsql;

-- Get company rank
CREATE OR REPLACE FUNCTION get_company_rank(company_id UUID)
RETURNS INTEGER AS $$
DECLARE
    company_rank INTEGER;
BEGIN
    SELECT rank INTO company_rank
    FROM (
        SELECT 
            id,
            ROW_NUMBER() OVER (ORDER BY total_energy_saved DESC) as rank
        FROM company_leaderboard
    ) ranked
    WHERE id = company_id;
    
    RETURN COALESCE(company_rank, 0);
END;
$$ LANGUAGE plpgsql;

-- Create demo user
CREATE OR REPLACE FUNCTION create_demo_user(
    user_id UUID,
    user_email TEXT,
    user_name TEXT
)
RETURNS users AS $$
DECLARE
    new_user users;
BEGIN
    -- Insert demo user
    INSERT INTO users (
        id,
        email,
        name,
        position,
        company_id,
        is_company_admin,
        is_demo
    ) VALUES (
        user_id,
        user_email,
        user_name,
        'Demo User',
        (SELECT id FROM companies WHERE name = 'Acme Inc.' LIMIT 1),
        false,
        true
    ) RETURNING * INTO new_user;
    
    RETURN new_user;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- DISABLE ROW LEVEL SECURITY
-- ============================================

-- Disable RLS on all tables for open access
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert demo company
INSERT INTO companies (
    id,
    name,
    industry,
    size,
    website,
    monthly_budget_range,
    has_ad_experience,
    current_platforms,
    company_code
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Acme Inc.',
    'Technology & Software',
    '51-200',
    'https://acme.com',
    '$10,000-$50,000',
    true,
    ARRAY['Facebook Ads', 'Google Ads', 'LinkedIn Ads'],
    'GR-ACME01'
);

-- Insert demo user
INSERT INTO users (
    id,
    email,
    name,
    position,
    company_id,
    is_company_admin,
    is_demo
) VALUES (
    '00000000-0000-0000-0000-000000000002'::uuid,
    'john.martinez@acme.com',
    'John Martinez',
    'Marketing Manager',
    '00000000-0000-0000-0000-000000000001'::uuid,
    true,
    true
);

-- Insert sample campaigns
INSERT INTO campaigns (
    id,
    user_id,
    company_id,
    name,
    product_name,
    product_description,
    product_category,
    budget,
    objective,
    start_date,
    end_date,
    status,
    target_audience,
    geographic_targeting,
    posting_schedule,
    platform_allocation,
    ad_variations,
    actual_reach,
    actual_impressions,
    actual_clicks,
    actual_conversions,
    actual_spend,
    energy_used_kwh,
    co2_avoided_kg,
    green_score
) VALUES 
-- Campaign 1: Summer Sale
(
    '10000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Summer Sale 2024',
    'Eco-Friendly Water Bottles',
    'Sustainable stainless steel water bottles',
    'Eco Products',
    500.00,
    'Increase Sales',
    '2024-06-01',
    '2024-06-30',
    'completed',
    '{"ageRange": "25-45", "interests": ["Sustainability", "Fitness"], "demographics": "Environmentally conscious consumers", "incomeLevel": "$40k-$80k"}'::jsonb,
    '{"primary": "United States", "cities": ["New York", "Los Angeles", "San Francisco"]}'::jsonb,
    '{"bestDays": ["Monday", "Wednesday", "Friday"], "bestTimes": ["9-11am EST", "7-9pm EST"], "reasoning": "Peak engagement hours"}'::jsonb,
    '[{"name": "Facebook", "budget": 200, "percentage": 40}, {"name": "Instagram", "budget": 150, "percentage": 30}, {"name": "Google", "budget": 150, "percentage": 30}]'::jsonb,
    '[{"name": "Variation 1", "headline": "Stay Hydrated, Stay Green", "body": "Eco-friendly water bottles for conscious consumers", "cta": "Shop Now"}]'::jsonb,
    45000,
    180000,
    3200,
    180,
    500.00,
    15.2,
    7.6,
    'A-'
),
-- Campaign 2: Holiday Campaign
(
    '10000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Holiday Green Gifts',
    'Sustainable Gift Sets',
    'Curated eco-friendly gift collections',
    'Gifts',
    750.00,
    'Increase Sales',
    '2024-11-15',
    '2024-12-25',
    'completed',
    '{"ageRange": "30-55", "interests": ["Gift Giving", "Sustainability"], "demographics": "Gift buyers", "incomeLevel": "$50k-$100k"}'::jsonb,
    '{"primary": "United States", "cities": ["Chicago", "Boston", "Seattle"]}'::jsonb,
    '{"bestDays": ["Tuesday", "Thursday", "Saturday"], "bestTimes": ["10am-12pm EST", "6-8pm EST"], "reasoning": "Gift shopping patterns"}'::jsonb,
    '[{"name": "Facebook", "budget": 300, "percentage": 40}, {"name": "Instagram", "budget": 225, "percentage": 30}, {"name": "Google", "budget": 225, "percentage": 30}]'::jsonb,
    '[{"name": "Variation 1", "headline": "Give Green This Holiday", "body": "Sustainable gifts that make a difference", "cta": "Shop Gifts"}]'::jsonb,
    12430,
    45230,
    1205,
    78,
    750.00,
    22.8,
    11.4,
    'B+'
);

-- ============================================
-- CREATE INDEXES
-- ============================================

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_code ON companies(company_code);
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_campaigns_user ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_company ON campaigns(company_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_users_demo ON users(is_demo);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE companies IS 'Company information and settings';
COMMENT ON TABLE users IS 'User profiles and authentication';
COMMENT ON TABLE campaigns IS 'Advertising campaigns and performance data';
COMMENT ON VIEW company_leaderboard IS 'Monthly company rankings by sustainability';
COMMENT ON VIEW employee_leaderboard IS 'Monthly employee rankings within companies';
COMMENT ON FUNCTION generate_company_code IS 'Generates unique company codes';
COMMENT ON FUNCTION calculate_sustainability_metrics IS 'Calculates energy and CO2 savings';
COMMENT ON FUNCTION get_company_rank IS 'Gets company leaderboard ranking';
COMMENT ON FUNCTION create_demo_user IS 'Creates demo user accounts';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ GreenReach Ads database schema created successfully!';
    RAISE NOTICE '📊 Tables: companies, users, campaigns';
    RAISE NOTICE '👀 Views: company_leaderboard, employee_leaderboard';
    RAISE NOTICE '⚡ Functions: generate_company_code, calculate_sustainability_metrics, get_company_rank, create_demo_user';
    RAISE NOTICE '🔓 RLS: Disabled for open access';
    RAISE NOTICE '📝 Sample data: Demo company and campaigns inserted';
    RAISE NOTICE '🎯 Ready for development and testing!';
END $$;
