import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, DollarSign, Calendar, Clock, Globe } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { InstagramPost } from '../../../components/ui/InstagramPost';
import { DashboardNavbar } from '../../../components/layout/DashboardNavbar';
import { CampaignLoadingScreen } from '../../../components/ui/CampaignLoadingScreen';

// Age Range Visualization Component
const AgeRangeVisualization: React.FC<{ ageRange: string }> = ({ ageRange }) => {
  const ageGroups = [
    { label: '18-24', range: '18-24' },
    { label: '25-34', range: '25-34' },
    { label: '35-44', range: '35-44' },
    { label: '45-54', range: '45-54' },
    { label: '55+', range: '55+' },
  ];

  // Parse the target age range (e.g., "25-40")
  const [minAge, maxAge] = ageRange.split('-').map(Number);

  const isTargetGroup = (groupRange: string): boolean => {
    if (groupRange === '55+') {
      return minAge >= 45 || maxAge >= 55;
    }
    const [groupMin, groupMax] = groupRange.split('-').map(Number);
    return (minAge <= groupMax && maxAge >= groupMin);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-3">
        Target Audience Age Distribution
      </label>
      <div className="space-y-2">
        {ageGroups.map((group) => {
          const isTarget = isTargetGroup(group.range);
          return (
            <div key={group.range} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-14">{group.label}</span>
              <div className="flex-1 h-8 bg-slate-100 rounded overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isTarget 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                      : 'bg-slate-200'
                  }`}
                  style={{ width: isTarget ? '100%' : '30%' }}
                ></div>
              </div>
              {isTarget && (
                <span className="text-xs font-medium text-emerald-600">Target</span>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Primary target: {ageRange} years old
      </p>
    </div>
  );
};

export const CampaignResultsPage: React.FC = () => {
  const location = useLocation();
  const campaignData = location.state?.campaignData || {};
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);

  // Mock AI-generated data (would come from Claude API)
  const aiData = {
    targetAudience: {
      ageRange: "25-40",
      interests: ["Sustainability", "Health & Wellness", "Technology", "Outdoor Activities"],
      demographics: "Urban professionals, environmentally conscious",
      incomeLevel: "$50k-$100k annually"
    },
    geographic: {
      primary: "United States (Urban areas)",
      cities: ["New York", "Los Angeles", "Chicago", "Austin", "Seattle"]
    },
    schedule: {
      bestDays: ["Tuesday", "Thursday", "Saturday"],
      bestTimes: ["2-4pm EST", "10am-12pm EST"],
      reasoning: "Peak engagement for your demographic and aligns with renewable energy peaks"
    },
    platforms: [
      { name: "Instagram", budget: 200, percentage: 40, reasoning: "Visual platform perfect for product showcase" },
      { name: "Facebook", budget: 175, percentage: 35, reasoning: "Broad reach with detailed targeting options" },
      { name: "Google", budget: 125, percentage: 25, reasoning: "Intent-based advertising for higher conversion rates" }
    ],
    adVariations: [
      {
        name: "Variation 1: Young Professionals",
        targetSegment: "Ages 25-35, urban professionals",
        headline: "Transform Your Daily Routine",
        body: "Discover the perfect solution for your busy lifestyle. Our innovative product delivers exceptional results while being environmentally conscious. Join thousands of satisfied customers who've made the smart choice.",
        cta: "Shop Now",
        whyItWorks: "Targets health-conscious professionals who value efficiency and sustainability"
      },
      {
        name: "Variation 2: Eco-Conscious Consumers",
        targetSegment: "Ages 30-45, environmentally aware",
        headline: "Sustainable Living Made Simple",
        body: "Make a positive impact on the planet without compromising on quality. Our eco-friendly solution helps you live more sustainably while enjoying premium performance.",
        cta: "Learn More",
        whyItWorks: "Appeals to environmentally conscious consumers who prioritize sustainability"
      },
      {
        name: "Variation 3: Lifestyle Enthusiasts",
        targetSegment: "Ages 25-40, active lifestyle",
        headline: "Elevate Your Experience",
        body: "Upgrade your daily routine with our premium product. Designed for modern living, it combines style, functionality, and environmental responsibility in one perfect package.",
        cta: "Get Started",
        whyItWorks: "Focuses on lifestyle enhancement and premium quality for active consumers"
      }
    ],
    sustainability: {
      energy: "15 kWh (vs 38 kWh traditional)",
      co2: "7.5kg saved",
      greenScore: "A-"
    }
  };

  const getDisplayImage = () => {
    if (campaignData.images && campaignData.images.length > 0) {
      return campaignData.images[selectedImageIndex];
    }
    // Fallback image
    return 'https://via.placeholder.com/400x400/10b981/ffffff?text=Product+Image';
  };

  const handleLaunchCampaign = () => {
    setIsLaunching(true);
  };

  const handleLaunchComplete = () => {
    setIsLaunching(false);
    // Navigation will be handled by the loading screen component
  };

  const nextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % aiData.adVariations.length);
  };

  const prevAd = () => {
    setCurrentAdIndex((prev) => (prev - 1 + aiData.adVariations.length) % aiData.adVariations.length);
  };

  // Show loading screen if launching
  if (isLaunching) {
    return <CampaignLoadingScreen onComplete={handleLaunchComplete} />;
  }

  const currentAd = aiData.adVariations[currentAdIndex];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">AI-Generated Campaign</h2>
          <p className="text-slate-600">Personalized recommendations for {campaignData.productName || 'your product'}</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - 45% */}
          <div className="lg:col-span-5 space-y-6">
            {/* Target Audience with Age Visualization */}
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-lg mb-4">Recommended Target Audience</CardTitle>
                <div className="space-y-4">
                  {/* Age Range Visualization */}
                  <AgeRangeVisualization ageRange={aiData.targetAudience.ageRange} />
                  
                  <div className="pt-4 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-600">Interests:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {aiData.targetAudience.interests.map((interest, index) => (
                        <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Demographics:</span>
                    <span className="ml-2 text-slate-900">{aiData.targetAudience.demographics}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-600">Income Level:</span>
                    <span className="ml-1 text-slate-900">{aiData.targetAudience.incomeLevel}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Geographic Targeting */}
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-lg mb-4">Geographic Targeting</CardTitle>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-600">Primary:</span>
                    <span className="ml-1 text-slate-900">{aiData.geographic.primary}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-slate-600">Focus cities:</span>
                    </div>
                    <div className="text-slate-900 pl-6">{aiData.geographic.cities.join(', ')}</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Posting Strategy */}
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-lg mb-4">Posting Strategy</CardTitle>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-600">Best Days:</span>
                    <span className="ml-1 text-slate-900">{aiData.schedule.bestDays.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-600">Best Times:</span>
                    <span className="ml-1 text-slate-900">{aiData.schedule.bestTimes.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Why:</span>
                    <span className="ml-2 text-slate-900">{aiData.schedule.reasoning}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Sustainability Impact */}
            <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
              <CardHeader className="p-6">
                <CardTitle className="text-lg mb-4">Sustainability Impact</CardTitle>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Energy:</span>
                    <span className="font-medium text-slate-900">{aiData.sustainability.energy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">CO₂:</span>
                    <span className="font-medium text-slate-900">{aiData.sustainability.co2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Green Score:</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded">
                      {aiData.sustainability.greenScore}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Right Column - 55% */}
          <div className="lg:col-span-7 space-y-6">
            {/* Ad Variations Carousel */}
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-xl mb-6">AI-Generated Ad Variations</CardTitle>
                
                {/* Image Selector */}
                {campaignData.images && campaignData.images.length > 1 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preview with image:
                    </label>
                    <select
                      value={selectedImageIndex}
                      onChange={(e) => setSelectedImageIndex(Number(e.target.value))}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {campaignData.images.map((_img: string, index: number) => (
                        <option key={index} value={index}>
                          Image {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Ad Variation Carousel */}
                <div className="space-y-6">
                  {/* Carousel Navigation */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={prevAd}
                      className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                      disabled={aiData.adVariations.length <= 1}
                    >
                      <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {currentAd.name}
                      </h3>
                      <p className="text-sm text-slate-600">{currentAd.targetSegment}</p>
                    </div>
                    
                    <button
                      onClick={nextAd}
                      className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                      disabled={aiData.adVariations.length <= 1}
                    >
                      <ChevronRight className="w-6 h-6 text-slate-600" />
                    </button>
                  </div>

                  {/* Ad Preview */}
                  <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                    <div className="flex justify-center mb-6">
                      <InstagramPost
                        imageUrl={getDisplayImage()}
                        headline={currentAd.headline}
                        bodyText={currentAd.body}
                        ctaText={currentAd.cta}
                      />
                    </div>

                    {/* Why This Works */}
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <h4 className="font-medium text-slate-900 mb-2">Why This Works:</h4>
                      <p className="text-sm text-slate-600">{currentAd.whyItWorks}</p>
                    </div>
                  </div>

                  {/* Carousel Indicators */}
                  <div className="flex justify-center space-x-2">
                    {aiData.adVariations.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentAdIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentAdIndex
                            ? 'bg-emerald-600'
                            : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Platform Allocation - Moved here */}
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-lg mb-4">Platform Allocation</CardTitle>
                <div className="space-y-3">
                  {aiData.platforms.map((platform, index) => (
                    <div key={index} className="border-l-4 border-emerald-500 pl-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-slate-900">{platform.name}</span>
                        <span className="text-slate-600">${platform.budget} ({platform.percentage}%)</span>
                      </div>
                      <p className="text-sm text-slate-600">{platform.reasoning}</p>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex gap-4">
          <Link to="/campaign/create" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Edit Campaign
            </Button>
          </Link>
          <Button 
            variant="default" 
            size="lg" 
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            onClick={handleLaunchCampaign}
          >
            Approve & Launch Campaign
          </Button>
        </div>
      </main>
    </div>
  );
};