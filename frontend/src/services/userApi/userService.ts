import { User } from "@/models/dto/user";
import UserApiConnector from "./userApiConnector";
import { UpdateUserRiskRequest } from "@/models/dto/UpdateUserRiskRequest";

class UserFacade {
  connector: UserApiConnector;

  constructor(connector: new () => UserApiConnector) {
    this.connector = new connector()
  }

  getAllUsers() { 
    return this.connector.getAllUsers() 
  };

  getUserById(id: string) { 
    return this.connector.getUserById(id)
  };

  getUserByUsername(username: string) {
    return this.connector.getUserByUsername(username);
  };

  updateUserRisk(user: UpdateUserRiskRequest, access_token: string) {
    return this.connector.updateUserRisk(user, access_token);
  };

  createUser(user: User, access_token: string) {
    return this.connector.createUser(user, access_token);
  };

  idNumberExists(id: string, access_token: string) {
    return this.connector.idNumberExists(id, access_token);
  }

  emailExists(email: string, access_token: string) {
    return this.connector.emailExists(email, access_token);
  }
  
}

export const UserService = new UserFacade(UserApiConnector);
