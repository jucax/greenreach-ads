import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Target, Calendar, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader } from '../../../components/ui/Card';
import { DashboardNavbar } from '../../../components/layout/DashboardNavbar';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { ImageService } from '../../../services/imageService';
import { generateCampaignPlan } from '../../../lib/claude';

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

export const CreateCampaignPage: React.FC = () => {
  const { user, company } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Cleanup image preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        ImageService.revokePreviewUrl(url);
      });
    };
  }, [imagePreviews]);

  const [formData, setFormData] = useState<CampaignFormData>({
    productName: '',
    productDescription: '',
    productCategory: '',
    objective: '',
    budget: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    images: [],
  });

  const categories = [
    // Technology & Electronics
    'Electronics',
    'Software/SaaS',
    'Mobile Apps',
    'Gaming',
    'Tech Accessories',
    'Smart Home',
    'Automotive Tech',
    
    // Fashion & Beauty
    'Fashion/Apparel',
    'Beauty & Cosmetics',
    'Jewelry & Accessories',
    'Footwear',
    'Luxury Goods',
    'Sustainable Fashion',
    
    // Home & Lifestyle
    'Home & Garden',
    'Furniture',
    'Home Decor',
    'Kitchen & Dining',
    'Bedding & Bath',
    'Pet Supplies',
    'Baby & Kids',
    
    // Food & Beverage
    'Food & Beverage',
    'Restaurants & Dining',
    'Organic & Natural',
    'Beverages',
    'Snacks & Treats',
    'Cooking & Kitchen',
    
    // Health & Wellness
    'Health & Wellness',
    'Fitness & Sports',
    'Medical & Healthcare',
    'Mental Health',
    'Nutrition & Supplements',
    'Personal Care',
    'Wellness Services',
    
    // Business & Professional
    'Professional Services',
    'Business & Finance',
    'Education & Training',
    'Consulting',
    'Legal Services',
    'Real Estate',
    'Insurance',
    
    // Travel & Entertainment
    'Travel & Tourism',
    'Hotels & Accommodation',
    'Entertainment',
    'Events & Venues',
    'Sports & Recreation',
    'Music & Arts',
    'Books & Media',
    
    // Automotive & Transportation
    'Automotive',
    'Transportation',
    'Ride Sharing',
    'Electric Vehicles',
    'Auto Parts & Accessories',
    
    // Sustainability & Environment
    'Sustainability & Green',
    'Renewable Energy',
    'Eco-Friendly Products',
    'Environmental Services',
    'Carbon Offset',
    
    // Other
    'Non-Profit & Charity',
    'Government & Public',
    'Religious & Spiritual',
    'Other',
  ];

  const objectives = [
    'Increase Sales',
    'Build Brand Awareness',
    'Generate Leads',
    'Drive Website Traffic',
    'Promote Event',
    'Product Launch',
    'Increase App Downloads',
    'Boost Engagement',
    'Retarget Customers',
    'Seasonal Promotion',
    'Clearance Sale',
    'Customer Retention',
    'Market Expansion',
    'Thought Leadership',
    'Community Building',
    'Fundraising',
    'Recruitment',
    'Educational Content',
  ];

  const handleChange = (field: keyof CampaignFormData, value: string | File[]) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 3) {
      setErrors({ ...errors, images: 'Maximum 3 images allowed' });
      return;
    }

    const validFiles = files.filter(file => {
      const validation = ImageService.validateCampaignImageFile(file);
      if (!validation.valid) {
        setErrors({ ...errors, images: validation.error || 'Invalid file' });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setErrors({ ...errors, images: '' });
      handleChange('images', validFiles);

      // Create previews
      const previews = validFiles.map(file => ImageService.createPreviewUrl(file));
      setImagePreviews(previews);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
    if (!formData.productDescription.trim()) newErrors.productDescription = 'Product description is required';
    if (!formData.productCategory) newErrors.productCategory = 'Product category is required';
    if (!formData.objective) newErrors.objective = 'Campaign objective is required';
    if (!formData.budget) newErrors.budget = 'Budget is required';
    else if (parseFloat(formData.budget) < 100) newErrors.budget = 'Budget must be at least $100';

    // Date validation
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Starting campaign creation...');
    console.log('📋 Form data:', formData);
    console.log('👤 User:', user?.name);
    console.log('🏢 Company:', company?.name);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    if (!user || !company) {
      console.log('❌ No user or company found');
      alert('Please log in to create a campaign');
      return;
    }

    setLoading(true);
    
    try {
      console.log('\n1️⃣ Generating AI campaign data with Claude API...');
      
      // Call Claude API to generate campaign plan
      const campaignPlan = await generateCampaignPlan({
        productName: formData.productName,
        productDescription: formData.productDescription,
        productCategory: formData.productCategory,
        budget: parseFloat(formData.budget),
        objective: formData.objective,
        startDate: formData.startDate,
        endDate: formData.endDate
      });
      
      // Transform Claude response to match existing data structure
      const aiGeneratedData = {
        target_audience: {
          ageRange: campaignPlan.targetAudience.ageRange,
          interests: campaignPlan.targetAudience.interests,
          demographics: campaignPlan.targetAudience.demographics,
          incomeLevel: campaignPlan.targetAudience.incomeLevel
        },
        geographic_targeting: {
          primary: campaignPlan.geographic.primary,
          cities: campaignPlan.geographic.cities
        },
        posting_schedule: {
          bestDays: campaignPlan.schedule.bestDays,
          bestTimes: campaignPlan.schedule.bestTimes,
          reasoning: campaignPlan.schedule.reasoning
        },
        platform_allocation: campaignPlan.platforms.map(platform => ({
          name: platform.name,
          budget: platform.budget,
          percentage: platform.percentage,
          reasoning: platform.reasoning
        })),
        ad_variations: campaignPlan.adVariations.map(variation => ({
          name: variation.name,
          targetSegment: variation.targetSegment,
          headline: variation.headline,
          body: variation.body,
          cta: variation.cta,
          whyItWorks: variation.whyItWorks
        }))
      };
      
      console.log('✅ AI data generated');
      
      console.log('\n2️⃣ Calculating sustainability metrics...');
      const { data: sustainabilityMetrics, error: metricsError } = await supabase
        .rpc('calculate_sustainability_metrics', { campaign_budget: parseFloat(formData.budget) });
      
      let finalMetrics;
      if (metricsError) {
        console.error('❌ Error calculating sustainability metrics:', metricsError);
        // Use fallback calculation
        const budget = parseFloat(formData.budget);
        const traditionalEnergy = budget * 0.076;
        const optimizedEnergy = traditionalEnergy * 0.4;
        const co2Saved = (traditionalEnergy - optimizedEnergy) * 0.5;
        
        let score = 'C';
        if (optimizedEnergy < traditionalEnergy * 0.35) score = 'A+';
        else if (optimizedEnergy < traditionalEnergy * 0.40) score = 'A';
        else if (optimizedEnergy < traditionalEnergy * 0.45) score = 'A-';
        else if (optimizedEnergy < traditionalEnergy * 0.50) score = 'B+';
        else if (optimizedEnergy < traditionalEnergy * 0.60) score = 'B';
        
        finalMetrics = {
          energy_used_kwh: optimizedEnergy,
          co2_avoided_kg: co2Saved,
          green_score: score
        };
        
        console.log('✅ Fallback sustainability metrics calculated');
      } else {
        finalMetrics = sustainabilityMetrics;
        console.log('✅ Sustainability metrics calculated:', sustainabilityMetrics);
      }
      
      console.log('\n3️⃣ Uploading campaign images...');
      let uploadedImageUrls: string[] = [];
      
      if (formData.images && formData.images.length > 0) {
        console.log('📤 Uploading', formData.images.length, 'images...');
        const uploadResult = await ImageService.uploadMultipleImages(
          formData.images,
          'campaign-images',
          user.id
        );
        
        if (uploadResult.success && uploadResult.urls) {
          uploadedImageUrls = uploadResult.urls;
          console.log('✅ Images uploaded successfully:', uploadedImageUrls);
        } else {
          console.error('❌ Image upload failed:', uploadResult.error);
          alert('Image upload failed. Please try again.');
          setLoading(false);
          return;
        }
      } else {
        console.log('ℹ️ No images provided, skipping upload');
      }
      
      console.log('\n4️⃣ Creating campaign in database...');
      const campaignData = {
        user_id: user.id,
        company_id: company.id,
        name: `${formData.productName} Campaign`,
        product_name: formData.productName,
        product_description: formData.productDescription,
        product_category: formData.productCategory,
        budget: parseFloat(formData.budget),
        objective: formData.objective,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: 'draft' as const,
        target_audience: aiGeneratedData.target_audience,
        geographic_targeting: aiGeneratedData.geographic_targeting,
        posting_schedule: aiGeneratedData.posting_schedule,
        platform_allocation: aiGeneratedData.platform_allocation,
        ad_variations: aiGeneratedData.ad_variations,
        image_urls: uploadedImageUrls,
        selected_image_index: 0,
        actual_reach: 0,
        actual_impressions: 0,
        actual_clicks: 0,
        actual_conversions: 0,
        actual_spend: 0,
        energy_used_kwh: finalMetrics.energy_used_kwh,
        co2_avoided_kg: finalMetrics.co2_avoided_kg,
        green_score: finalMetrics.green_score
      };
      
      console.log('📝 Campaign data to insert:', campaignData);
      
      const { data: newCampaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert(campaignData)
        .select()
        .single();
      
      if (campaignError) {
        console.error('❌ Error creating campaign:', campaignError);
        console.error('Campaign error details:', {
          message: campaignError.message,
          details: campaignError.details,
          hint: campaignError.hint,
          code: campaignError.code
        });
        
        // Provide more specific error messages
        let errorMessage = 'Error creating campaign. ';
        if (campaignError.code === '23503') {
          errorMessage += 'User or company not found. Please log in again.';
        } else if (campaignError.code === '23505') {
          errorMessage += 'Campaign with this name already exists.';
        } else if (campaignError.message.includes('permission')) {
          errorMessage += 'Permission denied. Please check your account.';
        } else {
          errorMessage += 'Please try again or contact support.';
        }
        
        alert(errorMessage);
        setLoading(false);
        return;
      }
      
      console.log('\n🎉 Campaign created successfully!');
      console.log('✅ Campaign ID:', newCampaign.id);
      
      // Navigate to results page with campaign ID
      navigate(`/campaign/results?id=${newCampaign.id}`);
      
    } catch (error) {
      console.error('\n💥 Unexpected error creating campaign:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      alert('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header with Green Background */}
        <div className="bg-emerald-50 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Campaign</h1>
          <p className="text-slate-600">
            Provide detailed information about your product so our AI can create highly personalized campaign recommendations.
          </p>
        </div>

        <Card>
          <CardHeader className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Details Section */}
              <div className="border-l-4 border-emerald-500 pl-6">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-xl font-medium text-emerald-600">Product Details</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Product/Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) => handleChange('productName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.productName ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="e.g., Eco-Friendly Water Bottle"
                    />
                    {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
                  </div>

                  {/* Product Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Detailed Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.productDescription}
                      onChange={(e) => handleChange('productDescription', e.target.value)}
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.productDescription ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="Be specific! Include features, benefits, target use cases, what makes it unique, pricing tier, etc. The more detail you provide, the better our AI recommendations will be."
                    />
                    {errors.productDescription && <p className="text-red-500 text-sm mt-1">{errors.productDescription}</p>}
                  </div>

                  {/* Product Category */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Product Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.productCategory}
                      onChange={(e) => handleChange('productCategory', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.productCategory ? 'border-red-500' : 'border-slate-300'}`}
                    >
                      <option value="">Select category...</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.productCategory && <p className="text-red-500 text-sm mt-1">{errors.productCategory}</p>}
                  </div>
                </div>
              </div>

              {/* Campaign Goals Section */}
              <div className="border-l-4 border-emerald-500 pl-6 pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-xl font-medium text-emerald-600">Campaign Goals</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Objective */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Primary Objective <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.objective}
                      onChange={(e) => handleChange('objective', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.objective ? 'border-red-500' : 'border-slate-300'}`}
                    >
                      <option value="">Select objective...</option>
                      {objectives.map((objective) => (
                        <option key={objective} value={objective}>
                          {objective}
                        </option>
                      ))}
                    </select>
                    {errors.objective && <p className="text-red-500 text-sm mt-1">{errors.objective}</p>}
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Budget <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => handleChange('budget', e.target.value)}
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.budget ? 'border-red-500' : 'border-slate-300'}`}
                        placeholder="500"
                        min="100"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Total amount you want to spend on this campaign</p>
                    {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                  </div>
                </div>
              </div>

              {/* Campaign Duration Section */}
              <div className="border-l-4 border-emerald-500 pl-6 pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-xl font-medium text-emerald-600">Campaign Duration</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.endDate ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                  </div>
                </div>
              </div>

              {/* Visual Assets Section */}
              <div className="border-l-4 border-emerald-500 pl-6 pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <ImageIcon className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-xl font-medium text-emerald-600">Visual Assets</h2>
                </div>
                
                {/* Instructions Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">📸 Visual Asset Guidelines</h3>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p><strong>What to upload:</strong></p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li>High-quality product photos (JPG, PNG, WebP)</li>
                      <li>Multiple angles or variations of your product</li>
                      <li>Images that showcase key features or benefits</li>
                      <li>Lifestyle images showing your product in use</li>
                    </ul>
                    <p className="mt-3"><strong>💡 Not sure what to choose?</strong></p>
                    <p>Our AI will analyze all your images and recommend the best ones for your target audience. You can upload up to 3 images, and we'll help you decide which performs best!</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Product Images (up to 3)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Our AI will analyze which image works best for your target audience and explain why
                  </p>
                  {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-slate-200"
                          />
                          <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            Image {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex gap-4 pt-8 border-t border-slate-200">
                <Link to="/dashboard" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Campaign with AI...
                    </div>
                  ) : (
                    'Generate Campaign with AI'
                  )}
                </Button>
              </div>
            </form>
          </CardHeader>
        </Card>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">AI is analyzing your product</h3>
              <p className="text-slate-600">
                AI is analyzing your product, images, and creating personalized recommendations...
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};