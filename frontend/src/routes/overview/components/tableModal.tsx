import { useState } from "react";
import FormFactory from "../../../components/formComponent/formFactory";
import { addPayment } from "@/models/forms/addPaymentModal";
import { MainApiService } from "@/services/mainApi/mainService";
import { LoanSummary } from "@/models/dto/loanSummary";
import { useLoansDispatch } from "@/stores/loans/LoansStore";
import { getTodayDate } from "@/utils/functions/dataTime";
import NextPayment from "./NextPayment";

const SuccessView = () => (
   <div className="u-center-v">
      <h1 className="paragraph paragraph--lg dark-green">Payment added successfully!</h1>
    </div>
);

const ErrorView = () => (
  <div className="u-center-v">
    <h1 className="paragraph paragraph--lg u-center-text blue">Error adding payment. <br/> Please try again.</h1>
  </div>
);

const TableModal = ({ action, loan }: {action: 'add' | 'edit'; loan: LoanSummary}) => {
  const [status, setStatus] = useState('idle');
  const [formVersion] = useState(0);
  const loansDispatch = useLoansDispatch();
  
  const savePayment = (data: any) => {
    const today = getTodayDate();    
    MainApiService.addPayment({
      loan_id: loan.id,
      paid_amount: Number(data.amount),
      payment_date: today,
    })
    .then(() => {
      loansDispatch({
        type: "SYNC_LOANS_OVERVIEW",
        isLoaded: false,
      });
      setStatus('success');
    })
    .catch((error) => {
      console.error("ERROR ADDING PAYMENT:", error);
      setStatus('error');
    });
  };

  if(status === 'success') return <SuccessView />;
  if(status === 'error') return <ErrorView />;
  return(
    <div className="u-center-v">
      <h1 className="paragraph paragraph--lg">{action === 'add' ? 'Add payment' : 'Edit borrower'}</h1>
      <p className="paragraph paragraph--sm"><span className="bold">Borrower:</span> {(loan.borrower_name).replace('_', ' ')}</p>
      <NextPayment borrowerId={loan.borrower_id} />
      <FormFactory
        key={formVersion}
        base={addPayment}
        formMethod={savePayment} 
        rootCss="survey-form"
        submitLabel="Save"
      />
    </div>
  )
}

export default TableModal;