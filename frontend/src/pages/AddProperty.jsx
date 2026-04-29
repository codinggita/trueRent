import React, { useState } from 'react';
import { Shield, ArrowLeft, Home, MapPin, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import propertyService from '../services/propertyService';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';

const AddProperty = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    location: '',
    rent: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`handleChange called with name: ${name}, value: ${value}`);
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = authService.getCurrentUser();
      const propertyData = {
        title: form.title,
        description: form.description,
        price: form.rent,
        location: form.location,
      };
      const data = await propertyService.createProperty(propertyData, user.token);
      if (data.success) {
        toast.success('Listing published successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create listing.';
      toast.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-8 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-700" />
          <span className="font-bold text-xl text-gray-900">True<span className="text-green-700">Rent</span></span>
        </div>
      </header>

      <div className="flex-1 p-8 flex justify-center">
        <div className="max-w-2xl w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
            <p className="text-gray-500">Provide accurate details for institutional verification.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Home className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="e.g. Luxury 2BHK in South Delhi"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 sm:text-sm"
                      value={form.title}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="e.g. Saket, New Delhi"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 sm:text-sm"
                      value={form.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent (INR)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="rent"
                      required
                      placeholder="e.g. 25000"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 sm:text-sm"
                      value={form.rent}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="description"
                      rows="4"
                      required
                      placeholder="Describe the property amenities, nearby landmarks, and rules..."
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 sm:text-sm"
                      value={form.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        List Property
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-gray-50 border-t border-gray-200 p-6">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-xs text-gray-500">
                  By listing your property, you agree to TrueRent's verification process. Our AI will audit your listing for accuracy and security compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
