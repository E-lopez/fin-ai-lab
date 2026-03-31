import { UserInit } from "@/models/dto/UserInit";
import ComposerApiConnector from "./composerApiConnector";

class ComposerFacade {
  connector: ComposerApiConnector;

  constructor(connector: new () => ComposerApiConnector) {
    this.connector = new connector();
  }

  initializeUser(payload: UserInit) {
    return this.connector.initializeUser(payload);
  }
}

export const ComposerService = new ComposerFacade(ComposerApiConnector);