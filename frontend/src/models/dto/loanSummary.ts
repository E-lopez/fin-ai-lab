export interface LoanSummary {
  id: string;
  amount: string;
  borrower_name: string;
  borrower_id: string;
  days_since_payment: number;
  is_overdue: boolean;
  last_due_date: string;
  last_payment_date: string;
  next_payment_date: string;
  start_date: string;
  status: string;
  total_balance: string;
  total_payments: string;
}
