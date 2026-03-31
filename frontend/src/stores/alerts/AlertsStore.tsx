import { 
  createContext, 
  ReactElement, 
  useContext, 
  useReducer 
} from "react";
import alertReducer from "./AlertsReducer";

const AlertContext = createContext(null);
const AlertDispatchContext = createContext<any>([]);

export function AlertProvider ({ children }: Readonly<{ children: ReactElement }>) {
  const [alert, dispatch] = useReducer(
    alertReducer,
    [],
  );

  return(
    <AlertContext.Provider value={alert}>
      <AlertDispatchContext.Provider value={dispatch}>
        {children}
      </AlertDispatchContext.Provider>
    </AlertContext.Provider>
  )
}

export function useAlerts() {
  return useContext(AlertContext);
}

export function useAlertDispatch() {
  return useContext(AlertDispatchContext);
}
