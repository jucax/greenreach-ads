-- Fix foreign key constraint error for campaigns table
-- ============================================

-- First, let's check what's in the campaigns table
SELECT id, user_id, company_id, name FROM campaigns LIMIT 5;

-- Check what's in the users table
SELECT id, email, name FROM users LIMIT 5;

-- Remove any campaigns that reference non-existent users
DELETE FROM campaigns WHERE user_id NOT IN (SELECT id FROM users);

-- If there are no users yet, remove all sample campaigns
-- (This will happen if the users table was recreated but no users have registered yet)
DELETE FROM campaigns WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Also remove any campaigns with the other placeholder user ID
DELETE FROM campaigns WHERE user_id = '00000000-0000-0000-0000-000000000002';

-- Verify the fix
SELECT 
    'Campaigns' as table_name, 
    COUNT(*) as count 
FROM campaigns
UNION ALL
SELECT 
    'Users' as table_name, 
    COUNT(*) as count 
FROM users;

-- Show any remaining campaigns and their user references
SELECT 
    c.id as campaign_id,
    c.name as campaign_name,
    c.user_id,
    u.email as user_email,
    u.name as user_name
FROM campaigns c
LEFT JOIN users u ON c.user_id = u.id
ORDER BY c.created_at DESC;

COMMIT;
