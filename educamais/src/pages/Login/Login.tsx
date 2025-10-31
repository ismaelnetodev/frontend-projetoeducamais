import {
  IonContent,
  IonHeader,
  IonPage,
  IonCard,
  IonCardContent,
  IonInput,
  IonInputPasswordToggle,
  IonText,
  IonButton,
  IonIcon,
  IonLoading,
} from '@ionic/react';
import React, { useState } from 'react';
import './Login.css';
import api from '../../services/api';
import { logInOutline } from 'ionicons/icons';

interface LoginProps {
  onLoginSuccess: (token: string, role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log(`Tentando com login: ${username} e senha: ${password}`);
    
    try{
      const response = await api.post('/auth/login', {
        login: username,
        password: password
      });

      const data = response.data;
      
      if (!data.token || !data.role){
        throw new Error('Resposta inválida do servidor.');
      }

      onLoginSuccess(data.token, data.role)

    }catch (err: any){
      if (err.response){
        console.error('Erro de resposta:', err.response.data);
        setError(err.response.data.message || 'Login ou senha inválidos.');
      } else if (err.request){
        setError('Erro ao conectar ao servidor. :O');
      } else {
        setError(err.message || 'Erro inesperado.');
      }
    }finally{
      setIsLoading(false);
    }

  };

  return (
    <IonPage>
      <IonHeader></IonHeader>

      <IonLoading isOpen={isLoading} message={'Entrando...'} />

      <IonContent fullscreen className="ion-padding login-container">
        <IonCard>
          <IonCardContent>
            <div className="ion-text-center ion-margin-bottom">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs7jp8So34X9gzuuG1uVySZdWWZtj3Rbq7dQ&s"
                alt=""
                width={100}
              />
              <IonText>
                <h1>Seja Bem-Vindo!</h1>
              </IonText>
              <IonText color="medium">
                <h2>Entre para continuar.</h2>
              </IonText>
            </div>

            <form onSubmit={handleLogin}>
              <IonInput
                name='username'
                className="ion-margin-bottom"
                type="text"
                fill="outline"
                label="Login"
                labelPlacement="floating"
                shape="round"
                autofocus
                required
                value={username}
                onIonInput={e => setUsername(e.detail.value!)}
              />

              <IonInput
                name='password'
                className="ion-margin-bottom"
                type="password"
                fill="outline"
                label="Senha"
                labelPlacement="floating"
                shape="round"
                required
                value={password}
                onIonInput={e => {console.log('Senha digitada', e.detail.value); setPassword(e.detail.value!)}}
              >
                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
              </IonInput>

              {error && (
                <IonText color={'danger'} className="ion-text-center">
                  <p>{error}</p>
                </IonText>
              )}

              <IonButton
                type="submit"
                expand="block"
                className="ion-margin-top"
                disabled={isLoading}
                shape="round"
              >
                <IonIcon slot="start" icon={logInOutline} />
                Entrar
              </IonButton>
            </form>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;
