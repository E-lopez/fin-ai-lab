import { Outlet } from 'react-router-dom';

import AlertComponent from '@/components/alertComponent/AlertComponent';
import ModalComponent from '@/components/modalComponent/modalComponent';
import Layout from '@/components/layouts/Layout';
import Navigation from '@/components/navigation/Navigation';

const Root = () => {

  return(
    <Navigation>
      <Layout>
        <Outlet />
      </Layout>
      <AlertComponent />
      <ModalComponent />
    </Navigation>
  )
}

export default Root; 
