export interface ScoreResponse {
  userId: string;
  demographics: number;
  financialResponsibility: number;
  riskAversion: number;
  impulsivity: number;
  futureOrientation: number;
  financialKnowledge: number;
  locusOfControl: number;
  socialInfluence: number;
  resilience: number;
  familismo: number;
  respect: number;
  riskLevel: number;
  risk_distance_analysis: {
    risk_distance: number;
    risk_score: number;
    risk_category: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
    closest_cluster: number;
  };
}