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
import { arrowBackOutline, peopleOutline } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface TurmaDetalhesParams {
  id: string;
}

interface Aluno {
  id: number;
  nome: string;
}

const TurmaDetalhes: React.FC = () => {
  const { id } = useParams<TurmaDetalhesParams>();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmaNome, setTurmaNome] = useState('');

  useEffect(() => {
    const fetchTurma = async () => {
      try {
        setLoading(true);

        // Exemplo real:
        // const response = await fetch(`https://seu-backend.com/professores/turma/${id}`);
        // const data = await response.json();

        // Mock:
        setTimeout(() => {
          setTurmaNome('1º Ano A - Matutino');
          setAlunos([
            { id: 1, nome: 'Ana Beatriz' },
            { id: 2, nome: 'Lucas Andrade' },
            { id: 3, nome: 'Marina Costa' },
          ]);
          setLoading(false);
        }, 1500);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchTurma();
  }, [id]);

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
                <IonItem key={aluno.id}>
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

