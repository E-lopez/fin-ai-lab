import { useEffect, useMemo, useState } from "react";
import FieldsFactory from "./fieldsFactory";
import FileDisplayer from "./fileDisplayer";
import { validateField } from "@/utils/formFunctions/formFunctions";
import { validationFeedback } from "@/utils/formFunctions/validationFeedback";


type TFormfactory = {
  base: {[name:string]: any}, 
  rootCss?: string, 
  formMethod: (arg0: any) => void,
  submitLabel?: string
}


const FormFactory = ({ 
  base, 
  rootCss = 'form-default', 
  formMethod, 
  submitLabel='Enviar' 
}: TFormfactory
) => {
  const [model, setModel] = useState<any>({});
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [disableButton, setDisableButton] = useState<boolean>(true);

  const buildModel = () => {
    console.log('Building model from base:', base);
    const modelObject = Object.keys(base).reduce((
      acc: {[name: string]: string|number}, 
      key: string|number
    ) => {
      const { type } = base[key] 
      console.log('Building field:', key, 'of type:', type);
      acc[key] = type.match(/number/gi) === null ? '' : 0
      return acc
    }, {})
    setModel(() => modelObject)
  }

  const handleChange = (e: any) => {
    let { files, value, checked, type, name, max, min } = e.target;
    const validationResult = validateField({name, value: files ?? value, max, min});

    if (validationResult !== undefined && !validationResult) {
      e.target.setCustomValidity(validationFeedback(name));
      e.target.reportValidity();
      setFormErrors((prevErrors: Record<string, boolean>) => ({ ...prevErrors, [name]: true }));
    } 
    else 
    {
      e.target.setCustomValidity('');
      setFormErrors((prevErrors: Record<string, boolean>) => ({ ...prevErrors, [name]: false }));
    }
    if(type === 'checkbox' && !checked) {
      value = ''
    }
    setModel((prevModel: any) => {
      return {
        ...prevModel,
        [e.target.name]: files ? [...files] : value,
      }
    })
  }

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if(disableButton) return false;
    formMethod(model);
    setModel({});
  }

  useEffect(() => {
    const requiredMissing = Object.entries(model).some((el) => el[1] === '' && base[el[0]].required);
    const hasErrors = Object.keys(formErrors).filter((key) => formErrors[key] === true).length;
    if(!requiredMissing && !hasErrors) {
      setDisableButton(false);
    }
    else {
      setDisableButton(true);
    }
  }, [model])


  useMemo(() => {
    buildModel();
  }, [base])

  if(!Object.keys(model).length) return <></>;

  return(
    <form
      className={rootCss} 
      onSubmit={(e: any) => handleSubmit(e)}
    >
      {
        Object.keys(base).map((key, i) => {
          return (
            <div 
              key={key+i} 
              className={`${rootCss}__field`}
            >
              <FieldsFactory 
                rootCss={rootCss}
                fieldName={key} 
                fieldContent={base[key]} 
                value={model.key} 
                handleChange={handleChange} 
              />
            </div>
          )
        })
      }
      <p className="u-mt-10 u-right-text">Campos obligatorios*</p>
      {
        model.files && 
        <FileDisplayer content={model.files} />
      }
      <input 
        type="submit" 
        value={submitLabel} 
        className={`base-button__button u-mt-10 ${disableButton && 'base-button__button--disabled'}`}
      />
    </form>
  )

}

export default FormFactory;