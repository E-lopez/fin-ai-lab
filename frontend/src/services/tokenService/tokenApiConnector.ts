

export default class SurveyApiConnector {
  static readonly lambda_url: string = import.meta.env.VITE_TOKEN_LAMBDA_URL;
  static readonly baseUrl: string = this.lambda_url + 'token';

  get currentBaseUrl() {
    return SurveyApiConnector.baseUrl;
  }

  async fetchToken() {
    try {
      const response = await fetch(`${this.currentBaseUrl}`, {
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
        method: 'POST',
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
}