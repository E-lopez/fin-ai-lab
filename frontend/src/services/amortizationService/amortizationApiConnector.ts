import { repaymentPlanRequest } from "@/models/dto/repaymentPlanRequest";

export default class AmortizationApiConnector {
  static readonly baseUrl: string = import.meta.env.VITE_SCORE_LAMBDA_URL;

  get currentBaseUrl() {
    return AmortizationApiConnector.baseUrl
  }

  async getRepaymentPlan(payload: repaymentPlanRequest, access_token: string) {
    try {
      const response = await fetch(`${this.currentBaseUrl}/repayment-plan?token=${encodeURIComponent(access_token ?? '')}`, {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw response;
      }
      const json = await response.json();
      return json;
      
    } catch (e: any) {
      console.error('Amortization API error:', e);
      const ex = await e.json()
      const errObject = {
        type: ex.name,
        message: ex.message, 
      }
      throw errObject;
    }
  }

}