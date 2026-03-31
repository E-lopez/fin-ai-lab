import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MenuComponent from "../menuComponent/MenuComponent";
import Button from "../button/CustomButton";
import { useModalDispatch } from "@/stores/modals/ModalStore";

import { useTokenDispatch } from "@/stores/tokens/TokenStore";
import FormFactory from "../formComponent/formFactory";

const LoginModal = () => {
  const [formVersion, setFormVersion] = useState(0);
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

  return(
    <div>
      Login Modal
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

const MainBar = () => {
  const [ showMenu, setShowMenu ] = useState(false);
  const targetRef: any = useRef();

  const modalDispatch = useModalDispatch();
  
  let location = useLocation();

  const toggleMenu = () => {
    setShowMenu((prevState: boolean) => !prevState);
  }

  const showModal = () => {
    modalDispatch({
      type: 'SHOW_MODAL',
      content: <LoginModal />,
    })
  }
  
  return(
    <>
      <nav className="main-bar" ref={targetRef}>
        <div className="main-bar__container">
          
          <div className="main-bar__center-buttons u-resp u-lg u-xl u-xxl">
            <Link to="test" className="u-mr-2">Qué es kredi</Link>
            <p>|</p>
            <Link to="faq" className="u-ml-2">Preguntas frecuentes</Link>
            <p>|</p>
            <Link to="contacto" className="u-ml-2">Ayuda</Link>
          </div>

          <div className="main-bar__user-buttons u-resp u-lg u-xl u-xxl">
            <Button label={'Login'} method={showModal} />
          </div>          

          <div className="main-bar__responsive-buttons u-resp u-xxs u-xs u-md">
            {location.pathname === '/' && 
              <a 
                aria-label="Chat on WhatsApp"
                href="/"
                className="main-bar__cta-button"
              >
                Comienza!
              </a>
            }
            <button onClick={toggleMenu} className="main-bar__hamburguer-button">
              <i className='bi-list'></i>
            </button>
          </div>
        </div>
      </nav>
      <MenuComponent showModal={showMenu} toggleMenu={toggleMenu} />
    </>
  )
};

export default MainBar;