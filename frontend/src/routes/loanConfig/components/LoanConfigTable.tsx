import { scheduleRow } from "@/models/types/scheduleRow";
import { useLoansState } from "@/stores/loans/LoansStore";
import { toCurrency } from "@/utils/functions/currency";
import { useEffect } from "react";

const LoanConfigTable = () => {
  const [ loansState ] = useLoansState();

  const { schedule } = loansState.simulation || [];

  useEffect(() => {
    console.log('Mounting LoanConfigTable', loansState.simulation);
  }, [loansState.simulation])

  return(
    <div className="u-center-v">
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
}

export default LoanConfigTable;