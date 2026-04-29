import React from 'react';
import { ShieldCheck, ArrowRight, Activity, Search } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-primary/30 mb-6 animate-fade-in-up">
              <ShieldCheck size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Rental Trust System</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-tight">
              AI Powered <br/>
              <span className="text-gradient">Rental Fraud</span> <br/>
              Detection
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Detect fake listings, verify properties, and rent with confidence using AI-driven insights. Stop scams before they happen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="btn-primary flex items-center justify-center gap-2 group">
                Explore Dashboard
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary">
                Login
              </button>
            </div>
          </div>

          {/* Image/Mockup */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none perspective-1000">
            {/* Main Mockup Card */}
            <div className="glass-card p-6 rounded-2xl glow relative z-10 transform lg:rotate-y-[-5deg] lg:rotate-x-[5deg] transition-transform duration-500 hover:rotate-0">
              <div className="flex items-center justify-between mb-6 border-b border-dark-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center">
                    <Search size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <div className="h-4 w-32 bg-dark-700 rounded mb-2"></div>
                    <div className="h-3 w-20 bg-dark-700/50 rounded"></div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold flex items-center gap-1 border border-primary/30">
                  <ShieldCheck size={12} /> Verified
                </div>
              </div>

              {/* Property Image Placeholder */}
              <div className="w-full h-48 bg-dark-700 rounded-xl mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent z-10"></div>
                <div className="absolute bottom-4 left-4 z-20">
                  <div className="text-2xl font-bold text-white">$2,400<span className="text-sm text-gray-400 font-normal">/mo</span></div>
                  <div className="text-sm text-gray-300">Modern Downtown Apartment</div>
                </div>
                {/* Simulated Image */}
                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Apartment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>

              {/* Stats/Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-900/50 rounded-lg p-3 border border-dark-700">
                  <div className="text-xs text-gray-400 mb-1">Trust Score</div>
                  <div className="text-xl font-bold text-primary flex items-center gap-2">
                    98/100 <Activity size={16} />
                  </div>
                </div>
                <div className="bg-dark-900/50 rounded-lg p-3 border border-dark-700">
                  <div className="text-xs text-gray-400 mb-1">Price Match</div>
                  <div className="text-xl font-bold text-green-400">Excellent</div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-[50px]"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-blue/20 rounded-full blur-[50px]"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
