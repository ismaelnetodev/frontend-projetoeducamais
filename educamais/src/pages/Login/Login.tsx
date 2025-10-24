import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonList,
  IonImg // 1. Importa o componente de Imagem
} from '@ionic/react';
import React, { useState } from 'react';
import './Login.css'; // O nosso ficheiro de estilos

interface LoginProps {
  onLoginSuccess: () => void; 
}

const LoginPage: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError(''); 
    if (username === 'admin' && password === '1234') {
      onLoginSuccess();
    } else {
      setError('Username ou password incorretos.');
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-container">
        
        <div className="login-form-container">

          <div className="login-logo ion-text-center">
            <IonImg 
              src="https://images.reallygooddesigns.com/2024/06/2-creative-negative-space-logo.png" 
              alt="Logo da Aplicação"
            />
          </div>

          <IonList>
            <IonItem>
              <IonLabel position="floating">Username</IonLabel>
              <IonInput 
                type="text" 
                value={username}
                onIonChange={e => setUsername(e.detail.value!)}
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="floating">Senha</IonLabel>
              <IonInput 
                type="password" 
                value={password}
                onIonChange={e => setPassword(e.detail.value!)}
              />
            </IonItem>
          </IonList>
          
          {error && <p className="login-error ion-padding-start">{error}</p>}

          <IonButton 
            expand="block" 
            onClick={handleLogin} 
            className="ion-margin-top"
          >
            Entrar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;