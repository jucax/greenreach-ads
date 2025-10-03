import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, TrendingUp, Users, DollarSign, Leaf, Zap, Target } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader } from '../../../../components/ui/Card';
import { DashboardNavbar } from '../../../../components/layout/DashboardNavbar';

interface CampaignData {
  formData: {
    productName: string;
    productDescription: string;
    productCategory: string;
    objective: string;
    budget: string;
    startDate: string;
    endDate: string;
  };
  campaignPlan: {
    targetAudience: {
      ageRange: string;
      interests: string[];
      demographics: string;
      incomeLevel: string;
    };
    geographic: {
      primary: string;
      cities: string[];
    };
    schedule: {
      bestDays: string[];
      bestTimes: string[];
      reasoning: string;
    };
    platforms: {
      name: string;
      budget: number;
      percentage: number;
      reasoning: string;
    }[];
    adVariations: {
      name: string;
      targetSegment: string;
      headline: string;
      body: string;
      cta: string;
      whyItWorks: string;
    }[];
  };
  sustainabilityMetrics: {
    energySaved: number;
    co2Reduced: number;
    greenScore: string;
    efficiency: number;
  };
}

export const DemoCampaignSuccessPage: React.FC = () => {
  console.log('🎯 DemoCampaignSuccessPage: Component rendering...');
  
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [predictedMetrics, setPredictedMetrics] = useState<any>(null);
  
  console.log('🎯 DemoCampaignSuccessPage: State initialized', { campaignData, predictedMetrics });

  useEffect(() => {
    // Get campaign data from sessionStorage
    const storedData = sessionStorage.getItem('demoCampaignResults');
    if (!storedData) {
      // Redirect to demo dashboard if no data
      window.location.href = '/demo';
      return;
    }

    const parsedData = JSON.parse(storedData) as CampaignData;
    setCampaignData(parsedData);

    // Generate predicted performance metrics
    const budget = parseFloat(parsedData.formData.budget);
    const predictedReach = Math.round(budget * 50 + Math.random() * 1000);
    const predictedClicks = Math.round(predictedReach * 0.02);
    const predictedConversions = Math.round(predictedClicks * 0.05);
    const predictedCTR = (2.5 + Math.random() * 1.5).toFixed(2);
    const predictedCPC = (budget / predictedClicks).toFixed(2);

    setPredictedMetrics({
      reach: predictedReach,
      clicks: predictedClicks,
      conversions: predictedConversions,
      ctr: predictedCTR,
      cpc: predictedCPC,
      roas: (3.2 + Math.random() * 1.5).toFixed(1)
    });
  }, []);

  if (!campaignData || !predictedMetrics) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading campaign summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">🎯 Demo Campaign Success</h2>
              <p className="text-emerald-100">Your campaign has been launched successfully!</p>
            </div>
            <Link 
              to="/demo" 
              className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Back to Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Navbar */}
      <DashboardNavbar
        userName="Demo User"
        userEmail="demo@greenreach.com"
        companyName="Demo Company"
        position="Marketing Manager"
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Campaign Launched Successfully!</h1>
          <p className="text-slate-600 text-lg">Your AI-powered campaign for {campaignData.formData.productName} is now live</p>
        </div>

        {/* Campaign Summary */}
        <Card className="mb-8">
          <CardHeader className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Campaign Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{campaignData.formData.productName}</div>
                <div className="text-sm text-slate-600">Product</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">${campaignData.formData.budget}</div>
                <div className="text-sm text-slate-600">Budget</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{campaignData.formData.objective}</div>
                <div className="text-sm text-slate-600">Objective</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">Active</div>
                <div className="text-sm text-slate-600">Status</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Predicted Performance */}
        <Card className="mb-8">
          <CardHeader className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-slate-900">Predicted Performance</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{predictedMetrics.reach.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Reach</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{predictedMetrics.clicks.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{predictedMetrics.conversions}</div>
                <div className="text-sm text-slate-600">Conversions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{predictedMetrics.ctr}%</div>
                <div className="text-sm text-slate-600">CTR</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">${predictedMetrics.cpc}</div>
                <div className="text-sm text-slate-600">CPC</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{predictedMetrics.roas}x</div>
                <div className="text-sm text-slate-600">ROAS</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Sustainability Report */}
        <Card className="mb-8">
          <CardHeader className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-slate-900">Sustainability Impact Report</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Environmental Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-emerald-600" />
                      <span className="text-slate-700">Energy Saved</span>
                    </div>
                    <span className="text-xl font-bold text-emerald-600">{campaignData.sustainabilityMetrics.energySaved} kWh</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Leaf className="w-5 h-5 text-emerald-600" />
                      <span className="text-slate-700">CO₂ Reduced</span>
                    </div>
                    <span className="text-xl font-bold text-emerald-600">{campaignData.sustainabilityMetrics.co2Reduced} kg</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-emerald-600" />
                      <span className="text-slate-700">Efficiency</span>
                    </div>
                    <span className="text-xl font-bold text-emerald-600">{campaignData.sustainabilityMetrics.efficiency}%</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Green Score Breakdown</h3>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg mx-auto mb-4">
                    {campaignData.sustainabilityMetrics.greenScore}
                  </div>
                  <p className="text-slate-600 mb-4">Overall Sustainability Score</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Targeting Precision</span>
                      <span className="text-emerald-600 font-semibold">A+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Energy Efficiency</span>
                      <span className="text-emerald-600 font-semibold">A</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Platform Optimization</span>
                      <span className="text-emerald-600 font-semibold">A-</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Campaign Strategy Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Target Audience */}
          <Card>
            <CardHeader className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Target Audience</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-slate-600">Age Range:</span>
                  <p className="text-slate-900">{campaignData.campaignPlan.targetAudience.ageRange}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600">Income Level:</span>
                  <p className="text-slate-900">{campaignData.campaignPlan.targetAudience.incomeLevel}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600">Key Interests:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {campaignData.campaignPlan.targetAudience.interests.slice(0, 3).map((interest, index) => (
                      <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Platform Distribution */}
          <Card>
            <CardHeader className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Platform Distribution</h2>
              </div>
              <div className="space-y-3">
                {campaignData.campaignPlan.platforms.map((platform, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-slate-700">{platform.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${platform.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">${platform.budget}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">What's Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Monitor Performance</h3>
                <p className="text-sm text-slate-600">Track your campaign's performance and optimize based on real data</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">A/B Test Variations</h3>
                <p className="text-sm text-slate-600">Test different ad variations to find what resonates best with your audience</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Improve Sustainability</h3>
                <p className="text-sm text-slate-600">Continue optimizing for better environmental impact and efficiency</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="mb-6">
            <p className="text-slate-600 mb-4">Ready to create real campaigns with full tracking and analytics?</p>
            <Link to="/register/company">
              <Button size="lg" className="mr-4">
                Get Started Free
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg">
                Back to Demo
              </Button>
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            This is a demo. Sign up to save campaigns, track real performance, and access advanced features.
          </p>
        </div>
      </main>
    </div>
  );
};
