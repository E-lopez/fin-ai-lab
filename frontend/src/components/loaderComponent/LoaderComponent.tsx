import React from 'react';


const LineDots: React.FC<{legend?: string}> = ({ legend }) => {
  return (
    <div className="loading-indicator loading-indicator--linear">
      {legend && <p className="paragraph">{legend}</p>}
      <div className="loading-box">
        <div className="loading-dot loading-dot-1"></div>
        <div className="loading-dot loading-dot-2"></div>
        <div className="loading-dot loading-dot-3"></div>
      </div>
    </div>
  );
};

const RotatingCircles: React.FC = () => {
  return (
    <div className="">
      <div className="loading-circle">
        <div className="loading-circle-1"></div>
      </div>
    </div>
  );
};

const LoadingIndicator = ({type, legend}: {type?: string, legend?: string}) => {
  switch(type) {
    case 'circles':
      return <div className='survey survey__loader'><RotatingCircles /></div>;
    default:
      return (
        <div className='survey survey__loader'>
          <LineDots legend={legend} />
        </div>
      )
  }
}

export default LoadingIndicator;