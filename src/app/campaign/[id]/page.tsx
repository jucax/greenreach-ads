import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DashboardNavbar } from '../../../components/layout/DashboardNavbar';

// Mock campaign data
const campaignData: Record<string, any> = {
  '1': {
    name: 'Summer Sale 2024',
    status: 'Active',
    dateCreated: 'September 28, 2024',
    objective: 'Increase Sales',
    budget: 500,
    spent: 230,
    startDate: 'October 1, 2024',
    endDate: 'October 31, 2024',
    platforms: ['Instagram', 'Facebook', 'Google'],
    reach: 45234,
    impressions: 128450,
    clicks: 3847,
    conversions: 234,
    ctr: '3.0%',
    ageRange: '25-40',
    interests: ['Shopping', 'Fashion', 'Lifestyle'],
    geographic: 'United States (Urban areas)',
    demographics: 'Urban professionals, 60% female',
    adVariations: [
      {
        headline: 'Summer Sale: Up to 50% Off!',
        body: 'Beat the heat with our hottest deals of the season. Limited time only!',
        cta: 'Shop Now',
      },
      {
        headline: 'Cool Down Your Summer Spending',
        body: 'Massive savings on everything you need for summer. Don\'t miss out!',
        cta: 'Browse Deals',
      },
    ],
    energyConsumed: '12 kWh',
    co2Emissions: '6 kg',
    greenScore: 'A-',
    traditionalEnergy: '30 kWh',
    platformBreakdown: [
      { name: 'Instagram', spent: 200, reach: 18500 },
      { name: 'Facebook', spent: 175, reach: 15200 },
      { name: 'Google', spent: 125, reach: 11534 },
    ],
  },
  '2': {
    name: 'Product Launch',
    status: 'Active',
    dateCreated: 'September 25, 2024',
    objective: 'Build Brand Awareness',
    budget: 200,
    spent: 89,
    startDate: 'September 26, 2024',
    endDate: 'October 10, 2024',
    platforms: ['Instagram', 'Google'],
    reach: 12430,
    impressions: 45230,
    clicks: 1205,
    conversions: 78,
    ctr: '2.7%',
    ageRange: '20-35',
    interests: ['Technology', 'Innovation', 'Early Adopters'],
    geographic: 'United States, Canada',
    demographics: 'Tech-savvy millennials, 55% male',
    adVariations: [
      {
        headline: 'Introducing Our Latest Innovation',
        body: 'Revolutionary features that change everything. Be the first to experience it.',
        cta: 'Learn More',
      },
    ],
    energyConsumed: '8 kWh',
    co2Emissions: '4 kg',
    greenScore: 'B+',
    traditionalEnergy: '20 kWh',
    platformBreakdown: [
      { name: 'Instagram', spent: 80, reach: 8200 },
      { name: 'Google', spent: 120, reach: 4230 },
    ],
  },
  '3': {
    name: 'Back to School',
    status: 'Completed',
    dateCreated: 'September 15, 2024',
    objective: 'Increase Sales',
    budget: 800,
    spent: 800,
    startDate: 'August 15, 2024',
    endDate: 'September 15, 2024',
    platforms: ['Facebook', 'TikTok', 'Google'],
    reach: 67890,
    impressions: 245600,
    clicks: 8920,
    conversions: 567,
    ctr: '3.6%',
    ageRange: '18-45',
    interests: ['Education', 'Parenting', 'Students'],
    geographic: 'United States',
    demographics: 'Parents and students, 65% female',
    adVariations: [
      {
        headline: 'Back to School Essentials',
        body: 'Everything you need for a successful school year. Shop the best deals now!',
        cta: 'Shop Now',
      },
      {
        headline: 'Start the Year Right',
        body: 'Premium quality supplies at unbeatable prices. Perfect for students and parents.',
        cta: 'Browse Collection',
      },
    ],
    energyConsumed: '22 kWh',
    co2Emissions: '11 kg',
    greenScore: 'A',
    traditionalEnergy: '55 kWh',
    platformBreakdown: [
      { name: 'Facebook', spent: 320, reach: 28900 },
      { name: 'TikTok', spent: 280, reach: 25100 },
      { name: 'Google', spent: 200, reach: 13890 },
    ],
  },
  '4': {
    name: 'Winter Clearance',
    status: 'Completed',
    dateCreated: 'October 1, 2024',
    objective: 'Increase Sales',
    budget: 150,
    spent: 150,
    startDate: 'October 5, 2024',
    endDate: 'October 12, 2024',
    platforms: ['Facebook'],
    reach: 3240,
    impressions: 8920,
    clicks: 134,
    conversions: 8,
    ctr: '1.5%',
    ageRange: '35-65',
    interests: ['Shopping', 'Bargains'],
    geographic: 'United States (Rural areas)',
    demographics: 'Budget-conscious shoppers, 70% female',
    adVariations: [
      {
        headline: 'Winter Clearance Sale',
        body: 'Clear out winter inventory with huge discounts.',
        cta: 'Shop Sale',
      },
    ],
    energyConsumed: '18 kWh',
    co2Emissions: '9 kg',
    greenScore: 'D',
    traditionalEnergy: '25 kWh',
    platformBreakdown: [
      { name: 'Facebook', spent: 150, reach: 3240 },
    ],
  },
};

export const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const campaign = id ? campaignData[id] : null;

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Campaign Not Found</h2>
            <p className="text-slate-600 mb-6">The campaign you're looking for doesn't exist.</p>
            <Link to="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const progressPercentage = (campaign.spent / campaign.budget) * 100;

  const getGreenScoreColor = (score: string): string => {
    if (score.startsWith('A')) return 'bg-emerald-500 text-white';
    if (score.startsWith('B')) return 'bg-blue-500 text-white';
    if (score.startsWith('C')) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-slate-900">{campaign.name}</h1>
            <span className={`px-3 py-1 rounded text-sm font-medium ${
              campaign.status === 'Active' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {campaign.status}
            </span>
          </div>
          <p className="text-slate-600">Created on {campaign.dateCreated}</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - 60% */}
          <div className="lg:col-span-7 space-y-6">
            {/* Campaign Overview */}
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-lg mb-4">Campaign Overview</CardTitle>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-slate-600">Objective:</span>
                    <div className="font-medium text-slate-900">{campaign.objective}</div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-slate-600">Budget:</span>
                    <div className="font-medium text-slate-900 mb-2">
                      ${campaign.spent} / ${campaign.budget}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-slate-600">Duration:</span>
                    <div className="font-medium text-slate-900">
                      {campaign.startDate} - {campaign.endDate}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-slate-600">Platforms:</span>
                    <div className="flex gap-2 mt-1">
                      {campaign.platforms.map((platform: string) => (
                        <span key={platform} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-lg mb-4">Performance Metrics</CardTitle>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-slate-600">Total Reach</span>
                    <div className="text-2xl font-bold text-slate-900">{campaign.reach.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Impressions</span>
                    <div className="text-2xl font-bold text-slate-900">{campaign.impressions.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Clicks</span>
                    <div className="text-2xl font-bold text-slate-900">{campaign.clicks.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Conversions</span>
                    <div className="text-2xl font-bold text-slate-900">{campaign.conversions}</div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">CTR</span>
                    <div className="text-2xl font-bold text-emerald-600">{campaign.ctr}</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Target Audience */}
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-lg mb-4">Target Audience</CardTitle>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-slate-600">Age Range:</span>
                    <div className="font-medium text-slate-900">{campaign.ageRange}</div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Interests:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {campaign.interests.map((interest: string) => (
                        <span key={interest} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Geographic Focus:</span>
                    <div className="font-medium text-slate-900">{campaign.geographic}</div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Demographics:</span>
                    <div className="font-medium text-slate-900">{campaign.demographics}</div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Right Column - 40% */}
          <div className="lg:col-span-5 space-y-6">
            {/* Ad Creatives */}
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-lg mb-4">Ad Creatives Used</CardTitle>
                <div className="space-y-4">
                  {campaign.adVariations.map((ad: any, index: number) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <div className="font-medium text-slate-900 mb-2">{ad.headline}</div>
                      <p className="text-sm text-slate-600 mb-2">{ad.body}</p>
                      <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-sm rounded">
                        {ad.cta}
                      </span>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Sustainability Report */}
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardHeader className="p-6">
                <CardTitle className="text-lg mb-4">Sustainability Report</CardTitle>
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 rounded-full ${getGreenScoreColor(campaign.greenScore)} flex items-center justify-center text-2xl font-bold mx-auto mb-2`}>
                      {campaign.greenScore}
                    </div>
                    <div className="text-sm text-slate-600">Green Score</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Energy Consumed:</span>
                      <span className="font-medium text-slate-900">{campaign.energyConsumed}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">CO₂ Emissions:</span>
                      <span className="font-medium text-slate-900">{campaign.co2Emissions}</span>
                    </div>
                  </div>

                  <div className="border-t border-emerald-200 pt-4">
                    <div className="text-sm text-emerald-700 font-medium mb-2">vs Traditional Approach:</div>
                    <div className="text-sm text-slate-600">
                      Saved <span className="font-bold text-emerald-600">{parseInt(campaign.traditionalEnergy) - parseInt(campaign.energyConsumed)} kWh</span> compared to {campaign.traditionalEnergy} traditional usage
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Platform Breakdown */}
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-lg mb-4">Platform Breakdown</CardTitle>
                <div className="space-y-3">
                  {campaign.platformBreakdown.map((platform: any) => (
                    <div key={platform.name} className="border-l-4 border-emerald-500 pl-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-slate-900">{platform.name}</span>
                        <span className="text-slate-600">${platform.spent}</span>
                      </div>
                      <div className="text-sm text-slate-600">{platform.reach.toLocaleString()} reach</div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex gap-4">
          <Link to="/dashboard" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Back to Dashboard
            </Button>
          </Link>
          <Button variant="ghost" size="lg" className="flex-1" disabled>
            Duplicate Campaign
          </Button>
          <Button variant="ghost" size="lg" className="flex-1" disabled>
            Edit Campaign
          </Button>
        </div>
      </main>
    </div>
  );
};
