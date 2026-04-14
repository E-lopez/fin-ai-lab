import AmortizationApiConnector from "./mainApiConnector";
import { addPaymentRequest } from "@/models/dto/addPaymentRequest";
import { getLoanScheduleRequest } from "@/models/dto/createLoanRequest";

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

}

export const MainApiService = new MainApiServiceFacade(AmortizationApiConnector);