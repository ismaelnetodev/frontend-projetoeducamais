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
import api from '../services/api';

interface Turma {
  id: number;
  nome: string;
  anoLetivo: number,
  nomesProfessores: [],
  numeroDeAlunos: number
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

        const response = await api.get('/professores/minhas-turmas');
        setTurmas(response.data);

      } catch (err: any) {
        if (err.response){
          setError('Não foi possivel carregar as turmas.');
        } else if (err.request){
          setError('Erro de conexão. Verifique a internet.');
        } else {
          setError('Erro inesperado');
        }
      } finally {
        setLoading(false);
      };
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
          <p>Bem-vindo, Professor!</p>
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
