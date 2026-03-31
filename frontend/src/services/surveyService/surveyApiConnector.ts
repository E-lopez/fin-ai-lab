import { agreementModelRequest } from "@/models/dto/agreementModelRequest";
import { surveyModelRequest } from "@/models/dto/surveyModelRequest";

export default class SurveyApiConnector {
  static readonly lambda_url: string = import.meta.env.VITE_SURVEY_LAMBDA_URL;
  static readonly baseUrl: string = this.lambda_url + 'survey';

  get currentBaseUrl() {
    return SurveyApiConnector.baseUrl
  }

  async fetchSurveyModel(payload: surveyModelRequest) {
    try {
      const { type, version, access_token } = payload;
      const response = await fetch(`${this.currentBaseUrl}/${type + '_' + version}?token=${encodeURIComponent(access_token ?? '')}`, {
        mode: 'cors',
        method: 'GET',
      });
      if (!response.ok) {
        throw response;
      }
      const json = await response.json();
      return json;
    }
    catch(e: any) {
      console.error('Survey API error:', e);
      const ex = await e.json()
      const errObject = {
        type: ex.name,
        message: ex.message, 
      }
      throw errObject;
    }
  }
 
  async fetchAgreements(payload: agreementModelRequest) {
    try {
      const { version, access_token } = payload
      const response = await fetch(`${this.currentBaseUrl}/agreement/${version}?token=${encodeURIComponent(access_token ?? '')}`, {
        mode: 'cors',
        method: 'GET',
      });
      if (!response.ok) {
        throw response;
      }
      const json = await response.json();
      return json;
    }
    catch(e: any) {
      console.error('Agreement API error:', e);
      const ex = await e.json()
      const errObject = {
        type: ex.name,
        message: ex.message, 
      }
      throw errObject;
    }
  }
}