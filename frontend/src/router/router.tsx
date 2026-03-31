import { createBrowserRouter } from 'react-router-dom';
import '@/sass/index.scss';

import { 
  Root, 
  Home,
  NotFound,
} from '../routes';
import Test from '@/routes/test/test';

const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: '',
        errorElement: <NotFound />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'test',
            element: <Test />,
          },
          {
            path: '*',
            loader() {
              throw new Response(null, { status: 404, statusText: 'Not found' })
            }
          }
        ]
      }
    ]
  },
];

const Router = createBrowserRouter(routes);

export default Router;
