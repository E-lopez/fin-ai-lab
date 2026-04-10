import { addPaymentRequest } from "@/models/dto/addPaymentRequest";
import { repaymentPlanRequest } from "@/models/dto/repaymentPlanRequest";

export default class MainApiConnector {
  static readonly baseUrl: string = import.meta.env.VITE_API_URL;
  
  get currentBaseUrl() {
    return MainApiConnector.baseUrl
  }

  async getSummary() {
    const response = await fetch(`${this.currentBaseUrl}/loans/loans-summary`);
    const json = await response.json();
    return json;
  }

  async addPayment(payload: addPaymentRequest) {
    try {
      const response = await fetch(`${this.currentBaseUrl}/payments`, {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw response;
      }
      const json = await response.json();
      return json;
      
    } catch (e: any) {
      console.error('Main API error:', e);
      const ex = await e.json()
      const errObject = {
        type: ex.name,
        message: ex.message, 
      }
      throw errObject;
    }
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