import { 
  createContext, 
  ReactElement, 
  useContext, 
  useReducer 
} from "react";
import surveyReducer from "./SurveyReducer";
import { initialModel } from "./initialState";

const SurveyContext = createContext(null);
const SurveyDispatchContext = createContext<any>([]);

export function SurveyProvider ({ 
  children,
  initialValue 
}: Readonly<{ children: ReactElement, initialValue?: any }>) {
  const [survey, dispatch] = useReducer(
    surveyReducer,
    initialValue ?? initialModel,
  );

  return(
    <SurveyContext.Provider value={survey}>
      <SurveyDispatchContext.Provider value={dispatch}>
        {children}
      </SurveyDispatchContext.Provider>
    </SurveyContext.Provider>
  )
}

export function useSurvey() {
  return useContext(SurveyContext);
}

export function useSurveyDispatch() {
  return useContext(SurveyDispatchContext);
}
