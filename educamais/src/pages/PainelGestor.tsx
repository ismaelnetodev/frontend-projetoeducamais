import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFooter,
  IonLabel,
  IonList,
  IonItem
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const PainelGestor: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {

  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Painel do Gestor</IonTitle>
        </IonToolbar>
      </IonHeader>

     <IonContent className="ion-padding">

      <IonList>
        <IonItem button routerLink="/gestao/alunos">
          <IonLabel>Gerenciar Alunos</IonLabel>
        </IonItem>

        <IonItem button routerLink="/gestao/professores">
          <IonLabel>Gerenciar Professores</IonLabel>
        </IonItem>

        <IonItem button routerLink="/gestao/gestores">
          <IonLabel>Gerenciar Gestores</IonLabel>
        </IonItem>

        <IonItem button routerLink="/gestao/turmas">
          <IonLabel>Gerenciar Turmas</IonLabel>
        </IonItem>
      </IonList>

    </IonContent>

      <IonFooter className="ion-padding">
        <IonButton expand="block" color="danger" onClick={onLogout}>
          Sair
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default PainelGestor;
