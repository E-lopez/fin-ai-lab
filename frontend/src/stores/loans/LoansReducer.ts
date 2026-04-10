import { LoanSummary } from "@/models/dto/loanSummary";
import { loansOverviewModelType } from "./initialMode";

export default function surveyReducer(
  loansState: loansOverviewModelType, 
  action: { 
    type: string,
    loansOverview: LoanSummary[],
    isLoaded?: boolean,
  }
) {
  switch(action.type) {
    case 'STORE_LOANS_OVERVIEW': {
      return {
        ...loansState,
        loansOverview: action.loansOverview,
        isLoaded: true,
      }
    }
    case 'SYNC_LOANS_OVERVIEW': {
      return {
        ...loansState,
        isLoaded: action.isLoaded,
      }
    }
    case 'RESET_DATA': {
      return {
        ...loansState,
        loansOverview: [],
      }
    }
    default: {
      throw new Error('Unknown action: ' + action.type);
    }
  }
}
