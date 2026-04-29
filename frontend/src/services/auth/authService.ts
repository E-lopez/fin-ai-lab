import AuthApiConnector from "./authApiConnector";
import { PasswordChange, UserCreate, UserLogin } from "@/models/dto/auth";

class AuthServiceFacade {
  connector: AuthApiConnector;

  constructor(connector: new () => AuthApiConnector) {
    this.connector = new connector();
  }

  login(payload: UserLogin) {
    return this.connector.login(payload);
  }

  register(payload: UserCreate) {
    return this.connector.register(payload);
  }

  me(token: string) {
    return this.connector.me(token);
  }

  changePassword(payload: PasswordChange, token: string) {
    return this.connector.changePassword(payload, token);
  }
}

export const AuthService = new AuthServiceFacade(AuthApiConnector);
