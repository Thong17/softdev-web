import { useRoutes } from 'react-router-dom'
import routes from './router';
import Sidebar from '../components/shared/Sidebar';
import { UserContext } from 'contexts/UserContext';
import { useContext } from 'react';

const App = () => {
  let routers = useRoutes(routes)
  const user = useContext(UserContext)

  return (
    <UserContext.Provider value={user}>
      <Sidebar></Sidebar>
      {routers}
    </UserContext.Provider>
  );
}

export default App;
