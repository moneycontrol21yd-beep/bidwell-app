export interface ContractorProfile {
  turnoverInLakhs: number;
  isoCertified: boolean;
  state: string;
}

export interface TenderRequirement {
  id: string;
  title: string;
  estimatedValueLakhs: number;
  minTurnoverRequired: number;
  isoRequired: boolean;
  state: string;
}

export function calculateMatchScore(
  profile: ContractorProfile,
  tender: TenderRequirement
): { score: number; eligible: boolean; warnings: string[] } {
  let score = 100;
  let warnings: string[] = [];
  let eligible = true;

  // Turnover Check
  if (profile.turnoverInLakhs < tender.minTurnoverRequired) {
    score -= 40;
    eligible = false;
    warnings.push(`Turnover shortfall: Min ₹${tender.minTurnoverRequired} L required.`);
  }

  // ISO Certification Check
  if (tender.isoRequired && !profile.isoCertified) {
    score -= 25;
    warnings.push("ISO 9001 Certification missing.");
  }

  // Region / State Preference Check
  if (profile.state.toLowerCase() === tender.state.toLowerCase()) {
    score += 10;
  } else {
    score -= 10;
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    score: finalScore,
    eligible,
    warnings
  };
}
