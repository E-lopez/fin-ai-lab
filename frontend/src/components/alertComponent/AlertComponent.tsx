import { useEffect, useState } from "react";
import { useAlertDispatch, useAlerts } from "@/stores/alerts/AlertsStore";

const initialAlert = {
  visible: false,
  message: undefined,
  type: 'error',
  data: ''
}

const alertHeaders = {
  error: '¡Hubo un problema!',
  alert: '',
  success: '¡Hecho!',
}

const AlertComponent = () => {
  const [alert, setAlert] = useState(initialAlert);
  const alerts = useAlerts();
  const dispatch = useAlertDispatch();

  const clearAlert = () => {
    const { name } = alerts ? alerts[0] : {name: ''};
    dispatch({type: "REMOVE_ALERT", name: name})
    setAlert(initialAlert);
  }

  const getMessage = () => {
    if(!alerts || !alerts[0]) return;
    const { message, type, data } = alerts[0];
    const clearOutTime = data ? 6000 : 3000;
    setAlert((prevAlert) => {
      return {
        ...prevAlert,
        ...{
          message,
          type,
          data,
        },
        visible: true,
      }
    });
    setTimeout(() => clearAlert(), clearOutTime);
  }
  
  useEffect(() => {
    getMessage();
  }, [alerts]);

  if(!alert.visible) return <></>;

  return(
    <div className="alert">
      <div className={`alert__container alert__container--${alert.type}`}>
        <h3 className="alert__title">
          {alertHeaders[alert.type as keyof typeof alertHeaders] || 'Atención'}
        </h3>
        <p className="alert__message">
          { alert.message || 'Unkown error' }
        </p>
        { alert.data && 
          <p className="alert__message">
            { alert.data }
          </p>
        }
      </div>
      <div 
        className="alert__close-button"
        onClick={clearAlert}
      >
        -
      </div>
    </div>
  )
}

export default AlertComponent;