import { ReactElement } from 'react';
import { AlertProvider } from './alerts/AlertsStore';
import { ModalProvider } from './modals/ModalStore';
import { SurveyProvider } from './survey/SurveyStore';
import { AmortizationProvider } from './amortization/AmortizationStore';
import { TokenProvider } from './tokens/TokenStore';

const RootStore = ({children}: { children: ReactElement }) => {
  return(
    <AlertProvider>
      <ModalProvider>
        <SurveyProvider>
          <AmortizationProvider>
            <TokenProvider>
              {children}
            </TokenProvider>
          </AmortizationProvider>
        </SurveyProvider>
      </ModalProvider>
    </AlertProvider>
  )
}

export default RootStore;