import ApiError from "@/services/mainApi/apiError";
import { PasswordChange, Token, UserCreate, UserLogin, UserRead } from "@/models/dto/auth";

export default class AuthApiConnector {
  static readonly baseUrl: string = import.meta.env.VITE_API_URL;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${AuthApiConnector.baseUrl}${endpoint}`;

    const config: RequestInit = {
      mode: 'cors',
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.name || 'API_Error',
          errorData.message || 'Unknown error occurred',
          response.status
        );
      }

      return await response.json();
    } catch (e: any) {
      console.error(`Auth API error [${endpoint}]:`, e);
      throw e.message ? e : { type: 'NetworkError', message: 'Check your connection' };
    }
  }

  async login(payload: UserLogin): Promise<Token> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async register(payload: UserCreate): Promise<UserRead> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async me(token: string): Promise<UserRead> {
    return this.request('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async changePassword(payload: PasswordChange, token: string): Promise<void> {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
