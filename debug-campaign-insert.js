// Debug script to test campaign database insert
// Run this in browser console on the campaign creation page

console.log('🔧 Campaign Insert Debug Script');
console.log('================================');

// Test data that matches the form structure
const testCampaignData = {
  user_id: 'test-user-id', // This will be replaced with actual user ID
  company_id: 'test-company-id', // This will be replaced with actual company ID
  name: 'Test Campaign',
  product_name: 'Test Product',
  product_description: 'Test product description',
  product_category: 'Electronics',
  budget: 500,
  objective: 'Increase Sales',
  start_date: '2024-01-01',
  end_date: '2024-01-15',
  status: 'draft',
  target_audience: {
    ageRange: '25-45',
    interests: ['Technology', 'Sustainability'],
    demographics: 'Urban professionals',
    incomeLevel: '$50k-$100k'
  },
  geographic_targeting: {
    primary: 'United States',
    cities: ['New York', 'Los Angeles', 'San Francisco']
  },
  posting_schedule: {
    bestDays: ['Monday', 'Wednesday', 'Friday'],
    bestTimes: ['9-11am EST', '7-9pm EST'],
    reasoning: 'Peak engagement hours for target audience'
  },
  platform_allocation: [
    { name: 'Facebook', budget: 200, percentage: 40, reasoning: 'Best for brand awareness' },
    { name: 'Instagram', budget: 150, percentage: 30, reasoning: 'Visual content performs well' },
    { name: 'Google', budget: 150, percentage: 30, reasoning: 'High intent audience' }
  ],
  ad_variations: [
    {
      name: 'Variation 1',
      targetSegment: 'Tech Enthusiasts',
      headline: 'Discover Test Product',
      body: 'Test product description',
      cta: 'Learn More',
      whyItWorks: 'Appeals to tech-savvy audience'
    }
  ],
  image_urls: [],
  selected_image_index: 0,
  actual_reach: 0,
  actual_impressions: 0,
  actual_clicks: 0,
  actual_conversions: 0,
  actual_spend: 0,
  energy_used_kwh: 20,
  co2_avoided_kg: 10,
  green_score: 'B'
};

// Function to test database insert
async function testCampaignInsert() {
  try {
    console.log('🧪 Testing campaign database insert...');
    
    // Get Supabase client
    const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
    
    const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with actual URL
    const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with actual key
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('📊 Supabase client created');
    
    // Test 1: Check if user exists
    console.log('\n1️⃣ Testing user lookup...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, company_id')
      .limit(1);
    
    if (usersError) {
      console.error('❌ User lookup error:', usersError);
      return;
    }
    
    if (!users || users.length === 0) {
      console.error('❌ No users found in database');
      return;
    }
    
    const testUser = users[0];
    console.log('✅ Test user found:', testUser);
    
    // Test 2: Check if company exists
    console.log('\n2️⃣ Testing company lookup...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, company_code')
      .limit(1);
    
    if (companiesError) {
      console.error('❌ Company lookup error:', companiesError);
      return;
    }
    
    if (!companies || companies.length === 0) {
      console.error('❌ No companies found in database');
      return;
    }
    
    const testCompany = companies[0];
    console.log('✅ Test company found:', testCompany);
    
    // Test 3: Test sustainability metrics function
    console.log('\n3️⃣ Testing sustainability metrics function...');
    const { data: metrics, error: metricsError } = await supabase
      .rpc('calculate_sustainability_metrics', { campaign_budget: 500 });
    
    if (metricsError) {
      console.error('❌ Sustainability metrics error:', metricsError);
      console.log('⚠️  Will use fallback calculation');
    } else {
      console.log('✅ Sustainability metrics calculated:', metrics);
    }
    
    // Test 4: Insert campaign with real user/company IDs
    console.log('\n4️⃣ Testing campaign insert...');
    const campaignData = {
      ...testCampaignData,
      user_id: testUser.id,
      company_id: testCompany.id
    };
    
    console.log('📝 Campaign data to insert:', campaignData);
    
    const { data: newCampaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert(campaignData)
      .select()
      .single();
    
    if (campaignError) {
      console.error('❌ Campaign insert error:', campaignError);
      console.error('Error details:', {
        message: campaignError.message,
        details: campaignError.details,
        hint: campaignError.hint,
        code: campaignError.code
      });
    } else {
      console.log('✅ Campaign inserted successfully:', newCampaign);
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Function to check database schema
async function checkDatabaseSchema() {
  try {
    console.log('🔍 Checking database schema...');
    
    const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
    
    const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with actual URL
    const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with actual key
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check campaigns table structure
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .limit(0);
    
    if (campaignsError) {
      console.error('❌ Error checking campaigns table:', campaignsError);
    } else {
      console.log('✅ Campaigns table accessible');
    }
    
    // Check if sustainability function exists
    const { data: functions, error: functionsError } = await supabase
      .rpc('calculate_sustainability_metrics', { campaign_budget: 100 });
    
    if (functionsError) {
      console.error('❌ Sustainability function error:', functionsError);
    } else {
      console.log('✅ Sustainability function works:', functions);
    }
    
  } catch (error) {
    console.error('💥 Schema check error:', error);
  }
}

// Export functions for use
window.testCampaignInsert = testCampaignInsert;
window.checkDatabaseSchema = checkDatabaseSchema;

console.log('📋 Available functions:');
console.log('- testCampaignInsert() - Test full campaign insert flow');
console.log('- checkDatabaseSchema() - Check database schema and functions');
console.log('\n⚠️  Remember to replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY with actual values');
