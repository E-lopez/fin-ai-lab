import { addPaymentRequest } from "@/models/dto/addPaymentRequest";
import { Borrower, BorrowerResponse } from "@/models/dto/borrower";
import { createLoanRequest, CreateLoanResponse } from "@/models/dto/createLoanRequest";
import { createLoanScheduleRequest } from "@/models/dto/createLoanSchedule";
import { getLoanScheduleRequest } from "@/models/dto/getLoanScheduleRequest";
import ApiError from "./apiError";
import { LoanSummary } from "@/models/dto/loanSummary";
import { FullLoanOnboardingRequest } from "@/models/dto/fullLoanOnboardingRequest";
import { Payment } from "@/models/dto/payment";
import { PaymentAllocation } from "@/models/dto/paymentAllocation";

export default class MainApiConnector {
  static readonly baseUrl: string = import.meta.env.VITE_API_URL;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${MainApiConnector.baseUrl}${endpoint}`;
    
    const config = {
      mode: 'cors' as RequestMode,
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Attempt to parse the structured error from the backend
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.name || 'API_Error',
          errorData.message || 'Unknown error occurred',
          response.status
        );
      }

      return await response.json();
    } catch (e: any) {
      console.error(`Main API error [${endpoint}]:`, e);
      // Re-throw either our structured error or a generic one
      throw e.message ? e : { type: 'NetworkError', message: 'Check your connection' };
    }
  }
  
  async getSummary(): Promise<LoanSummary[]> {
    return this.request('/loans/loans-summary');
  }

  async addPayment(payload: addPaymentRequest) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async simulateLoanSchedule(payload: getLoanScheduleRequest) {
    return this.request('/loan_schedules/simulate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  
  async createBorrower(payload: Borrower): Promise<BorrowerResponse> {
    return this.request('/borrowers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async createLoan(payload: createLoanRequest): Promise<CreateLoanResponse> {
    return this.request('/loans', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  
  async createLoanSchedule(payload: createLoanScheduleRequest) {
    return this.request(`/loan_schedules/?loan_id=${payload.loan_id}`, {
      method: 'POST',
    });
  }

  async onboardingFullLoan(payload: FullLoanOnboardingRequest) {
    try {
      // Create the Borrower
      console.log("Starting onboarding with payload:", payload);
      const borrower = await this.createBorrower(payload.borrower);

      // Create the Loan 
      const loan = await this.createLoan({
        ...payload.loan,
        borrower_id: borrower.id 
      });

      // 3. Create the Schedule (using the new loan's ID)
      const schedule = await this.createLoanSchedule({
        loan_id: loan.id
      });

      return { borrower, loan, schedule };
    } catch (err) {
      console.error("Onboarding failed at some step:", err);
      throw err; 
    }
  }

  async disburseLoan(loan_id: string) {
    return this.request(`/loans/${loan_id}/disburse`, {
      method: 'POST',
    });
  }

  async getPaymentsByLoanId(loan_id: string): Promise<Payment[]> {
    return this.request(`/payments/loan/${loan_id}`);
  }

  async getPaymentAllocation(payment_id: string): Promise<PaymentAllocation[]> {
    return this.request(`/payment_allocations/payment/${payment_id}`);
  }
}