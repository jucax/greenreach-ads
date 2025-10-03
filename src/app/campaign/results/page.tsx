import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, DollarSign, Calendar, Clock, Globe } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { InstagramPost } from '../../../components/ui/InstagramPost';
import { DashboardNavbar } from '../../../components/layout/DashboardNavbar';
import { CampaignLoadingScreen } from '../../../components/ui/CampaignLoadingScreen';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import type { Campaign } from '../../../lib/supabase';

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
  const { user, company } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const campaignId = searchParams.get('id');
  const [campaignData, setCampaignData] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);

  // Load campaign data from database
  useEffect(() => {
    if (campaignId && user && company) {
      loadCampaignData();
    } else if (!campaignId) {
      console.error('❌ No campaign ID provided');
      setLoading(false);
    }
  }, [campaignId, user, company]);

  const loadCampaignData = async () => {
    if (!campaignId || !user || !company) return;

    try {
      console.log('📊 Loading campaign data for ID:', campaignId);
      setLoading(true);

      const { data: campaign, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .eq('company_id', company.id) // Ensure user can only see their company's campaigns
        .single();

      if (error) {
        console.error('❌ Error loading campaign:', error);
        console.error('Campaign error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        alert('Campaign not found or access denied');
        setLoading(false);
        return;
      }

      if (!campaign) {
        console.log('❌ Campaign not found');
        alert('Campaign not found');
        setLoading(false);
        return;
      }

      console.log('✅ Campaign loaded successfully:', campaign);
      setCampaignData(campaign);
      setSelectedImageIndex(campaign.selected_image_index || 0);
      setLoading(false);

    } catch (error) {
      console.error('💥 Unexpected error loading campaign:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      alert('An unexpected error occurred while loading the campaign');
      setLoading(false);
    }
  };

  const getDisplayImage = () => {
    if (campaignData?.image_urls && campaignData.image_urls.length > 0) {
      return campaignData.image_urls[selectedImageIndex];
    }
    // Fallback image
    return 'https://via.placeholder.com/400x400/10b981/ffffff?text=Product+Image';
  };

  const handleLaunchCampaign = async () => {
    if (!campaignData) return;
    
    setIsLaunching(true);
    
    try {
      console.log('🚀 Launching campaign:', campaignData.id);
      
      // Update campaign status to active
      const { error } = await supabase
        .from('campaigns')
        .update({ status: 'active' })
        .eq('id', campaignData.id);
      
      if (error) {
        console.error('❌ Error launching campaign:', error);
        alert('Error launching campaign. Please try again.');
        setIsLaunching(false);
        return;
      }
      
      console.log('✅ Campaign launched successfully');
      
      // Navigate to success page using React Router
      navigate('/campaign/success');
      
    } catch (error) {
      console.error('💥 Unexpected error launching campaign:', error);
      alert('An unexpected error occurred while launching the campaign');
      setIsLaunching(false);
    }
  };

  const handleLaunchComplete = () => {
    setIsLaunching(false);
    // Navigation will be handled by the loading screen component
  };

  const nextAd = () => {
    if (campaignData?.ad_variations) {
      setCurrentAdIndex((prev) => (prev + 1) % campaignData.ad_variations.length);
    }
  };

  const prevAd = () => {
    if (campaignData?.ad_variations) {
      setCurrentAdIndex((prev) => (prev - 1 + campaignData.ad_variations.length) % campaignData.ad_variations.length);
    }
  };

  // Show loading screen if launching
  if (isLaunching) {
    return <CampaignLoadingScreen onComplete={handleLaunchComplete} />;
  }

  if (loading) {
    return <CampaignLoadingScreen />;
  }

  if (!campaignData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Campaign not found or access denied.</p>
          <Link to="/dashboard" className="text-emerald-600 hover:text-emerald-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentAd = campaignData.ad_variations?.[currentAdIndex];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">AI-Generated Campaign</h2>
          <p className="text-slate-600">Personalized recommendations for {campaignData.product_name || 'your product'}</p>
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
                  <AgeRangeVisualization ageRange={campaignData.target_audience?.ageRange || '25-45'} />
                  
                  <div className="pt-4 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-600">Interests:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(campaignData.target_audience?.interests || []).map((interest: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Demographics:</span>
                    <span className="ml-2 text-slate-900">{campaignData.target_audience?.demographics || 'Target demographics'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-600">Income Level:</span>
                    <span className="ml-1 text-slate-900">{campaignData.target_audience?.incomeLevel || 'Target income level'}</span>
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
                    <span className="ml-1 text-slate-900">{campaignData.geographic_targeting?.primary || 'Primary location'}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-slate-600">Focus cities:</span>
                    </div>
                    <div className="text-slate-900 pl-6">{(campaignData.geographic_targeting?.cities || []).join(', ')}</div>
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
                    <span className="ml-1 text-slate-900">{(campaignData.posting_schedule?.bestDays || []).join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-600">Best Times:</span>
                    <span className="ml-1 text-slate-900">{(campaignData.posting_schedule?.bestTimes || []).join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Why:</span>
                    <span className="ml-2 text-slate-900">{campaignData.posting_schedule?.reasoning || 'Optimal posting schedule'}</span>
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
                    <span className="font-medium text-slate-900">{campaignData.energy_used_kwh?.toFixed(0) || '0'} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">CO₂:</span>
                    <span className="font-medium text-slate-900">{campaignData.co2_avoided_kg?.toFixed(0) || '0'}kg saved</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Green Score:</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded">
                      {campaignData.green_score || 'C'}
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
                {campaignData.image_urls && campaignData.image_urls.length > 1 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preview with image:
                    </label>
                    <select
                      value={selectedImageIndex}
                      onChange={(e) => setSelectedImageIndex(Number(e.target.value))}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {campaignData.image_urls.map((_img: string, index: number) => (
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
                      disabled={!campaignData.ad_variations || campaignData.ad_variations.length <= 1}
                    >
                      <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {currentAd?.name || 'Ad Variation'}
                      </h3>
                      <p className="text-sm text-slate-600">{currentAd?.targetSegment || 'Target segment'}</p>
                    </div>
                    
                    <button
                      onClick={nextAd}
                      className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                      disabled={!campaignData.ad_variations || campaignData.ad_variations.length <= 1}
                    >
                      <ChevronRight className="w-6 h-6 text-slate-600" />
                    </button>
                  </div>

                  {/* Ad Preview */}
                  <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                    <div className="flex justify-center mb-6">
                      <InstagramPost
                        imageUrl={getDisplayImage()}
                        headline={currentAd?.headline || 'Campaign Headline'}
                        bodyText={currentAd?.body || 'Campaign description...'}
                        ctaText={currentAd?.cta || 'Learn More'}
                      />
                    </div>

                    {/* Why This Works */}
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <h4 className="font-medium text-slate-900 mb-2">Why This Works:</h4>
                      <p className="text-sm text-slate-600">{currentAd?.whyItWorks || 'This ad variation is optimized for your target audience'}</p>
                    </div>
                  </div>

                  {/* Carousel Indicators */}
                  <div className="flex justify-center space-x-2">
                    {(campaignData.ad_variations || []).map((_: any, index: number) => (
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
                  {(campaignData.platform_allocation || []).map((platform: any, index: number) => (
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