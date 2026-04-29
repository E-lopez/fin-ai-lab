export interface UserLogin {
  username: string;
  password: string;
}

export interface UserCreate extends UserLogin {
  role?: string;
}

export interface UserRead {
  id: string;
  username: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface PasswordChange {
  old_password: string;
  new_password: string;
}
