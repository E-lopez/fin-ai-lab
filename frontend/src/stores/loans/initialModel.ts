import { BorrowerResponse } from "@/models/dto/borrower"
import { getLoanScheduleRequest } from "@/models/dto/getLoanScheduleRequest"
import { LoanSummary } from "@/models/dto/loanSummary"
import { Payment } from "@/models/dto/payment"
import { scheduleRow } from "@/models/types/scheduleRow"

export type simulationType = {
  data: getLoanScheduleRequest,
  schedule: scheduleRow[],
}

export type statsType = {
  profit: number,
  yield_rate: number,
  value: number,
  total_cost: number,
}

export type loansOverviewModelType = {
  loansOverview?: LoanSummary[],
  loanPayments?: Payment[],
  borrowers?: BorrowerResponse[],
  isLoaded?: boolean,
  simulation?: simulationType,
  stats?: statsType,
}

export const loansOverviewModel: loansOverviewModelType = {
  loansOverview: [],
  loanPayments: [],
  isLoaded: false,
  borrowers: [],
  simulation: {
    data: {
      principal: 0,
      interest_rate: 0,
      amortization_type: "",
      payment_frequency: "",
      term_months: 0,
      start_date: "",
      id: ""
    },
    schedule: [],
  },
  stats: {
    profit: 0,
    yield_rate: 0,
    value: 0,
    total_cost: 0,
  }
}