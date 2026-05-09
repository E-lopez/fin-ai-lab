import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MainApiService } from "@/services/mainApi/mainService";
import { Payment } from "@/models/dto/payment";
import { PaymentAllocation } from "@/models/dto/paymentAllocation";
import { LoanScheduleRead } from "@/models/dto/loanSchedule";
import LoadingIndicator from "@/components/loaderComponent/LoaderComponent";
import { toCurrency } from "@/utils/functions/currency";
import { isSameMonthAndYear, monthYearFormat } from "@/utils/functions/dataTime";
import { useModalDispatch } from "@/stores/modals/ModalStore";
import AllocationModal from "./components/AllocationModal";
import LoanPaymentsHeader from "./components/LoanPaymentsHeader";

interface EnrichedPayment {
  payment: Payment;
  allocations: PaymentAllocation[];
  scheduledAmount: number;
  scheduleRow: LoanScheduleRead | undefined;
  balance: number;
}

const LoanPayments = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');
  const [schedule, setSchedule] = useState<LoanScheduleRead[]>([]);
  const location = useLocation();
  const { loanId, borrowerName } = location.state || {};
  const modalDispatch = useModalDispatch();

  const totals = { scheduled: 0, principal: 0, paid: 0 };

  const handleRowAction = (row: EnrichedPayment) => {
    // modalDispatch({
    //   type: 'SHOW_MODAL',
    //   content: (
    //     <AllocationModal
    //       allocations={row.allocations}
    //       scheduleMap={scheduleMap}
    //       paymentDate={row.payment.payment_date}
    //       paidAmount={row.payment.paid_amount}
    //     />
    //   ),
    //   cssModifier: 'side-modal',
    // });
  };

  const sumTotals = (scheduled: number, principal: number, paid: number) => {
    totals.scheduled += scheduled;
    totals.principal += principal;
    totals.paid += paid;
  }

  const groupByDueDate = (payments: Payment[], schedule: LoanScheduleRead[]) =>
    schedule.map((s) => {
      const amounts_payed = payments.filter((p) => isSameMonthAndYear(p.payment_date, s.due_date)).reduce((acc, p) => {
        return acc + Number(p.paid_amount);
      }, 0);
      return {
        ...s,
        amounts_payed,
      }
    });

  useEffect(() => {
    Promise.all([
      MainApiService.getPaymentsByLoanId(loanId),
      MainApiService.getScheduleByLoanId(loanId),
    ])
    .then(async ([payments, schedule]) => {
      // const scheduleMap = new Map<string, LoanScheduleRead>(
      //   (schedule).map((s) => [s.id, s])
      // );
      const scheduledGrouped = groupByDueDate(payments, schedule);
      setSchedule(scheduledGrouped);

      // const enrichedBase = await Promise.all(
      //   (payments).map(async (payment) => {
      //     const allocations = await MainApiService.getPaymentAllocation(payment.id);
      //     const scheduleRow = allocations[0]?.schedule_id
      //       ? scheduleMap.get(allocations[0].schedule_id)
      //       : undefined;
      //     const scheduledAmount = scheduleRow
      //       ? Number(scheduleRow.scheduled_principal) + Number(scheduleRow.scheduled_interest) + Number(scheduleRow.scheduled_fees)
      //       : 0;
      //     return { payment, allocations, scheduledAmount, scheduleRow };
      //   })
      // );

      // const scheduleList = schedule;
      // const initialBalance = scheduleList.reduce(
      //   (acc, s) => acc + Number(s.scheduled_principal), 0
      // );

      // const principalRepayments = enrichedBase.map(
      //   ({ allocations }) => Number(allocations[0]?.allocated_principal ?? 0)
      // );
      // const balances = calcRunningBalances(initialBalance, principalRepayments);

      // setRows(enrichedBase.map((row, i) => ({ ...row, balance: balances[i] })));
      setStatus('idle');
    })
    .catch((error) => {
      console.error("ERROR FETCHING LOAN PAYMENTS:", error);
      setStatus('error');
    });
  }, [loanId]);

  return (
    <>
    <LoanPaymentsHeader borrowerName={borrowerName} totals={totals} />
    <div className="overview-container">
      <div className="overview-table">
        {status === 'loading' && <LoadingIndicator />}
        {status === 'error' && (
          <p className="paragraph paragraph--lg u-center-text red">Error loading data. Please try again.</p>
        )}
        {status === 'idle' && (
          <div className="overview-table__scroll">
            <table>
              <thead>
                <tr>
                  <th>per</th>
                  <th>principal</th>
                  <th>interest</th>
                  <th>fees</th>
                  <th>scheduled amount</th>
                  <th>Paid amount</th>
                  <th>due date</th>
                  <th>Allocations</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => {
                  const { period, due_date, scheduled_fees, scheduled_interest, scheduled_principal, id, amounts_payed } = row;
                  const scheduledAmount = Number(scheduled_principal) + Number(scheduled_interest) + Number(scheduled_fees);
                  sumTotals(scheduledAmount, Number(scheduled_principal), Number(amounts_payed ?? 0));
                  return (
                  <tr key={id}>
                    <td>{period}</td>
                    <td>{toCurrency(scheduled_principal)}</td>
                    <td>{toCurrency(scheduled_interest)}</td>
                    <td>{toCurrency(scheduled_fees)}</td>
                    <td>{toCurrency(scheduledAmount)}</td>
                    <td>{toCurrency(amounts_payed ?? 0)}</td>
                    <td>{due_date ? monthYearFormat(due_date) : '—'}</td>
                    <td className="overview-table__row-buttons">
                      <button className="blue" onClick={() => {}}>
                        <i className="bi-info-circle-fill"></i>
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default LoanPayments;
