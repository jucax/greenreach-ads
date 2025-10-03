import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { generateCompanyCode } from '../../../utils/companyCode';
import { isValidEmail, calculatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor } from '../../../utils/validation';

interface CompanyData {
  name: string;
  industry: string;
  size: string;
  website: string;
  budgetRange: string;
  hasAdExperience: string;
  platforms: string[];
}

interface UserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  position: string;
}

export const CompanyRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [companyCode, setCompanyCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    industry: '',
    size: '',
    website: '',
    budgetRange: '',
    hasAdExperience: '',
    platforms: [],
  });

  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    position: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const platforms = [
    'Facebook Ads',
    'Instagram Ads',
    'Google Ads',
    'TikTok Ads',
    'LinkedIn Ads',
    'Other',
  ];

  const handleCompanyChange = (field: keyof CompanyData, value: string | string[]) => {
    setCompanyData({ ...companyData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleUserChange = (field: keyof UserData, value: string) => {
    setUserData({ ...userData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const togglePlatform = (platform: string) => {
    const platforms = companyData.platforms.includes(platform)
      ? companyData.platforms.filter(p => p !== platform)
      : [...companyData.platforms, platform];
    handleCompanyChange('platforms', platforms);
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!companyData.name.trim()) newErrors.name = 'Company name is required';
    if (!companyData.industry) newErrors.industry = 'Industry is required';
    if (!companyData.size) newErrors.size = 'Company size is required';
    if (!companyData.budgetRange) newErrors.budgetRange = 'Budget range is required';
    if (!companyData.hasAdExperience) newErrors.hasAdExperience = 'Please select an option';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!userData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!userData.email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(userData.email)) newErrors.email = 'Invalid email format';
    if (!userData.password) newErrors.password = 'Password is required';
    else if (userData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (userData.password !== userData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!userData.position.trim()) newErrors.position = 'Position is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate company code
    const code = generateCompanyCode();
    setCompanyCode(code);
    
    // TODO: Save to Supabase
    // const { data, error } = await supabase.from('companies').insert({...})
    
    setLoading(false);
    setStep(3);
    window.scrollTo(0, 0);
  };

  const passwordStrength = calculatePasswordStrength(userData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Register Your Company</h1>
          <p className="text-slate-600">Set up your organization's sustainable advertising hub</p>
        </div>

        {/* Progress Indicator */}
        {step < 3 && (
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  1
                </div>
                <div className={`w-32 h-1 mx-2 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  2
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-2 gap-32">
              <span className="text-xs text-slate-600">Company Info</span>
              <span className="text-xs text-slate-600">Your Account</span>
            </div>
          </div>
        )}

        {/* Step 1: Company Information */}
        {step === 1 && (
          <Card>
            <CardHeader className="p-8">
              <div className="space-y-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={companyData.name}
                    onChange={(e) => handleCompanyChange('name', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Acme Inc."
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={companyData.industry}
                    onChange={(e) => handleCompanyChange('industry', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.industry ? 'border-red-500' : 'border-slate-300'}`}
                  >
                    <option value="">Select industry...</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Retail">Retail</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                </div>

                {/* Company Size & Budget - Two columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Size <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={companyData.size}
                      onChange={(e) => handleCompanyChange('size', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.size ? 'border-red-500' : 'border-slate-300'}`}
                    >
                      <option value="">Select size...</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                    {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Website <span className="text-slate-400">(optional)</span>
                    </label>
                    <input
                      type="url"
                      value={companyData.website}
                      onChange={(e) => handleCompanyChange('website', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Monthly Ad Budget */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Monthly Ad Budget Range <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={companyData.budgetRange}
                    onChange={(e) => handleCompanyChange('budgetRange', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.budgetRange ? 'border-red-500' : 'border-slate-300'}`}
                  >
                    <option value="">Select budget range...</option>
                    <option value="Less than $500">Less than $500</option>
                    <option value="$500-$2,000">$500-$2,000</option>
                    <option value="$2,000-$10,000">$2,000-$10,000</option>
                    <option value="$10,000-$50,000">$10,000-$50,000</option>
                    <option value="$50,000+">$50,000+</option>
                  </select>
                  {errors.budgetRange && <p className="text-red-500 text-sm mt-1">{errors.budgetRange}</p>}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Advertising Experience <span className="text-slate-400 font-normal">(Helps our AI)</span>
                  </h3>

                  {/* Has Ad Experience */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Have you run digital ads before? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="hasAdExperience"
                          value="yes"
                          checked={companyData.hasAdExperience === 'yes'}
                          onChange={(e) => handleCompanyChange('hasAdExperience', e.target.value)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="ml-2 text-slate-700">Yes</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="hasAdExperience"
                          value="no"
                          checked={companyData.hasAdExperience === 'no'}
                          onChange={(e) => handleCompanyChange('hasAdExperience', e.target.value)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="ml-2 text-slate-700">No</span>
                      </label>
                    </div>
                    {errors.hasAdExperience && <p className="text-red-500 text-sm mt-1">{errors.hasAdExperience}</p>}
                  </div>

                  {/* Platforms (only show if has experience) */}
                  {companyData.hasAdExperience === 'yes' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Which platforms have you used?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {platforms.map((platform) => (
                          <label key={platform} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={companyData.platforms.includes(platform)}
                              onChange={() => togglePlatform(platform)}
                              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                            <span className="ml-2 text-slate-700">{platform}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* OAuth Integration Section */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Connect Your Accounts <span className="text-slate-400 font-normal">(Optional - Coming Soon)</span>
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    OAuth integration available in production version. For now, our AI uses industry benchmarks and the information you provide to make smart recommendations.
                  </p>
                  
                  <div className="space-y-3">
                    <button disabled className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 opacity-60 cursor-not-allowed">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">f</div>
                        <span className="ml-3 text-slate-700">Connect Facebook Business Manager</span>
                      </div>
                      <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded">Phase 2</span>
                    </button>
                    
                    <button disabled className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 opacity-60 cursor-not-allowed">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded flex items-center justify-center text-white font-bold">i</div>
                        <span className="ml-3 text-slate-700">Connect Instagram Business</span>
                      </div>
                      <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded">Phase 2</span>
                    </button>
                    
                    <button disabled className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 opacity-60 cursor-not-allowed">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold">G</div>
                        <span className="ml-3 text-slate-700">Connect Google Analytics</span>
                      </div>
                      <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded">Phase 2</span>
                    </button>
                  </div>
                </div>

                {/* Next Button */}
                <div className="pt-4">
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    variant="default"
                    size="lg"
                    className="w-full"
                  >
                    Next: Create Your Account →
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Step 2: Personal Account Creation */}
        {step === 2 && (
          <Card>
            <CardHeader className="p-8">
              <CardTitle className="text-2xl mb-2">Great! Now create your account</CardTitle>
              <CardDescription className="mb-6">You'll be the admin for {companyData.name}</CardDescription>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userData.fullName}
                    onChange={(e) => handleUserChange('fullName', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleUserChange('email', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={userData.password}
                    onChange={(e) => handleUserChange('password', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="••••••••"
                  />
                  {userData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className={getPasswordStrengthColor(passwordStrength)}>
                          {getPasswordStrengthLabel(passwordStrength)}
                        </span>
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`w-12 h-1 rounded ${i <= passwordStrength ? 'bg-emerald-500' : 'bg-slate-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={userData.confirmPassword}
                    onChange={(e) => handleUserChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Position/Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userData.position}
                    onChange={(e) => handleUserChange('position', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.position ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Marketing Manager"
                  />
                  {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    variant="default"
                    size="lg"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Company & Account'}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Step 3: Success Screen */}
        {step === 3 && (
          <Card>
            <CardHeader className="p-8 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-2">Company Created Successfully!</h2>
              <p className="text-slate-600 mb-8">Welcome to GreenReach Ads, {userData.fullName}!</p>

              {/* Company Code Display */}
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-6 mb-6">
                <p className="text-sm text-slate-600 mb-2">Your Company Code</p>
                <div className="text-4xl font-bold text-emerald-600 mb-4 tracking-wider">{companyCode}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(companyCode);
                    alert('Company code copied to clipboard!');
                  }}
                >
                  📋 Copy Code
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-blue-800">
                  <strong>Share this code with your team members</strong> so they can join {companyData.name}. They'll need it during registration.
                </p>
              </div>

              <Button
                variant="default"
                size="lg"
                className="w-full"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard →
              </Button>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

