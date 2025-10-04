import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader } from '../../../components/ui/Card';
import { validateCompanyCodeFormat, formatCompanyCodeInput } from '../../../utils/companyCode';
import { isValidEmail, calculatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor } from '../../../utils/validation';
import { supabase } from '../../../lib/supabase';
import { ImageService } from '../../../services/imageService';

interface IndividualData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  position: string;
  companyCode: string;
  companyId?: string;
  profilePicture?: File;
}

export const IndividualRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [codeValidated, setCodeValidated] = useState(false);

  const [formData, setFormData] = useState<IndividualData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    position: '',
    companyCode: '',
    profilePicture: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');

  const handleChange = (field: keyof IndividualData, value: string | File) => {
    let processedValue = value;
    
    // Auto-format company code
    if (field === 'companyCode' && typeof value === 'string') {
      processedValue = formatCompanyCodeInput(value);
      setCodeValidated(false);
      setCompanyName('');
    }

    setFormData({ ...formData, [field]: processedValue });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
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
    handleChange('profilePicture', file);
    const previewUrl = ImageService.createPreviewUrl(file);
    setProfilePicturePreview(previewUrl);
  };

  const removeProfilePicture = () => {
    if (profilePicturePreview) {
      ImageService.revokePreviewUrl(profilePicturePreview);
    }
    setFormData({ ...formData, profilePicture: undefined });
    setProfilePicturePreview('');
  };


  const validateCompanyCode = async () => {
    if (!validateCompanyCodeFormat(formData.companyCode)) {
      setErrors({ ...errors, companyCode: 'Invalid code format. Should be GR-XXXXXX' });
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔍 Validating company code:', formData.companyCode);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Validation timeout')), 5000)
      );
      
      const queryPromise = supabase
        .from('companies')
        .select('id, name')
        .eq('company_code', formData.companyCode)
        .single();
      
      const { data: company, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      console.log('🔍 Validation result:', { company, error });
      
      if (error || !company) {
        console.log('❌ Company code not found:', formData.companyCode);
        setErrors({ ...errors, companyCode: 'Company code not found. Please check with your manager.' });
        setCompanyName('');
        setCodeValidated(false);
      } else {
        console.log('✅ Company found:', company);
        setCompanyName(company.name);
        setCodeValidated(true);
        setErrors({ ...errors, companyCode: '' });
        setFormData(prev => ({ ...prev, companyId: company.id }));
      }
    } catch (error) {
      console.error('💥 Validation error:', error);
      setErrors({ ...errors, companyCode: 'Error validating company code' });
      setCompanyName('');
      setCodeValidated(false);
    }
    
    setLoading(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.companyCode.trim()) newErrors.companyCode = 'Company code is required';
    else if (!codeValidated) newErrors.companyCode = 'Please validate your company code';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Starting individual registration process...');
    console.log('📋 Form data:', { ...formData, password: '[HIDDEN]' });
    console.log('🏢 Company name:', companyName);
    console.log('✅ Code validated:', codeValidated);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setLoading(true);
    
    try {
      // Use the company ID from validation if available
      const companyId = formData.companyId;
      
      if (!companyId) {
        console.error('❌ No company ID available. Please validate company code first.');
        alert('Please validate your company code first.');
        setLoading(false);
        return;
      }
      
      console.log('✅ Using validated company ID:', companyId);
      
      console.log('\n1️⃣ Creating user account in Supabase Auth...');
      console.log('📝 Form data:', {
        email: formData.email,
        fullName: formData.fullName,
        position: formData.position,
        companyCode: formData.companyCode,
        companyId: companyId,
        passwordLength: formData.password.length
      });
      
      const authSignUpData = {
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.fullName,
            position: formData.position
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
        
        // Show more specific error message
        let errorMessage = 'Error creating user account. Please try again.';
        if (authError.message.includes('already registered')) {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        } else if (authError.message.includes('invalid')) {
          errorMessage = 'Invalid email format. Please check your email address.';
        } else if (authError.message.includes('password')) {
          errorMessage = 'Password requirements not met. Please ensure your password is at least 6 characters.';
        } else if (authError.message) {
          errorMessage = `Registration failed: ${authError.message}`;
        }
        
        alert(errorMessage);
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
      
      console.log('\n2️⃣ Uploading profile picture...');
      let profilePictureUrl: string | null = null;
      
      if (formData.profilePicture) {
        console.log('📤 Uploading profile picture...');
        const profileUploadResult = await ImageService.uploadImage(
          formData.profilePicture,
          'profile-pictures',
          authData.user?.id || 'temp-user'
        );
        
        if (profileUploadResult.success && profileUploadResult.url) {
          profilePictureUrl = profileUploadResult.url;
          console.log('✅ Profile picture uploaded successfully:', profilePictureUrl);
        } else {
          console.error('❌ Profile picture upload failed:', profileUploadResult.error);
          alert('Profile picture upload failed. Please try again.');
          setLoading(false);
          return;
        }
      } else {
        console.log('ℹ️ No profile picture provided, skipping upload');
      }
      
      console.log('\n3️⃣ Creating user profile in database...');
      const userInsertData = {
        id: authData.user?.id,
        email: formData.email,
        name: formData.fullName,
        position: formData.position,
        company_id: companyId,
        is_company_admin: false,
        profile_picture_url: profilePictureUrl
      };
      console.log('📝 User insert data:', userInsertData);
      
      const { error: userError } = await supabase
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
      
      console.log('✅ Registration completed successfully!');
      
      // Redirect immediately - no need to wait
      setLoading(false);
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      console.error('\n💥 Unexpected registration error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      alert('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Join Your Team</h1>
          <p className="text-slate-600">Create your account and start creating sustainable campaigns</p>
        </div>

        <Card>
          <CardHeader className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
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
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Two column layout for passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="••••••••"
                  />
                  {formData.password && (
                    <div className="mt-2">
                      <span className={`text-xs ${getPasswordStrengthColor(passwordStrength)}`}>
                        {getPasswordStrengthLabel(passwordStrength)}
                      </span>
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
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Position/Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.position ? 'border-red-500' : 'border-slate-300'}`}
                  placeholder="Marketing Specialist"
                />
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200 pt-6">
                {/* Company Code */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Code <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.companyCode}
                      onChange={(e) => handleChange('companyCode', e.target.value)}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.companyCode ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="GR-XXXXXX"
                      maxLength={9}
                    />
                    <Button
                      type="button"
                      onClick={validateCompanyCode}
                      variant="outline"
                      size="md"
                      disabled={loading || !validateCompanyCodeFormat(formData.companyCode)}
                    >
                      {loading ? 'Checking...' : 'Validate'}
                    </Button>
                  </div>
                  
                  {codeValidated && companyName && (
                    <div className="mt-2 flex items-center text-emerald-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Validated! Joining {companyName}</span>
                    </div>
                  )}
                  
                  {errors.companyCode && <p className="text-red-500 text-sm mt-1">{errors.companyCode}</p>}
                  
                  <p className="text-xs text-slate-500 mt-2">
                    Get your company code from your manager or team admin
                  </p>
                </div>
              </div>

              {/* Note */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-700">
                  Don't have a company code yet?{' '}
                  <Link to="/register/company" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Register your company
                  </Link>{' '}
                  or ask your manager for the code.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : codeValidated ? `Join ${companyName}` : 'Create Account'}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link to="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

