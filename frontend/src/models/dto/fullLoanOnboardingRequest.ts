import { Borrower } from "./borrower";
import { createLoanRequest } from "./createLoanRequest";

export interface FullLoanOnboardingRequest {
  borrower: Borrower;
  loan: createLoanRequest;
}