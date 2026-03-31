import { 
  createContext, 
  ReactElement, 
  useContext, 
  useReducer 
} from "react";
import modalReducer from "./ModalReducer";

const ModalContext = createContext(null);
const ModalDispatchContext = createContext<any>([]);
const modalState = {
  visible: false,
  content: undefined,
  cssModifier: undefined,
};

export function ModalProvider ({ children }: Readonly<{ children: ReactElement }>) {
  const [modal, dispatch] = useReducer(
    modalReducer,
    modalState,
  );

  return(
    <ModalContext.Provider value={modal}>
      <ModalDispatchContext.Provider value={dispatch}>
        {children}
      </ModalDispatchContext.Provider>
    </ModalContext.Provider>
  )
}

export function useModal() {
  return useContext(ModalContext);
}

export function useModalDispatch() {
  return useContext(ModalDispatchContext);
}
