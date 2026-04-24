import LoadingIndicator from "@/components/loaderComponent/LoaderComponent";
import { MainApiService } from "@/services/mainApi/mainService";
import { useLoansState } from "@/stores/loans/LoansStore";
import { useModalDispatch } from "@/stores/modals/ModalStore";
import { monthYearFormat } from "@/utils/functions/dataTime";
import { useEffect, useState } from "react";
import AllocationModal from "./components/BorrowersModal";
import { BorrowerResponse } from "@/models/dto/borrower";

const BorrowersView = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');
  const [loansState, loansDispatch] = useLoansState();
  const modalDispatch = useModalDispatch();


  const handleRowAction = (paymentId: string) => {

    modalDispatch({
      type: 'SHOW_MODAL',
      content: <AllocationModal paymentId={paymentId} />,
      cssModifier: 'side-modal',
    })
  }

  useEffect(() => {
    if(loansState.borrowers.length > 0) {
      setStatus('idle');
      return;
    }
    MainApiService.getBorrowers()
      .then((data: BorrowerResponse[]) => {
        loansDispatch({
          type: "STORE_BORROWERS",
          borrowers: data,
        })
        console.log("Borrowers data:", data);
        setStatus('idle');
      })
      .catch((error: any) => {
        console.error("ERROR FETCHING SUMMARY:", error);
        setStatus('error');
      });
  }, [loansState.borrowers]);

  return(
    <div className="overview-container">
      <div className="overview-table">
        {status === 'loading' && <LoadingIndicator />}
        {status === 'error' && <p className="paragraph paragraph--lg u-center-text red">Error loading data. Please try again.</p>}
        <div className="overview-table__scroll">
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>name</th>
                <th>email</th>
                <th>gender</th>
                <th>org name</th>
                <th>created at</th>
                <th>edit</th>
              </tr>
            </thead>
            <tbody>
              {loansState.borrowers.map((borrower: BorrowerResponse, index: number) => (
                <tr key={borrower.id} >
                  <td>{index+1}</td>
                  <td>{borrower.name}</td>
                  <td>{borrower.email}</td>
                  <td>{borrower.gender}</td>
                  <td>{borrower.orgName}</td>
                  <td>{monthYearFormat(borrower.created_at)}</td>
                  <td className="overview-table__row-buttons">
                    <button 
                      className="dark-green"
                      onClick={() => handleRowAction(borrower.id)} >
                      <i className="bi-info-circle-fill"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
     </div>
  )
}

export default BorrowersView;
