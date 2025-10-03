# GreenReach Ads Registration Debug Guide

## Issue Identified
The registration was failing due to a schema mismatch in the `monthly_budget_range` field.

## Root Cause
- The database schema has `monthly_budget_range` as nullable (`TEXT`)
- The registration code was setting it to an empty string `''`
- This caused database constraint violations

## Fixes Applied

### 1. Company Registration Code Fix
**File**: `src/app/register/company/page.tsx`
```typescript
// BEFORE (causing errors)
monthly_budget_range: '', // We removed this field

// AFTER (fixed)
monthly_budget_range: null, // Set to null instead of empty string
```

### 2. TypeScript Interface Fix
**File**: `src/lib/supabase.ts`
```typescript
// BEFORE
monthly_budget_range: string;

// AFTER
monthly_budget_range?: string | null;
```

## Debug Tools Created

### 1. Database Schema Checker
**File**: `check-database-schema.sql`
- Run this in Supabase SQL Editor to verify database structure
- Checks table schemas, RLS policies, and functions
- Tests company code generation

### 2. Registration Test Tool
**File**: `quick-registration-test.html`
- Open this file in a browser to test registration flows
- Tests both company and individual registration
- Provides detailed error messages
- Cleans up test data automatically

### 3. Console Debug Script
**File**: `debug-registration.js`
- Load this in browser console for debugging
- Tests Supabase connection and registration flow
- Provides step-by-step debugging

## Testing Steps

### Step 1: Verify Database Schema
1. Open Supabase SQL Editor
2. Run `check-database-schema.sql`
3. Verify all tables and functions exist
4. Check RLS policies are disabled

### Step 2: Test Registration
1. Open `quick-registration-test.html` in browser
2. Enter your Supabase credentials
3. Run "Company Registration Test"
4. Run "Individual Registration Test"
5. Check for any errors

### Step 3: Test in Application
1. Start the development server: `npm run dev`
2. Navigate to `/register/company`
3. Fill out the form and submit
4. Check browser console for errors
5. Verify user is created and redirected to dashboard

## Common Issues and Solutions

### Issue: "monthly_budget_range" constraint violation
**Solution**: Set field to `null` instead of empty string

### Issue: RLS policy violations
**Solution**: Run `fix-company-code-validation.sql` to disable RLS

### Issue: Company code generation fails
**Solution**: Verify `generate_company_code()` function exists in database

### Issue: User profile creation fails
**Solution**: Check if users table has correct schema and RLS is disabled

## Environment Setup

Make sure your `.env` file contains:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Scripts to Run

1. **First**: `fix-users-table.sql` - Fixes users table schema
2. **Second**: `fix-company-code-validation.sql` - Disables RLS for development
3. **Third**: `check-database-schema.sql` - Verifies everything is working

## Verification Checklist

- [ ] Database schema is correct
- [ ] RLS policies are disabled
- [ ] `generate_company_code()` function exists
- [ ] Company registration works
- [ ] Individual registration works
- [ ] Login works
- [ ] Dashboard loads correctly

## Next Steps

1. Run the database scripts in order
2. Test with the debug tools
3. Test in the actual application
4. Verify complete flow works end-to-end

## Support

If issues persist:
1. Check browser console for errors
2. Check Supabase logs for database errors
3. Use the debug tools to isolate the problem
4. Verify environment variables are correct
