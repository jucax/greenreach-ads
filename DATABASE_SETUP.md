# GreenReach Ads - Database Setup Guide

This guide explains how to set up and use the Supabase database for GreenReach Ads.

## Overview

The application supports **two modes**:

1. **Demo Mode** - Uses hardcoded data for quick demonstrations (no database required)
2. **Production Mode** - Uses Supabase database for real user accounts and data

## Database Architecture

### Tables

1. **companies** - Stores organization information
   - Includes company code for team member invites
   - Tracks industry, size, budget, and advertising platforms

2. **users** - Stores individual user profiles
   - Linked to companies via `company_id`
   - Includes `is_company_admin` flag for permissions
   - Includes `is_demo` flag to identify demo accounts

3. **campaigns** - Stores all advertising campaigns
   - Linked to both users and companies
   - Stores AI-generated data as JSONB
   - Tracks performance metrics and sustainability scores

### Views

1. **company_leaderboard** - Ranked companies by sustainability performance (monthly)
2. **employee_leaderboard** - Ranked employees within companies (monthly)

### Functions

1. **generate_company_code()** - Generates unique GR-XXXXXX codes
2. **calculate_sustainability_metrics(budget)** - Calculates energy, CO2, and scores
3. **get_company_rank(company_id)** - Gets company's leaderboard ranking
4. **create_demo_user(user_id, email, name)** - Creates demo user accounts

## Setup Instructions

### Step 1: Run Initial Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `SUPABASE_SCHEMA.sql`
4. Click **Run**

### Step 2: Run Updated Schema

1. In the same SQL Editor
2. Copy and paste the contents of `SUPABASE_SCHEMA_UPDATED.sql`
3. Click **Run**

This adds:
- `is_demo` column to users table
- Demo company (Acme Inc.)
- Demo campaigns
- Updated RLS policies
- Demo user creation function

### Step 3: Configure Environment Variables

1. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_ANTHROPIC_API_KEY=your_claude_api_key_here
```

2. Get your Supabase credentials:
   - Go to **Settings** → **API** in your Supabase dashboard
   - Copy **Project URL** → paste as `VITE_SUPABASE_URL`
   - Copy **anon public** key → paste as `VITE_SUPABASE_ANON_KEY`

### Step 4: Enable Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. (Optional) Configure email templates for sign-up confirmations

## How It Works

### Demo Mode (View Demo Button)

When a user clicks "View Demo" on the landing page:

1. App sets `demoMode = true` in localStorage
2. App uses hardcoded data from the component files
3. No database queries are made
4. Perfect for quick hackathon demos!

**Demo User:**
- Name: John Martinez
- Company: Acme Inc.
- Position: Marketing Manager
- Has 4 sample campaigns

### Production Mode (Login/Register)

When a user logs in or registers:

1. App checks if `demoMode` is false (or not set)
2. Supabase Auth handles authentication
3. User profile is fetched from the database
4. All data (campaigns, leaderboards) comes from Supabase

### Company Registration Flow

1. User fills out company registration form
2. System calls `generateCompanyCode()` to create unique code
3. New company is created in `companies` table
4. User account is created in Supabase Auth
5. User profile is created in `users` table with `is_company_admin = true`
6. User receives company code to share with team

### Individual Registration Flow

1. User enters company code
2. System validates code against `companies` table
3. If valid, user account is created in Supabase Auth
4. User profile is created in `users` table linked to that company
5. User can now access company campaigns and leaderboards

### Campaign Creation Flow

1. User fills out campaign form
2. App calls Claude API to generate campaign variations
3. System calls `calculateSustainabilityMetrics(budget)`
4. Campaign is saved to `campaigns` table with:
   - User ID and Company ID
   - Product information
   - AI-generated content (JSONB)
   - Sustainability metrics
5. Campaign appears in company dashboard

## Data Models

### Campaign JSONB Fields

```typescript
target_audience: {
  ageRange: string;
  interests: string[];
  demographics: string;
  incomeLevel: string;
}

geographic_targeting: {
  primary: string;
  cities: string[];
}

posting_schedule: {
  bestDays: string[];
  bestTimes: string[];
  reasoning: string;
}

platform_allocation: Array<{
  name: string;
  budget: number;
  percentage: number;
  reasoning: string;
}>

ad_variations: Array<{
  name: string;
  targetSegment: string;
  headline: string;
  body: string;
  cta: string;
  whyItWorks: string;
}>
```

## Row Level Security (RLS)

All tables have RLS enabled:

### Companies
- Users can view their own company
- Company admins can update their company

### Users
- Users can view other users in their company
- Users can update their own profile

### Campaigns
- Users can view campaigns from their company
- Users can create/update/delete their own campaigns

### Demo Accounts
- Demo users (where `is_demo = true`) can view all data
- Useful for hackathon demos and testing

## Leaderboards

### Company Leaderboard
- Shows top 50 companies by `total_energy_saved`
- Updates monthly (resets on 1st of each month)
- Includes average green score

### Employee Leaderboard
- Shows top 50 employees within a company
- Updates monthly
- Filtered by `company_id`

## Testing

### Test Demo Mode

1. Click "View Demo" on landing page
2. Verify hardcoded data appears
3. Create a test campaign
4. Check that data is not saved to database

### Test Production Mode

1. Click "Register Company"
2. Fill out form and create account
3. Save the company code
4. Log out and register as individual using that code
5. Verify both users see the same company data
6. Create a campaign as each user
7. Verify both campaigns appear in dashboard

## Troubleshooting

### "Failed to fetch" errors
- Check that `.env` file exists with correct credentials
- Verify Supabase URL and anon key are correct
- Check browser console for CORS errors

### RLS Policy errors
- Ensure you're authenticated before accessing data
- Check that user profile exists in `users` table
- Verify `company_id` is set correctly

### Leaderboard not updating
- Leaderboards are monthly views
- Only campaigns with `status != 'draft'` count
- Check that campaigns have `energy_used_kwh` values

### Demo mode not working
- Clear localStorage and try again
- Check that hardcoded data exists in components
- Verify `isDemoMode()` returns true

## Future Enhancements

Potential additions for post-hackathon:

1. **Image Upload** - Use Supabase Storage for campaign images
2. **Real-time Updates** - Use Supabase Realtime for live leaderboards
3. **OAuth Integration** - Connect Facebook/Google Ads accounts
4. **Advanced Analytics** - Time-series data for performance tracking
5. **Team Permissions** - Role-based access control (admin, editor, viewer)
6. **Notifications** - Email alerts for campaign milestones
7. **API Integration** - Actually post to social media platforms

## Support

For issues or questions:
1. Check Supabase logs in dashboard
2. Review browser console for errors
3. Check Network tab for failed requests
4. Verify environment variables are set

