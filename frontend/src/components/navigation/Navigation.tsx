import MainBar from "./MainBar";
import SideBar from "./SideBar";

const Navigation = ({ children }: { children: React.ReactNode}) => {   
  return(
    <div className='navigation'>
      <MainBar />
      <div className='navigation__main'>
        <SideBar />
        <div className='navigation__content'>
          { children }
        </div>
      </div>
    </div>
  )
}

export default Navigation;
