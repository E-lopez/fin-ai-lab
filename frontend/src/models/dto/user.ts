export interface User {
  id?: string;              // UUID, auto-generated
  idNumber: string;         // 5-12 digits
  userName: string;         // max 50 characters
  email: string;           // valid email format
  dateOfBirth: string;     // date string
  gender: string;          // gender value
  occupation: string;      // occupation
  riskLevel: string;       // 1-10, defaults to "1"
}

export interface UserApiResponse {
  status: number;
  body: User; 
  message?: string;
}
