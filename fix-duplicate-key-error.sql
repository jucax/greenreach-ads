-- Fix duplicate key error by cleaning up existing data
-- ============================================

-- Check what companies already exist
SELECT id, name, company_code FROM companies ORDER BY created_at;

-- Check what users already exist
SELECT id, email, name, company_id FROM users ORDER BY created_at;

-- If you want to start fresh, uncomment the lines below:
-- WARNING: This will delete ALL existing data!

-- DELETE FROM campaigns;
-- DELETE FROM users;
-- DELETE FROM companies;

-- Alternative: Just remove the conflicting sample data
DELETE FROM companies WHERE company_code IN ('GR-ABC123', 'GR-DEF456', 'GR-GHI789');

-- Verify cleanup
SELECT COUNT(*) as company_count FROM companies;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as campaign_count FROM campaigns;

COMMIT;
