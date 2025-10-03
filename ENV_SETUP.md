# Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Example:
# VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Anthropic Claude API (for AI campaign generation)
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

## How to get Supabase credentials:

1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy the "Project URL" and "anon public" key
4. Paste them into your `.env` file

## How to get Anthropic API key:

1. Go to https://console.anthropic.com/
2. Navigate to API Keys
3. Create a new API key
4. Paste it into your `.env` file

