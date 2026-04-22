
## Overview loan summary table

- `src/models/dto/loanSummary.ts`: Added `LoanSummary` interface matching the API response shape.
- `src/routes/overview/components/LoanSummaryTable.tsx`: Dumb component rendering a filterable table of loans. Status filter via `<select>`, overdue rows get `overview-table__row--overdue` class, and each `id` is rendered as an anchor link.
- `src/sass/routesComponents/overview/_overviewTable.scss`: SCSS partial for the overview table; overdue rows styled with `$pale-pink` background.
- `src/sass/index.scss`: Imported the new `_overviewTable.scss` partial.
- `src/routes/overview/Overview.tsx`: Added `useState` to hold fetched loans, passes data to `LoanSummaryTable`.

## OverviewHeader card calculations

- `src/utils/functions/currency.ts`: Added `filterLoans` (filters by status), `sumLoansField` (generic column sum), and `calcProfitability` (ratio + net from disbursed/repaid).
- `src/routes/overview/components/OverviewHeader.tsx`: Replaced static `model` array with computed cards derived from `loansState.loansOverview` filtered by the active filter. Disbursed, repaid, and outstanding display as currency via `toCurrency`; profitability shows `ratio%` / `net` currency. Removed unused `status` state and `MainApiService` import.
