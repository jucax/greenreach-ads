import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { isValidEmail, calculatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor } from '../../../utils/validation';
import { supabase } from '../../../lib/supabase';
import { ImageService } from '../../../services/imageService';

interface CompanyData {
  name: string;
  industry: string;
  size: string;
  website: string;
  hasAdExperience: string;
  platforms: string[];
  logo?: File;
}

interface UserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  position: string;
  profilePicture?: File;
}

export const CompanyRegistrationPage: React.FC = () => {
  console.log('🏗️ CompanyRegistrationPage component rendering...');
  
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [companyCode, setCompanyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [authCredentials, setAuthCredentials] = useState({ email: '', password: '' });
  const [showOthersModal, setShowOthersModal] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const [connectedServices, setConnectedServices] = useState<Record<string, { email: string; connectedAt: string }>>({});
  
  console.log('🔍 Component state:', { step, loading, companyCode });

  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    industry: '',
    size: '',
    website: '',
    hasAdExperience: '',
    platforms: [],
    logo: undefined,
  });

  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    position: '',
    profilePicture: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');

  const platforms = [
    'Facebook Ads',
    'Instagram Ads',
    'Google Ads',
    'TikTok Ads',
    'LinkedIn Ads',
    'Other',
  ];

  const otherServices = [
    // Advertising Platforms
    'Facebook Business Manager',
    'Instagram Business',
    'Google Ads Manager',
    'TikTok Business Center',
    'LinkedIn Campaign Manager',
    // CRM & Sales
    'LinkedIn Sales Navigator',
    'Salesforce CRM',
    'HubSpot CRM',
    // Analytics & Marketing
    'Google Analytics',
    'Google Tag Manager',
    'Mailchimp',
    'Constant Contact',
    // Productivity & Communication
    'Zapier',
    'Slack',
    'Microsoft Teams',
    'Zoom',
    'Calendly',
    // Design & Creative
    'Typeform',
    'SurveyMonkey',
    'Canva',
    'Adobe Creative Suite',
    // E-commerce & Payments
    'Shopify',
    'WooCommerce',
    'Stripe',
    'PayPal',
    // Website Builders
    'WordPress',
    'Squarespace',
    'Wix',
    // Accounting & Finance
    'QuickBooks',
    'Xero',
    // Project Management
    'Asana',
    'Trello',
    'Monday.com',
    'Notion',
    'Airtable',
  ];

  // Service domain mapping for favicon API
  const serviceDomains: Record<string, string> = {
    'Facebook Business Manager': 'facebook.com',
    'Instagram Business': 'instagram.com',
    'Google Ads Manager': 'google.com',
    'TikTok Business Center': 'tiktok.com',
    'LinkedIn Campaign Manager': 'linkedin.com',
    'LinkedIn Sales Navigator': 'linkedin.com',
    'Salesforce CRM': 'salesforce.com',
    'HubSpot CRM': 'hubspot.com',
    'Google Analytics': 'google.com',
    'Google Tag Manager': 'google.com',
    'Mailchimp': 'mailchimp.com',
    'Constant Contact': 'constantcontact.com',
    'Zapier': 'zapier.com',
    'Slack': 'slack.com',
    'Microsoft Teams': 'microsoft.com',
    'Zoom': 'zoom.us',
    'Calendly': 'calendly.com',
    'Typeform': 'typeform.com',
    'SurveyMonkey': 'surveymonkey.com',
    'Canva': 'canva.com',
    'Adobe Creative Suite': 'adobe.com',
    'Shopify': 'shopify.com',
    'WooCommerce': 'woocommerce.com',
    'WordPress': 'wordpress.org',
    'Squarespace': 'squarespace.com',
    'Wix': 'wix.com',
    'Stripe': 'stripe.com',
    'PayPal': 'paypal.com',
    'QuickBooks': 'quickbooks.intuit.com',
    'Xero': 'xero.com',
    'Asana': 'asana.com',
    'Trello': 'trello.com',
    'Monday.com': 'monday.com',
    'Notion': 'notion.so',
    'Airtable': 'airtable.com',
  };

  // Helper function to get service initials
  const getServiceInitials = (service: string) => {
    const words = service.split(' ');
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return service.charAt(0).toUpperCase();
  };

  const platformToServiceMap: Record<string, string> = {
    'Facebook Ads': 'Facebook Business Manager',
    'Instagram Ads': 'Instagram Business',
    'Google Ads': 'Google Ads Manager',
    'TikTok Ads': 'TikTok Business Center',
    'LinkedIn Ads': 'LinkedIn Campaign Manager',
  };

  const handleCompanyChange = (field: keyof CompanyData, value: string | string[] | File) => {
    setCompanyData({ ...companyData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file
    const validation = ImageService.validateImageFile(file);
    if (!validation.valid) {
      setErrors({ ...errors, logo: validation.error || 'Invalid file' });
      return;
    }

    // Clear any previous errors
    if (errors.logo) {
      setErrors({ ...errors, logo: '' });
    }

    // Set the file and create preview
    handleCompanyChange('logo', file);
    const previewUrl = ImageService.createPreviewUrl(file);
    setLogoPreview(previewUrl);
  };

  const removeLogo = () => {
    if (logoPreview) {
      ImageService.revokePreviewUrl(logoPreview);
    }
    setCompanyData({ ...companyData, logo: undefined });
    setLogoPreview('');
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file
    const validation = ImageService.validateImageFile(file);
    if (!validation.valid) {
      setErrors({ ...errors, profilePicture: validation.error || 'Invalid file' });
      return;
    }

    // Clear any previous errors
    if (errors.profilePicture) {
      setErrors({ ...errors, profilePicture: '' });
    }

    // Set the file and create preview
    setUserData({ ...userData, profilePicture: file });
    const previewUrl = ImageService.createPreviewUrl(file);
    setProfilePicturePreview(previewUrl);
  };

  const removeProfilePicture = () => {
    if (profilePicturePreview) {
      ImageService.revokePreviewUrl(profilePicturePreview);
    }
    setUserData({ ...userData, profilePicture: undefined });
    setProfilePicturePreview('');
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
    
    // Update connected accounts based on selected platforms
    const newConnectedAccounts = platforms
      .filter(p => p !== 'Other' && platformToServiceMap[p])
      .map(p => platformToServiceMap[p]);
    setConnectedAccounts(newConnectedAccounts);
  };

  const handleConnectAccount = (service: string) => {
    setSelectedPlatform(service);
    setShowAuthModal(true);
  };

  const handleConnectOtherService = (service: string) => {
    setSelectedPlatform(service);
    setShowAuthModal(true);
    setShowOthersModal(false);
  };

  const handleServiceConnected = (service: string, email: string) => {
    // Add to connected services with timestamp
    setConnectedServices(prev => ({
      ...prev,
      [service]: {
        email,
        connectedAt: new Date().toISOString()
      }
    }));
    
    // Add to connected accounts if not already there
    if (!connectedAccounts.includes(service)) {
      setConnectedAccounts(prev => [...prev, service]);
    }
    
    // Clear credentials
    setAuthCredentials({ email: '', password: '' });
    setShowAuthModal(false);
  };

  const isServiceConnected = (service: string) => {
    return connectedServices.hasOwnProperty(service);
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!companyData.name.trim()) newErrors.name = 'Company name is required';
    if (!companyData.industry) newErrors.industry = 'Industry is required';
    if (!companyData.size) newErrors.size = 'Company size is required';
    if (!companyData.hasAdExperience) newErrors.hasAdExperience = 'Please select an option';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    console.log('🔍 Starting step 2 validation...');
    console.log('📋 Company data to validate:', companyData);
    console.log('👤 User data to validate:', { ...userData, password: '[HIDDEN]' });
    
    const newErrors: Record<string, string> = {};

    if (!userData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      console.log('❌ Full name validation failed');
    }
    if (!userData.email.trim()) {
      newErrors.email = 'Email is required';
      console.log('❌ Email validation failed - empty');
    } else if (!isValidEmail(userData.email)) {
      newErrors.email = 'Invalid email format';
      console.log('❌ Email validation failed - invalid format');
    }
    if (!userData.password) {
      newErrors.password = 'Password is required';
      console.log('❌ Password validation failed - empty');
    } else if (userData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      console.log('❌ Password validation failed - too short');
    }
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      console.log('❌ Password confirmation validation failed');
    }
    if (!userData.position.trim()) {
      newErrors.position = 'Position is required';
      console.log('❌ Position validation failed');
    }

    console.log('🔍 Validation errors found:', newErrors);
    console.log('✅ Validation result:', Object.keys(newErrors).length === 0);
    
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
    console.log('🚀 Starting company registration process...');
    console.log('📋 Company data:', companyData);
    console.log('👤 User data:', { ...userData, password: '[HIDDEN]' });
    console.log('🔍 Current step:', step);
    console.log('⏳ Loading state:', loading);
    
    if (!validateStep2()) {
      console.log('❌ Form validation failed');
      console.log('❌ Current errors:', errors);
      return;
    }

    console.log('✅ Form validation passed, setting loading to true...');
    setLoading(true);
    console.log('⏳ Loading state after setLoading(true):', loading);
    
    try {
      console.log('\n1️⃣ Generating company code...');
      const { data: generatedCode, error: codeError } = await supabase.rpc('generate_company_code');
      
      if (codeError) {
        console.error('❌ Error generating company code:', codeError);
        console.error('Code error details:', {
          message: codeError.message,
          details: codeError.details,
          hint: codeError.hint,
          code: codeError.code
        });
        alert('Error generating company code. Please try again.');
        setLoading(false);
        return;
      }
      
      const code = generatedCode;
      console.log('✅ Company code generated:', code);
      setCompanyCode(code);
      
      console.log('\n2️⃣ Skipping logo upload for now (will upload after user creation)...');
      let logoUrl: string | null = null;
      
      console.log('\n3️⃣ Creating company in database...');
      const companyInsertData = {
        name: companyData.name,
        industry: companyData.industry,
        size: companyData.size,
        website: companyData.website || null,
        monthly_budget_range: null, // Set to null instead of empty string
        has_ad_experience: companyData.hasAdExperience === 'yes',
        current_platforms: companyData.platforms,
        company_code: code,
        logo_url: logoUrl
      };
      console.log('📝 Company insert data:', companyInsertData);
      
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert(companyInsertData)
        .select()
        .single();
      
      if (companyError) {
        console.error('❌ Error creating company:', companyError);
        console.error('Company error details:', {
          message: companyError.message,
          details: companyError.details,
          hint: companyError.hint,
          code: companyError.code
        });
        alert('Error creating company. Please try again.');
        setLoading(false);
        return;
      }
      
      console.log('✅ Company created successfully:', company);
      
      console.log('\n4️⃣ Creating user account in Supabase Auth...');
      const authSignUpData = {
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.fullName,
            position: userData.position
          }
        }
      };
      console.log('📝 Auth signup data:', { ...authSignUpData, password: '[HIDDEN]' });
      
      const { data: authData, error: authError } = await supabase.auth.signUp(authSignUpData);
      
      if (authError) {
        console.error('❌ Error creating user account:', authError);
        console.error('Auth error details:', {
          message: authError.message,
          code: authError.status
        });
        alert('Error creating user account. Please try again.');
        setLoading(false);
        return;
      }
      
      console.log('✅ User account created successfully:', {
        user: authData.user ? {
          id: authData.user.id,
          email: authData.user.email,
          email_confirmed_at: authData.user.email_confirmed_at
        } : null,
        session: authData.session ? 'Session created' : 'No session'
      });
      
      console.log('\n5️⃣ Uploading company logo...');
      if (companyData.logo) {
        console.log('📤 Starting logo upload process...');
        console.log('📁 Logo file:', companyData.logo);
        try {
          // Use mock image service
          const logoUploadResult = await ImageService.uploadImage(
            companyData.logo,
            'company-logos',
            authData.user?.id || 'temp-company'
          );
          
          if (logoUploadResult.success && logoUploadResult.url) {
            logoUrl = logoUploadResult.url;
            console.log('✅ Logo uploaded successfully:', logoUrl);
            
            // Update company record with logo URL
            const { error: updateError } = await supabase
              .from('companies')
              .update({ logo_url: logoUrl })
              .eq('id', company.id);
            
            if (updateError) {
              console.error('❌ Error updating company with logo:', updateError);
            } else {
              console.log('✅ Company updated with logo URL');
            }
          } else {
            console.error('❌ Logo upload failed:', logoUploadResult.error);
            console.log('⚠️ Continuing registration without logo...');
          }
        } catch (err) {
          console.error('❌ Logo upload process failed:', err);
          console.error('❌ Logo upload error details:', {
            name: err instanceof Error ? err.name : 'Unknown',
            message: err instanceof Error ? err.message : String(err),
            cause: err instanceof Error ? err.cause : undefined
          });
          console.log('⚠️ Continuing registration without logo...');
        }
      } else {
        console.log('ℹ️ No logo provided, skipping upload');
      }
      
      console.log('\n6️⃣ Uploading profile picture...');
      let profilePictureUrl: string | null = null;
      
      if (userData.profilePicture) {
        console.log('📤 Starting profile picture upload process...');
        console.log('📁 Profile picture file:', userData.profilePicture);
        try {
          // Use mock image service
          const profileUploadResult = await ImageService.uploadImage(
            userData.profilePicture,
            'profile-pictures',
            authData.user?.id || 'temp-user'
          );
          
          if (profileUploadResult.success && profileUploadResult.url) {
            profilePictureUrl = profileUploadResult.url;
            console.log('✅ Profile picture uploaded successfully:', profilePictureUrl);
          } else {
            console.error('❌ Profile picture upload failed:', profileUploadResult.error);
            // Don't fail the entire registration for profile picture upload issues
            console.log('⚠️ Continuing registration without profile picture...');
          }
        } catch (err) {
          console.error('❌ Profile picture upload process failed:', err);
          console.error('❌ Profile picture upload error details:', {
            name: err instanceof Error ? err.name : 'Unknown',
            message: err instanceof Error ? err.message : String(err),
            cause: err instanceof Error ? err.cause : undefined
          });
          // Don't fail the entire registration for profile picture upload issues
          console.log('⚠️ Continuing registration without profile picture...');
        }
      } else {
        console.log('ℹ️ No profile picture provided, skipping upload');
      }
      
      console.log('\n6️⃣ Creating user profile in database...');
      const userInsertData = {
        id: authData.user?.id,
        email: userData.email,
        name: userData.fullName,
        position: userData.position,
        company_id: company.id,
        is_company_admin: true,
        profile_picture_url: profilePictureUrl
      };
      console.log('📝 User insert data:', userInsertData);
      
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert(userInsertData)
        .select()
        .single();
      
      if (userError) {
        console.error('❌ Error creating user profile:', userError);
        console.error('User error details:', {
          message: userError.message,
          details: userError.details,
          hint: userError.hint,
          code: userError.code
        });
        alert('Error creating user profile. Please try again.');
        setLoading(false);
        return;
      }
      
      console.log('\n7️⃣ Signing in user...');
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password
      });
      
      if (signInError) {
        console.error('❌ Error signing in user:', signInError);
        console.log('⚠️ User created but sign-in failed. User can sign in manually.');
      } else {
        console.log('✅ User signed in successfully');
      }
      
      console.log('\n🎉 Registration completed successfully!');
      console.log('✅ Company created:', {
        id: company.id,
        name: company.name,
        code: company.company_code,
        industry: company.industry
      });
      console.log('✅ User created:', {
        id: user.id,
        name: user.name,
        email: user.email,
        company_id: user.company_id,
        is_admin: user.is_company_admin
      });
      
      setLoading(false);
      setStep(3);
      window.scrollTo(0, 0);
      
    } catch (error) {
      console.error('\n💥 Unexpected registration error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        cause: error instanceof Error ? error.cause : undefined
      });
      alert('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(userData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
            <div className="flex-1" />
          </div>
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
                    <option value="Technology & Software">Technology & Software</option>
                    <option value="E-commerce & Retail">E-commerce & Retail</option>
                    <option value="SaaS & Cloud Services">SaaS & Cloud Services</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Healthcare & Medical">Healthcare & Medical</option>
                    <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Education & Training">Education & Training</option>
                    <option value="Entertainment & Media">Entertainment & Media</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Travel & Hospitality">Travel & Hospitality</option>
                    <option value="Fashion & Beauty">Fashion & Beauty</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                    <option value="Non-Profit & NGO">Non-Profit & NGO</option>
                    <option value="Legal Services">Legal Services</option>
                    <option value="Consulting & Professional Services">Consulting & Professional Services</option>
                    <option value="Agriculture & Farming">Agriculture & Farming</option>
                    <option value="Energy & Utilities">Energy & Utilities</option>
                    <option value="Telecommunications">Telecommunications</option>
                    <option value="Transportation & Logistics">Transportation & Logistics</option>
                    <option value="Construction & Engineering">Construction & Engineering</option>
                    <option value="Government & Public Sector">Government & Public Sector</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Marketing & Advertising">Marketing & Advertising</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                </div>

                {/* Company Logo */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Logo <span className="text-slate-400">(optional)</span>
                  </label>
                  <div className="space-y-4">
                    {!logoPreview ? (
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <svg className="w-12 h-12 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-slate-600 font-medium">Upload Company Logo</span>
                          <span className="text-slate-400 text-sm">JPG, PNG, or WebP (max 5MB)</span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={logoPreview}
                          alt="Company logo preview"
                          className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {errors.logo && <p className="text-red-500 text-sm">{errors.logo}</p>}
                  </div>
                </div>

                {/* Company Size & Website - Two columns on desktop */}
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
                    Connect Your Accounts <span className="text-slate-400 font-normal">(Optional)</span>
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Connect your advertising accounts to get personalized recommendations and sync your campaign data.
                  </p>
                  
                  <div className="space-y-3">
                    {connectedAccounts.length > 0 && (
                      <>
                        {connectedAccounts.map((service) => {
                          const getServiceLogo = (service: string) => {
                            // Try favicon API first (most reliable)
                            const domain = serviceDomains[service];
                            if (domain) {
                              return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
                            }
                            
                            // Fallback to Wikipedia URLs for specific services
                            if (service.includes('Facebook')) return 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png';
                            if (service.includes('Instagram')) return 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg';
                            if (service.includes('Google')) return 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg';
                            if (service.includes('TikTok')) return 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg';
                            if (service.includes('LinkedIn')) return 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png';
                            
                            return null;
                          };
                          
                          const getServiceColor = (service: string) => {
                            if (service.includes('Facebook')) return 'bg-blue-600';
                            if (service.includes('Instagram')) return 'bg-gradient-to-br from-purple-600 to-pink-600';
                            if (service.includes('Google')) return 'bg-red-600';
                            if (service.includes('TikTok')) return 'bg-black';
                            if (service.includes('LinkedIn')) return 'bg-blue-700';
                            return 'bg-slate-600';
                          };
                          
                          const logo = getServiceLogo(service);
                          
                          return (
                            <button 
                              key={service}
                              onClick={() => handleConnectAccount(service)}
                              className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center">
                                <div className={`w-8 h-8 ${logo ? 'bg-white border border-slate-200' : getServiceColor(service)} rounded flex items-center justify-center overflow-hidden`}>
                                  {logo ? (
                                    <img 
                                      src={logo} 
                                      alt={`${service} logo`}
                                      className="w-6 h-6 object-contain"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const nextElement = target.nextElementSibling as HTMLElement;
                                        if (nextElement) nextElement.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div className="w-6 h-6 flex items-center justify-center text-white font-bold text-xs" style={{display: logo ? 'none' : 'flex'}}>
                                    {getServiceInitials(service)}
                                  </div>
                                </div>
                                <span className="ml-3 text-slate-700">Connect {service}</span>
                              </div>
                              {isServiceConnected(service) ? (
                                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">Connected</span>
                              ) : (
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-600 text-xs rounded">Connect</span>
                              )}
                            </button>
                          );
                        })}
                      </>
                    )}
                    
                    <button 
                      onClick={() => setShowOthersModal(true)}
                      className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600"
                    >
                      <span className="mr-2">+</span>
                      Connect Other Services
                    </button>
                    
                    {connectedAccounts.length === 0 && (
                      <div className="text-center py-4 text-slate-500">
                        <p className="text-sm">Select platforms above to see specific connection options, or connect other services directly</p>
                      </div>
                    )}
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
                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Profile Picture <span className="text-slate-400">(optional)</span>
                  </label>
                  <div className="space-y-4">
                    {!profilePicturePreview ? (
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                          id="profile-picture-upload"
                        />
                        <label
                          htmlFor="profile-picture-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <svg className="w-12 h-12 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-slate-600 font-medium">Upload Profile Picture</span>
                          <span className="text-slate-400 text-sm">JPG, PNG, or WebP (max 5MB)</span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative inline-block">
                        <img
                          src={profilePicturePreview}
                          alt="Profile picture preview"
                          className="w-24 h-24 object-cover rounded-full border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={removeProfilePicture}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {errors.profilePicture && <p className="text-red-500 text-sm">{errors.profilePicture}</p>}
                  </div>
                </div>

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
                    onClick={() => {
                      console.log('🖱️ Create button clicked!');
                      console.log('🔍 Button state - loading:', loading);
                      console.log('🔍 Button state - step:', step);
                      console.log('🔍 Button state - errors:', errors);
                      handleSubmit();
                    }}
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
                onClick={async () => {
                  console.log('🚀 Company registration: Navigating to dashboard...');
                  // Wait a moment for the auth session to be fully established
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  navigate('/dashboard', { replace: true });
                }}
              >
                Go to Dashboard →
              </Button>
            </CardHeader>
          </Card>
        )}

        {/* Authorization Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Connect {selectedPlatform}
                </h3>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-sm text-slate-600 mb-6">
                Enter your {selectedPlatform} credentials to authorize access to your advertising data.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={authCredentials.email}
                    onChange={(e) => setAuthCredentials({...authCredentials, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={authCredentials.password}
                    onChange={(e) => setAuthCredentials({...authCredentials, password: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="authorize"
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                  />
                  <label htmlFor="authorize" className="ml-2 text-sm text-slate-600">
                    I authorize GreenReach Ads to access my {selectedPlatform} data for campaign optimization
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (authCredentials.email && authCredentials.password) {
                      // TODO: Implement actual OAuth flow
                      handleServiceConnected(selectedPlatform, authCredentials.email);
                      alert(`${selectedPlatform} connection successful! (Demo mode)`);
                    } else {
                      alert('Please enter both email and password');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Authorize & Connect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Others Services Modal */}
        {showOthersModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Connect Other Services
                </h3>
                <button
                  onClick={() => setShowOthersModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-sm text-slate-600 mb-4">
                Select additional services to connect for enhanced campaign insights and data synchronization.
              </p>
              
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {otherServices.map((service) => {
                    const getServiceLogo = (service: string) => {
                      // Try favicon API first (most reliable)
                      const domain = serviceDomains[service];
                      if (domain) {
                        return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
                      }
                      
                      // Fallback to Wikipedia URLs for specific services
                      if (service.includes('LinkedIn')) return 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png';
                      if (service.includes('Salesforce')) return 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg';
                      if (service.includes('HubSpot')) return 'https://upload.wikimedia.org/wikipedia/commons/0/0a/HubSpot_Logo.svg';
                      if (service.includes('Google')) return 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg';
                      if (service.includes('Mailchimp')) return 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Mailchimp_logo.svg';
                      if (service.includes('Slack')) return 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg';
                      if (service.includes('Zoom')) return 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg';
                      if (service.includes('Shopify')) return 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_black.svg';
                      if (service.includes('Stripe')) return 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg';
                      if (service.includes('PayPal')) return 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg';
                      if (service.includes('QuickBooks')) return 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Intuit_QuickBooks_logo.svg';
                      if (service.includes('Asana')) return 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Asana_Logo.svg';
                      if (service.includes('Trello')) return 'https://upload.wikimedia.org/wikipedia/commons/0/07/Trello_logo.svg';
                      if (service.includes('Notion')) return 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png';
                      if (service.includes('Canva')) return 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg';
                      if (service.includes('WordPress')) return 'https://upload.wikimedia.org/wikipedia/commons/9/93/WordPress_Blue_logo.svg';
                      if (service.includes('Squarespace')) return 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Squarespace_logo.svg';
                      if (service.includes('Wix')) return 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wix.com_website_creator_logo.svg';
                      if (service.includes('Zapier')) return 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Zapier_logo.svg';
                      if (service.includes('Typeform')) return 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Typeform_logo.svg';
                      if (service.includes('SurveyMonkey')) return 'https://upload.wikimedia.org/wikipedia/commons/7/77/SurveyMonkey_logo.svg';
                      if (service.includes('Adobe')) return 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg';
                      if (service.includes('WooCommerce')) return 'https://upload.wikimedia.org/wikipedia/commons/0/0b/WooCommerce_logo.svg';
                      if (service.includes('Xero')) return 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Xero_logo.svg';
                      if (service.includes('Monday.com')) return 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Monday.com_logo.svg';
                      if (service.includes('Airtable')) return 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Airtable_logo.svg';
                      if (service.includes('Microsoft')) return 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg';
                      if (service.includes('Constant Contact')) return 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Constant_Contact_logo.svg';
                      if (service.includes('Calendly')) return 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Calendly_logo.svg';
                      
                      return null;
                    };
                    
                    const getServiceColor = (service: string) => {
                      if (service.includes('LinkedIn')) return 'bg-blue-700';
                      if (service.includes('Salesforce')) return 'bg-blue-500';
                      if (service.includes('HubSpot')) return 'bg-orange-500';
                      if (service.includes('Google')) return 'bg-red-600';
                      if (service.includes('Mailchimp')) return 'bg-yellow-500';
                      if (service.includes('Slack')) return 'bg-purple-600';
                      if (service.includes('Zoom')) return 'bg-blue-600';
                      if (service.includes('Shopify')) return 'bg-green-600';
                      if (service.includes('Stripe')) return 'bg-indigo-600';
                      if (service.includes('PayPal')) return 'bg-blue-400';
                      if (service.includes('QuickBooks')) return 'bg-blue-800';
                      if (service.includes('Asana')) return 'bg-red-500';
                      if (service.includes('Trello')) return 'bg-blue-500';
                      if (service.includes('Notion')) return 'bg-gray-800';
                      if (service.includes('Canva')) return 'bg-purple-500';
                      if (service.includes('WordPress')) return 'bg-blue-600';
                      if (service.includes('Squarespace')) return 'bg-black';
                      if (service.includes('Wix')) return 'bg-orange-500';
                      if (service.includes('Zapier')) return 'bg-orange-400';
                      if (service.includes('Typeform')) return 'bg-purple-600';
                      if (service.includes('SurveyMonkey')) return 'bg-blue-500';
                      if (service.includes('Adobe')) return 'bg-red-500';
                      if (service.includes('WooCommerce')) return 'bg-purple-600';
                      if (service.includes('Xero')) return 'bg-blue-600';
                      if (service.includes('Monday.com')) return 'bg-red-500';
                      if (service.includes('Airtable')) return 'bg-orange-500';
                      if (service.includes('Microsoft')) return 'bg-blue-600';
                      if (service.includes('Constant Contact')) return 'bg-orange-500';
                      if (service.includes('Calendly')) return 'bg-blue-600';
                      return 'bg-slate-600';
                    };
                    
                    const logo = getServiceLogo(service);
                    
                    return (
                      <button
                        key={service}
                        onClick={() => handleConnectOtherService(service)}
                        className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className={`w-8 h-8 ${logo ? 'bg-white border border-slate-200' : getServiceColor(service)} rounded flex items-center justify-center overflow-hidden mr-3`}>
                          {logo ? (
                            <img 
                              src={logo} 
                              alt={`${service} logo`}
                              className="w-6 h-6 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const nextElement = target.nextElementSibling as HTMLElement;
                                if (nextElement) nextElement.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-6 h-6 flex items-center justify-center text-white font-bold text-xs" style={{display: logo ? 'none' : 'flex'}}>
                            {getServiceInitials(service)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-slate-700">{service}</span>
                          {isServiceConnected(service) && (
                            <div className="text-xs text-green-600 mt-1">
                              Connected as {connectedServices[service]?.email}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowOthersModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

