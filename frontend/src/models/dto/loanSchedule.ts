export interface LoanScheduleRead {
  id: string;
  loan_id: string;
  period: number;
  due_date: string;
  scheduled_principal: string;
  scheduled_interest: string;
  scheduled_fees: string;
  created_at: string;
  amounts_payed?: number;
}
