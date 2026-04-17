import { useState } from "react";
import FormFactory from "@/components/formComponent/formFactory";
import { MainApiService } from "@/services/mainApi/mainService";
import { LoanSummary } from "@/models/dto/loanSummary";
import { useLoansDispatch, useLoansState } from "@/stores/loans/LoansStore";
import { getTodayDate } from "@/utils/functions/dataTime";
import { borrowerData } from "@/models/forms/borrowerData";

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

const SaveLoanModal = () => {
  const [status, setStatus] = useState('idle');
  const [formVersion] = useState(0);
  const [loansState, loansDispatch] = useLoansState();

  const createNewLoan = (data: any) => {
    console.log("CREATE NEW LOAN", loansState, data);
    // create borrower use borrower model dto
    // get borrower Id from response
    // create loan with loan model dto (Remember, status must be pending)
    // get loan id from response and create schedule with createLoanSchedule model dto
    // sync loans overview

  }

  if(status === 'success') return <SuccessView />;
  if(status === 'error') return <ErrorView />;
  return(
    <div className="u-center-v">
      <h1 className="paragraph paragraph--lg">Save Loan</h1>
      <FormFactory
        key={formVersion}
        base={borrowerData}
        formMethod={createNewLoan} 
        rootCss="form-loan-config"
        submitLabel="Save"
      />
    </div>
  )
}

export default SaveLoanModal;