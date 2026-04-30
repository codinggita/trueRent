import React, { useState } from 'react';
import { Shield, ArrowLeft, Home, MapPin, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProperty } from '../services/api';
import { toast } from 'react-hot-toast';

const AddProperty = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    location: '',
    rent: '',
    description: ''
  });

  const mutation = useMutation({
    mutationFn: (data) => createProperty(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      
      const analysis = res.data;
      if (analysis.riskLevel === 'low') {
        toast.success('Listing published! AI Scan: Safe Listing.');
      } else {
        toast.error(`Published with warnings: AI flagged as ${analysis.riskLevel} risk.`);
      }
      navigate('/dashboard');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create listing.');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      title: form.title,
      description: form.description,
      price: Number(form.rent),
      location: form.location,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-emerald-700 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-600" />
          <span className="font-bold text-xl text-gray-900">True<span className="text-emerald-600">Rent</span></span>
        </div>
      </header>

      <div className="flex-1 p-4 sm:p-8 flex justify-center">
        <div className="max-w-2xl w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Property</h1>
            <p className="text-gray-500">Provide accurate details for institutional AI verification.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Property Title</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Home className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="e.g. Luxury 2BHK in South Delhi"
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      value={form.title}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="e.g. Saket, New Delhi"
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      value={form.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rent (INR)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="rent"
                      required
                      placeholder="e.g. 25000"
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      value={form.rent}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3.5 flex items-start pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="description"
                      rows="4"
                      required
                      placeholder="Describe the property amenities..."
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      value={form.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    {mutation.isPending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Publish & AI Scan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-emerald-50/50 border-t border-emerald-100 p-6 text-center">
               <p className="text-xs text-emerald-800 font-medium">TrueRent AI scans every listing to protect tenants from rental fraud.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
