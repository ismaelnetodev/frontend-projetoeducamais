import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSkeletonText,
  IonText
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { peopleOutline, chevronForwardOutline, logOutOutline, schoolOutline } from 'ionicons/icons';

interface Turma {
  id: number;
  nome: string;
}

interface MinhasTurmasProps {
  onLogout: () => void;
}

const MinhasTurmas: React.FC<MinhasTurmasProps> = ({ onLogout }) => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        setLoading(true);
        setError(null);

        // Exemplo de chamada real:
        // const response = await fetch('https://seu-backend.com/professores/minhas-turmas', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        // });
        // if (!response.ok) throw new Error('Erro ao carregar turmas');
        // const data = await response.json();

        // Mock temporário
        setTimeout(() => {
          const data: Turma[] = [
            { id: 1, nome: '1º Ano A - Matutino' },
            { id: 2, nome: '3º Ano B - Vespertino' },
            { id: 3, nome: '2º Ano C - Noturno' },
          ];
          setTurmas(data);
          setLoading(false);
        }, 1500);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTurmas();
  }, []);

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Minhas Turmas</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onLogout} color="medium">
              <IonIcon icon={logOutOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">

        <IonText color="primary">
          <h1 style={{ fontWeight: 700, fontSize: '1.6rem', marginBottom: '0.4rem' }}>Minhas Turmas</h1>
        </IonText>

        <IonText color="medium">
          <p>Bem-vindo, Professor Tarcísio!</p>
        </IonText>

        {/* Estado de carregamento */}
        {loading && (
          <IonList inset={true}>
            {[1, 2, 3].map((_, index) => (
              <IonItem key={index}>
                <IonIcon icon={schoolOutline} slot="start" color="medium" />
                <IonLabel>
                  <IonSkeletonText animated style={{ width: '80%' }} />
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        {/* Estado de erro */}
        {error && (
          <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--ion-color-danger)' }}>
            <IonText>Erro ao carregar suas turmas. Tente novamente mais tarde.</IonText>
          </div>
        )}

        {/* Estado vazio */}
        {!loading && !error && turmas.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--ion-color-medium)' }}>
            <IonIcon icon={schoolOutline} style={{ fontSize: '3rem', marginBottom: '1rem' }} />
            <IonText>
              <h2>Nenhuma turma associada a você</h2>
              <p>Entre em contato com a gestão para verificar sua alocação.</p>
            </IonText>
          </div>
        )}

        {/* Lista de turmas */}
        {!loading && !error && turmas.length > 0 && (
          <IonList inset={true}>
            {turmas.map((turma) => (
              <IonItem
                key={turma.id}
                button={true}
                detail={false}
                onClick={() => history.push(`/turma/${turma.id}`)}
              >
                <IonIcon icon={peopleOutline} slot="start" color="primary" />
                <IonLabel>{turma.nome}</IonLabel>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MinhasTurmas;
