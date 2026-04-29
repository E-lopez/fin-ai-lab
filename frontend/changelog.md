
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
