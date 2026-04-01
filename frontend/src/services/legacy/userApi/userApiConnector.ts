import { UpdateUserRiskRequest } from "@/models/dto/UpdateUserRiskRequest";
import { User } from "@/models/dto/user";

export default class UserApiConnector {
  static readonly lambda_url: string = import.meta.env.VITE_USER_LAMBDA_URL;
  static readonly baseUrl: string = this.lambda_url + 'users';

  get currentBaseUrl() {
    return UserApiConnector.baseUrl
  }

  async getAllUsers() {
    try {
      const response = await fetch(`${UserApiConnector.baseUrl}`, { 
        headers: {'Content-Type': 'application/json'},
        mode: 'cors'
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

  async getUserById(id: string) {
    try {
      const response = await fetch(`${UserApiConnector.baseUrl}/${id}`, { 
        headers: {'Content-Type': 'application/json'},
        mode: 'cors'
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
  
  async getUserByUsername(userName: string) {
    try {
      const response = await fetch(`${UserApiConnector.baseUrl}/by-name?name=${userName}`, { 
        headers: {'Content-Type': 'application/json'},
        mode: 'cors'
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

  async createUser(user: User, access_token: string) {
    try {
      const response = await fetch(`${UserApiConnector.baseUrl}?token=${encodeURIComponent(access_token ?? '')}`, { 
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw response;
      }
      const json = await response.json();
      return json;
    }
    catch(e: any) {
      console.error('Create user API error:', e);
      throw e;
    }
  }
  
  async updateUserRisk(user: UpdateUserRiskRequest, access_token: string) {
    try {
      const response = await fetch(`${UserApiConnector.baseUrl}/risk?token=${encodeURIComponent(access_token ?? '')}`, { 
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw response;
      }
      const json = await response.json();
      return json;
    }
    catch(e: any) {
      console.error('User risk update error:', e);
      throw e;
    }
  }
  
  async idNumberExists(id: string, access_token: string) {
    try {
      const response = await fetch(`${UserApiConnector.baseUrl}/check-id/${id}?token=${encodeURIComponent(access_token ?? '')}`, { 
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
      });
      if (!response.ok) {
        throw response;
      }
      const json = await response.json();
      return json;
    }
    catch(e: unknown) {
      throw e;
    }
  }

  async emailExists(email: string, access_token: string) {
    try {
      const response = await fetch(`${UserApiConnector.baseUrl}/check-email/${email}?token=${encodeURIComponent(access_token ?? '')}`, { 
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
      });
      if (!response.ok) {
        throw response;
      }
      const json = await response.json();
      return json;
    }
    catch(e: unknown) {
      throw e;
    }
  }

}