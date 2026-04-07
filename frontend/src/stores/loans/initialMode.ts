import { LoanSummary } from "@/models/dto/loanSummary"

export type InitialModelType = {
  loansOverview?: LoanSummary[],
}

export const intialAmortizationModel: InitialModelType = {
  loansOverview: [],
}