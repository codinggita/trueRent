import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-dark-700/50 bg-dark-900 pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <span className="font-bold text-white text-lg">T</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">True<span className="text-primary">Rent</span></span>
            </div>
            <p className="text-gray-400 text-sm font-medium">Secure. Verified. Transparent.</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Support</a>
          </div>

        </div>

        <div className="pt-8 border-t border-dark-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-dark-500 text-xs">
            &copy; {new Date().getFullYear()} TrueRent. All rights reserved.
          </p>
          <div className="text-dark-500 text-xs">
            Powered by AI
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
