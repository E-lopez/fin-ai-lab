import MainBar from "./MainBar";
import SideBar from "./SideBar";

const Navigation = ({ children }: { children: React.ReactNode}) => {   
  return(
    <div className='navigation'>
      <SideBar />
      <div className='navigation__main'>
        <MainBar />
        <div className='navigation__content'>
          { children }
        </div>
      </div>
    </div>
  )
}

export default Navigation;
