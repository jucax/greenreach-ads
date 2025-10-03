import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, Leaf, Award, TreePine, Instagram, Facebook, Chrome } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DashboardNavbar } from '../../../components/layout/DashboardNavbar';
import { InstagramPost } from '../../../components/ui/InstagramPost';

export const CampaignSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    // Small delay to show loading state
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  // Mock ad variations data
  const adVariations = [
    {
      headline: "Transform Your Daily Routine",
      body: "Discover the perfect solution for your busy lifestyle. Our innovative product delivers exceptional results while being environmentally conscious.",
      cta: "Shop Now",
      image: "https://via.placeholder.com/400x400/10b981/ffffff?text=Product+Image"
    },
    {
      headline: "Sustainable Living Made Simple",
      body: "Make a positive impact on the planet without compromising on quality. Our eco-friendly solution helps you live more sustainably.",
      cta: "Learn More",
      image: "https://via.placeholder.com/400x400/10b981/ffffff?text=Product+Image"
    },
    {
      headline: "Elevate Your Experience",
      body: "Upgrade your daily routine with our premium product. Designed for modern living, it combines style, functionality, and environmental responsibility.",
      cta: "Get Started",
      image: "https://via.placeholder.com/400x400/10b981/ffffff?text=Product+Image"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Campaign Launched Successfully! 🎉
          </h1>
          <p className="text-xl text-slate-600">
            Your ads are now live and optimized for maximum impact
          </p>
        </div>

        {/* Section 1: Campaign Deployment Summary */}
        <Card className="mb-8">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl mb-6">Your Campaign is Live On:</CardTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Instagram Card */}
              <Card className="border border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100">
                <CardHeader className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Instagram className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Instagram</h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-600">5 posts scheduled</div>
                    <div className="text-slate-600">Stories + Feed</div>
                    <div className="text-emerald-600 font-medium">Starting: Today at 2:00 PM</div>
                  </div>
                </CardHeader>
              </Card>

              {/* Facebook Card */}
              <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Facebook className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Facebook</h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-600">4 ads scheduled</div>
                    <div className="text-slate-600">Feed + Marketplace</div>
                    <div className="text-emerald-600 font-medium">Starting: Today at 2:30 PM</div>
                  </div>
                </CardHeader>
              </Card>

              {/* Google Card */}
              <Card className="border border-red-200 bg-gradient-to-br from-red-50 to-red-100">
                <CardHeader className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Chrome className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Google</h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-600">Display campaign active</div>
                    <div className="text-slate-600">1,200+ websites</div>
                    <div className="text-emerald-600 font-medium">Starting: Today at 3:00 PM</div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </CardHeader>
        </Card>

        {/* Section 2: Post Previews Carousel */}
        <Card className="mb-8">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl mb-6">Your Ad Creatives</CardTitle>
            
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-6 min-w-max">
                {adVariations.map((ad, index) => (
                  <div key={index} className="flex-shrink-0 w-80">
                    <InstagramPost
                      imageUrl={ad.image}
                      headline={ad.headline}
                      bodyText={ad.body}
                      ctaText={ad.cta}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Section 3: Sustainability Summary */}
        <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl mb-6 text-emerald-800">Environmental Impact Report</CardTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Energy Used */}
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">15 kWh</div>
                <div className="text-sm font-medium text-slate-900 mb-1">Energy Used</div>
                <div className="text-xs text-emerald-700">60% less than traditional</div>
              </div>

              {/* CO2 Avoided */}
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">11.5 kg</div>
                <div className="text-sm font-medium text-slate-900 mb-1">CO₂ Avoided</div>
                <div className="text-xs text-emerald-700">Equivalent to 29 miles not driven</div>
              </div>

              {/* Green Score */}
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">A-</div>
                <div className="text-sm font-medium text-slate-900 mb-1">Green Score</div>
                <div className="text-xs text-emerald-700">Excellent sustainability performance</div>
              </div>

              {/* Trees Saved */}
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TreePine className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">0.5</div>
                <div className="text-sm font-medium text-slate-900 mb-1">Trees Saved</div>
                <div className="text-xs text-emerald-700">Carbon offset equivalent</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Section 4: Predicted Performance */}
        <Card className="mb-8">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl mb-6">Expected Campaign Results (14 days)</CardTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">108,000</div>
                <div className="text-sm text-slate-600">Estimated Reach</div>
                <div className="text-xs text-slate-500 mt-1">people</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">245,000</div>
                <div className="text-sm text-slate-600">Expected Impressions</div>
                <div className="text-xs text-slate-500 mt-1">total views</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">3,240</div>
                <div className="text-sm text-slate-600">Projected Clicks</div>
                <div className="text-xs text-slate-500 mt-1">3% CTR</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">324</div>
                <div className="text-sm text-slate-600">Estimated Conversions</div>
                <div className="text-xs text-slate-500 mt-1">10% conversion rate</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">290%</div>
                <div className="text-sm text-slate-600">Predicted ROI</div>
                <div className="text-xs text-slate-500 mt-1">return on investment</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 text-center">
                Based on similar campaigns and your targeting parameters
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1"
            onClick={() => handleNavigation('/campaign/1')}
            disabled={isNavigating}
          >
            {isNavigating ? 'Loading...' : 'View Campaign Details'}
          </Button>
          <Button 
            variant="default" 
            size="lg" 
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => handleNavigation('/campaign/create')}
            disabled={isNavigating}
          >
            {isNavigating ? 'Loading...' : 'Create Another Campaign'}
          </Button>
          <Button 
            variant="ghost" 
            size="lg" 
            className="flex-1"
            onClick={() => handleNavigation('/dashboard')}
            disabled={isNavigating}
          >
            {isNavigating ? 'Loading...' : 'Back to Dashboard'}
          </Button>
        </div>
      </main>
    </div>
  );
};
