import { useState } from "react";
import { useModalDispatch } from "@/stores/modals/ModalStore";
import { useTokenDispatch } from "@/stores/tokens/TokenStore";
import FormFactory from "../formComponent/formFactory";
import { addPayment } from "@/models/forms/addPaymentModal";
import { MainApiService } from "@/services/mainApi/mainService";
import { LoanSummary } from "@/models/dto/loanSummary";

const SuccessView = () => (
   <div className="u-center-v">
      <h1 className="paragraph paragraph--lg">Payment added successfully!</h1>
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
  const tokenDispatch = useTokenDispatch();
  const modalDispatch = useModalDispatch();

  const savePayment = (data: any) => {
    const today = new Date().toISOString().split('T')[0];

    console.log("TEST PAYKMENT DATA:", {
      loan_id: loan.id,
      paid_amount: data.amount,
      payment_date: today,
    });
    
    MainApiService.addPayment({
      loan_id: loan.id,
      paid_amount: data.amount,
      payment_date: today,
    })
    .then(() => {
      modalDispatch({
        type: 'HIDE_MODAL',
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
      <p className="paragraph paragraph--sm">Borrower: {loan.borrower_name}</p>
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