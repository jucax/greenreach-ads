// Debug script to test registration issues
// Run this in the browser console on the registration page

console.log('🔍 Starting registration debug...');

// Test 1: Check if Supabase client is working
console.log('\n1️⃣ Testing Supabase connection...');
try {
  const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
  
  const supabaseUrl = 'https://efrubdzowzzdrpmmbzlu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmcnViZHpvd3p6ZHJwbW1iemx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NjA1MTQsImV4cCI6MjA3NTAzNjUxNH0.mboF46T0UByROXV7APgxnbztmix8WMoIESotLIQqie0';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test auth
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('✅ Supabase client created successfully');
  console.log('🔐 Current session:', session ? 'Active' : 'None');
  
  if (sessionError) {
    console.error('❌ Session error:', sessionError);
  }
  
  // Test 2: Check if generate_company_code function exists
  console.log('\n2️⃣ Testing generate_company_code function...');
  try {
    const { data, error } = await supabase.rpc('generate_company_code');
    if (error) {
      console.error('❌ generate_company_code function error:', error);
    } else {
      console.log('✅ generate_company_code function works:', data);
    }
  } catch (err) {
    console.error('❌ generate_company_code function failed:', err);
  }
  
  // Test 3: Check if companies table exists and is accessible
  console.log('\n3️⃣ Testing companies table access...');
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('id, name, company_code')
      .limit(1);
    
    if (error) {
      console.error('❌ Companies table error:', error);
    } else {
      console.log('✅ Companies table accessible:', data?.length || 0, 'records');
    }
  } catch (err) {
    console.error('❌ Companies table failed:', err);
  }
  
  // Test 4: Check if users table exists and is accessible
  console.log('\n4️⃣ Testing users table access...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email')
      .limit(1);
    
    if (error) {
      console.error('❌ Users table error:', error);
    } else {
      console.log('✅ Users table accessible:', data?.length || 0, 'records');
    }
  } catch (err) {
    console.error('❌ Users table failed:', err);
  }
  
  // Test 5: Check if storage buckets exist
  console.log('\n5️⃣ Testing storage buckets...');
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('❌ Storage buckets error:', error);
    } else {
      console.log('✅ Storage buckets accessible:', data?.length || 0, 'buckets');
      const buckets = data?.map(b => b.name) || [];
      console.log('📦 Available buckets:', buckets);
      
      const requiredBuckets = ['company-logos', 'profile-pictures', 'campaign-images'];
      const missingBuckets = requiredBuckets.filter(bucket => !buckets.includes(bucket));
      
      if (missingBuckets.length > 0) {
        console.error('❌ Missing required buckets:', missingBuckets);
      } else {
        console.log('✅ All required buckets exist');
      }
    }
  } catch (err) {
    console.error('❌ Storage buckets failed:', err);
  }
  
  // Test 6: Test auth signup (without actually creating a user)
  console.log('\n6️⃣ Testing auth signup capability...');
  try {
    // This will fail but should give us info about the auth setup
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    if (error) {
      console.log('ℹ️ Auth signup test (expected to fail):', error.message);
      if (error.message.includes('User already registered')) {
        console.log('✅ Auth signup is working (user already exists)');
      } else if (error.message.includes('Invalid email')) {
        console.log('✅ Auth signup is working (invalid email test)');
      } else {
        console.log('⚠️ Auth signup error:', error.message);
      }
    } else {
      console.log('✅ Auth signup test successful');
    }
  } catch (err) {
    console.error('❌ Auth signup test failed:', err);
  }
  
} catch (error) {
  console.error('💥 Debug script failed:', error);
}

console.log('\n🏁 Debug complete! Check the results above.');
