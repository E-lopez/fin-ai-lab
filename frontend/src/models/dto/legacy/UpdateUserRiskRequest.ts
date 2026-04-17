export interface UpdateUserRiskRequest {
  userId: string;
  riskLevel: string;
  riskDistance: number;
  riskScore: number;
  riskCategory: string;
  closestCluster: number;
}