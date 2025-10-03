# GreenReach Ads - Implementation Guide

This guide explains how the application handles **Demo Mode** vs **Production Mode** with Supabase.

## Architecture Overview

### Two Operating Modes

1. **Demo Mode** (Quick Hackathon Demos)
   - Activated by clicking "View Demo" button
   - Uses hardcoded data in components
   - No database connection required
   - Perfect for quick presentations

2. **Production Mode** (Real Users)
   - Activated by Login/Register
   - Uses Supabase database
   - Real authentication
   - Persistent data storage

## File Structure

```
src/
├── lib/
│   └── supabase.ts              # Supabase client & helper functions
├── contexts/
│   └── AppContext.tsx           # Global app state (demo vs production)
├── app/
│   ├── page.tsx                 # Landing page
│   ├── dashboard/page.tsx       # Dashboard (supports both modes)
│   ├── campaign/
│   │   ├── create/page.tsx      # Campaign creation
│   │   ├── results/page.tsx     # AI results
│   │   └── success/page.tsx     # Success screen
│   └── register/
│       ├── company/page.tsx     # Company registration
│       └── individual/page.tsx  # Individual registration
└── components/
    ├── layout/DashboardNavbar.tsx
    └── ui/                      # Reusable UI components
```

## Current Implementation Status

### ✅ Completed (Hardcoded Demo Mode)

- [x] Landing page with all sections
- [x] Dashboard with stats, charts, campaigns
- [x] Campaign creation form
- [x] AI results page with carousel
- [x] Campaign success/launch page
- [x] Campaign detail view
- [x] Loading screens and transitions
- [x] Sustainability leaderboard
- [x] Company & Individual registration forms
- [x] All UI components and styling

### 🚧 Ready for Implementation (Production Mode)

The following files have been created and are ready to use:

1. **src/lib/supabase.ts** - All Supabase helper functions
2. **src/contexts/AppContext.tsx** - Context provider for app state
3. **SUPABASE_SCHEMA.sql** - Original database schema
4. **SUPABASE_SCHEMA_UPDATED.sql** - Updated schema with demo support
5. **DATABASE_SETUP.md** - Database setup instructions
6. **ENV_SETUP.md** - Environment variables guide

## Implementation Steps for Production Mode

### Phase 1: Setup Environment (5 minutes)

1. Create `.env` file with Supabase credentials
2. Run SQL schemas in Supabase SQL Editor
3. Test database connection

### Phase 2: Wrap App with Context (2 minutes)

Update `src/main.tsx`:

```tsx
import { AppProvider } from './contexts/AppContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);
```

### Phase 3: Update Dashboard (15 minutes)

Modify `src/app/dashboard/page.tsx`:

```tsx
import { useApp } from '../../contexts/AppContext';
import { getCompanyCampaigns, getCompanyLeaderboard, getEmployeeLeaderboard } from '../../lib/supabase';

export const DashboardPage = () => {
  const { isDemo, currentUser, currentCompany } = useApp();
  const [campaigns, setCampaigns] = useState([]);
  const [companyLeaderboard, setCompanyLeaderboard] = useState([]);
  const [employeeLeaderboard, setEmployeeLeaderboard] = useState([]);

  useEffect(() => {
    if (isDemo) {
      // Use hardcoded data (existing implementation)
      return;
    }

    // Fetch real data from Supabase
    const fetchData = async () => {
      if (currentCompany) {
        const campaignsData = await getCompanyCampaigns(currentCompany.id);
        setCampaigns(campaignsData);

        const companyRankings = await getCompanyLeaderboard();
        setCompanyLeaderboard(companyRankings);

        const employeeRankings = await getEmployeeLeaderboard(currentCompany.id);
        setEmployeeLeaderboard(employeeRankings);
      }
    };

    fetchData();
  }, [isDemo, currentCompany]);

  // Rest of component...
}
```

### Phase 4: Update Login/Register (20 minutes)

Implement Supabase Auth in:
- `src/app/auth/login/page.tsx`
- `src/app/register/company/page.tsx`
- `src/app/register/individual/page.tsx`

### Phase 5: Update Campaign Creation (15 minutes)

Modify `src/app/campaign/create/page.tsx` to save campaigns to Supabase when not in demo mode.

### Phase 6: Update View Demo Button (2 minutes)

Modify landing page to set demo mode:

```tsx
<Link to="/dashboard" onClick={() => setDemoMode(true)}>
  <button>View Demo</button>
</Link>
```

## Quick Reference: Supabase Functions

All available in `src/lib/supabase.ts`:

### Authentication
- `getCurrentUser()` - Get current auth user
- `isDemoMode()` - Check if in demo mode
- `setDemoMode(boolean)` - Set demo mode

### User/Company
- `getUserProfile(userId)` - Get user profile
- `getCompany(companyId)` - Get company details
- `createCompany(data)` - Create new company
- `createUserProfile(data)` - Create user profile
- `verifyCompanyCode(code)` - Validate company code
- `generateCompanyCode()` - Generate unique code

### Campaigns
- `getCompanyCampaigns(companyId)` - Get all company campaigns
- `getUserCampaigns(userId)` - Get user's campaigns
- `createCampaign(data)` - Create new campaign
- `updateCampaign(id, updates)` - Update campaign

### Leaderboards
- `getCompanyLeaderboard()` - Get top companies
- `getEmployeeLeaderboard(companyId)` - Get top employees

### Calculations
- `calculateSustainabilityMetrics(budget)` - Calculate energy, CO2, score

## Demo vs Production Data Flow

### Demo Mode Flow
```
User clicks "View Demo"
  ↓
localStorage.demoMode = true
  ↓
Navigate to /dashboard
  ↓
Dashboard checks isDemoMode()
  ↓
Returns true → Use hardcoded data
  ↓
No database calls made
```

### Production Mode Flow
```
User logs in/registers
  ↓
Supabase Auth creates session
  ↓
AppContext fetches user profile
  ↓
Dashboard checks isDemoMode()
  ↓
Returns false → Fetch from database
  ↓
Display real user data
```

## Testing Checklist

### Demo Mode
- [ ] Click "View Demo" on landing page
- [ ] Dashboard shows hardcoded campaigns
- [ ] Leaderboard shows hardcoded rankings
- [ ] Can create test campaign (not saved)
- [ ] Can view campaign results
- [ ] Can launch campaign (loading screen)
- [ ] Success page shows correct data

### Production Mode
- [ ] Register new company
- [ ] Receive company code
- [ ] Log out
- [ ] Register as individual with code
- [ ] Both users see same company
- [ ] Create campaign as user 1
- [ ] User 2 can see user 1's campaign
- [ ] Leaderboard updates with real data
- [ ] Sustainability scores calculate correctly

## Key Design Decisions

### Why Dual Mode?

1. **Demo Mode** - For hackathon judges and quick demos
   - No setup required
   - Always works perfectly
   - Shows ideal data presentation

2. **Production Mode** - For actual implementation
   - Shows technical capability
   - Demonstrates database integration
   - Proves scalability

### Why JSONB for AI Data?

- Flexible schema for AI-generated content
- Easy to update without migrations
- Fast queries with GIN indexes
- Perfect for hackathon rapid development

### Why Monthly Leaderboards?

- Creates engagement through competition
- Fresh start each month
- Prevents long-term dominance
- Gamification element

## Next Steps (Post-Hackathon)

If you want to fully implement production mode:

1. **Set up environment variables** (`.env` file)
2. **Run database migrations** (SQL scripts)
3. **Wrap app in AppProvider** (`main.tsx`)
4. **Update dashboard to use context** (check `isDemo` flag)
5. **Implement auth pages** (login/register with Supabase)
6. **Add Claude API integration** (campaign generation)
7. **Test both modes** thoroughly

## Estimated Implementation Time

- Demo Mode (Current): ✅ **Complete**
- Production Mode: ~2-3 hours
  - Database setup: 15 min
  - Context integration: 30 min
  - Auth implementation: 45 min
  - Campaign CRUD: 30 min
  - Testing: 30 min

## Support Files

- `SUPABASE_SCHEMA.sql` - Initial database schema
- `SUPABASE_SCHEMA_UPDATED.sql` - Demo mode additions
- `DATABASE_SETUP.md` - Detailed database guide
- `ENV_SETUP.md` - Environment variables
- This file - Implementation overview

---

**Current Status**: Demo mode is fully functional and ready for presentations. Production mode infrastructure is in place and ready to implement when needed.

