export type createLoanRequest = {
  borrower_id: string,
  principal: number,
  interest_rate: number,
  amortization_type: string,
  payment_frequency: string,
  term_months: number,
  start_date: string,
  status: string,
}

export type CreateLoanResponse = createLoanRequest & {
  id: string,
  created_at: string,
}
