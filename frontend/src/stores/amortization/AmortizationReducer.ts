type repaymentTableData = {
  'Balance': number, 
  'Interest': number, 
  'Payment': number, 
  'Payment_Date': string, 
  'Principal': number,
}[]

export default function surveyReducer(
  amortizationState: any, 
  action: { 
    type: string,
    data: repaymentTableData,
    rate: number,
  }
) {
  switch(action.type) {
    case 'STORE_DATA': {
      return {
        ...amortizationState,
        data: [...amortizationState.data, ...action.data],
        rate: action.rate,
      }
    }
    case 'RESET_DATA': {
      return {
        ...amortizationState,
        data: [],
      }
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
