import { repaymentPlanRequest } from "@/models/dto/repaymentPlanRequest";
import AmortizationApiConnector from "./amortizationApiConnector";

class AmortizationFacade {
  connector: AmortizationApiConnector;

  constructor(connector: new () => AmortizationApiConnector) {
    this.connector = new connector();
  }

  getRepaymentPlan(payload: repaymentPlanRequest, access_token: string) {
    return this.connector.getRepaymentPlan(payload, access_token);
  }

}

export const AmortizationService = new AmortizationFacade(AmortizationApiConnector);