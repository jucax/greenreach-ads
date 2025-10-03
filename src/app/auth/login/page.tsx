import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader } from '../../../components/ui/Card';
import { supabase } from '../../../lib/supabase';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('🔄 Attempting to sign in with:', email);
      console.log('🔧 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('🔧 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        setError(error.message);
        setLoading(false);
        return;
      }
      
      console.log('✅ Login successful!');
      console.log('User data:', data.user);
      console.log('Session:', data.session);
      console.log('Session expires at:', data.session?.expires_at);

      if (data.user) {
        console.log('✅ User authenticated successfully');
        
        // Check if user exists in users table
        console.log('🔍 Checking if user profile exists in database...');
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('id, name, email, company_id')
          .eq('id', data.user.id)
          .single();
        
        if (profileError || !userProfile) {
          console.error('❌ User profile not found in database:', profileError);
          setError('User profile not found. Please contact support.');
          setLoading(false);
          return;
        }
        
        console.log('✅ User profile found:', userProfile);
        
        // Wait a moment for the session to be fully established
        console.log('⏳ Waiting for session to be established...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the intended destination or default to dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        console.log('🚀 Navigating to:', from);
        navigate(from, { replace: true });
      } else {
        console.error('❌ No user in response');
        setError('Login failed - no user data received');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('💥 Unexpected login error:', error);
      console.error('💥 Error stack:', error.stack);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Log in to your GreenReach Ads account</p>
        </div>

        <Card>
          <CardHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="ml-2 text-sm text-slate-600">Remember me</span>
                </label>
                <Link to="/auth/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                variant="default" 
                size="lg" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Log In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/register/individual" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Join your team
                </Link>
              </p>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

