import { 
  createContext, 
  ReactElement, 
  useContext, 
  useReducer 
} from "react";
import amortizationReducer from "./AmortizationReducer";
import { intialAmortizationModel } from "./initialMode";


const AmortizationContext = createContext(null);
const AmortizationDispatchContext = createContext<any>([]);


export function AmortizationProvider ({ children }: Readonly<{ children: ReactElement }>) {
  const [amortizationData, dispatch] = useReducer(
    amortizationReducer,
    intialAmortizationModel,
  );

  return(
    <AmortizationContext.Provider value={amortizationData}>
      <AmortizationDispatchContext.Provider value={dispatch}>
        {children}
      </AmortizationDispatchContext.Provider>
    </AmortizationContext.Provider>
  )
}

export function useAmortization() {
  return useContext(AmortizationContext);
}

export function useAmortizationDispatch() {
  return useContext(AmortizationDispatchContext);
}
