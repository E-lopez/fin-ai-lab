import LoadingIndicator from "@/components/loaderComponent/LoaderComponent";
import { Payment } from "@/models/dto/payment";
import { MainApiService } from "@/services/mainApi/mainService";
import { useLoansState } from "@/stores/loans/LoansStore";
import { useModalDispatch } from "@/stores/modals/ModalStore";
import { monthYearFormat } from "@/utils/functions/dataTime";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AllocationModal from "./components/AllocationModal";

const LoanPayments = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');
  const [loansState, loansDispatch] = useLoansState();
  const modalDispatch = useModalDispatch();
  const location = useLocation();
  const { loanId } = location.state || {};
  const { loanPayments } = loansState;

  const handleRowAction = (paymentId: string) => {
    console.log("HANDLE ACTION FOR PAYMENT ID:", paymentId);
    modalDispatch({
      type: 'SHOW_MODAL',
      content: <AllocationModal paymentId={paymentId} />,
      cssModifier: 'side-modal',
    })
  }

  useEffect(() => {
    MainApiService.getPaymentsByLoanId(loanId)
      .then((data: Payment[]) => {
        loansDispatch({
          type: "STORE_LOAN_PAYMENTS",
          loanPayments: data,
        })
        setStatus('idle');
      })
      .catch((error) => {
        console.error("ERROR FETCHING SUMMARY:", error);
        setStatus('error');
      });
  }, [loanId]);

  return(
    <div className="overview-container">
      <div className="overview-table">
        {status === 'loading' && <LoadingIndicator />}
        {status === 'error' && <p className="paragraph paragraph--lg u-center-text red">Error loading data. Please try again.</p>}
        <div className="overview-table__scroll">
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>amount</th>
                <th>date</th>
                <th>created at</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {loanPayments.map((payment: Payment, index: number) => (
                <tr key={payment.id} >
                  <td>{index}</td>
                  <td>{payment.paid_amount}</td>
                  <td>{monthYearFormat(payment.payment_date)}</td>
                  <td>{monthYearFormat(payment.created_at)}</td>
                  <td className="overview-table__row-buttons">
                    <button 
                      className="dark-green"
                      onClick={() => handleRowAction(payment.id)} >
                      <i className="bi-info-circle-fill"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
     </div>
  )
}

export default LoanPayments;
