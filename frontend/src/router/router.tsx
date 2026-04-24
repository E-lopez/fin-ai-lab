import { createBrowserRouter } from 'react-router-dom';
import '@/sass/index.scss';

import { 
  Root, 
  NotFound,
} from '../routes';
import Overview from '@/routes/overview/Overview';
import Test from '@/routes/test/test';
import LoanConfig from '@/routes/loanConfig/LoanConfig';
import LoanPayments from '@/routes/loanPayments/loanPayments';
import BorrowersView from '@/routes/borrowers/borrowersView';


const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: 'new-loan',
        element: <LoanConfig />,
      },
      {
        path: 'loan-payments',
        element: <LoanPayments />
      },
      {
        path: 'borrowers',
        element: <BorrowersView />
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
  },
];

const Router = createBrowserRouter(routes);

export default Router;
