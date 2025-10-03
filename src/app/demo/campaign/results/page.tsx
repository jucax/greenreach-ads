import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader } from '../../../../components/ui/Card';
import { DashboardNavbar } from '../../../../components/layout/DashboardNavbar';
import { generateCampaignPlan } from '../../../../lib/claude';

interface CampaignFormData {
  productName: string;
  productDescription: string;
  productCategory: string;
  objective: string;
  budget: string;
  startDate: string;
  endDate: string;
  images: File[];
}

interface CampaignPlan {
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
}

export const DemoCampaignResultsPage: React.FC = () => {
  console.log('🎯 DemoCampaignResultsPage: Component rendering...');
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState('');
  const [formData, setFormData] = useState<CampaignFormData | null>(null);
  const [campaignPlan, setCampaignPlan] = useState<CampaignPlan | null>(null);
  const [sustainabilityMetrics, setSustainabilityMetrics] = useState<any>(null);
  
  console.log('🎯 DemoCampaignResultsPage: State initialized', { loading, progress, formData, campaignPlan, sustainabilityMetrics });

  useEffect(() => {
    // Get form data from sessionStorage
    const storedData = sessionStorage.getItem('demoCampaignData');
    if (!storedData) {
      navigate('/demo/campaign/create');
      return;
    }

    const parsedData = JSON.parse(storedData) as CampaignFormData;
    setFormData(parsedData);
    
    // Start the AI generation process
    generateCampaignResults(parsedData);
  }, [navigate]);

  const generateCampaignResults = async (data: CampaignFormData) => {
    try {
      setProgress('🤖 Analyzing your product and market...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress('🎯 Identifying target audience segments...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress('🌍 Determining optimal geographic targeting...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress('📅 Calculating best posting schedule...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress('💰 Allocating budget across platforms...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress('✍️ Creating compelling ad variations...');
      
      // Call Claude API
      const plan = await generateCampaignPlan({
        productName: data.productName,
        productDescription: data.productDescription,
        productCategory: data.productCategory,
        budget: parseFloat(data.budget),
        objective: data.objective,
        startDate: data.startDate,
        endDate: data.endDate
      });

      setCampaignPlan(plan);

      setProgress('🌱 Calculating sustainability metrics...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Calculate fake sustainability metrics based on budget
      const budget = parseFloat(data.budget);
      const energySaved = Math.round(budget * 0.8 + Math.random() * 20);
      const co2Reduced = Math.round(energySaved * 0.4 + Math.random() * 10);
      const greenScore = budget > 1000 ? 'A' : budget > 500 ? 'B+' : 'B';

      setSustainabilityMetrics({
        energySaved,
        co2Reduced,
        greenScore,
        efficiency: Math.round(85 + Math.random() * 10)
      });

      setProgress('✅ Campaign plan generated successfully!');
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error('Error generating campaign results:', error);
      setProgress('❌ Error generating campaign plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchCampaign = () => {
    // Store campaign data for success page
    if (formData && campaignPlan && sustainabilityMetrics) {
      sessionStorage.setItem('demoCampaignResults', JSON.stringify({
        formData,
        campaignPlan,
        sustainabilityMetrics
      }));
    }
    navigate('/demo/campaign/success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">🎯 Demo Campaign Results</h2>
                <p className="text-emerald-100">Generating your AI-powered campaign plan...</p>
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

        {/* Loading Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Generating Your Campaign Plan</h1>
            <p className="text-lg text-slate-600 mb-8">{progress}</p>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Product Analysis</span>
                  <span className="text-emerald-600">✓ Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Audience Targeting</span>
                  <span className="text-emerald-600">✓ Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Platform Optimization</span>
                  <span className="text-emerald-600">✓ Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Ad Creation</span>
                  <span className="text-emerald-600">✓ Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Sustainability Analysis</span>
                  <span className="text-emerald-600">✓ Complete</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!formData || !campaignPlan || !sustainabilityMetrics) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Campaign Results</h1>
          <p className="text-slate-600 mb-6">Something went wrong. Please try creating a new campaign.</p>
          <Link to="/demo/campaign/create">
            <Button>Create New Campaign</Button>
          </Link>
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
              <h2 className="text-xl font-bold">🎯 Demo Campaign Results</h2>
              <p className="text-emerald-100">Your AI-generated campaign plan is ready!</p>
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Campaign Plan Generated</h1>
          <p className="text-slate-600 mt-1">AI-powered strategy for {formData.productName}</p>
        </div>

        {/* Sustainability Score */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">Sustainability Score</h2>
                  <p className="text-slate-600">Based on your campaign parameters</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {sustainabilityMetrics.greenScore}
                  </div>
                  <p className="text-sm text-slate-600 mt-2">Green Score</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{sustainabilityMetrics.energySaved}</div>
                  <div className="text-sm text-slate-600">kWh Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{sustainabilityMetrics.co2Reduced}</div>
                  <div className="text-sm text-slate-600">kg CO₂ Reduced</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{sustainabilityMetrics.efficiency}%</div>
                  <div className="text-sm text-slate-600">Efficiency</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Campaign Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Target Audience */}
          <Card>
            <CardHeader className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Target Audience</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-slate-600">Age Range:</span>
                  <p className="text-slate-900">{campaignPlan.targetAudience.ageRange}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600">Income Level:</span>
                  <p className="text-slate-900">{campaignPlan.targetAudience.incomeLevel}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600">Demographics:</span>
                  <p className="text-slate-900">{campaignPlan.targetAudience.demographics}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600">Interests:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {campaignPlan.targetAudience.interests.map((interest, index) => (
                      <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Geographic Targeting */}
          <Card>
            <CardHeader className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Geographic Targeting</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-slate-600">Primary Market:</span>
                  <p className="text-slate-900">{campaignPlan.geographic.primary}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600">Target Cities:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {campaignPlan.geographic.cities.map((city, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Posting Schedule */}
          <Card>
            <CardHeader className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Optimal Schedule</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-slate-600">Best Days:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {campaignPlan.schedule.bestDays.map((day, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600">Best Times:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {campaignPlan.schedule.bestTimes.map((time, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600">Reasoning:</span>
                  <p className="text-slate-900 text-sm mt-1">{campaignPlan.schedule.reasoning}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Budget Allocation */}
          <Card>
            <CardHeader className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Budget Allocation</h2>
              </div>
              <div className="space-y-4">
                {campaignPlan.platforms.map((platform, index) => (
                  <div key={index} className="border-b border-slate-200 pb-3 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-900">{platform.name}</span>
                      <span className="text-emerald-600 font-semibold">${platform.budget}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full" 
                        style={{ width: `${platform.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-600">{platform.reasoning}</p>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Ad Variations */}
        <Card className="mb-8">
          <CardHeader className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-slate-900">AI-Generated Ad Variations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaignPlan.adVariations.map((variation, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <h3 className="font-semibold text-slate-900 mb-2">{variation.name}</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-medium text-slate-600">Target:</span>
                      <p className="text-sm text-slate-900">{variation.targetSegment}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-600">Headline:</span>
                      <p className="text-sm font-medium text-slate-900">{variation.headline}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-600">Copy:</span>
                      <p className="text-sm text-slate-900">{variation.body}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-600">CTA:</span>
                      <p className="text-sm font-medium text-emerald-600">{variation.cta}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-600">Why it works:</span>
                      <p className="text-xs text-slate-600">{variation.whyItWorks}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Link to="/demo/campaign/create">
            <Button variant="outline" size="lg">
              Create Another Campaign
            </Button>
          </Link>
          <Button onClick={handleLaunchCampaign} size="lg">
            Launch Campaign
          </Button>
        </div>
      </main>
    </div>
  );
};
