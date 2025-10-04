import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { DashboardNavbar } from '../../components/layout/DashboardNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Campaign, CompanyLeaderboard, EmployeeLeaderboard } from '../../lib/supabase';

// Chart data interface
interface EnergyChartData {
  campaign: string;
  energy: number;
}

export const DashboardPage: React.FC = () => {
  const { user, company, loading: authLoading } = useAuth();
  const [leaderboardTab, setLeaderboardTab] = useState<'companies' | 'employees'>('companies');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [companyLeaderboard, setCompanyLeaderboard] = useState<CompanyLeaderboard[]>([]);
  const [employeeLeaderboard, setEmployeeLeaderboard] = useState<EmployeeLeaderboard[]>([]);
  const [energyChartData, setEnergyChartData] = useState<EnergyChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingRef, setLoadingRef] = useState(false); // Prevent multiple simultaneous loads

  console.log('🏠 DashboardPage render:', {
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    company: company ? { id: company.id, name: company.name } : null,
    authLoading,
    loading,
    error
  });

  // Auth check with proper error handling
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading user session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-slate-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-slate-600 mb-4">Please log in to access your dashboard.</p>
          <Link 
            to="/auth/login" 
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-slate-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Company Not Found</h2>
          <p className="text-slate-600 mb-4">Unable to load your company data. Please contact support.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 mr-2"
          >
            Refresh Page
          </button>
          <Link 
            to="/auth/login" 
            className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Load dashboard data
  useEffect(() => {
    console.log('🔄 Dashboard useEffect triggered:', {
      user: !!user,
      company: !!company,
      authLoading,
      loading
    });

    // Only load if we have user and company
    if (user && company) {
      console.log('✅ User and company found, loading dashboard data...');
      loadDashboardData();
    }
  }, [user?.id, company?.id]); // Use IDs to prevent unnecessary re-renders

  // Remove focus event listener to prevent loading loops

  const loadDashboardData = async () => {
    // Prevent multiple simultaneous loads
    if (loadingRef) {
      console.log('🚫 Dashboard already loading, skipping...');
      return;
    }

    // User and company are guaranteed to exist at this point
    console.log('🚀 Starting loadDashboardData...', {
      companyName: company?.name,
      companyId: company?.id,
      userId: user?.id
    });

    try {
      console.log('📊 Loading dashboard data for company:', company.name, 'ID:', company.id);
      setLoadingRef(true);
      setLoading(true);
      setError(null);

      // Load all data in parallel for better performance
      console.log('🔍 Fetching all dashboard data in parallel...');
      
      const [campaignsResult, companyLeaderboardResult, employeeLeaderboardResult] = await Promise.allSettled([
        // Load company campaigns
        supabase
          .from('campaigns')
          .select('*')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false }),
        
        // Load company leaderboard
        supabase
          .from('company_leaderboard')
          .select('*')
          .limit(10),
        
        // Load employee leaderboard for this company
        supabase
          .from('employee_leaderboard')
          .select('*')
          .eq('company_id', company.id)
          .limit(10)
      ]);

      // Process campaigns result
      if (campaignsResult.status === 'fulfilled') {
        const { data: companyCampaigns, error: campaignsError } = campaignsResult.value;
        if (campaignsError) {
          console.error('❌ Error loading campaigns:', campaignsError);
          setCampaigns([]);
        } else {
          console.log('✅ Loaded campaigns:', companyCampaigns?.length || 0);
          console.log('📊 Campaign data structure:', companyCampaigns?.map(c => ({
            id: c?.id,
            name: c?.name,
            energy_used_kwh: c?.energy_used_kwh,
            co2_avoided_kg: c?.co2_avoided_kg,
            actual_reach: c?.actual_reach,
            green_score: c?.green_score,
            hasAllRequiredFields: !!(c?.energy_used_kwh && c?.co2_avoided_kg && c?.actual_reach)
          })));
          
          setCampaigns(companyCampaigns || []);
          
          // Generate energy chart data from campaigns
          if (companyCampaigns && companyCampaigns.length > 0) {
            const chartData = companyCampaigns.slice(0, 7).map((campaign, index) => ({
              campaign: `Campaign ${index + 1}`,
              energy: campaign?.energy_used_kwh || 0
            }));
            console.log('📊 Generated chart data:', chartData);
            setEnergyChartData(chartData);
          } else {
            console.log('📊 No campaigns found, using empty chart data');
            setEnergyChartData([]);
          }
        }
      } else {
        console.error('❌ Failed to load campaigns:', campaignsResult.reason);
        setCampaigns([]);
      }

      // Process company leaderboard result
      if (companyLeaderboardResult.status === 'fulfilled') {
        const { data: companyLeaderboardData, error: companyLeaderboardError } = companyLeaderboardResult.value;
        if (companyLeaderboardError) {
          console.error('❌ Error loading company leaderboard:', companyLeaderboardError);
          setCompanyLeaderboard([]);
        } else {
          console.log('✅ Loaded company leaderboard:', companyLeaderboardData?.length || 0);
          console.log('📊 Company leaderboard data structure:', companyLeaderboardData?.map(c => ({
            id: c?.id,
            name: c?.name,
            total_campaigns: c?.total_campaigns,
            total_energy_saved: c?.total_energy_saved,
            most_common_score: c?.most_common_score,
            hasAllRequiredFields: !!(c?.name && c?.total_campaigns && c?.total_energy_saved)
          })));
          setCompanyLeaderboard(companyLeaderboardData || []);
        }
      } else {
        console.error('❌ Failed to load company leaderboard:', companyLeaderboardResult.reason);
        setCompanyLeaderboard([]);
      }

      // Process employee leaderboard result
      if (employeeLeaderboardResult.status === 'fulfilled') {
        const { data: employeeLeaderboardData, error: employeeLeaderboardError } = employeeLeaderboardResult.value;
        if (employeeLeaderboardError) {
          console.error('❌ Error loading employee leaderboard:', employeeLeaderboardError);
          setEmployeeLeaderboard([]);
        } else {
          console.log('✅ Loaded employee leaderboard:', employeeLeaderboardData?.length || 0);
          console.log('📊 Employee leaderboard data structure:', employeeLeaderboardData?.map(e => ({
            id: e?.id,
            name: e?.name,
            total_campaigns: e?.total_campaigns,
            total_energy_saved: e?.total_energy_saved,
            hasAllRequiredFields: !!(e?.name && e?.total_campaigns && e?.total_energy_saved)
          })));
          setEmployeeLeaderboard(employeeLeaderboardData || []);
        }
      } else {
        console.error('❌ Failed to load employee leaderboard:', employeeLeaderboardResult.reason);
        setEmployeeLeaderboard([]);
      }

    } catch (error) {
      console.error('💥 Error loading dashboard data:', error);
      console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      setError('Failed to load dashboard data. Please try refreshing the page.');
    } finally {
      console.log('✅ Dashboard data loading completed, setting loading to false');
      setLoadingRef(false);
      setLoading(false);
    }
  };

  const getGreenScoreColor = (score: string): string => {
    if (score.startsWith('A')) return 'bg-emerald-100 text-emerald-700';
    if (score.startsWith('B')) return 'bg-blue-100 text-blue-700';
    if (score.startsWith('C')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getTrophyIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  // Calculate stats from campaigns with proper error handling
  console.log('📊 Calculating dashboard stats from campaigns:', {
    campaignsLength: campaigns?.length || 0,
    campaigns: campaigns?.map(c => ({
      id: c.id,
      name: c.name,
      actual_reach: c.actual_reach,
      energy_used_kwh: c.energy_used_kwh,
      co2_avoided_kg: c.co2_avoided_kg,
      green_score: c.green_score
    }))
  });

  const totalCampaigns = campaigns?.length || 0;
  const totalReach = campaigns?.reduce((sum, campaign) => {
    const reach = campaign?.actual_reach || 0;
    console.log('📊 Campaign reach calculation:', { campaignId: campaign?.id, reach, sum });
    return sum + reach;
  }, 0) || 0;
  
  const totalEnergySaved = campaigns?.reduce((sum, campaign) => {
    const energy = campaign?.energy_used_kwh || 0;
    console.log('📊 Campaign energy calculation:', { campaignId: campaign?.id, energy, sum });
    return sum + energy;
  }, 0) || 0;
  
  const totalCO2Avoided = campaigns?.reduce((sum, campaign) => {
    const co2 = campaign?.co2_avoided_kg || 0;
    console.log('📊 Campaign CO2 calculation:', { campaignId: campaign?.id, co2, sum });
    return sum + co2;
  }, 0) || 0;
  
  // Calculate average green score with proper error handling
  const scores = campaigns?.map(c => c?.green_score).filter(Boolean) || [];
  console.log('📊 Green scores found:', scores);
  
  const scoreValues = scores.map(score => {
    switch (score) {
      case 'A+': return 10; case 'A': return 9; case 'A-': return 8;
      case 'B+': return 7; case 'B': return 6; case 'B-': return 5;
      case 'C+': return 4; case 'C': return 3; case 'C-': return 2;
      case 'D': return 1; default: return 3;
    }
  });
  const avgScoreValue = scoreValues.length > 0 ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : 3;
  const avgGreenScore = avgScoreValue >= 9 ? 'A' : avgScoreValue >= 8 ? 'A-' : avgScoreValue >= 7 ? 'B+' : avgScoreValue >= 6 ? 'B' : 'C';

  // Calculate industry comparison percentage
  const calculateIndustryComparison = () => {
    if (totalCampaigns === 0) {
      return null; // No comparison possible with 0 campaigns
    }
    
    // Industry average is typically around 3.5 (C+ to B- range)
    const industryAverage = 3.5;
    const improvement = ((avgScoreValue - industryAverage) / industryAverage) * 100;
    return Math.round(improvement);
  };

  const industryComparison = calculateIndustryComparison();

  console.log('📊 Dashboard stats calculated:', {
    totalCampaigns,
    totalReach,
    totalEnergySaved,
    totalCO2Avoided,
    avgGreenScore,
    avgScoreValue,
    industryComparison
  });

  // Show loading state for dashboard data
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardNavbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading dashboard...</p>
            <p className="text-sm text-slate-500 mt-2">Fetching your latest campaign data</p>
            <button 
              onClick={() => {
                console.log('🔄 Manual refresh triggered');
                setLoadingRef(false);
                setLoading(false);
                setError(null);
                setTimeout(() => loadDashboardData(), 100);
              }}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Refresh Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show error state for dashboard data
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Dashboard Error</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 mr-2"
            >
              Refresh Page
            </button>
            <Link 
              to="/auth/login" 
              className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Add error boundary logging
  console.log('🎯 Dashboard render state:', {
    loading,
    error,
    user: !!user,
    company: !!company,
    campaignsLength: campaigns?.length || 0,
    companyLeaderboardLength: companyLeaderboard?.length || 0,
    employeeLeaderboardLength: employeeLeaderboard?.length || 0,
    totalEnergySaved,
    totalCO2Avoided,
    totalReach
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, {user.name.split(' ')[0]}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-50">
            <CardHeader className="p-6">
              <div className="text-sm text-slate-600 mb-1">Total Campaigns</div>
              <div className="text-3xl font-bold text-slate-900">{totalCampaigns}</div>
            </CardHeader>
          </Card>

          <Card className="bg-slate-50">
            <CardHeader className="p-6">
              <div className="text-sm text-slate-600 mb-1">Total Reach</div>
              <div className="text-3xl font-bold text-slate-900">
                {totalReach >= 1000000 
                  ? `${(totalReach / 1000000).toFixed(1)}M` 
                  : totalReach >= 1000 
                    ? `${(totalReach / 1000).toFixed(1)}K` 
                    : totalReach.toLocaleString()
                }
              </div>
              <div className="text-xs text-slate-500">impressions</div>
            </CardHeader>
          </Card>

          <Card className="bg-slate-50">
            <CardHeader className="p-6">
              <div className="text-sm text-slate-600 mb-1">Energy Saved</div>
              <div className="text-3xl font-bold text-emerald-600">{(totalEnergySaved || 0).toFixed(0)}</div>
              <div className="text-xs text-slate-500">kWh</div>
            </CardHeader>
          </Card>

          <Card className="bg-slate-50">
            <CardHeader className="p-6">
              <div className="text-sm text-slate-600 mb-1">CO₂ Avoided</div>
              <div className="text-3xl font-bold text-emerald-600">{(totalCO2Avoided || 0).toFixed(0)}</div>
              <div className="text-xs text-slate-500">kg</div>
            </CardHeader>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - 65% */}
          <div className="lg:col-span-8 space-y-8">
            {/* Energy Savings Chart */}
            <Card>
              <CardHeader className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Energy Savings Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={energyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="campaign" 
                      stroke="#64748b" 
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      style={{ fontSize: '12px' }}
                      label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '12px',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardHeader>
            </Card>

            {/* Campaigns Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Recent Campaigns</h2>
                <Link to="/campaign/create">
                  <Button variant="default" size="md">
                    + New Campaign
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {campaigns.length === 0 ? (
                  <Card>
                    <CardHeader className="p-8 text-center">
                      <div className="text-slate-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No campaigns yet</h3>
                      <p className="text-slate-500 mb-6">Start creating sustainable campaigns for {company.name}</p>
                      <Link to="/campaign/create">
                        <Button variant="default" size="md">
                          Create your first campaign
                        </Button>
                      </Link>
                    </CardHeader>
                  </Card>
                ) : (
                  campaigns.map((campaign) => (
                    <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-slate-900">{campaign.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${
                            campaign.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : campaign.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : campaign.status === 'paused'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {campaign.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">Reach:</span>
                            <div className="font-medium text-slate-900">
                              {campaign.actual_reach 
                                ? (campaign.actual_reach >= 1000000 
                                    ? `${(campaign.actual_reach / 1000000).toFixed(1)}M` 
                                    : campaign.actual_reach >= 1000 
                                      ? `${(campaign.actual_reach / 1000).toFixed(1)}K` 
                                      : campaign.actual_reach.toLocaleString())
                                : '0'
                              }
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-600">Budget:</span>
                            <div className="font-medium text-slate-900">
                              ${campaign.actual_spend || 0} / ${campaign.budget}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-600">Green Score:</span>
                            <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getGreenScoreColor(campaign.green_score)}`}>
                              {campaign.green_score}
                            </div>
                          </div>
                        </div>

                        <Link to={`/campaign/details/${campaign.id}`}>
                          <button className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                            View →
                          </button>
                        </Link>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - 35% */}
          <div className="lg:col-span-4 space-y-8">
            {/* Sustainability Score Card */}
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardHeader className="p-8">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Sustainability Score</h2>
                  
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {avgGreenScore}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-slate-700">
                      Based on <span className="font-semibold">{totalCampaigns} campaigns</span>
                    </p>
                    {industryComparison !== null ? (
                      <p className={`font-semibold text-lg ${
                        industryComparison >= 0 ? 'text-emerald-600' : 'text-orange-600'
                      }`}>
                        {industryComparison >= 0 ? '+' : ''}{industryComparison}% vs industry average
                      </p>
                    ) : (
                      <p className="text-slate-500 font-medium text-lg">
                        Create campaigns to see comparison
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-4">
                      {totalCampaigns > 0 
                        ? 'Score calculated based on energy efficiency, targeting precision, and sustainable practices across all your campaigns.'
                        : 'Start creating sustainable campaigns to build your sustainability score and compare with industry standards.'
                      }
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Leaderboard Card */}
            <Card>
              <CardHeader className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Sustainability Leaderboard</h2>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 mb-4 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setLeaderboardTab('companies')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      leaderboardTab === 'companies'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Companies
                  </button>
                  <button
                    onClick={() => setLeaderboardTab('employees')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      leaderboardTab === 'employees'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Employees
                  </button>
                </div>

                <p className="text-xs text-slate-500 mb-4">Top Performers - October 2024</p>

                {/* Leaderboard Content */}
                <div className="max-h-96 overflow-y-auto">
                  {leaderboardTab === 'companies' ? (
                    <div className="space-y-2">
                      {companyLeaderboard.length === 0 ? (
                        <div className="text-center py-4 text-slate-500">
                          <p>No leaderboard data available</p>
                        </div>
                      ) : (
                        companyLeaderboard.map((company, index) => (
                          <div
                            key={company.id}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-sm font-bold text-slate-500 w-6">
                                {getTrophyIcon(index + 1) || `#${index + 1}`}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-900 truncate">
                                  {company.name}
                                </div>
                                <div className="text-xs text-slate-500">{(company?.total_energy_saved || 0).toFixed(0)} kWh saved</div>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded font-semibold ${getGreenScoreColor(company.most_common_score)}`}>
                              {company.most_common_score}
                            </span>
                          </div>
                        ))
                      )}
                      
                      {/* User's Company */}
                      <div className="border-t-2 border-slate-200 pt-2 mt-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-sm font-bold text-emerald-600 w-6">#47</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900">
                                {company.name}
                              </div>
                              <div className="text-xs text-slate-600">{(totalEnergySaved || 0).toFixed(0)} kWh saved</div>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 rounded font-semibold bg-blue-100 text-blue-700">
                            {avgGreenScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {employeeLeaderboard.length === 0 ? (
                        <div className="text-center py-4 text-slate-500">
                          <p>No employee leaderboard data available</p>
                        </div>
                      ) : (
                        employeeLeaderboard.map((employee, index) => (
                          <div
                            key={employee.id}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                              employee.id === user.id
                                ? 'bg-emerald-50 border border-emerald-200'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span className={`text-sm font-bold w-6 ${
                                employee.id === user.id ? 'text-emerald-600' : 'text-slate-500'
                              }`}>
                                {getTrophyIcon(index + 1) || `#${index + 1}`}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-900 truncate">
                                  {employee.id === user.id ? 'You' : employee.name}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {employee?.total_campaigns || 0} campaigns • {(employee?.total_energy_saved || 0).toFixed(0)} kWh saved
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Reset Indicator */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-center text-slate-500">
                    Resets in 28 days
                  </p>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};