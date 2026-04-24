// RiskBadge: displays a colour-coded risk label based on a 0-100 score

export default function RiskBadge({ score }) {
  let label, className;

  if (score <= 30) {
    label = 'Safe';
    className = 'bg-green-100 text-green-700';
  } else if (score <= 60) {
    label = 'Suspicious';
    className = 'bg-yellow-100 text-yellow-700';
  } else {
    label = 'High Risk';
    className = 'bg-red-100 text-red-700';
  }

  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${className}`}>
      {label} ({score})
    </span>
  );
}
