export interface Borrower {
  name: string,
  email: string,
  gender: string,
  orgName: string
};

export interface BorrowerResponse extends Borrower {
  id: string
  created_at: string
};