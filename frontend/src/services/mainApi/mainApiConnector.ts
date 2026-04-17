import { addPaymentRequest } from "@/models/dto/addPaymentRequest";
import { getLoanScheduleRequest } from "@/models/dto/getLoanScheduleRequest";
import { repaymentPlanRequest } from "@/models/dto/legacy/repaymentPlanRequest";

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

  async simulateLoanSchedule(payload: getLoanScheduleRequest) {
    try {
      const response = await fetch(`${this.currentBaseUrl}/loan_schedules/simulate`, {
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
}