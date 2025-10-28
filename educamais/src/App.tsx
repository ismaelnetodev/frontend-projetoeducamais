import { IonApp, setupIonicReact, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useIonRouter } from '@ionic/react';

import Login from './pages/Login/Login';
import MainTabs from './MainTabs';

import PainelGestor from './pages/PainelGestor';
import PainelProfessor from './pages/PainelProfessor';
import PainelAluno from './pages/PainelAluno';

/* Ionic Core e CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const AppRoutes: React.FC = () => {
  const router = useIonRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Carrega o token inicial
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('userRole');
    setIsAuthenticated(!!token);
    if (storedRole) setRole(storedRole);
  }, []);

  // Reage à mudança no estado de autenticação
  useEffect(() => {
    if (isAuthenticated === null) return;

    // Delay curto para o Ionic sincronizar o estado da rota antes de redirecionar
    const delayRedirect = setTimeout(() => {
      if (isAuthenticated && router.routeInfo.pathname === '/login') {
        switch (role){
          case 'GESTOR':
            router.push('/gestor', 'root');
            break;
          case 'ALUNO':
            router.push('/aluno', 'root');
            break;
          case 'PROFESSOR':
            router.push('/professor', 'root');
            break;
          default:
            router.push('/', 'root');
        }
      } else if (!isAuthenticated && router.routeInfo.pathname !== '/login') {
        router.push('/login', 'root');
      }
    }, 100);

    return () => clearTimeout(delayRedirect);
  }, [isAuthenticated, role, router]);

  const handleLoginSuccess = (token: string, role: string) => {
    console.log("LOGIN SUCEDIDO");
    // salva o token e atualiza o estado
    localStorage.setItem('authToken', 'tokensecreto');
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setRole(role);
    
    switch (role) {
      case 'GESTOR':
        router.push('/gestor', 'root');
        break;
      case 'PROFESSOR':
        router.push('/professor', 'root');
        break;
      case 'ALUNO':
        router.push('/aluno', 'root');
        break;
      default:
        router.push('/', 'root');
    }    

  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setRole(null);
    router.push('/login', 'root');
  };

  if (isAuthenticated === null) return null;

  return (
    <IonRouterOutlet>

      <Route path="/login" exact>
        <Login onLoginSuccess={handleLoginSuccess} />
      </Route>

      <Route path="/" exact>
        <MainTabs onLogout={handleLogout} />
      </Route>

      <Route path="/gestor" exact>
        <PainelGestor onLogout={handleLogout}></PainelGestor>
      </Route>

      <Route path="/professor" exact>
        <PainelProfessor onLogout={handleLogout}></PainelProfessor>
      </Route>

      <Route path="/aluno" exact>
        <PainelAluno onLogout={handleLogout}></PainelAluno>
      </Route>

    </IonRouterOutlet>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AppRoutes />
    </IonReactRouter>
  </IonApp>
);

export default App;
