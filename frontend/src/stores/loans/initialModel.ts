import { getLoanScheduleRequest } from "@/models/dto/getLoanScheduleRequest"
import { LoanSummary } from "@/models/dto/loanSummary"
import { scheduleRow } from "@/models/types/scheduleRow"

export type simulationType = {
  data: getLoanScheduleRequest,
  schedule: scheduleRow[],
}

export type loansOverviewModelType = {
  loansOverview?: LoanSummary[],
  isLoaded?: boolean,
  simulation?: simulationType
}

export const loansOverviewModel: loansOverviewModelType = {
  loansOverview: [],
  isLoaded: false,
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
  }
}