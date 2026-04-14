import { Link } from "react-router-dom";
import { useState } from "react";
import sideBarButtons from "./sideButtons";

const SideBar = () => {
  const [activeBtn, setActiveBtn ] = useState('overview');
  
  return(
      <nav className="side-bar">
        <div className="side-bar__btns">
          <p className="paragraph bold u-ml-10">Navigation</p>
          {
            sideBarButtons.map((item) => (
              <Link
                key={item.path}
                to={item.path} 
                onClick={() => setActiveBtn(item.path)}
                className={`side-bar__btns-btn ${activeBtn === item.path ? 'side-bar__btns-btn--active' : '' }`}
              >
                <div className="side-bar__btns-link">
                  <i className={`side-bar__btns-icon ${item.icon}`}></i>
                </div>
                <p className="paragraph paragraph--sm">{item.name}</p>
              </Link>
            ))
          } 
        </div>
      </nav>
  )
};

export default SideBar;