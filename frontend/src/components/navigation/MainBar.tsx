import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import img from '@assets/logo_1.png';

import MenuComponent from "../menuComponent/MenuComponent";
import Button from "../button/CustomButton";
import { useModalDispatch } from "@/stores/modals/ModalStore";
import { useToken, useTokenDispatch } from "@/stores/tokens/TokenStore";
import LoginModal from "../modalComponent/loginModal";


const MainBar = () => {
  const [ showMenu, setShowMenu ] = useState(false);
  const targetRef: any = useRef();
  const modalDispatch = useModalDispatch();

  const toggleMenu = () => {
    setShowMenu((prevState: boolean) => !prevState);
  }

  const tokenState: any = useToken();
  const tokenDispatch = useTokenDispatch();

  const showModal = () => {
    modalDispatch({
      type: 'SHOW_MODAL',
      content: <LoginModal />,
    });
  };

  const handleLogout = () => {
    (globalThis as any).authToken = null;
    tokenDispatch({ type: 'RESET_TOKEN' });
  };
  
  return(
    <>
      <nav className="main-bar" ref={targetRef}>
          <div className="main-bar__home-icon">
            <Link to="/" className="main-bar__home-icon">
              <img src={img} alt={'kredit logo'} />
            </Link>
          </div>

          <div className="main-bar__center-buttons u-resp u-lg u-xl u-xxl">
            <Link to="test" className="u-mr-2">Qué es kredi</Link>
            <p>|</p>
            <Link to="faq" className="u-ml-2">Preguntas frecuentes</Link>
            <p>|</p>
            <Link to="contacto" className="u-ml-2">Ayuda</Link>
            {tokenState?.userAuthenticated
              ? <Button label={'Logout'} method={handleLogout} />
              : <Button label={'Login'} method={showModal} />
            }
          </div>
  
      </nav>
      <MenuComponent showModal={showMenu} toggleMenu={toggleMenu} />
    </>
  )
};

export default MainBar;