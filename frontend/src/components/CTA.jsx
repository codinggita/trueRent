import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-dark-800"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-blue/20 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 px-8 py-16 md:px-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Renting Smarter Today</h2>
              <p className="text-lg text-gray-400">
                Join thousands of renters who use TrueRent to find safe, verified, and reasonably priced properties without the stress of scams.
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <button className="btn-primary py-4 px-8 text-lg flex items-center justify-center gap-2 group whitespace-nowrap w-full sm:w-auto">
                Explore TrueRent
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
