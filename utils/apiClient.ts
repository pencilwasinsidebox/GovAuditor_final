import { ClaimData, ReportEntry, RiskAnalysisResult } from '../types';
import { runFraudDetectionModel } from './fraudEngine';

export const analyzeClaim = async (
  data: ClaimData, 
  history: ReportEntry[],
  approverName?: string
): Promise<RiskAnalysisResult> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const result = runFraudDetectionModel(data, history, approverName);
  return result;
};