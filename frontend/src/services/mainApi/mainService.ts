import AmortizationApiConnector from "./mainApiConnector";
import { addPaymentRequest } from "@/models/dto/addPaymentRequest";
import { FullLoanOnboardingRequest } from "@/models/dto/fullLoanOnboardingRequest";
import { getLoanScheduleRequest } from "@/models/dto/getLoanScheduleRequest";
import { Payment } from "@/models/dto/payment";


class MainApiServiceFacade {
  connector: AmortizationApiConnector;

  constructor(connector: new () => AmortizationApiConnector) {
    this.connector = new connector();
  }

  getSummary() {
    return this.connector.getSummary();
  }

  addPayment(payload: addPaymentRequest) {
    return this.connector.addPayment(payload);
  }

  simulateLoanSchedule(payload: getLoanScheduleRequest) {
    return this.connector.simulateLoanSchedule(payload);
  }

  onboardingFullLoan(payload: FullLoanOnboardingRequest) {
    return this.connector.onboardingFullLoan(payload);
  }

  disburseLoan(loan_id: string) {
    return this.connector.disburseLoan(loan_id);
  }

  getPaymentsByLoanId(loan_id: string): Promise<Payment[]> {
    return this.connector.getPaymentsByLoanId(loan_id);
  }

  getPaymentAllocation(payment_id: string) {
    return this.connector.getPaymentAllocation(payment_id);
  }

  getBorrowers() {
    return this.connector.getBorrowers();
  }

  getNextPayment(borrowerId: string) {
    return this.connector.getNextPayment(borrowerId);
  }

}

export const MainApiService = new MainApiServiceFacade(AmortizationApiConnector);