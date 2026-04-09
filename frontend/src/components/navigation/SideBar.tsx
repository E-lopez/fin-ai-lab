import { Link } from "react-router-dom";
import { useState } from "react";

const model = [
  {
    name: 'overview',
    icon: 'bi-bar-chart-fill',
    path: 'overview',
  },
  {
    name: 'borrowers',
    icon: 'bi-file-person-fill',
    path: 'borrowers',
  },
  {
    name: 'loans',
    icon: 'bi-briefcase-fill',
    path: 'loans',
  },
  {
    name: 'recovery',
    icon: 'bi-basket3-fill',
    path: 'recovery',
  },
  {
    name: 'calendar',
    icon: 'bi-calendar3-week-fill',
    path: 'calendar',
  },
  {
    name: 'coms',
    icon: 'bi-chat-right-quote-fill',
    path: 'communications',
  },
];

const SideBar = () => {
  const [activeBtn, setActiveBtn ] = useState('overview');
  
  return(
      <nav className="side-bar">
        <div className="side-bar__btns">
          <p className="paragraph bold u-ml-10">Navigation</p>
          {
            model.map((item) => (
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