import AmortizationApiConnector from "./mainApiConnector";
import { addPaymentRequest } from "@/models/dto/addPaymentRequest";
import { FullLoanOnboardingRequest } from "@/models/dto/fullLoanOnboardingRequest";
import { getLoanScheduleRequest } from "@/models/dto/getLoanScheduleRequest";


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

}

export const MainApiService = new MainApiServiceFacade(AmortizationApiConnector);