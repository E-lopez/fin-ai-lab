import { useEffect, useState } from "react";
import { MainApiService } from "@/services/mainApi/mainService";
import { monthYearFormat } from "@/utils/functions/dataTime";
import { PaymentAllocation } from "@/models/dto/paymentAllocation";
import LoadingIndicator from "@/components/loaderComponent/LoaderComponent";
import { toCurrency } from "@/utils/functions/currency";

const ErrorView = () => (
  <div className="u-center-v">
    <h1 className="paragraph paragraph--lg u-center-text blue">Error retrieving payment allocation. <br/> Please try again.</h1>
  </div>
);

const AllocationModal = ({ paymentId }: {paymentId: string}) => {
  const [status, setStatus] = useState('loading');
  const [allocation, setAllocation] = useState<PaymentAllocation[] | []>([]);

  useEffect(() => {
    MainApiService.getPaymentAllocation(paymentId)
      .then((data: PaymentAllocation[]) => {
        setAllocation(data);
        setStatus('idle');
      })
      .catch((error: any) => {
        console.error("ERROR FETCHING SUMMARY:", error);
        setStatus('error');
      });
  }, [paymentId]);

  if(status === 'loading') return <LoadingIndicator />;
  if(status === 'error') return <ErrorView />;
  return(
    <div className="u-center-v u-overflow-y">
      {allocation.map((item, index) => (
        <div key={item.id} className="dataBox">
          <p className="paragraph bold blue">Allocation {index + 1}</p>
          <p className="paragraph"><span className="bold">principal:</span> {toCurrency(item.allocated_principal) || 0}</p>
          <p className="paragraph"><span className="bold">interest:</span> {toCurrency(item.allocated_interest) || 0}</p>
          <p className="paragraph"><span className="bold">fees:</span> {toCurrency(item.allocated_fees) || 0}</p>
          <p className="paragraph"><span className="bold">created at:</span> {monthYearFormat(item.created_at) || 'N/A'}</p>
        </div>
      ))}
    </div>
  )
}

export default AllocationModal;