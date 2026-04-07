import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { LoanSummary } from "@/models/dto/loanSummary";
import { toCurrency } from "@/utils/functions/currency";
import { useLoansState } from "@/stores/loans/LoansStore";

interface Props {
  data: LoanSummary[];
}

const LoanSummaryTable = () => {
  const [statusFilter, setStatusFilter] = useState("active");
  const [loansState] = useLoansState();

  const statuses = ["all", ...Array.from(new Set<string>(loansState.loansOverview.map((d: LoanSummary) => d.status)))];
  const filtered = statusFilter === "all" ? loansState.loansOverview : loansState.loansOverview.filter((d: LoanSummary) => d.status === statusFilter);

  return (
    <div className="overview-table">
      <div className="overview-table__filter">
        <label htmlFor="status-filter">Status:</label>
        <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="overview-table__scroll">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Borrower</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Total Balance</th>
            <th>Total Payments</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Last Payment</th>
            <th>Next Payment</th>
            <th>Days Since Payment</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((loan: LoanSummary, i: number) => (
            <tr key={loan.id} >
              <td>
                <a href={`/loans/${loan.id}`}>{i + 1}</a>
              </td>
              <td >{loan.borrower_name}</td>
              <td>{loan.status}</td>
              <td>{toCurrency(loan.amount)}</td>
              <td>{toCurrency(loan.total_balance)}</td>
              <td>{toCurrency(loan.total_payments)}</td>
              <td>{loan.start_date}</td>
              <td>{loan.last_due_date}</td>
              <td>{loan.last_payment_date}</td>
              <td className={loan.is_overdue ? "overview-table__row--overdue" : ""}>{loan.next_payment_date}</td>
              <td>{loan.days_since_payment}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default LoanSummaryTable;
