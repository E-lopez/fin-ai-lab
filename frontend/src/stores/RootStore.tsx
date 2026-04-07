import { ReactElement } from 'react';
import { AlertProvider } from './alerts/AlertsStore';
import { ModalProvider } from './modals/ModalStore';
import { SurveyProvider } from './survey/SurveyStore';
import { LoansProvider } from './loans/LoansStore';
import { TokenProvider } from './tokens/TokenStore';

const RootStore = ({children}: { children: ReactElement }) => {
  return(
    <AlertProvider>
      <ModalProvider>
        <SurveyProvider>
          <LoansProvider>
            <TokenProvider>
              {children}
            </TokenProvider>
          </LoansProvider>
        </SurveyProvider>
      </ModalProvider>
    </AlertProvider>
  )
}

export default RootStore;