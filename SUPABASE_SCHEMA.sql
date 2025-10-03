-- GreenReach Ads Database Schema for Supabase
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies Table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  size TEXT NOT NULL,
  website TEXT,
  monthly_budget_range TEXT NOT NULL,
  has_ad_experience BOOLEAN NOT NULL DEFAULT false,
  current_platforms TEXT[] DEFAULT '{}',
  company_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on company_code for fast lookups
CREATE INDEX idx_companies_company_code ON companies(company_code);

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  is_company_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_is_company_admin ON users(is_company_admin);

-- Campaigns Table (for future use)
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10, 2) NOT NULL,
  objective TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  ai_generated_content JSONB,
  energy_saved_kwh DECIMAL(10, 2),
  co2_reduced_kg DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_company_id ON campaigns(company_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Companies: Users can read their own company
CREATE POLICY "Users can read own company" ON companies
  FOR SELECT
  USING (id IN (SELECT company_id FROM users WHERE users.id = auth.uid()));

-- Companies: Company admins can update their company
CREATE POLICY "Company admins can update own company" ON companies
  FOR UPDATE
  USING (id IN (SELECT company_id FROM users WHERE users.id = auth.uid() AND is_company_admin = true));

-- Users: Users can read users in their company
CREATE POLICY "Users can read users in own company" ON users
  FOR SELECT
  USING (company_id IN (SELECT company_id FROM users WHERE users.id = auth.uid()));

-- Users: Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (id = auth.uid());

-- Campaigns: Users can read campaigns in their company
CREATE POLICY "Users can read company campaigns" ON campaigns
  FOR SELECT
  USING (company_id IN (SELECT company_id FROM users WHERE users.id = auth.uid()));

-- Campaigns: Users can create campaigns
CREATE POLICY "Users can create campaigns" ON campaigns
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Campaigns: Users can update their own campaigns
CREATE POLICY "Users can update own campaigns" ON campaigns
  FOR UPDATE
  USING (user_id = auth.uid());

-- Campaigns: Users can delete their own campaigns
CREATE POLICY "Users can delete own campaigns" ON campaigns
  FOR DELETE
  USING (user_id = auth.uid());

-- Sample data for testing (optional)
-- Uncomment to insert test data

/*
-- Insert a test company
INSERT INTO companies (name, industry, size, website, monthly_budget_range, has_ad_experience, current_platforms, company_code)
VALUES (
  'Acme Inc.',
  'E-commerce',
  '51-200',
  'https://acme.com',
  '$10,000-$50,000',
  true,
  ARRAY['Facebook Ads', 'Google Ads'],
  'GR-TEST01'
);

-- Insert a test user (password: 'password123', hashed with bcrypt)
INSERT INTO users (email, password_hash, name, position, company_id, is_company_admin)
VALUES (
  'admin@acme.com',
  '$2b$10$YourHashedPasswordHere',
  'John Doe',
  'Marketing Manager',
  (SELECT id FROM companies WHERE company_code = 'GR-TEST01'),
  true
);
*/

-- Views for analytics (optional)
CREATE VIEW company_stats AS
SELECT 
  c.id,
  c.name,
  c.company_code,
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT ca.id) as total_campaigns,
  SUM(ca.energy_saved_kwh) as total_energy_saved,
  SUM(ca.co2_reduced_kg) as total_co2_reduced
FROM companies c
LEFT JOIN users u ON c.id = u.company_id
LEFT JOIN campaigns ca ON c.id = ca.company_id
GROUP BY c.id, c.name, c.company_code;

-- Grant permissions
GRANT SELECT ON company_stats TO authenticated;

