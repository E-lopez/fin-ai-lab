import { forwardRef, useEffect } from "react";
import { scheduleRow } from "@/models/types/scheduleRow";
import { useLoansState } from "@/stores/loans/LoansStore";
import {
  toCurrency,
  sumColumn,
  calcTotalValue
} from "@/utils/functions/currency";

const LoanConfigTable = forwardRef<HTMLTableElement, any>((props, ref) => {
  const [ loansState, loansDispatch ] = useLoansState();

  const { schedule } = loansState.simulation || [];

  useEffect(() => {
    const schedule: scheduleRow[] = loansState.simulation?.schedule ?? [];
    if (!schedule.length) return;

    const totalPrincipal = sumColumn(schedule, 'scheduled_principal');
    const totalInterest = sumColumn(schedule, 'scheduled_interest');
    const totalFees = sumColumn(schedule, 'scheduled_fees');

    const total_cost = totalFees + totalInterest
    const profit = total_cost/totalPrincipal*100;
    const yieldRate = profit*(12/schedule.length);
    const value = calcTotalValue(totalPrincipal, totalFees, totalInterest);

    loansDispatch({
      type: 'STORE_STATS',
      stats: { profit, yield_rate: yieldRate, value, total_cost },
    });
  }, [loansState.simulation?.schedule]);

  return(
    <div className="u-center-v" ref={ref as any}>
      <h1 className="paragraph">Loan Simulation</h1>
      <div className="overview-table overview-table__scroll">
        <table>
          <thead>
            <tr>
              <th>Payment</th>
              <th>Due</th>
              <th>Principal</th>
              <th>Interests</th>
              <th>Fees</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row: scheduleRow) => (
              <tr key={row.period} >
                <td>{row.period}</td>
                <td>{row.due_date}</td>
                <td>{toCurrency(row.scheduled_principal)}</td>
                <td>{toCurrency(row.scheduled_interest)}</td>
                <td>{toCurrency(row.scheduled_fees)}</td>
                <td>{toCurrency(Number(row.scheduled_fees) + Number(row.scheduled_interest) + Number(row.scheduled_principal))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
});

export default LoanConfigTable;