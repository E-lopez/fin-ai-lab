export default function alertReducer(
  alerts: any, 
  action: { 
    type: string, 
    alertType?: 'error'|'success'|'alert', 
    message?: any,
    name?: string, 
    data?: string,
  }
) {
  switch(action.type) {
    case 'SET_ALERT': {
      return[...alerts, {
        name: action.name,
        type: action.alertType ?? 'error',
        message: action.message,
        data: action.data,
      }]
    }
    case 'REMOVE_ALERT': {
      return alerts.filter((e: { name: string; }) => e.name !== action.name)
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
