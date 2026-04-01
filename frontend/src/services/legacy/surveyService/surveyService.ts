import { surveyModelRequest } from "@/models/dto/surveyModelRequest";
import SurveyApiConnector from "./surveyApiConnector";
import { agreementModelRequest } from "@/models/dto/agreementModelRequest";

class SurveyFacade {
  connector: SurveyApiConnector;

  constructor(connector: new () => SurveyApiConnector) {
    this.connector = new connector();
  }

  fetchSurvey(payload: surveyModelRequest) {
    return this.connector.fetchSurveyModel(payload);
  }

  fetchAgreements(payload: agreementModelRequest) {
    return this.connector.fetchAgreements(payload);
  }
}

export const SurveyService = new SurveyFacade(SurveyApiConnector);