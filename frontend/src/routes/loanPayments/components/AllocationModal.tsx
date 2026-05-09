import { PaymentAllocation } from "@/models/dto/paymentAllocation";
import { LoanScheduleRead } from "@/models/dto/loanSchedule";
import { toCurrency } from "@/utils/functions/currency";
import { monthYearFormat } from "@/utils/functions/dataTime";

interface Props {
  allocations: PaymentAllocation[];
  scheduleMap: Map<string, LoanScheduleRead>;
  paymentDate: string;
  paidAmount: string;
}

const AllocationModal = ({ allocations, scheduleMap, paymentDate, paidAmount }: Props) => {
  const totalAllocated = allocations.reduce(
    (acc, a) => ({
      principal: acc.principal + Number(a.allocated_principal),
      interest: acc.interest + Number(a.allocated_interest),
      fees: acc.fees + Number(a.allocated_fees),
    }),
    { principal: 0, interest: 0, fees: 0 }
  );

  return (
    <div className="u-overflow-y">
      <div className="dataBox">
        <p className="paragraph bold blue">Payment summary</p>
        <p className="paragraph"><span className="bold">date:</span> {monthYearFormat(paymentDate)}</p>
        <p className="paragraph"><span className="bold">total paid:</span> {toCurrency(paidAmount)}</p>
        <p className="paragraph"><span className="bold">total principal:</span> {toCurrency(totalAllocated.principal)}</p>
        <p className="paragraph"><span className="bold">total interest:</span> {toCurrency(totalAllocated.interest)}</p>
        <p className="paragraph"><span className="bold">total fees:</span> {toCurrency(totalAllocated.fees)}</p>
      </div>

      {allocations.map((item, index) => {
        const scheduleRow = scheduleMap.get(item.schedule_id);
        return (
          <div key={item.id} className="dataBox">
            <p className="paragraph bold blue">Allocation {index + 1}</p>
            {scheduleRow && (
              <p className="paragraph"><span className="bold">period:</span> {scheduleRow.period} — due {monthYearFormat(scheduleRow.due_date)}</p>
            )}
            <p className="paragraph"><span className="bold">principal:</span> {toCurrency(item.allocated_principal)}</p>
            <p className="paragraph"><span className="bold">interest:</span> {toCurrency(item.allocated_interest)}</p>
            <p className="paragraph"><span className="bold">fees:</span> {toCurrency(item.allocated_fees)}</p>
            {scheduleRow && (
              <>
                <p className="paragraph"><span className="bold">scheduled principal:</span> {toCurrency(scheduleRow.scheduled_principal)}</p>
                <p className="paragraph"><span className="bold">scheduled interest:</span> {toCurrency(scheduleRow.scheduled_interest)}</p>
                <p className="paragraph"><span className="bold">scheduled fees:</span> {toCurrency(scheduleRow.scheduled_fees)}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AllocationModal;
