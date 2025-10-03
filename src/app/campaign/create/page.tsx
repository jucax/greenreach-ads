import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Target, Calendar, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader } from '../../../components/ui/Card';
import { DashboardNavbar } from '../../../components/layout/DashboardNavbar';

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
    'Electronics',
    'Fashion/Apparel',
    'Home & Garden',
    'Food & Beverage',
    'Health & Wellness',
    'Software/SaaS',
    'Professional Services',
    'Other',
  ];

  const objectives = [
    'Increase Sales',
    'Build Brand Awareness',
    'Generate Leads',
    'Drive Website Traffic',
    'Promote Event',
    'Product Launch',
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
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, images: 'Only JPG, PNG, and WebP files are allowed' });
        return false;
      }
      
      if (file.size > maxSize) {
        setErrors({ ...errors, images: 'File size must be less than 5MB' });
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      setErrors({ ...errors, images: '' });
      handleChange('images', validFiles);

      // Create previews
      const previews = validFiles.map(file => URL.createObjectURL(file));
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
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call to generate campaign
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // TODO: Call actual Claude API endpoint with image files
    // const response = await fetch('/api/generate-campaign', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     ...formData,
    //     imageCount: formData.images.length
    //   })
    // });
    
    // For demo, navigate with mock data
    const mockResponse = {
      productName: formData.productName,
      productDescription: formData.productDescription,
      category: formData.productCategory,
      objective: formData.objective,
      budget: formData.budget,
      imageCount: formData.images.length,
      images: imagePreviews,
    };
    
    navigate('/campaign/results', { state: { campaignData: mockResponse } });
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