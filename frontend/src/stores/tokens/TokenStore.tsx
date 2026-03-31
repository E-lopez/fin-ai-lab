import { 
  createContext, 
  ReactElement, 
  useContext, 
  useReducer 
} from "react";
import tokenReducer from "./TokenReducer";
import { initialModel } from "./initialState";

const TokenContext = createContext(null);
const TokenDispatchContext = createContext<any>([]);

export function TokenProvider ({ 
  children,
  initialValue 
}: Readonly<{ children: ReactElement, initialValue?: any }>) {
  const [survey, dispatch] = useReducer(
    tokenReducer,
    initialValue ?? initialModel,
  );

  return(
    <TokenContext.Provider value={survey}>
      <TokenDispatchContext.Provider value={dispatch}>
        {children}
      </TokenDispatchContext.Provider>
    </TokenContext.Provider>
  )
}

export function useToken() {
  return useContext(TokenContext);
}

export function useTokenDispatch() {
  return useContext(TokenDispatchContext);
}
