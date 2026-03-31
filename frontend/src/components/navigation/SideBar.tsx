import { Link } from "react-router-dom";
import img from '@assets/logo_1.png';

const SideBar = () => {
  
  return(
      <nav className="side-bar" >
        <div className="side-bar__home-icon">
          <Link to="/" className="side-bar__home-icon">
            <img src={img} alt={'kredit logo'} />
          </Link>
        </div>
        {
          [1,2,3,4,5].map((item) => (
            <p key={item}>{`item ${item}`}</p>
          ))
        } 
      </nav>
  )
};

export default SideBar;