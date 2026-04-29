import React from 'react';
import { Shield, Lock, FileCheck } from 'lucide-react';

const Trust = () => {
  return (
    <section className="py-24 relative z-10 bg-dark-800/20 border-y border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Visual Side */}
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
            
            <div className="relative z-10 grid gap-6 max-w-md mx-auto lg:mx-0">
              {/* Risk Score Widget */}
              <div className="glass-card p-6 rounded-2xl flex items-center gap-6 transform hover:scale-105 transition-transform duration-300">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-dark-700"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary"
                      strokeWidth="3"
                      strokeDasharray="98, 100"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-white">98</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">Excellent Trust Score</h4>
                  <p className="text-sm text-gray-400">Property verified by AI</p>
                </div>
              </div>

              {/* Verified Badge Widget */}
              <div className="glass-card p-5 rounded-2xl flex items-center justify-between transform translate-x-8 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium">Identity Verified</h4>
                    <p className="text-xs text-gray-400">Landlord KYC completed</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                  Passed
                </div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for Trust and Transparency</h2>
            <p className="text-lg text-gray-400 mb-8">
              We don't just show listings, we help you make safe decisions. Our multi-layered verification process ensures that what you see is what you get.
            </p>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-dark-700 flex items-center justify-center flex-shrink-0 text-primary">
                  <Lock size={14} />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Bank-Level Security</h4>
                  <p className="text-sm text-gray-400">Your data and communications are encrypted and secure.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-dark-700 flex items-center justify-center flex-shrink-0 text-accent-blue">
                  <FileCheck size={14} />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Document Verification</h4>
                  <p className="text-sm text-gray-400">We verify ownership records against public databases.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Trust;
