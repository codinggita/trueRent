import React, { useState } from 'react';
import { Shield, CheckCircle, CreditCard, Eye, EyeOff, Lock, Home, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';

const SignupPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('tenant');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = 'Enter a valid email address.';
    if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';
    if (!formData.phone.match(/^[6-9]\d{9}$/))
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    setErrors({});

    try {
      const data = await authService.register({
        ...formData,
        role: role, // 'tenant' or 'owner' from state
      });
      if (data.success) {
        toast.success('Account created successfully! Please sign in.');
        navigate('/login');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      setErrors({ server: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2.5 rounded-lg border ${
      errors[field] ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-green-600 focus:ring-green-600'
    } focus:ring-1 outline-none transition-all text-gray-900 bg-white`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-700" />
          <span className="font-bold text-xl text-gray-900">
            True<span className="text-green-700">Rent</span>
          </span>
        </Link>
        <Link
          to="/login"
          className="text-sm font-medium text-green-700 hover:text-green-800 flex items-center gap-1"
        >
          Already have an account? <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* LEFT – Info Section */}
        <div className="hidden md:flex md:w-[45%] bg-[#f8fafc] flex-col justify-center px-12 lg:px-24">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-8">
              <Home className="w-4 h-4" />
              Join 50,000+ verified users
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Rent Smarter. Detect Fraud. Stay Safe.
            </h1>

            <p className="text-gray-600 mb-12">
              Create your TrueRent account and get instant access to AI-powered fraud detection, verified listings, and direct landlord connections.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="mb-3">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">AI Fraud Alerts</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Suspicious listings flagged in real-time before you pay.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="mb-3">
                  <CreditCard className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure Payments</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Escrow-backed transactions with full dispute protection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT – Signup Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 py-12 bg-white">
          <div className="mx-auto w-full max-w-[440px]">
            <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">

              {/* Role Tabs */}
              <div className="flex w-full mb-2">
                {['tenant', 'owner'].map((r) => (
                  <button
                    key={r}
                    className={`flex-1 py-4 text-center font-medium text-sm capitalize transition-all border-b-2 ${
                      role === r
                        ? 'text-green-700 border-green-700'
                        : 'text-gray-500 border-gray-100 bg-gray-50/50 hover:text-gray-700'
                    }`}
                    onClick={() => setRole(r)}
                  >
                    {r === 'tenant' ? 'Tenant' : 'Property Owner'}
                  </button>
                ))}
              </div>

              <div className="px-8 pb-8 pt-4">
                <div className="mb-6 text-center">
                  <h2 className="text-xl font-medium text-gray-900 mb-1">Create your account</h2>
                  <p className="text-gray-500 text-sm">Join India's trusted rental network</p>
                </div>

                {errors.server && (
                  <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {errors.server}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="signup-name"
                      required
                      placeholder="Arjun Sharma"
                      className={inputClass('name')}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="signup-email"
                      required
                      placeholder="name@company.com"
                      className={inputClass('email')}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <span className="inline-flex items-center px-3 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-600 text-sm font-medium select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        id="signup-phone"
                        required
                        placeholder="9876543210"
                        maxLength={10}
                        className={`flex-1 ${inputClass('phone')}`}
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        id="signup-password"
                        required
                        placeholder="Min. 8 characters"
                        className={`${inputClass('password')} pr-10`}
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        name="confirmPassword"
                        id="signup-confirm-password"
                        required
                        placeholder="Re-enter your password"
                        className={`${inputClass('confirmPassword')} pr-10`}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    id="signup-submit"
                    disabled={isLoading}
                    className="w-full bg-[#166534] hover:bg-green-800 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 mt-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-green-700 hover:text-green-800">
                    Sign In
                  </Link>
                </p>
              </div>

              <div className="border-t border-gray-100 p-4 bg-gray-50/50 flex items-center justify-center gap-2 text-sm text-green-800 font-medium rounded-b-xl">
                <Lock className="w-4 h-4" />
                <span>256-bit SSL Secured Connection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-100 py-6 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1 mb-4 md:mb-0 font-medium">
          <Shield className="w-4 h-4 text-gray-400" />© 2024 TrueRent India. All rights reserved.
        </div>
        <div className="flex gap-6 font-medium">
          <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default SignupPage;
