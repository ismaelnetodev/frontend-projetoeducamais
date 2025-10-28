import { 
  IonTabs, 
  IonRouterOutlet, 
  IonTabBar, 
  IonTabButton, 
  IonIcon, 
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { home } from 'ionicons/icons';

const Tab1: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Tab 1</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <h1>Conteúdo Protegido!</h1>
      <p>Conseguiste fazer o login.</p>
    </IonContent>
  </IonPage>
);

const MainTabs: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Main</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        oi todos
        
    </IonContent>
        <IonButton slot="end" onClick={onLogout}>
            Logout
        </IonButton>
    </IonPage>
  );
};

export default MainTabs;