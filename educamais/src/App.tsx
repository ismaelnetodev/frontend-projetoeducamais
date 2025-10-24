import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useState } from 'react';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import LoginPage from './pages/Login/Login';
import MainTabs from './MainTabs';

setupIonicReact();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <IonApp>
      <IonReactRouter>
        <Switch>
          <Route path="/login" exact={true}>
            {isAuthenticated 
              ? <Redirect to="/" /> 
              : <LoginPage onLoginSuccess={handleLoginSuccess} />
            }
          </Route>

          <Route path="/" render={() => 
            isAuthenticated 
              ? <MainTabs /> 
              : <Redirect to="/login" />
          } />
          
        </Switch>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;