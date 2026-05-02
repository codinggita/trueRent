import React, { useState } from 'react';
import { Shield, ArrowLeft, Home, MapPin, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProperty } from '../services/api';
import { toast } from 'react-hot-toast';

import DashboardLayout from '../components/DashboardLayout';

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
    <DashboardLayout title="Create New Listing">
      <div className="max-w-2xl mx-auto py-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Property Details</h2>
          <p className="text-gray-500 text-sm font-medium">Provide accurate details for institutional AI verification.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Property Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Home className="h-5 w-5 text-gray-300" />
                  </div>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Luxury 2BHK in South Delhi"
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                    value={form.title}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-300" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="City, Area"
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                      value={form.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Monthly Rent</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-300" />
                    </div>
                    <input
                      type="number"
                      name="rent"
                      required
                      placeholder="Amount in INR"
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                      value={form.rent}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                <div className="relative">
                  <div className="absolute top-4 left-4 flex items-start pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-300" />
                  </div>
                  <textarea
                    name="description"
                    rows="4"
                    required
                    placeholder="Describe amenities, proximity to transit, etc..."
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                    value={form.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-emerald-900/20"
                >
                  {mutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Verify & Publish Listing
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-emerald-50/30 p-6 border-t border-emerald-50">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                   <Shield className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-widest leading-tight">
                  TrueRent AI scans every listing for institutional safety.
                </p>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;
