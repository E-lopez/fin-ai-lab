import { LoanSummary } from "@/models/dto/loanSummary"

export type loansOverviewModelType = {
  loansOverview?: LoanSummary[],
  isLoaded?: boolean,
}

export const loansOverviewModel: loansOverviewModelType = {
  loansOverview: [],
  isLoaded: false,
}