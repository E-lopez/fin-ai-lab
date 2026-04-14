import LoanConfigForm from "./components/LoanConfigForm";
import LoanConfigTable from "./components/LoanConfigTable";
import LoanStats from "./components/LoanStats";

const LoanConfig = () => {   
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
          <LoanConfigTable />
        </div>
      </div>
    </div>
  )
}

export default LoanConfig;
