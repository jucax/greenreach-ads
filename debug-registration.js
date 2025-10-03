// Debug script to test Supabase connection and registration flow
// Run this in browser console to debug registration issues

console.log('🔍 Starting GreenReach Ads Registration Debug...');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'Present' : 'MISSING');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'MISSING');

// Test Supabase client
async function testSupabaseConnection() {
  try {
    console.log('\n🔧 Testing Supabase Connection...');
    
    // Import supabase client
    const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase credentials');
      return false;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Supabase connection error:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    console.log('Current session:', data.session ? 'Active' : 'None');
    
    // Test database access
    console.log('\n🗄️ Testing Database Access...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, company_code')
      .limit(3);
    
    if (companiesError) {
      console.error('❌ Database access error:', companiesError);
      return false;
    }
    
    console.log('✅ Database access successful');
    console.log('Sample companies:', companies);
    
    // Test RPC function
    console.log('\n⚡ Testing RPC Functions...');
    const { data: generatedCode, error: rpcError } = await supabase.rpc('generate_company_code');
    
    if (rpcError) {
      console.error('❌ RPC function error:', rpcError);
      return false;
    }
    
    console.log('✅ RPC function successful');
    console.log('Generated code:', generatedCode);
    
    return true;
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return false;
  }
}

// Test company registration flow
async function testCompanyRegistration() {
  try {
    console.log('\n🏢 Testing Company Registration Flow...');
    
    const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    
    // Test data
    const testCompany = {
      name: 'Test Company Debug',
      industry: 'Technology',
      size: '11-50',
      website: 'https://test.com',
      has_ad_experience: true,
      current_platforms: ['Google Ads'],
      company_code: 'GR-TEST1'
    };
    
    const testUser = {
      email: 'test@debug.com',
      password: 'TestPassword123!',
      fullName: 'Test User',
      position: 'Test Position'
    };
    
    // Step 1: Generate company code
    console.log('1️⃣ Testing company code generation...');
    const { data: code, error: codeError } = await supabase.rpc('generate_company_code');
    
    if (codeError) {
      console.error('❌ Company code generation failed:', codeError);
      return false;
    }
    
    console.log('✅ Company code generated:', code);
    
    // Step 2: Create company
    console.log('2️⃣ Testing company creation...');
    const companyData = { ...testCompany, company_code: code };
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert(companyData)
      .select()
      .single();
    
    if (companyError) {
      console.error('❌ Company creation failed:', companyError);
      return false;
    }
    
    console.log('✅ Company created:', company);
    
    // Step 3: Create user account
    console.log('3️⃣ Testing user account creation...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          name: testUser.fullName,
          position: testUser.position
        }
      }
    });
    
    if (authError) {
      console.error('❌ User account creation failed:', authError);
      return false;
    }
    
    console.log('✅ User account created:', authData.user?.id);
    
    // Step 4: Create user profile
    console.log('4️⃣ Testing user profile creation...');
    const userProfileData = {
      id: authData.user?.id,
      email: testUser.email,
      name: testUser.fullName,
      position: testUser.position,
      company_id: company.id,
      is_company_admin: true
    };
    
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert(userProfileData)
      .select()
      .single();
    
    if (profileError) {
      console.error('❌ User profile creation failed:', profileError);
      return false;
    }
    
    console.log('✅ User profile created:', userProfile);
    
    // Cleanup test data
    console.log('🧹 Cleaning up test data...');
    await supabase.from('users').delete().eq('id', authData.user?.id);
    await supabase.from('companies').delete().eq('id', company.id);
    
    console.log('✅ Company registration flow test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('💥 Company registration test failed:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running all debug tests...\n');
  
  const connectionTest = await testSupabaseConnection();
  if (!connectionTest) {
    console.error('❌ Connection test failed. Stopping here.');
    return;
  }
  
  const registrationTest = await testCompanyRegistration();
  if (!registrationTest) {
    console.error('❌ Registration test failed.');
    return;
  }
  
  console.log('\n🎉 All tests passed! Registration should be working.');
}

// Export for manual testing
window.debugGreenReach = {
  testConnection: testSupabaseConnection,
  testRegistration: testCompanyRegistration,
  runAllTests: runAllTests
};

console.log('📝 Debug functions available:');
console.log('- debugGreenReach.testConnection()');
console.log('- debugGreenReach.testRegistration()');
console.log('- debugGreenReach.runAllTests()');
console.log('\n🔍 Run debugGreenReach.runAllTests() to start debugging...');
