
## Overview loan summary table

- `src/models/dto/loanSummary.ts`: Added `LoanSummary` interface matching the API response shape.
- `src/routes/overview/components/LoanSummaryTable.tsx`: Dumb component rendering a filterable table of loans. Status filter via `<select>`, overdue rows get `overview-table__row--overdue` class, and each `id` is rendered as an anchor link.
- `src/sass/routesComponents/overview/_overviewTable.scss`: SCSS partial for the overview table; overdue rows styled with `$pale-pink` background.
- `src/sass/index.scss`: Imported the new `_overviewTable.scss` partial.
- `src/routes/overview/Overview.tsx`: Added `useState` to hold fetched loans, passes data to `LoanSummaryTable`.

## OverviewHeader card calculations

- `src/utils/functions/currency.ts`: Added `filterLoans` (filters by status), `sumLoansField` (generic column sum), and `calcProfitability` (ratio + net from disbursed/repaid).
- `src/routes/overview/components/OverviewHeader.tsx`: Replaced static `model` array with computed cards derived from `loansState.loansOverview` filtered by the active filter. Disbursed, repaid, and outstanding display as currency via `toCurrency`; profitability shows `ratio%` / `net` currency. Removed unused `status` state and `MainApiService` import.

## Auth service integration

- `src/models/dto/auth.ts`: Added `UserLogin`, `UserCreate`, `UserRead`, `Token`, and `PasswordChange` interfaces matching the API schemas from `/auth/*` routes.
- `src/services/auth/authApiConnector.ts`: New connector class with `login`, `register`, `me`, and `changePassword` methods. Auth-protected endpoints pass `Authorization: Bearer {token}` directly.
- `src/services/auth/authService.ts`: Facade over `AuthApiConnector`, exported as singleton `AuthService`.
- `src/services/mainApi/mainApiConnector.ts`: `request()` now reads `globalThis.authToken` and injects `Authorization: Bearer {token}` header into every API call when a token is present.
- `src/components/modalComponent/loginModal.tsx`: Replaced mock auth with real `AuthService.login` call. On success, stores `access_token` in `globalThis.authToken`, dispatches `SAVE_TOKEN` to the token store, and closes the modal. Displays an inline error message on failure.

## Login/Logout toggle in MainBar

- `src/components/navigation/MainBar.tsx`: Reads `userAuthenticated` from the token store. When `true`, renders a Logout button that clears `globalThis.authToken` and dispatches `RESET_TOKEN`. When `false`, renders the Login button that opens the login modal.

## LoanPayments table refactor

- `src/models/dto/loanSchedule.ts`: New `LoanScheduleRead` interface matching the `/loan_schedules/loan/{loan_id}` API schema.
- `src/services/mainApi/mainApiConnector.ts`: Added `getScheduleByLoanId(loan_id)` calling `GET /loan_schedules/loan/{loan_id}`.
- `src/services/mainApi/mainService.ts`: Exposed `getScheduleByLoanId` through the facade.
- `src/routes/loanPayments/loanPayments.tsx`: Refactored to fetch payments and schedule in parallel via `Promise.all`, then fetch allocations per payment. Builds a `scheduleMap` keyed by schedule `id` to join scheduled amounts via `allocation.schedule_id`. Table now shows: sequential `#`, amount paid, allocations (principal / interest / fees), scheduled amount for that period, and payment date. Removed dependency on loans store — data is local to the route.

## LoanPayments table column expansion

- `src/utils/functions/currency.ts`: Added `calcRunningBalances(initialBalance, principalRepayments[])` — computes period-end balance by subtracting each principal repayment cumulatively from the loan's initial principal.
- `src/routes/loanPayments/loanPayments.tsx`: Split allocations into individual columns (principal, interest, fees). Added balance column computed via `calcRunningBalances` seeded from the sum of all `scheduled_principal` values. Added due date column sourced from the matched `LoanScheduleRead.due_date`. Renamed "date" column to "payment date" for clarity.

## AllocationModal full breakdown

- `src/routes/loanPayments/components/AllocationModal.tsx`: Rewritten to accept pre-fetched `allocations`, `scheduleMap`, `paymentDate`, and `paidAmount` as props — no internal API call. Renders a payment summary header (total paid, total principal/interest/fees across all allocations) followed by one `dataBox` per allocation showing period number, due date, allocated amounts, and the corresponding scheduled amounts from the matched schedule row.
- `src/routes/loanPayments/loanPayments.tsx`: Persists `scheduleMap` to component state. Added `handleRowAction` that opens `AllocationModal` via modal dispatch passing the row's allocations and scheduleMap. Added action button column to the table.
