import { useRef } from 'react';
import { toPng } from 'html-to-image';

import LoanConfigForm from "./components/LoanConfigForm";
import LoanConfigTable from "./components/LoanConfigTable";
import LoanStats from "./components/LoanStats";
import TableModal from "@/routes/overview/components/tableModal";
import { dateNowLocale } from "@/utils/functions/dataTime";
import { useLoansState } from '@/stores/loans/LoansStore';
import { useModalDispatch } from "@/stores/modals/ModalStore";
import CreateLoanModal from './components/CreateLoanModal';


const LoanConfig = () => {   
  const [loansState] = useLoansState();
  const modalDispatch = useModalDispatch();
  const tableRef = useRef(null);

  const showModal = () => {
    modalDispatch({
      type: 'SHOW_MODAL',
      content: <CreateLoanModal />,
      cssModifier: 'side-modal',
    })
  }

  const downloadTable = () => {
    if (tableRef.current === null) return;

    toPng(tableRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `simulation-${dateNowLocale()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error(err));
  };

  const recordLoan = () => {
    console.log("RECORD LOAN", loansState);
  };

  return(
    <div className="loans">
      <div className="loans__top">
        <div className="loans__form">
          <LoanConfigForm />
        </div>
        <div className="loans__stats">
          <LoanStats />
        </div>
      </div>

      <div className="loans__table">
        <div className="loans__table-content">
          <LoanConfigTable ref={tableRef} />
        </div>
      </div>

      <div className="loans__actions">
        <button
          onClick={downloadTable} 
          className="loans__actions-btn"
        >
          <i className="bi-download"></i>
        </button>
        <button 
          onClick={showModal}
          className="loans__actions-btn"
        >
          <i className="bi-cloud-arrow-up-fill"></i>
        </button>
      </div>
    </div>
  )
}

export default LoanConfig;
