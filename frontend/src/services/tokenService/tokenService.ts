import TokenApiConnector from "./tokenApiConnector";


class TokenFacade {
  connector: TokenApiConnector;

  constructor(connector: new () => TokenApiConnector) {
    this.connector = new connector();
  }

  fetchToken() {
    return this.connector.fetchToken();
  }

}

export const TokenService = new TokenFacade(TokenApiConnector);