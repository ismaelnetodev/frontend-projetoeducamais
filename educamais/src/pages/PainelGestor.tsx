import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFooter
} from '@ionic/react';

const PainelGestor: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Painel do Gestor</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Bem-vindo ao Painel do Gestor!</h2>
        <p>Aqui você pode gerenciar turmas, professores e alunos.</p>
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
