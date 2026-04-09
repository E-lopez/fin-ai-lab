import { useState } from "react";
import { useModalDispatch } from "@/stores/modals/ModalStore";
import { useTokenDispatch } from "@/stores/tokens/TokenStore";
import FormFactory from "../formComponent/formFactory";

const model = {
  "dataTreatment": {
      "type": "CHECKBOX",
      "required": true,
      "label": "Acepto haber leído y entendido el tratamiento de datos personales.",
      "options": null,
      "helperLeft": null,
      "helperRight": null,
      "multipleOptions": [
          "acepto"
      ],
      "multiple": false
  }  
};

const LoginModal = () => {
  const [formVersion] = useState(0);
  const tokenDispatch = useTokenDispatch();
  const modalDispatch = useModalDispatch();

  const autheticateUser = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        tokenDispatch(
          {
            type: 'SAVE_TOKEN', 
            payload: {
              tokenData: {
                access_token: 'some fake token'
              }, 
              userAuthenticated: true
            }
          }
        );
        modalDispatch({
          type: 'HIDE_MODAL',
        });
        resolve(true);
      }, 1000);
    });
  };

  return(
    <div className="u-center-v">
      <h1 className="paragraph paragraph--lg">Login</h1>
      <FormFactory
        key={formVersion}
        base={model}
        formMethod={autheticateUser} 
        rootCss="survey-form"
        submitLabel="Siguiente"
      />
    </div>
  )
}

export default LoginModal;