import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader } from '../../../components/ui/Card';
import { validateCompanyCodeFormat, formatCompanyCodeInput } from '../../../utils/companyCode';
import { isValidEmail, calculatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor } from '../../../utils/validation';

interface IndividualData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  position: string;
  companyCode: string;
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof IndividualData, value: string) => {
    let processedValue = value;
    
    // Auto-format company code
    if (field === 'companyCode') {
      processedValue = formatCompanyCodeInput(value);
      setCodeValidated(false);
      setCompanyName('');
    }

    setFormData({ ...formData, [field]: processedValue });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateCompanyCode = async () => {
    if (!validateCompanyCodeFormat(formData.companyCode)) {
      setErrors({ ...errors, companyCode: 'Invalid code format. Should be GR-XXXXXX' });
      return;
    }

    setLoading(true);
    
    // Simulate API call to validate company code
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // TODO: Check against Supabase
    // const { data, error } = await supabase.from('companies').select('name').eq('company_code', formData.companyCode).single()
    
    // For demo, accept any properly formatted code
    const demoCompanyName = 'Acme Inc.'; // This would come from the database
    
    if (demoCompanyName) {
      setCompanyName(demoCompanyName);
      setCodeValidated(true);
      setErrors({ ...errors, companyCode: '' });
    } else {
      setErrors({ ...errors, companyCode: 'Company code not found. Please check with your manager.' });
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
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // TODO: Save to Supabase
    // const { data, error } = await supabase.from('users').insert({...})
    
    setLoading(false);
    navigate('/dashboard');
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

