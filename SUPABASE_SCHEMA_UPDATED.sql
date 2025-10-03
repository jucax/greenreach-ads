-- GreenReach Ads Database Schema - Updated
-- Run this in Supabase SQL Editor after running the original schema

-- ============================================
-- ADD DEMO MODE COLUMN TO USERS
-- ============================================

-- Add is_demo column to users table to distinguish demo accounts
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Add index for demo users
CREATE INDEX IF NOT EXISTS idx_users_demo ON users(is_demo);

-- ============================================
-- UPDATE RLS POLICIES FOR DEMO MODE
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Demo users can view all" ON users;
DROP POLICY IF EXISTS "Demo users can view all companies" ON companies;
DROP POLICY IF EXISTS "Demo users can view all campaigns" ON campaigns;

-- Demo users can view all users (for demo purposes)
CREATE POLICY "Demo users can view all"
  ON users FOR SELECT
  USING (
    (id = auth.uid()) OR
    (is_demo = true AND auth.uid() IN (SELECT id FROM users WHERE is_demo = true))
  );

-- Demo users can view all companies
CREATE POLICY "Demo users can view all companies"
  ON companies FOR SELECT
  USING (
    (id IN (SELECT company_id FROM users WHERE id = auth.uid())) OR
    (auth.uid() IN (SELECT id FROM users WHERE is_demo = true))
  );

-- Demo users can view all campaigns
CREATE POLICY "Demo users can view all campaigns"
  ON campaigns FOR SELECT
  USING (
    (company_id IN (SELECT company_id FROM users WHERE id = auth.uid())) OR
    (auth.uid() IN (SELECT id FROM users WHERE is_demo = true))
  );

-- ============================================
-- CREATE DEMO USER AND COMPANY
-- ============================================

-- Note: This creates the demo company
-- The demo user will be created through Supabase Auth when "View Demo" is clicked

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
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Acme Inc.',
  'E-commerce',
  '51-200',
  'https://acme.example.com',
  '$2,000-$10,000',
  true,
  ARRAY['Instagram', 'Facebook', 'Google'],
  'GR-DEMO00'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FUNCTION TO CREATE DEMO USER
-- ============================================

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
  )
  VALUES (
    user_id,
    user_email,
    user_name,
    'Marketing Manager',
    '00000000-0000-0000-0000-000000000001'::uuid,
    false,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    is_demo = EXCLUDED.is_demo
  RETURNING * INTO new_user;
  
  RETURN new_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE DEMO CAMPAIGNS
-- ============================================

-- Insert sample campaigns for demo purposes
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
)
VALUES
  -- Campaign 1: Summer Sale 2024
  (
    '10000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid, -- Demo user ID
    '00000000-0000-0000-0000-000000000001'::uuid, -- Demo company ID
    'Summer Sale 2024',
    'Eco-Friendly Water Bottle',
    'Sustainable water bottle made from recycled materials',
    'Health & Wellness',
    500.00,
    'Increase Sales',
    '2024-10-01',
    '2024-10-31',
    'active',
    '{"ageRange": "25-40", "interests": ["Sustainability", "Health"], "demographics": "Urban professionals", "incomeLevel": "$50k-$100k"}'::jsonb,
    '{"primary": "United States", "cities": ["New York", "Los Angeles"]}'::jsonb,
    '{"bestDays": ["Tuesday", "Thursday"], "bestTimes": ["2-4pm EST"], "reasoning": "Peak engagement times"}'::jsonb,
    '[{"name": "Instagram", "budget": 200, "percentage": 40}, {"name": "Facebook", "budget": 175, "percentage": 35}]'::jsonb,
    '[{"name": "Variation 1", "headline": "Transform Your Daily Routine", "body": "Eco-friendly water bottle", "cta": "Shop Now"}]'::jsonb,
    45234,
    128450,
    3847,
    234,
    230.00,
    12.0,
    6.0,
    'A-'
  ),
  -- Campaign 2: Product Launch
  (
    '10000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Product Launch',
    'Smart Home Device',
    'AI-powered home automation device',
    'Electronics',
    200.00,
    'Build Brand Awareness',
    '2024-09-26',
    '2024-10-10',
    'active',
    '{"ageRange": "20-35", "interests": ["Technology", "Innovation"], "demographics": "Tech-savvy millennials", "incomeLevel": "$60k-$120k"}'::jsonb,
    '{"primary": "United States", "cities": ["Austin", "Seattle"]}'::jsonb,
    '{"bestDays": ["Wednesday", "Friday"], "bestTimes": ["10am-12pm EST"], "reasoning": "Tech audience engagement"}'::jsonb,
    '[{"name": "Instagram", "budget": 80, "percentage": 40}, {"name": "Google", "budget": 120, "percentage": 60}]'::jsonb,
    '[{"name": "Variation 1", "headline": "Smart Living Made Easy", "body": "Revolutionary home automation", "cta": "Learn More"}]'::jsonb,
    12430,
    45230,
    1205,
    78,
    89.00,
    8.0,
    4.0,
    'B+'
  ),
  -- Campaign 3: Back to School
  (
    '10000000-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Back to School',
    'Student Supplies Bundle',
    'Complete back to school essentials',
    'Education',
    800.00,
    'Increase Sales',
    '2024-08-15',
    '2024-09-15',
    'completed',
    '{"ageRange": "18-45", "interests": ["Education", "Parenting"], "demographics": "Parents and students", "incomeLevel": "$40k-$80k"}'::jsonb,
    '{"primary": "United States", "cities": ["Chicago", "Houston"]}'::jsonb,
    '{"bestDays": ["Monday", "Tuesday"], "bestTimes": ["6-8pm EST"], "reasoning": "After work/school hours"}'::jsonb,
    '[{"name": "Facebook", "budget": 320, "percentage": 40}, {"name": "TikTok", "budget": 280, "percentage": 35}]'::jsonb,
    '[{"name": "Variation 1", "headline": "Back to School Ready", "body": "Everything you need for success", "cta": "Shop Now"}]'::jsonb,
    67890,
    245600,
    8920,
    567,
    800.00,
    22.0,
    11.0,
    'A'
  ),
  -- Campaign 4: Winter Clearance (Failed)
  (
    '10000000-0000-0000-0000-000000000004'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Winter Clearance',
    'Winter Apparel Sale',
    'End of season winter clothing clearance',
    'Fashion/Apparel',
    150.00,
    'Increase Sales',
    '2024-10-05',
    '2024-10-12',
    'completed',
    '{"ageRange": "35-65", "interests": ["Shopping", "Bargains"], "demographics": "Budget shoppers", "incomeLevel": "$30k-$60k"}'::jsonb,
    '{"primary": "United States (Rural)", "cities": ["Rural areas"]}'::jsonb,
    '{"bestDays": ["Saturday", "Sunday"], "bestTimes": ["12-2pm EST"], "reasoning": "Weekend shopping"}'::jsonb,
    '[{"name": "Facebook", "budget": 150, "percentage": 100}]'::jsonb,
    '[{"name": "Variation 1", "headline": "Winter Clearance", "body": "Up to 70% off", "cta": "Shop Sale"}]'::jsonb,
    3240,
    8920,
    134,
    8,
    150.00,
    18.0,
    9.0,
    'D'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON COLUMN users.is_demo IS 'Indicates if this is a demo/test user account';
COMMENT ON FUNCTION create_demo_user IS 'Creates or updates a demo user account';

