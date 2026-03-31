import React from 'react';


const ErrorComponent: React.FC<{main?: string, secondary?: string}> = ({ main, secondary }) => {
  return (
    <div className='survey survey--orange u-pr-30 u-pl-30'>
      <div className='u-mt-30 u-pt-30 u-pr-30 u-pl-30 u-center-v'>
        <i className="bi-heartbreak-fill paragraph paragraph--xxl gray u-mt-30"></i>
        <h1 className='heading-primary heading-primary--general'>Error!</h1>
        <p className='paragraph paragraph--lg u-center-text'>
          {main ?? 'Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.'}
        </p>
        {secondary && (
          <p className='paragraph paragraph--sm u-center-text'>
            {secondary}
          </p>
        )}
      </div>
    </div>
  )
}

export default ErrorComponent;