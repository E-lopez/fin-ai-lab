import { initialModel } from "./initialState";

export default function TokenReducer(
  tokenState: any, 
  action: { 
    type: string,
    payload?: Record<string, string> 
  }
) {
  switch(action.type) {
    case 'SAVE_TOKEN':
      return {
        ...tokenState,
        ...action.payload,
      }
    case 'RESET_TOKEN':
      return initialModel;
    default: {
      throw new Error('Unknown action: ' + action.type);
    }
  }
}
