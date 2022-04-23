import { useRoutes } from 'react-router-dom'
import routes from './router';
import Sidebar from '../components/shared/Sidebar';

const App = () => {
  let routers = useRoutes(routes)
  
  return (
    <div>
      <Sidebar></Sidebar>
      {routers}
    </div>
  );
}

export default App;
