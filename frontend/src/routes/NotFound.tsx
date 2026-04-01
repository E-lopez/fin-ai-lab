
import { useRouteError } from 'react-router-dom';

const NotFound = () => {
  const error: any = useRouteError();


  return(
    <div id="error-page">
      <h1>Error!</h1>
      <p>That route has not been found.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}

export default NotFound;
