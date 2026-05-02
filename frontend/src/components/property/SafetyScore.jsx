import React from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const getSafetyConfig = (score) => {
  if (score == null) return { label: 'Not Assessed', color: 'gray', icon: Shield, ring: 'ring-gray-700', bg: 'bg-gray-800', text: 'text-gray-400', fill: 0 };
  if (score >= 70) return { label: 'Safe Area', color: 'emerald', icon: CheckCircle, ring: 'ring-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', fill: score };
  if (score >= 40) return { label: 'Moderate Risk', color: 'yellow', icon: AlertTriangle, ring: 'ring-yellow-500/30', bg: 'bg-yellow-500/10', text: 'text-yellow-400', fill: score };
  return { label: 'High Risk', color: 'red', icon: XCircle, ring: 'ring-red-500/30', bg: 'bg-red-500/10', text: 'text-red-400', fill: score };
};

const SafetyScore = ({ score, fraudScore }) => {
  // Use safetyScore if available, otherwise invert fraudScore
  const displayScore = score != null ? score : (fraudScore != null ? 100 - fraudScore : null);
  const config = getSafetyConfig(displayScore);
  const Icon = config.icon;

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (circumference * (config.fill || 0)) / 100;

  return (
    <div className="bg-gray-900 rounded-[20px] border border-gray-800 p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md">
      <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-emerald-400" />
        Safety Score
      </h2>

      <div className="flex items-center gap-5">
        {/* Circular gauge */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor"
              className="text-gray-800" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none"
              className={config.text}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-extrabold ${config.text}`}>
              {displayScore ?? '—'}
            </span>
            <span className="text-[9px] text-gray-500 font-medium">/100</span>
          </div>
        </div>

        {/* Label + info */}
        <div>
          <div className={`inline-flex items-center gap-1.5 ${config.bg} ${config.text} text-xs font-bold px-3 py-1.5 rounded-full mb-2`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {displayScore >= 70
              ? 'This area has low crime rates and good infrastructure.'
              : displayScore >= 40
              ? 'Exercise caution. Some concerns flagged in this area.'
              : displayScore != null
              ? 'Multiple safety concerns detected. Verify before proceeding.'
              : 'Safety data not yet available for this location.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyScore;
