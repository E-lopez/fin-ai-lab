import { useState, useEffect } from "react";
import { MainApiService } from "@/services/mainApi/mainService";
import { LoanSummary } from "@/models/dto/loanSummary";
import LoanSummaryTable from "./components/LoanSummaryTable";

const Overview = () => {
  const [loans, setLoans] = useState<LoanSummary[]>([]);

  useEffect(() => {
    MainApiService.getSummary()
      .then(setLoans)
      .catch((error) => console.error("ERROR FETCHING SUMMARY:", error));
  }, []);

  return (
    <div className="">
      <LoanSummaryTable data={loans} />
    </div>
  );
};

export default Overview;
