import React from 'react';
import { Badge } from '../ui/Badge';

export function RiskBadge({ score }) {
  let variant = 'success';
  let label = 'Safe';

  if (score >= 71) {
    variant = 'danger';
    label = 'High Risk';
  } else if (score >= 41) {
    variant = 'warning';
    label = 'Medium Risk';
  }

  return (
    <Badge variant={variant} className="flex gap-1.5 items-center w-fit">
      <div className={`w-1.5 h-1.5 rounded-full ${variant === 'danger' ? 'bg-red-500' : variant === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
      <span>{label} ({score})</span>
    </Badge>
  );
}
