import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Target, Calendar, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader } from '../../../../components/ui/Card';
import { DashboardNavbar } from '../../../../components/layout/DashboardNavbar';

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

export const DemoCreateCampaignPage: React.FC = () => {
  console.log('🎯 DemoCreateCampaignPage: Component rendering...');
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  console.log('🎯 DemoCreateCampaignPage: State initialized', { loading, errors, imagePreviews });

  // Cleanup image preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        URL.revokeObjectURL(url);
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
    'Software',
    'Mobile Apps',
    'Gaming',
    'Smart Home',
    'Wearables',
    
    // Fashion & Beauty
    'Fashion',
    'Beauty',
    'Jewelry',
    'Accessories',
    'Footwear',
    'Cosmetics',
    
    // Health & Wellness
    'Health & Fitness',
    'Nutrition',
    'Mental Health',
    'Medical',
    'Wellness',
    'Supplements',
    
    // Food & Beverage
    'Food & Beverage',
    'Restaurants',
    'Cooking',
    'Organic Food',
    'Beverages',
    'Snacks',
    
    // Home & Garden
    'Home & Garden',
    'Furniture',
    'Decor',
    'Tools',
    'Appliances',
    'Outdoor',
    
    // Automotive
    'Automotive',
    'Electric Vehicles',
    'Car Accessories',
    'Motorcycles',
    'Tires',
    'Auto Parts',
    
    // Travel & Tourism
    'Travel',
    'Hotels',
    'Airlines',
    'Tourism',
    'Adventure',
    'Luxury Travel',
    
    // Education & Training
    'Education',
    'Online Learning',
    'Training',
    'Courses',
    'Books',
    'E-learning',
    
    // Business & Finance
    'Business Services',
    'Finance',
    'Insurance',
    'Real Estate',
    'Consulting',
    'Legal Services',
    
    // Entertainment & Media
    'Entertainment',
    'Movies',
    'Music',
    'Streaming',
    'Gaming',
    'Sports',
    
    // Sustainability & Green
    'Sustainability',
    'Green Energy',
    'Eco-friendly',
    'Renewable Energy',
    'Environmental',
    'Carbon Neutral',
    
    // Other
    'Other'
  ];

  const objectives = [
    'Brand Awareness',
    'Lead Generation',
    'Sales',
    'Website Traffic',
    'App Downloads',
    'Event Promotion',
    'Product Launch',
    'Customer Retention',
    'Market Research',
    'Social Media Growth'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    // Revoke the URL and remove from previews
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }

    if (!formData.productDescription.trim()) {
      newErrors.productDescription = 'Product description is required';
    }

    if (!formData.productCategory) {
      newErrors.productCategory = 'Product category is required';
    }

    if (!formData.objective) {
      newErrors.objective = 'Campaign objective is required';
    }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be greater than $0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Starting demo campaign creation...');
    console.log('📋 Form data:', formData);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setLoading(true);
    
    try {
      // Store form data in sessionStorage for the results page
      sessionStorage.setItem('demoCampaignData', JSON.stringify(formData));
      
      // Navigate to demo results page
      navigate('/demo/campaign/results');
      
    } catch (error) {
      console.error('💥 Error in demo campaign creation:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">🎯 Demo Campaign Creation</h2>
              <p className="text-emerald-100">Create a campaign to see AI-powered results (no account required)</p>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Create New Campaign</h1>
          <p className="text-slate-600 mt-1">Fill out the form below to generate an AI-powered campaign plan</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Product Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="productName" className="block text-sm font-medium text-slate-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="productName"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.productName ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="e.g., EcoSmart Solar Panel"
                    />
                    {errors.productName && (
                      <p className="mt-1 text-sm text-red-600">{errors.productName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="productCategory" className="block text-sm font-medium text-slate-700 mb-2">
                      Product Category *
                    </label>
                    <select
                      id="productCategory"
                      name="productCategory"
                      value={formData.productCategory}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.productCategory ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.productCategory && (
                      <p className="mt-1 text-sm text-red-600">{errors.productCategory}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="productDescription" className="block text-sm font-medium text-slate-700 mb-2">
                    Product Description *
                  </label>
                  <textarea
                    id="productDescription"
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.productDescription ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Describe your product, its benefits, and what makes it unique..."
                  />
                  {errors.productDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.productDescription}</p>
                  )}
                </div>
              </div>

              {/* Campaign Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Campaign Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="objective" className="block text-sm font-medium text-slate-700 mb-2">
                      Campaign Objective *
                    </label>
                    <select
                      id="objective"
                      name="objective"
                      value={formData.objective}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.objective ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select an objective</option>
                      {objectives.map((objective) => (
                        <option key={objective} value={objective}>
                          {objective}
                        </option>
                      ))}
                    </select>
                    {errors.objective && (
                      <p className="mt-1 text-sm text-red-600">{errors.objective}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                      Budget ($) *
                    </label>
                    <input
                      type="number"
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      min="1"
                      step="0.01"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.budget ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="e.g., 1000"
                    />
                    {errors.budget && (
                      <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Campaign Timeline */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Campaign Timeline</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.startDate ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.endDate ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <ImageIcon className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Product Images (Optional)</h2>
                </div>

                <div>
                  <label htmlFor="images" className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Images
                  </label>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <p className="mt-1 text-sm text-slate-500">
                    Upload up to 5 images of your product (JPG, PNG, GIF)
                  </p>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-slate-200">
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 text-lg"
                >
                  {loading ? 'Creating Campaign...' : 'Generate AI Campaign Plan'}
                </Button>
              </div>
            </form>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
};
