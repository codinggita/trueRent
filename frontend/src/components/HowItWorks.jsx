import React from 'react';
import { Search, ShieldAlert, CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: <Search size={32} className="text-accent-blue" />,
      title: "Analyze Listing",
      description: "AI scans price, images, and data points across multiple sources."
    },
    {
      number: "02",
      icon: <ShieldAlert size={32} className="text-yellow-400" />,
      title: "Detect Risk",
      description: "Assigns a comprehensive risk score (Safe, Moderate, or Risky) instantly."
    },
    {
      number: "03",
      icon: <CheckCircle2 size={32} className="text-primary" />,
      title: "Show Verified Options",
      description: "User sees only trusted listings with transparent verification details."
    }
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 text-lg">
            A seamless process running silently in the background to keep you safe.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-dark-700 -translate-y-1/2 z-0">
            <div className="absolute top-0 left-0 h-full w-2/3 bg-gradient-to-r from-accent-blue via-primary to-transparent"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center mb-6 relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute inset-0 bg-dark-700/50 group-hover:bg-dark-600/50 transition-colors"></div>
                  <div className="relative z-10">{step.icon}</div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-dark-900 border border-dark-600 flex items-center justify-center text-xs font-bold text-gray-400 z-20 shadow-lg">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
