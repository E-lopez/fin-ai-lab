import { User } from "./user";

export interface Demographics {
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  agreements: Record<string, string>;
}

export interface ScoringData {
  demographics: Demographics;
  sections: Record<string, Record<string, any>>;
}

export interface CreateUserRequest {
  userData: User;
  scoringData: ScoringData;
  access_token: string;
}