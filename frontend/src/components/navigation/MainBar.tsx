import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MenuComponent from "../menuComponent/MenuComponent";
import Button from "../button/CustomButton";
import { useModalDispatch } from "@/stores/modals/ModalStore";
import LoginModal from "../modalComponent/loginModal";


const MainBar = () => {
  const [ showMenu, setShowMenu ] = useState(false);
  const targetRef: any = useRef();
  const modalDispatch = useModalDispatch();

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
              <a 
                aria-label=""
                href="/"
                className="main-bar__cta-button"
              >
                Comienza!
              </a>
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