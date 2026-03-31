import img from '@/assets/add-button.png';
import { useState } from 'react';

const FieldsFactory = ({fieldName, fieldContent, value, handleChange, rootCss}: 
  {
    fieldName: string, 
    fieldContent: {[name:string]: any}, 
    value: any, 
    handleChange: any,
    rootCss: string,
  }
) => {
  const { 
    type, 
    required, 
    label, 
    helperLeft, 
    helperRight, 
    scale, 
    multipleOptions,
    min,
    max,
    step,
    placeholder,
    pattern,
   } = fieldContent;
  const [active, setActive] = useState(-1);

  switch(type) {
    case 'TEXT':
      return (
        <>
          <label htmlFor={fieldName}>
            {label}{required && '*'}
          </label>
          <input 
            type="text" 
            id={fieldName} 
            name={fieldName} 
            required={required} 
            minLength={7} 
            maxLength={65} 
            tabIndex={0}
            value={value}
            onChange={handleChange}
            className={`${rootCss}__text-input`}
          />
          <span className={`${rootCss}__validity`}></span>
        </>
      )
    case 'EMAIL':
      return (
        <>
          <label htmlFor={fieldName}>
            {label}{required && '*'}
          </label>
          <input 
            type="email" 
            id={fieldName} 
            name={fieldName} 
            required={required} 
            minLength={10} 
            maxLength={65} 
            tabIndex={0}
            value={value}
            onChange={handleChange}
            className={`${rootCss}__text-input`}
          />
          <span className={`${rootCss}__validity`}></span>
        </>
      )
    case 'DROPDOWN':
      return (
        <>
          <label htmlFor={fieldName}>
            {label}{required && '*'}
          </label>
          <select 
            name={fieldName} 
            id={fieldName}
            value={value}
            required={required}
            onChange={handleChange}
            className={`${rootCss}__dropdown`}
          >
            <option value="">--Selecciona una opción--</option>
            {
              fieldContent.options.map((value: string, i: number) => {
                return <option key={value+i} value={value}>{value}</option>  
              })
            }
          </select>
          <span className={`${rootCss}__validity`}></span>
        </>
      )
    case 'PHONE_NUMBER':
      return (
        <>
          <label htmlFor={fieldName}>
            {label}{required && '*'}
          </label>
          <input 
            type="tel" 
            id={fieldName} 
            name={fieldName} 
            pattern="[0-9]{10}" 
            placeholder="1112223333"
            minLength={7}
            maxLength={10}
            value={value}
            required={required}
            onChange={handleChange}
            className={`${rootCss}__text-input`}
          />
          <span className={`${rootCss}__validity`}></span>
        </>
      )
    case 'ID_NUMBER':
      return (
        <>
          <label htmlFor={fieldName}>
            {label}{required && '*'}
          </label>
          <input 
            type='number' 
            inputMode='numeric'
            id={fieldName} 
            name={fieldName} 
            pattern=".{0}|.{5,10}"
            minLength={5}
            maxLength={10}
            value={value}
            required={required}
            onChange={handleChange}
            className={`${rootCss}__text-input`}
          />
        <span className={`${rootCss}__validity`}></span>
        </>
      )
    case 'NUMERIC':
      return (
        <>
          <label htmlFor={fieldName}>
            {label}{required && '*'}
          </label>
          <input 
            type='number' 
            inputMode='numeric'
            id={fieldName} 
            name={fieldName} 
            step={step ?? 1} 
            placeholder={placeholder ?? '0'}
            pattern={pattern ?? '[3}(0-9]{1,,[0-9]{3})*(\.[0-9]{1,2})?'}
            min={min ?? 0}
            max={max ?? undefined}
            value={value}
            required={required}
            onChange={handleChange}
            className={`${rootCss}__text-input`}
          />
          <span className={`${rootCss}__validity`}></span>
        </>
      )
    case 'DATE':
      return (
        <>
          <label htmlFor={fieldName}>
            {label}{required && '*'}
          </label>
          <input
            type='date'            
            id={fieldName} 
            name={fieldName} 
            value={value}
            min={"1965-01-01"}
            max={"2006-01-01"}
            required={required}
            onChange={handleChange}
            className={`${rootCss}__text-input`}
          />
          <span className={`${rootCss}__validity`}></span>
        </>
      )
    case 'RANGE':
      return (
        <>
          <label htmlFor={fieldName}>
            {label}{required && '*'}
          </label>
          <input
            type="range"            
            id={fieldName} 
            name={fieldName} 
            value={value}
            min={min}
            max={max}
            step={step ?? 1}
            required={required}
            onChange={handleChange}
            list="markers"
            className={`${rootCss}__range`}
          />
          <datalist id="markers">
            {Array.from({ length: max }, (_, idx) => ++idx).map((i) => {
                if(i === 0) return;
                const label = i % 2 === 0 ? i.toString() : '';
                return <option key={i} value={i} label={label}></option>
              })
            }
          </datalist>
          <p>HERE {value}</p>
        </>
      )
    case 'TEXTAREA':
      return (
        <>
          <label htmlFor={fieldName}>
            {label}{required && '*'}
          </label>
          <textarea       
            id={fieldName} 
            name={fieldName} 
            value={value}
            maxLength={300}
            required={required}
            onChange={handleChange}
            className={`${rootCss}__text-input`}
          />
          <span className={`${rootCss}__validity`}></span>
        </>
      )
    case 'LIKERT':
      return(
        <div className={`${rootCss}__likert`}>
          <p className='label u-center-text'>{label}{required && '*'}</p>
          <div className={`${rootCss}__likert-buttons`}>
            {[...Array(scale ?? 5).keys()].map((el) => 
              <button
                className={`${(el+1) === active ? 'active-likert' : ''}`}
                key={fieldName+el} 
                type="button" 
                value={el+1} 
                name={fieldName} 
                onClick={(e) => {
                  setActive(el+1);
                  handleChange(e);
                }}
              >
                {el + 1}
              </button>)
            }
          </div>
          <div className={`${rootCss}__helper-labels`}>
            <p className='label label'>{helperLeft ?? 'Nunca'}</p>
            <p className='label label'>{helperRight ?? 'Siempre'}</p>
          </div>
        </div>
      )
    case 'MULTIPLE_CHOICE':
      return(
        <div className={`${rootCss}__multiple-choice`}>
          <p className='label u-center-text'>{label}{required && '*'}</p>
          <div className={`${rootCss}__multiple-choice-buttons`}>
            {multipleOptions.map((el: string, i: number) => 
              <button
                className={`${i === active ? 'active-choice' : ''}`}
                key={fieldName+el} 
                type="button" 
                value={el} 
                name={fieldName} 
                onClick={(e) => {
                  setActive(i);
                  handleChange(e);
                }}
              >
                {el}
              </button>)
            }
          </div>
        </div>
      )
    case 'CHECKBOX':
      return (
        <>
          {multipleOptions.map((label: string, i: number) => {
            return(
              <div 
                className={`${rootCss}__checkbox`} 
                key={label+i}
              >
                <input 
                  type="checkbox" 
                  id={fieldName} 
                  name={fieldName} 
                  value={label}
                  required={required}
                  onChange={handleChange} 
                />
                <label 
                  htmlFor={fieldName} 
                  className='paragraph paragraph--md'
                >
                  {label}
                </label>
              </div>
            )
          })}
        </>
      )
    case 'FILE':
      return (
        <>
          <label htmlFor={fieldName}>
            {label}{required && '*'}
          </label>
          <div className={`${rootCss}__file-upload`}>
            <div className={`${rootCss}__upload-icon`}>
              <img src={img} height={40} width={40} alt={label} />
              <p className='text-primary u-mt-6'>Haz click o arrastra tus archivos</p>
            </div>
            <input 
              type="file" 
              id={fieldName} 
              name={fieldName} 
              required={required}
              onChange={handleChange}
              multiple={fieldContent.multiple}
              accept="image/*,.pdf"
            />
          </div>
        </>
      )
    default:
      return <p>Working on this...</p>
  }
}

export default FieldsFactory;