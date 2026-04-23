export interface PaymentAllocation {
  payment_id: string,
  schedule_id: string,
  allocated_principal: number,
  allocated_interest: number,
  allocated_fees: number,
  id: string,
  created_at: string
}