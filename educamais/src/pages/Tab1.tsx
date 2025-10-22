import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Tab 1</IonTitle>
        </IonToolbar>
        </IonHeader>
        <IonCard>
        <IonCardHeader>
          <IonCardTitle>Bem-vindo!</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          Este é o seu primeiro componente customizado.
          <IonButton expand="block" style={{ marginTop: '16px' }}>
            Clique-me
          </IonButton>
        </IonCardContent>
      </IonCard>
  
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
