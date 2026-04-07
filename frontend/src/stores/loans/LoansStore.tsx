import { 
  createContext, 
  ReactElement, 
  useContext, 
  useReducer 
} from "react";
import loansReducer from "./LoansReducer";
import { intialAmortizationModel } from "./initialMode";


const LoansContext = createContext(null);
const LoansDispatchContext = createContext<any>([]);


export function LoansProvider ({ children }: Readonly<{ children: ReactElement }>) {
  const [loansData, dispatch] = useReducer(
    loansReducer,
    intialAmortizationModel,
  );

  return(
    <LoansContext.Provider value={loansData}>
      <LoansDispatchContext.Provider value={dispatch}>
        {children}
      </LoansDispatchContext.Provider>
    </LoansContext.Provider>
  )
}

export function useLoans() {
  return useContext(LoansContext);
}

export function useLoansDispatch() {
  return useContext(LoansDispatchContext);
}

export function useLoansState() {
  const state = useContext(LoansContext);
  const dispatch = useContext(LoansDispatchContext);

  return [state, dispatch];
}
