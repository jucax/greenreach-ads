-- Check current database schema and identify issues
-- Run this in Supabase SQL Editor to debug registration problems

-- Check companies table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'companies' 
ORDER BY ordinal_position;

-- Check users table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('companies', 'users', 'campaigns')
ORDER BY tablename;

-- Check if generate_company_code function exists
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name = 'generate_company_code';

-- Check sample data in companies table
SELECT 
    id,
    name,
    company_code,
    monthly_budget_range,
    created_at
FROM companies 
LIMIT 5;

-- Check sample data in users table
SELECT 
    id,
    email,
    name,
    company_id,
    is_company_admin,
    created_at
FROM users 
LIMIT 5;

-- Test company code generation
SELECT generate_company_code() as test_code;
