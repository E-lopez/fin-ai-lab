import { UserInit } from "@/models/dto/UserInit";

export default class ComposerApiConnector {
  static readonly baseUrl: string = 'http://localhost:8080/composer';

  get currentBaseUrl() {
    return ComposerApiConnector.baseUrl
  }

  async initializeUser(payload: UserInit) {
    try {
      const response = await fetch(`${this.currentBaseUrl}/createUser`, {
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw response;
      }
      const json = await response.json();
      return json;
    }
    catch(e: any) {
      throw e;
    }
  }
}