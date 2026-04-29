import React from 'react';
import { ShieldAlert, TrendingUp, Image as ImageIcon, CheckCircle, BellRing, PieChart } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <ShieldAlert size={24} className="text-primary" />,
      title: "Fraud Detection",
      description: "Detect suspicious listings instantly using advanced AI algorithms trained on thousands of scam patterns."
    },
    {
      icon: <TrendingUp size={24} className="text-accent-blue" />,
      title: "Price Intelligence",
      description: "Automatically compare property prices with real-time market data to flag unrealistic deals."
    },
    {
      icon: <ImageIcon size={24} className="text-accent-purple" />,
      title: "Image Verification",
      description: "Identify duplicate, stolen, or digitally altered images across different platforms."
    },
    {
      icon: <CheckCircle size={24} className="text-primary" />,
      title: "Verified Listings",
      description: "Browse a curated feed showing only trusted properties that have passed our rigorous checks."
    },
    {
      icon: <BellRing size={24} className="text-yellow-400" />,
      title: "Smart Alerts",
      description: "Get instant notifications when a listing you're interested in is flagged as potentially risky."
    },
    {
      icon: <PieChart size={24} className="text-accent-blue" />,
      title: "Analytics Dashboard",
      description: "View comprehensive trust scores, neighborhood insights, and risk assessments in one place."
    }
  ];

  return (
    <section id="features" className="py-24 relative z-10 bg-dark-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent Capabilities</h2>
          <p className="text-gray-400 text-lg">
            Our platform combines AI detection with verification to ensure safe rental experiences for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 group hover:-translate-y-2 hover:glow-blue transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              
              <div className="w-12 h-12 rounded-xl bg-dark-700/50 border border-dark-600 flex items-center justify-center mb-6 shadow-inner group-hover:bg-dark-700 transition-colors">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
