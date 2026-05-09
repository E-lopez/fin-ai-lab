import { toCurrency } from "@/utils/functions/currency";

const LoanPaymentsHeader = ({borrowerName, totals}: {borrowerName: string, totals: Record<string, number>}) => {

  const cards = [
    { name: 'Borrower', display: borrowerName.replace('_', ' ') ?? 'N/A' },
    { name: 'Total', display: toCurrency(totals.principal) },
    { name: 'Payments', type: 'single', display: toCurrency(totals.paid) },
    { name: 'Balance', display: toCurrency(totals.scheduled - totals.paid) },
  ];

  return (
    <div className="overview-header overview-header--wide">
      {cards.map((item) => (
        <div
          key={item.name}
          className="overview-header__card overview-header__card--single"
        >
          <p className="paragraph paragraph--sm bold">{item.name}</p>
          <p className="paragraph paragraph--sm">{item.display}</p>
        </div>
      ))}
    </div>
  );
};

export default LoanPaymentsHeader;
