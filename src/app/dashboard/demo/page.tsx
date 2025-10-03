import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader } from '../../../components/ui/Card';
import { DashboardNavbar } from '../../../components/layout/DashboardNavbar';

// Sample user data
const currentUser = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@ecotech.com',
  position: 'Marketing Director',
  companyName: 'EcoTech Solutions',
};

// Sample campaigns data
const campaigns = [
  {
    id: 1,
    name: 'Green Energy Campaign',
    status: 'Active',
    reach: '45,234',
    spent: '$230 / $500',
    greenScore: 'A-',
  },
  {
    id: 2,
    name: 'Sustainable Products Launch',
    status: 'Active',
    reach: '12,430',
    spent: '$89 / $200',
    greenScore: 'B+',
  },
  {
    id: 3,
    name: 'Eco Awareness Drive',
    status: 'Completed',
    reach: '67,890',
    spent: '$800 / $800',
    greenScore: 'A',
  },
  {
    id: 4,
    name: 'Carbon Footprint Reduction',
    status: 'Completed',
    reach: '3,240',
    spent: '$150 / $150',
    greenScore: 'D',
  },
];

// Chart data
const energyData = [
  { campaign: 'Campaign 1', energy: 45 },
  { campaign: 'Campaign 2', energy: 52 },
  { campaign: 'Campaign 3', energy: 38 },
  { campaign: 'Campaign 4', energy: 65 },
  { campaign: 'Campaign 5', energy: 48 },
  { campaign: 'Campaign 6', energy: 58 },
  { campaign: 'Campaign 7', energy: 72 },
];

export const DemoDashboardPage: React.FC = () => {
  const [leaderboardTab, setLeaderboardTab] = useState<'companies' | 'employees'>('companies');

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

  const companiesLeaderboard = [
    { rank: 1, name: 'EcoTech Solutions', score: 'A+', kwh: 145 },
    { rank: 2, name: 'GreenStart Co.', score: 'A+', kwh: 132 },
    { rank: 3, name: 'EcoRetail LLC', score: 'A', kwh: 118 },
    { rank: 4, name: 'Digital Solutions', score: 'A', kwh: 95 },
    { rank: 5, name: 'SmartAds Agency', score: 'A-', kwh: 87 },
    { rank: 6, name: 'Future Marketing', score: 'A-', kwh: 76 },
    { rank: 7, name: 'Urban Brands', score: 'B+', kwh: 68 },
    { rank: 8, name: 'Coastal Retail', score: 'B+', kwh: 54 },
    { rank: 9, name: 'Metro Advertising', score: 'B', kwh: 47 },
    { rank: 10, name: 'City Commerce', score: 'B', kwh: 41 },
  ];

  const employeesLeaderboard = [
    { rank: 1, name: 'Sarah Chen', campaigns: 12, kwh: 45 },
    { rank: 2, name: 'Mike Johnson', campaigns: 10, kwh: 38 },
    { rank: 3, name: 'Alex Rivera', campaigns: 9, kwh: 35 },
    { rank: 4, name: 'Emily Watson', campaigns: 8, kwh: 31 },
    { rank: 5, name: 'David Kim', campaigns: 8, kwh: 28 },
    { rank: 6, name: 'Lisa Anderson', campaigns: 7, kwh: 26 },
    { rank: 7, name: 'Tom Martinez', campaigns: 7, kwh: 24 },
    { rank: 8, name: 'Sarah Johnson', campaigns: 6, kwh: 22, isCurrentUser: true },
    { rank: 9, name: 'Rachel Green', campaigns: 6, kwh: 19 },
    { rank: 10, name: 'Chris Brown', campaigns: 5, kwh: 18 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">🎯 Demo Dashboard</h2>
              <p className="text-emerald-100">This is a demonstration of GreenReach Ads with sample data</p>
            </div>
            <Link 
              to="/register/company" 
              className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Navbar */}
      <DashboardNavbar
        userName={currentUser.name}
        userEmail={currentUser.email}
        companyName={currentUser.companyName}
        position={currentUser.position}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, {currentUser.name.split(' ')[0]}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-50">
            <CardHeader className="p-6">
              <div className="text-sm text-slate-600 mb-1">Total Campaigns</div>
              <div className="text-3xl font-bold text-slate-900">12</div>
            </CardHeader>
          </Card>

          <Card className="bg-slate-50">
            <CardHeader className="p-6">
              <div className="text-sm text-slate-600 mb-1">Total Reach</div>
              <div className="text-3xl font-bold text-slate-900">1.2M</div>
              <div className="text-xs text-slate-500">impressions</div>
            </CardHeader>
          </Card>

          <Card className="bg-slate-50">
            <CardHeader className="p-6">
              <div className="text-sm text-slate-600 mb-1">Energy Saved</div>
              <div className="text-3xl font-bold text-emerald-600">320</div>
              <div className="text-xs text-slate-500">kWh</div>
            </CardHeader>
          </Card>

          <Card className="bg-slate-50">
            <CardHeader className="p-6">
              <div className="text-sm text-slate-600 mb-1">CO₂ Avoided</div>
              <div className="text-3xl font-bold text-emerald-600">150</div>
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
                  <LineChart data={energyData}>
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
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">{campaign.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          campaign.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Reach:</span>
                          <div className="font-medium text-slate-900">{campaign.reach}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Budget:</span>
                          <div className="font-medium text-slate-900">{campaign.spent}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Green Score:</span>
                          <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getGreenScoreColor(campaign.greenScore)}`}>
                            {campaign.greenScore}
                          </div>
                        </div>
                      </div>

                      <Link to={`/campaign/${campaign.id}`}>
                        <button className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                          View →
                        </button>
                      </Link>
                    </CardHeader>
                  </Card>
                ))}
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
                      A-
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-slate-700">
                      Based on <span className="font-semibold">12 campaigns</span>
                    </p>
                    <p className="text-emerald-600 font-semibold text-lg">
                      58% better than industry average
                    </p>
                    <p className="text-xs text-slate-500 mt-4">
                      Score calculated based on energy efficiency, targeting precision, and sustainable practices across all your campaigns.
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
                      {companiesLeaderboard.map((company) => (
                        <div
                          key={company.rank}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-sm font-bold text-slate-500 w-6">
                              {getTrophyIcon(company.rank) || `#${company.rank}`}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-900 truncate">
                                {company.name}
                              </div>
                              <div className="text-xs text-slate-500">{company.kwh} kWh saved</div>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded font-semibold ${getGreenScoreColor(company.score)}`}>
                            {company.score}
                          </span>
                        </div>
                      ))}
                      
                      {/* User's Company */}
                      <div className="border-t-2 border-slate-200 pt-2 mt-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-sm font-bold text-emerald-600 w-6">#1</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900">
                                {currentUser.companyName}
                              </div>
                              <div className="text-xs text-slate-600">145 kWh saved</div>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 rounded font-semibold bg-emerald-100 text-emerald-700">
                            A+
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {employeesLeaderboard.map((employee) => (
                        <div
                          key={employee.rank}
                          className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                            employee.isCurrentUser
                              ? 'bg-emerald-50 border border-emerald-200'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className={`text-sm font-bold w-6 ${
                              employee.isCurrentUser ? 'text-emerald-600' : 'text-slate-500'
                            }`}>
                              {getTrophyIcon(employee.rank) || `#${employee.rank}`}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-900 truncate">
                                {employee.isCurrentUser ? 'You' : employee.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {employee.campaigns} campaigns • {employee.kwh} kWh saved
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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