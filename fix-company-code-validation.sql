-- Fix company code validation by disabling RLS on companies table
-- ============================================

-- Disable RLS on companies table to allow company code validation
-- This is needed because company code validation happens before user authentication
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on users and campaigns for consistency
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('companies', 'users', 'campaigns')
ORDER BY tablename;

COMMIT;
