/**
 * Calculates a fraud risk score for a property listing
 * @param {Object} listing - The property listing object
 * @returns {Object} - { score, level, reasons }
 */
const calculateRiskScore = (listing) => {
  let score = 0;
  const reasons = [];

  // 1. Price Anomaly (Simplified check: assuming a "market average" of 50,000 for demo)
  // Real world would query area averages
  if (listing.price < 5000) {
    score += 40;
    reasons.push("Price is significantly below market average for this type of property.");
  } else if (listing.price < 15000 && listing.propertyType === 'Villa') {
    score += 30;
    reasons.push("Suspiciously low price for a Villa listing.");
  }

  // 2. Suspicious Keywords in description
  const suspiciousKeywords = ['wire transfer', 'western union', 'moneygram', 'advance deposit', 'urgent', 'available now', 'overseas owner'];
  const desc = (listing.description || '').toLowerCase();
  
  suspiciousKeywords.forEach(keyword => {
    if (desc.includes(keyword)) {
      score += 15;
      reasons.push(`Contains suspicious keyword: "${keyword}"`);
    }
  });

  // 3. Image Analysis (Mock duplicate image check)
  if (listing.images && listing.images.length === 0) {
    score += 10;
    reasons.push("No images provided for the listing.");
  } else if (listing.images && listing.images.length === 1) {
    score += 5;
    reasons.push("Only one image provided; harder to verify property legitimacy.");
  }

  // 4. Description length/quality
  if (desc.length < 50) {
    score += 10;
    reasons.push("Listing description is too short/generic.");
  }

  // Cap score at 100
  score = Math.min(score, 100);

  // Determine Level
  let level = "low";
  if (score >= 70) level = "high";
  else if (score >= 40) level = "medium";

  return {
    score,
    level,
    reasons
  };
};

module.exports = { calculateRiskScore };
