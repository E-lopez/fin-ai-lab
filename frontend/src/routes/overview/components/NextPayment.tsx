import { NextPaymentType } from "@/models/dto/nextPaymentType";
import { MainApiService } from "@/services/mainApi/mainService";
import { toCurrency } from "@/utils/functions/currency";
import { useEffect, useState } from "react";

const NextPayment = ({ borrowerId }: { borrowerId: string }) => {
  const [payment, setPayment] = useState<NextPaymentType>({
    amount_due: 0,
    due_date: '',
    is_catch_up_balance: false,
    status: '',
  });

  useEffect(() => {
      MainApiService.getNextPayment(borrowerId)
        .then((data: NextPaymentType | null) => {
          if (data) {
            setPayment({
              ...payment,
              ...data
            });
          }
        })
        .catch((error: any) => {
          console.error("ERROR FETCHING NEXT PAYMENT:", error);
        });
    }, [borrowerId]);
    
  return (
    <div className="dataBox">
      <h2>Next Payment</h2>
      <p>Amount: {toCurrency(payment.amount_due)}</p>
      <p>Due Date: {payment.due_date}</p>
      <p className={`${payment.status === 'overdue' ? 'red' : 'blue'}`}>{payment.status}</p>
    </div>
  );
};

export default NextPayment;