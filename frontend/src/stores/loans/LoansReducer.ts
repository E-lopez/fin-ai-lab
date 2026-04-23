import { LoanSummary } from "@/models/dto/loanSummary";
import {
  loansOverviewModelType,
  simulationType,
  statsType
} from "./initialModel";
import { Payment } from "@/models/dto/payment";

export default function surveyReducer(
  loansState: loansOverviewModelType, 
  action: { 
    type: string,
    loansOverview: LoanSummary[],
    loanPayments: Payment[],
    isLoaded?: boolean,
    simulation?: simulationType,
    stats?: statsType,
  }
) {
  console.log("INCOMING", action);
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
    case 'STORE_SIMULATION': {
      return {
        ...loansState,
        simulation: action.simulation,
      }
    }
    case 'STORE_STATS': {
      return {
        ...loansState,
        stats: action.stats
      }
    }
    case 'STORE_LOAN_PAYMENTS': {
      return {
        ...loansState,
        loanPayments: action.loanPayments,
      }
    }
    case 'RESET_DATA': {
      return {
        ...loansState,
        loansOverview: [],
        loanPayments: [],
      }
    }
    default: {
      throw new Error('Unknown action: ' + action.type);
    }
  }
}
