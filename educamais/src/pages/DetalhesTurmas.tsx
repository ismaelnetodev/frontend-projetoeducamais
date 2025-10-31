import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonText,
  IonList,
  IonItem,
  IonLabel,
  IonSkeletonText
} from '@ionic/react';
import { arrowBackOutline, arrowForward, peopleOutline } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

interface TurmaDetalhesParams {
  id: string;
}

interface Aluno {
  id: string;
  nome: string,
  login: string,
  matricula: string,
  turmaNome: string;
}

interface TurmaInfo {
  id: number;
  nome: string;
  anoLetivo: number,
  nomesProfessores: [],
  numeroDeAlunos: number;
}

const TurmaDetalhes: React.FC = () => {
  const { id } = useParams<TurmaDetalhesParams>();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmaNome, setTurmaNome] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!id){
      history.goBack();
      return;
    }

    const fetchTurma = async () => {
      try {
        setLoading(true);
        setError(null);

        const turmaPromise = api.get<TurmaInfo>(`/turmas/${id}`);
        const alunosPromise = api.get<Aluno[]>(`/turmas/${id}/alunos`);

        const [turmaResponse, alunosResponse] = await Promise.all([
          turmaPromise,
          alunosPromise
        ]);

        setTurmaNome(turmaResponse.data.nome);
        setAlunos(alunosResponse.data);
      
      } catch (err: any){
        console.error("Erro ao buscar detalhes da turma:", err);
        setError(err.message);
        history.goBack();
      }finally {
        setLoading(false);
      }
    };

    fetchTurma();
  }, [id, history]);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>Detalhes da Turma</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading ? (
          <>
            <IonSkeletonText animated style={{ width: '60%', height: '2rem', marginBottom: '1rem' }} />
            <IonList inset>
              {[1, 2, 3].map((i) => (
                <IonItem key={i}>
                  <IonIcon icon={peopleOutline} slot="start" color="medium" />
                  <IonLabel>
                    <IonSkeletonText animated style={{ width: '80%' }} />
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </>
        ) : (
          <>
            <IonText color="primary">
              <h1 style={{ fontWeight: 700 }}>{turmaNome}</h1>
            </IonText>

            <IonList inset>
              {alunos.map((aluno) => (
                <IonItem key={aluno.id} button={true} onClick={() => history.push(`/turma/${id}/aluno/${aluno.id}`)} detail={true} detailIcon={arrowForward}>
                  <IonIcon icon={peopleOutline} slot="start" color="primary" />
                  <IonLabel>{aluno.nome}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TurmaDetalhes;