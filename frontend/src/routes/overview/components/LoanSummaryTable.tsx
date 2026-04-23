import { useState } from "react";
import { LoanSummary } from "@/models/dto/loanSummary";
import { toCurrency } from "@/utils/functions/currency";
import { useLoansState } from "@/stores/loans/LoansStore";
import TableModal from "@/routes/overview/components/tableModal";
import { useModalDispatch } from "@/stores/modals/ModalStore";
import { useAlertDispatch } from "@/stores/alerts/AlertsStore";
import { MainApiService } from "@/services/mainApi/mainService";
import { Link } from "react-router-dom";


const LoanSummaryTable = () => {
  const [statusFilter, setStatusFilter] = useState("active");
  const [loansState, loansDispatch] = useLoansState();
  const modalDispatch = useModalDispatch();
  const alertDispatch = useAlertDispatch();

  const statuses = ["all", ...Array.from(
    new Set<string>(loansState.loansOverview.map((d: LoanSummary) => d.status)))
  ];

  const filtered = statusFilter === "all" ? 
  loansState.loansOverview : 
  loansState.loansOverview.filter((d: LoanSummary) => d.status === statusFilter);

  const showModal = (action: 'add' | 'edit', loan: LoanSummary) => {
    modalDispatch({
      type: 'SHOW_MODAL',
      content: <TableModal action={action} loan={loan} />,
      cssModifier: 'side-modal',
    })
  }

  const disburseLoan = (loanId: string) => { 
    MainApiService.disburseLoan(loanId)
    .then(() => {
      loansDispatch({
        type: "SYNC_LOANS_OVERVIEW",
        isLoaded: false,
      });
        alertDispatch({
        type: 'SET_ALERT',
        alertType: 'success',
        message: `Loan ${loanId} disbursed successfully!`,
      });
    })
    .catch((error: any) => {
      console.error("ERROR ADDING PAYMENT:", error);
        alertDispatch({
        type: 'SET_ALERT',
        alertType: 'error',
        message: `Loan ${loanId} disbursed failed!`,
      });
    });
  };

  const handleRowAction = (loan: LoanSummary, action: string) => {
    switch(action) {
      case "add": {
        console.log("ADD PAYMENT FOR LOAN ID:", loan);
        showModal(action, loan);
        break;
      }
      case "edit": {
        console.log("EDIT LOAN ID:", loan);
        showModal(action, loan);
        break;
      }
      case "disburse": {
        console.log("DISBURSE LOAN ID:", loan);
        disburseLoan(loan.id);
        break;
      }
      default: {
        console.error("UNKNOWN ACTION:", action);
      }
    }
  };

  return (
    <div className="overview-table">
      <div className="overview-table__filter">
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="overview-table__scroll">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Borrower</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Payments</th>
              <th>Rem</th>
              <th>Last Payment</th>
              <th>Next Payment</th>
              <th>Days Since Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((loan: LoanSummary) => (
              <tr key={loan.id} >
                <td>
                  <i className={`${loan.is_overdue ? "red" : "dark-green"} u-ml-4 bi-circle-fill`}></i>
                </td>
                <td>
                  <Link to='/loan-payments' state={{ loanId: loan.id }} className="blue">
                    {loan.borrower_name}
                  </Link>
                </td>
                <td>{loan.status}</td>
                <td>{toCurrency(loan.amount)}</td>
                <td>{toCurrency(loan.total_balance)}</td>
                <td>{toCurrency(loan.total_payments)}</td>
                <td>{((Number(loan.total_balance) / Number(loan.amount))*100).toFixed(2) || 0}%</td>
                <td>{loan.last_payment_date || 'n/a'}</td>
                <td>{loan.next_payment_date || 'n/a'}</td>
                <td>{loan.days_since_payment}</td>
                <td className="overview-table__row-buttons">
                  {loan.status === 'pending' ? (
                      <button 
                        className="dark-green"
                        onClick={() => handleRowAction(loan, "disburse")} >
                        <i className="bi-play-circle-fill"></i>
                      </button>
                    ) : (
                      <button 
                        className="blue"
                        onClick={() => handleRowAction(loan, "add")} >
                        <i className="bi-plus-circle-fill"></i>
                      </button>
                    )
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanSummaryTable;
