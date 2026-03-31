import Router from './router/router.tsx';
import { RouterProvider } from 'react-router-dom';
import RootStore from './stores/RootStore.tsx';

const App = () => {
  return(
    <RootStore>
      <RouterProvider router={Router} />
    </RootStore>
  )
}

export default App;