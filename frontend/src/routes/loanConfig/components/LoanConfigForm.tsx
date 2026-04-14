import { useState } from "react";
import FormFactory from "@/components/formComponent/formFactory";
import { MainApiService } from "@/services/mainApi/mainService";
import { loanScheduleFormModel } from "@/models/forms/loanConfig";
import { getLoanScheduleRequest } from "@/models/dto/getLoanScheduleRequest";
import { useLoansDispatch } from "@/stores/loans/LoansStore";


const LoanConfigForm = () => {
  const [formVersion] = useState(0);
  const loansDispatch = useLoansDispatch();

  const getSchedule = (data: getLoanScheduleRequest) => {
    const dto = {
      borrower_id: "",
      principal: Number(data.principal),
      interest_rate: Number(data.interest_rate),
      amortization_type: data.amortization_type,
      payment_frequency: data.payment_frequency,
      term_months: Number(data.term_months),
      start_date: new Date().toISOString(),
      id: "1",
      status: "",
      created_at: "",
    }

    console.log("GETTING LOAN SCHEDULE...", dto);

    MainApiService.simulateLoanSchedule(dto)
    .then((data) => {
      console.log("STORING LOAN SCHEDULE");
      loansDispatch({
        type: "STORE_SIMULATION", 
        simulation: {
          data: dto,
          schedule: data
        }, 
      })
    })
    .catch((error) => {
      console.error("ERROR SIMULATING LOAN SCHEDULE:", error);
    });
  };

  return(
    <div className="u-center-v">
      <h1 className="paragraph">Loan data</h1>
      <FormFactory
        key={formVersion}
        base={loanScheduleFormModel}
        formMethod={getSchedule} 
        rootCss="form-loan-config"
        submitLabel="Simulate"
        resetOnSubmit={false}
      />
    </div>
  )
}

export default LoanConfigForm;