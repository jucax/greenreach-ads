# GreenReach Ads - Registration Fix Guide

## Issues Identified

After analyzing the codebase, I found several critical issues preventing registration from working:

### 1. **Database Schema Mismatch** ❌
- The `users` table still has `password_hash` column (from old schema)
- Registration code uses Supabase Auth and tries to insert `auth.uid()` into `users.id`
- Missing `profile_picture_url` column in users table
- Missing `logo_url` column in companies table

### 2. **RLS (Row Level Security) Issues** ❌
- RLS policies are blocking registration
- Policies reference `auth.uid()` but users table structure doesn't match

### 3. **Missing Database Functions** ❌
- `generate_company_code()` function may be missing
- `calculate_sustainability_metrics()` function may be missing

## Fix Steps

### Step 1: Run Database Schema Fix
Execute this SQL script in Supabase SQL Editor:
```sql
-- File: fix-registration-schema.sql
```

This script will:
- Drop and recreate the `users` table with correct schema
- Add missing columns (`profile_picture_url`, `logo_url`)
- Disable RLS for development
- Create necessary indexes
- Verify the schema

### Step 2: Run Missing Functions Fix
Execute this SQL script in Supabase SQL Editor:
```sql
-- File: fix-missing-functions.sql
```

This script will:
- Create `generate_company_code()` function
- Create `calculate_sustainability_metrics()` function
- Grant necessary permissions

### Step 3: Run Storage Setup
Execute this SQL script in Supabase SQL Editor:
```sql
-- File: setup-image-storage.sql
```

This script will:
- Create storage buckets for images
- Set up storage policies
- Add image-related columns to tables

### Step 4: Test Registration
1. Open the registration page in your browser
2. Open browser console (F12)
3. Run the test script: `test-registration.js`
4. Check for any errors

## Expected Registration Flow

### Company Registration:
1. User fills out company and user forms
2. System generates company code using `generate_company_code()`
3. Creates company record in `companies` table
4. Creates user account in Supabase Auth
5. Creates user profile in `users` table with `is_company_admin = true`
6. Uploads logo and profile picture to storage
7. Redirects to dashboard

### Individual Registration:
1. User validates company code
2. System finds company by code and stores company ID
3. Creates user account in Supabase Auth
4. Creates user profile in `users` table with `is_company_admin = false`
5. Uploads profile picture to storage
6. Redirects to dashboard

## Key Changes Made

### Database Schema:
- Removed `password_hash` from users table
- Added `profile_picture_url` to users table
- Added `logo_url` to companies table
- Made `id` field use Supabase Auth user ID

### RLS Policies:
- Disabled RLS for development
- Removed conflicting policies

### Functions:
- Added `generate_company_code()` function
- Added `calculate_sustainability_metrics()` function

## Testing Checklist

- [ ] Database schema is correct
- [ ] Required functions exist
- [ ] Storage buckets are created
- [ ] RLS is disabled
- [ ] Company registration works
- [ ] Individual registration works
- [ ] Image uploads work
- [ ] Login works after registration
- [ ] Dashboard loads correctly

## Common Issues and Solutions

### Issue: "column 'password_hash' does not exist"
**Solution**: Run `fix-registration-schema.sql` to update the users table

### Issue: "function generate_company_code() does not exist"
**Solution**: Run `fix-missing-functions.sql` to create the function

### Issue: "RLS policy violation"
**Solution**: RLS is disabled in the fix script, but if you re-enable it, update policies to match new schema

### Issue: "storage bucket not found"
**Solution**: Run `setup-image-storage.sql` to create storage buckets

### Issue: "profile_picture_url column does not exist"
**Solution**: The fix script adds this column to the users table

## Next Steps

1. Run the SQL scripts in order
2. Test registration with the test script
3. Test in the actual application
4. Verify complete flow works end-to-end
5. Re-enable RLS with proper policies if needed for production

## Files Created

- `fix-registration-schema.sql` - Fixes database schema
- `test-registration.js` - Tests registration functionality
- `REGISTRATION_FIX_GUIDE.md` - This guide

## Support

If issues persist:
1. Check browser console for errors
2. Check Supabase logs for database errors
3. Verify all SQL scripts ran successfully
4. Test with the provided test script
