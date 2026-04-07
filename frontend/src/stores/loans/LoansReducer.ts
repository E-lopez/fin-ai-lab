import { LoanSummary } from "@/models/dto/loanSummary";

export default function surveyReducer(
  loansState: any, 
  action: { 
    type: string,
    loansOverview: LoanSummary[],
  }
) {
  switch(action.type) {
    case 'STORE_LOANS_OVERVIEW': {
      return {
        ...loansState,
        loansOverview: [...loansState.loansOverview, ...action.loansOverview],
      }
    }
    case 'RESET_DATA': {
      return {
        ...loansState,
        data: [],
      }
    }
    default: {
      throw new Error('Unknown action: ' + action.type);
    }
  }
}
