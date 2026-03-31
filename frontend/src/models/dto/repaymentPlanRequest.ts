export type repaymentPlanRequest = {
  payment_type: 'period' | 'instalment',
  user_risk: string,
  amount: string,
  period?: string,
  instalment?: string,
}