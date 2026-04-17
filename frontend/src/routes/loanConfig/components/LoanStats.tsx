import { useLoansState } from "@/stores/loans/LoansStore";
import { toCurrency } from "@/utils/functions/currency";

const LoanStats = () => {
  const [ loansState ] = useLoansState();
  const { profit, yield_rate, value, total_cost } = loansState.stats || {};

  console.log("Mounting LoanStats", loansState);

  return(
    <div className="stats u-center-v">
      <h1 className="paragraph">Loan Stats</h1>
      <div className="stats__table">
        <p>Profit: <span>{Number(profit).toFixed(2)} %</span></p>
        <p>Yield: <span>{Number(yield_rate).toFixed(2)} %</span></p>
        <p>Value: <span>{toCurrency(value)}</span></p>
        <p>Total Cost: <span>{toCurrency(total_cost)}</span></p>
      </div>
    </div>
  )
}

export default LoanStats;