import { useState, useMemo } from "react";
import { useLoansState } from "@/stores/loans/LoansStore";
import CustomButton from "@/components/button/CustomButton";
import { toCurrency, filterLoans, sumLoansField, calcProfitability } from "@/utils/functions/currency";
import { LoanSummary } from "@/models/dto/loanSummary";

const OverviewHeader = () => {
  const [filter, setFilter] = useState('active');
  const [loansState] = useLoansState();

  const loans: LoanSummary[] = useMemo(
    () => filterLoans(loansState?.loansOverview ?? [], filter),
    [loansState?.loansOverview, filter]
  );

  const disbursed = useMemo(() => sumLoansField(loans, 'amount'), [loans]);
  const repaid = useMemo(() => sumLoansField(loans, 'total_payments'), [loans]);
  const outstanding = useMemo(() => sumLoansField(loans, 'total_balance'), [loans]);
  const profitability = useMemo(() => calcProfitability(disbursed, repaid), [disbursed, repaid]);

  const cards = [
    { name: 'disbursed', type: 'single', display: toCurrency(disbursed) },
    { name: 'repaid', type: 'single', display: toCurrency(repaid) },
    { name: 'outstanding', type: 'single', display: toCurrency(outstanding) },
    {
      name: 'profitability',
      type: 'multiple',
      display: `${(profitability.ratio * 100).toFixed(2)}%`,
      display_sec: `${toCurrency(profitability.net)}`,
    },
  ];

  return (
    <div className="overview-header">
      <div className="overview-header__filters">
        <CustomButton
          label="Active"
          cssModifier={`${filter === 'active' ? 'overview-filters--active' : 'overview-filters'}`}
          method={() => setFilter('active')}
        />
        <CustomButton
          label="All"
          cssModifier={`${filter === 'all' ? 'overview-filters--active' : 'overview-filters'}`}
          method={() => setFilter('all')}
        />
      </div>
      {cards.map((item) => (
        <div
          key={item.name}
          className={`overview-header__card overview-header__card--${item.type}`}
        >
          <p className="paragraph paragraph--sm bold">{item.name}</p>
          <p className="paragraph paragraph--sm">{item.display}</p>
          {item.display_sec && <p className="paragraph paragraph--xs">{item.display_sec}</p>}
        </div>
      ))}
    </div>
  );
};

export default OverviewHeader;
