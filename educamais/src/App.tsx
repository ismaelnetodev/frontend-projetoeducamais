import { IonApp, setupIonicReact, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useIonRouter } from '@ionic/react';

import Login from './pages/Login/Login';
import PainelGestor from './pages/PainelGestor';
import PainelAluno from './pages/PainelAluno';
import MinhasTurmas from './pages/PainelProfessor';
import TurmaDetalhes from './pages/DetalhesTurmas';
import CarometroAluno from './pages/CarometroTurma';

import { setAuthToken } from './services/api';

/* Ionic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const RedirectToRole: React.FC<{ role: string | null }> = ({ role }) => {
  switch (role){
    case 'GESTOR':
      return <Redirect to="/gestor"/>;
    case 'PROFESSOR':
      return <Redirect to="/minhas-turmas"/>;
    case 'ALUNO':
      return <Redirect to="/aluno"/>;
    default:
      return <Redirect to="/login" />;
  }
};

const AppRoutes: React.FC = () => {

  const router = useIonRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('userRole');
    
    if (token && storedRole){
      setAuthToken(token);
      setIsAuthenticated(true);
      setRole(storedRole);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginSuccess = (token: string, role: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    setAuthToken(token);
    setIsAuthenticated(true);
    setRole(role);
    switch (role){
      case 'GESTOR':
        router.push('/gestor', 'root');
        break;
      case 'PROFESSOR':
        router.push('/minhas-turmas', 'root');
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
    setAuthToken(null);
    setIsAuthenticated(false);
    setRole(null);
    router.push('/login', 'root');
  };

  return (
    <IonRouterOutlet>
      <Switch>
        {/* Rota 1: O Login */}
        <Route path="/login" exact>
          {/* Se JÁ estiver logado, redireciona para a "home". */}
          {isAuthenticated ? <Redirect to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />}
        </Route>

        {/* Rota 2: A "Home" (/) */}
        {/* Esta rota é o "distribuidor". */}
        <Route path="/" exact>
          {/* Se NÃO estiver logado, vai para /login */}
          {!isAuthenticated ? <Redirect to="/login" /> : <RedirectToRole role={role} />}
        </Route>

        {/* Rota 3: Rotas Protegidas */}
        <Route path="/gestor" exact>
          {isAuthenticated ? <PainelGestor onLogout={handleLogout} /> : <Redirect to="/login" />}
        </Route>
        
        <Route path="/minhas-turmas" exact>
          {isAuthenticated ? <MinhasTurmas onLogout={handleLogout} /> : <Redirect to="/login" />}
        </Route>
        
        <Route path="/aluno" exact>
          {isAuthenticated ? <PainelAluno onLogout={handleLogout} /> : <Redirect to="/login" />}
        </Route>
        
        <Route path="/turma/:id" exact>
          {isAuthenticated ? <TurmaDetalhes /> : <Redirect to="/login" />}
        </Route>

        <Route path="/turma/:turmaId/aluno/:alunoId" exact>
          {isAuthenticated ? <CarometroAluno /> : <Redirect to="/login" />}
        </Route>
        
        {/* Rota "Default": Se não encontrar nada, volta para a home */}
        <Redirect to="/" />

      </Switch>
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
