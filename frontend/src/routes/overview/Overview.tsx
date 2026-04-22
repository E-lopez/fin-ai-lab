import { useEffect, useState } from "react";
import { MainApiService } from "@/services/mainApi/mainService";
import { LoanSummary } from "@/models/dto/loanSummary";
import LoanSummaryTable from "./components/LoanSummaryTable";
import { useLoansState } from "@/stores/loans/LoansStore";
import LoadingIndicator from "@/components/loaderComponent/LoaderComponent";
import OverviewHeader from "./components/OverviewHeader";

const Overview = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');
  const [loansState,loansDispatch] = useLoansState();

  useEffect(() => {
    if(loansState.isLoaded) {
      setStatus('idle');
      return;
    };
    MainApiService.getSummary()
      .then((data: LoanSummary[]) => {
        loansDispatch({
          type: "STORE_LOANS_OVERVIEW",
          loansOverview: data,
        })
        setStatus('idle');
      })
      .catch((error) => {
        console.error("ERROR FETCHING SUMMARY:", error);
        setStatus('error');
      });
  }, [loansState.isLoaded]);

  return (
    <div className="overview">
      <OverviewHeader />
      <div className="overview-container">
        {status === 'loading' && <LoadingIndicator />}
        {status === 'idle' && <LoanSummaryTable />}
        {status === 'error' && <p className="paragraph paragraph--lg u-center-text red">Error loading data. Please try again.</p>}
      </div>
    </div>
  );
};

export default Overview;
