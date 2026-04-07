import { useState } from "react";
import { LoanSummary } from "@/models/dto/loanSummary";
import { toCurrency } from "@/utils/functions/currency";

interface Props {
  data: LoanSummary[];
}

const LoanSummaryTable = ({ data }: Props) => {
  const [statusFilter, setStatusFilter] = useState("active");

  const statuses = ["all", ...Array.from(new Set(data.map((d) => d.status)))];
  const filtered = statusFilter === "all" ? data : data.filter((d) => d.status === statusFilter);

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
          {filtered.map((loan, i) => (
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
