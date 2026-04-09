import { useEffect } from "react";
import { MainApiService } from "@/services/mainApi/mainService";
import { LoanSummary } from "@/models/dto/loanSummary";
import LoanSummaryTable from "./components/LoanSummaryTable";
import { useLoansState } from "@/stores/loans/LoansStore";

const Overview = () => {
  const [loansState,loansDispatch] = useLoansState();

  useEffect(() => {
    if(loansState.loansOverview.length > 0) return;
    MainApiService.getSummary()
      .then((data: LoanSummary[]) => {
        loansDispatch({
          type: "STORE_LOANS_OVERVIEW",
          loansOverview: data,
        })
      })
      .catch((error) => console.error("ERROR FETCHING SUMMARY:", error));
  }, []);

  return (
    <div className="overview-container">
      <LoanSummaryTable />
    </div>
  );
};

export default Overview;
