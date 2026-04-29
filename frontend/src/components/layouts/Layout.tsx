import { useToken } from "@/stores/tokens/TokenStore";

const Layout = ({ children }: { children: React.ReactNode}) => {   
  const token = useToken();
  const { userAuthenticated } = token!;

  if(!userAuthenticated) return <div className='layout layout--yellow'><h1>user Not authenticated</h1></div>;
  return(
    <div className='layout'>
      { children }
    </div>
  )
}

export default Layout;
