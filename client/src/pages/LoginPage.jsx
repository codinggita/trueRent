import React, { useState } from 'react';
import { Shield, CheckCircle, CreditCard, Eye, EyeOff, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tenant');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const data = await authService.login(formData);
      if (data.success) {
        toast.success('Welcome back to TrueRent!');
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Simple Header */}
      <header className="w-full bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-700" />
          <span className="font-bold text-xl text-gray-900">True<span className="text-green-700">Rent</span></span>
        </Link>
        <button className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
          Get Early Access
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* LEFT SIDE - Info Section */}
        <div className="hidden md:flex md:w-[45%] bg-[#f8fafc] flex-col justify-center px-12 lg:px-24">
          <div className="max-w-md">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-8">
              <Shield className="w-4 h-4" />
              No brokers allowed
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Institutional Trust. Operational Clarity.
            </h1>

            <p className="text-gray-600 mb-12">
              Join India's most secure rental verification network. We connect verified owners directly with high-trust tenants, removing middle-men and hidden fees.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="mb-3">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">KYC Verified</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Every profile is audited via Aadhaar and PAN for total safety.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="mb-3">
                  <CreditCard className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Direct Pay</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Automated rental payments with institutional-grade security.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 py-12 bg-white">
          <div className="mx-auto w-full max-w-[420px]">
            <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
              
              {/* Top Tabs */}
              <div className="flex w-full mb-6">
                <button
                  className={`flex-1 py-4 text-center font-medium text-sm transition-all border-b-2 ${
                    activeTab === 'tenant' ? 'text-green-700 border-green-700' : 'text-gray-500 border-gray-100 bg-gray-50/50 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('tenant')}
                >
                  Tenant
                </button>
                <button
                  className={`flex-1 py-4 text-center font-medium text-sm transition-all border-b-2 ${
                    activeTab === 'owner' ? 'text-green-700 border-green-700' : 'text-gray-500 border-gray-100 bg-gray-50/50 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('owner')}
                >
                  Owner
                </button>
              </div>

              <div className="px-8 pb-8">
                <div className="mb-6 text-center">
                  <h2 className="text-xl font-medium text-gray-900 mb-1">Welcome back</h2>
                  <p className="text-gray-500 text-sm">Secure access to your rental portal</p>
                </div>

                <div className="mb-6">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Continue with Google
                  </button>
                </div>

                <div className="mb-6 flex items-center justify-center space-x-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-400 px-2">OR</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {error && (
                  <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="login-email"
                      required
                      placeholder="name@company.com"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all text-gray-900"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        id="login-password"
                        required
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all text-gray-900 pr-10"
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
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        id="login-remember"
                        className="w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-green-700"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm font-medium text-green-700 hover:text-green-800">
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    id="login-submit"
                    disabled={isLoading}
                    className="w-full bg-[#166534] hover:bg-green-800 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 mt-4"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-green-700 hover:text-green-800">
                    Create Account
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

      {/* Simple Footer */}
      <footer className="w-full bg-white border-t border-gray-100 py-6 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1 mb-4 md:mb-0 font-medium">
          <Shield className="w-4 h-4 text-gray-400" />
          © 2024 TrueRent India. Institutional Trust & Operational Clarity.
        </div>
        <div className="flex gap-6 font-medium">
          <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Security Shield</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
