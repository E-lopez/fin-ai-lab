import { repaymentPlanRequest } from "@/models/dto/repaymentPlanRequest";
import AmortizationApiConnector from "./mainApiConnector";
import { addPaymentRequest } from "@/models/dto/addPaymentRequest";

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

  getRepaymentPlan(payload: repaymentPlanRequest, access_token: string) {
    return this.connector.getRepaymentPlan(payload, access_token);
  }

}

export const MainApiService = new MainApiServiceFacade(AmortizationApiConnector);