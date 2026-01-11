import { ClaimData, ReportEntry, RiskAnalysisResult } from '../types';

const mean = (numbers: number[]) => numbers.reduce((acc, val) => acc + val, 0) / numbers.length;

const stdDev = (numbers: number[]) => {
  if (numbers.length < 2) return 0;
  const m = mean(numbers);
  const squareDiffs = numbers.map(value => Math.pow(value - m, 2));
  const avgSquareDiff = mean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
};

const checkBenfordsLawViolation = (amount: number, history: number[]): { risk: number; message: string | null } => {
  if (history.length < 15) return { risk: 0, message: null };
  const getLeadingDigit = (n: number) => {
      const s = n.toString().replace(/[^1-9]/g, '');
      return s.length > 0 ? parseInt(s[0]) : null;
  };
  const leadingDigits = history.map(getLeadingDigit).filter(d => d !== null) as number[];
  const currentDigit = getLeadingDigit(amount);
  if (currentDigit === null) return { risk: 0, message: null };
  const frequencyOfDigit = leadingDigits.filter(d => d === currentDigit).length / leadingDigits.length;
  const expectedProb = [0, 0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046];
  if (frequencyOfDigit < expectedProb[currentDigit] * 0.25) {
    return { 
      risk: 30, 
      message: `Benford Mismatch: Digit '${currentDigit}' is statistically under-represented (${(frequencyOfDigit * 100).toFixed(1)}% vs expected ${(expectedProb[currentDigit] * 100).toFixed(1)}%), indicating potential data fabrication.` 
    };
  }
  return { risk: 0, message: null };
};

const checkSensiblePatternMismatch = (amount: number, entityHistory: number[], categoryHistory: number[]): { risk: number; message: string | null } => {
  if (entityHistory.length < 3) {
      if (categoryHistory.length > 5) {
          const catAvg = mean(categoryHistory);
          const catStd = stdDev(categoryHistory);
          const z = Math.abs(amount - catAvg) / (catStd || 1);
          if (z > 3 || amount > 10000) return { risk: 60, message: `Category Outlier: This amount is significantly higher than the standard average for this sector.` };
      }
      return { risk: 0, message: null };
  }
  const avg = mean(entityHistory);
  const sdev = stdDev(entityHistory);
  if (sdev === 0 && amount !== avg) {
      return { risk: 50, message: `Contractual Deviation: Entity previously maintained a static billing pattern. This change lacks historical precedent.` };
  }
  const zScore = Math.abs(amount - avg) / (sdev || 1);
  if (zScore > 2.2 || amount > 10000) {
    return { 
      risk: 40 + Math.min(zScore * 5, 40), 
      message: `Category Outlier: This amount is significantly higher than the standard average for this sector.` 
    };
  }
  return { risk: 0, message: null };
};

const checkFrequencyAnomaly = (entityId: string, history: ReportEntry[]): { risk: number; message: string | null } => {
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const recentTransactions = sortedHistory.slice(0, 10);
  const recentCount = recentTransactions.filter(h => h.input.entityId === entityId).length;
  if (recentCount >= 3) {
    return {
      risk: 70,
      message: `High-Frequency Stacking: Entity ID ${entityId} has filed ${recentCount + 1} transactions in a short sequence. This "Velocity Pattern" is a primary indicator of claim-splitting or automated padding.`
    };
  }
  return { risk: 0, message: null };
};

export const runFraudDetectionModel = (current: ClaimData, history: ReportEntry[], approverName?: string): RiskAnalysisResult => {
  const factors: string[] = [];
  let totalRiskScore = 0;
  const currentAmount = parseFloat(current.amount) || 0;
  const categoryHistory = history.filter(h => h.input.category === current.category);
  const entityHistory = categoryHistory
    .filter(h => h.input.entityId === current.entityId)
    .map(h => parseFloat(h.input.amount));
  const allAmounts = categoryHistory.map(h => parseFloat(h.input.amount));

  if (approverName) {
    const normalizedName = approverName.toLowerCase().trim();
    const previousApprovals = history.filter(h => 
      h.approval?.approverName.toLowerCase().trim() === normalizedName
    );
    if (previousApprovals.length > 0) {
      totalRiskScore += 80;
      factors.push(`Duty Separation Violation: Officer "${approverName}" has previously authorized transactions in this session. High risk of collusion detected.`);
    }
  }

  const frequency = checkFrequencyAnomaly(current.entityId, history);
  if (frequency.risk > 0) {
    totalRiskScore += frequency.risk;
    factors.push(frequency.message!);
  }

  const pattern = checkSensiblePatternMismatch(currentAmount, entityHistory, allAmounts);
  if (pattern.risk > 0) {
    totalRiskScore += pattern.risk;
    factors.push(pattern.message!);
  }

  const benford = checkBenfordsLawViolation(currentAmount, allAmounts);
  if (benford.risk > 0) {
    totalRiskScore += benford.risk;
    factors.push(benford.message!);
  }

  const nameMismatch = categoryHistory.find(h => 
    h.input.entityId === current.entityId && 
    h.input.entityName.toLowerCase().trim() !== current.entityName.toLowerCase().trim()
  );
  if (nameMismatch) {
    totalRiskScore += 60;
    factors.push(`Identity Conflict: Registration ID ${current.entityId} is linked to "${nameMismatch.input.entityName}" in master logs, mismatching current input "${current.entityName}".`);
  }

  if (currentAmount > 0 && currentAmount % 1000 === 0) {
    totalRiskScore += 15;
    factors.push("Heuristic Warning: Perfectly rounded amounts are statistically significant markers for manually inflated entries.");
  }

  totalRiskScore = Math.min(Math.max(totalRiskScore, 0), 100);
  let level: RiskAnalysisResult['level'] = 'LOW';
  if (totalRiskScore >= 80) level = 'CRITICAL';
  else if (totalRiskScore >= 55) level = 'HIGH';
  else if (totalRiskScore >= 30) level = 'MEDIUM';

  return {
    score: Math.round(totalRiskScore),
    level,
    factors,
    timestamp: new Date().toISOString()
  };
};