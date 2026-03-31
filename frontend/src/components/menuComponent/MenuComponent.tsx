import { ReactElement } from "react";
import { Link } from "react-router-dom";

const MenuComponent: React.FC<{showModal: boolean, toggleMenu: () => void}> = ({ showModal, toggleMenu }): ReactElement => {
  if(!showModal) return <></>;

  return(
    <div className="menu" >
      <div className="menu__button-box">
        <button className="menu__close-button" onClick={toggleMenu}>
          <i className='bi-x-lg'></i>
        </button>
      </div>
      <div className="menu__link-list">
        <Link to="que-es-kredi" onClick={toggleMenu} className="heading-primary heading-primary--general">Qué Es Kredi</Link>
        <Link to="faq" onClick={toggleMenu} className="heading-primary heading-primary--general u-mb-20">FAQs</Link>
        <Link to="contacto" onClick={toggleMenu} className="heading-primary heading-primary--general">Ayuda</Link>
      </div>
    </div>
  )
}

export default MenuComponent;