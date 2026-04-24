// Mock fraud analysis logic
// In a real app this would call an AI/ML model

const analyzeListingFraud = (req, res) => {
  const { price, location, images, description } = req.body;

  let riskScore = 0;
  let reasons = [];

  // Rule 1: Suspiciously low price
  if (price && price < 5000) {
    riskScore += 40;
    reasons.push('Price is unusually low for the area');
  }

  // Rule 2: No images provided
  if (!images || images.length === 0) {
    riskScore += 30;
    reasons.push('No images provided');
  }

  // Rule 3: Very short description
  if (!description || description.length < 30) {
    riskScore += 20;
    reasons.push('Description is missing or too short');
  }

  // Cap at 100
  riskScore = Math.min(riskScore, 100);

  let label = 'Safe';
  if (riskScore > 60) label = 'High Risk';
  else if (riskScore > 30) label = 'Suspicious';

  res.json({ riskScore, label, reasons });
};

module.exports = { analyzeListingFraud };
