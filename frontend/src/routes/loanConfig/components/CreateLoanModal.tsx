import { useState } from "react";
import FormFactory from "@/components/formComponent/formFactory";
import { MainApiService } from "@/services/mainApi/mainService";
import { useLoansState } from "@/stores/loans/LoansStore";
import { getTodayDate } from "@/utils/functions/dataTime";
import { borrowerData } from "@/models/forms/borrowerData";
import LoadingIndicator from "@/components/loaderComponent/LoaderComponent";
import { formatName } from "@/utils/functions/strings";

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

  const createNewLoan = (payload: any) => {
    console.log("CREATE NEW LOAN", loansState, payload);
    const { simulation: { data }} = loansState;
    const today = getTodayDate();
    setStatus('loading');
    MainApiService.onboardingFullLoan({
      borrower: {
        name: formatName(payload.borrowerName),
        email: payload.email,
        gender: payload.gender,
        orgName: payload.organization,
      },
      loan: {
        principal: Number(data.principal),
        interest_rate: Number(data.interest_rate),
        term_months: Number(data.term_months),
        start_date: today,
        status: 'pending',
        borrower_id: "",
        amortization_type: data.amortization_type,
        payment_frequency: data.payment_frequency
      },
    })
    .then(() => {
      loansDispatch({
        type: "SYNC_LOANS_OVERVIEW",
        isLoaded: false,
      });
      setStatus('success');
    })
    .catch((error) => {
      console.error("ERROR CREATING LOAN:", error);
      setStatus('error');
    });

  }

  if(status === 'success') return <SuccessView />;
  if(status === 'error') return <ErrorView />;
  return(
    <div className="u-center-v">
      <h1 className="paragraph paragraph--lg">Save Loan</h1>
      {status === 'loading' && <LoadingIndicator />}
      {status === 'idle' &&
        <FormFactory
          key={formVersion}
          base={borrowerData}
          formMethod={createNewLoan} 
          rootCss="form-loan-config"
          submitLabel="Save"
        />
      }
    </div>
  )
}

export default SaveLoanModal;