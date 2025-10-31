// CarometroAluno.tsx
import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonTextarea,
  IonButton,
  IonSkeletonText,
  IonText,
  useIonToast,
  IonItem,
  IonList,
  IonRange,
  IonSpinner
} from '@ionic/react';
import { add, schoolOutline } from 'ionicons/icons';
import { useParams } from 'react-router';
import api from '../services/api';


interface CarometroParams {
  turmaId: string,
  alunoId: string;
}

// Tipagem do aluno
interface Aluno {
  id: string;
  nome: string;
  turmaNome: string;
  matricula: string;
  fotoUrl?: string;
}


// Função para gerar emoji de média
const gerarEmoji = (valor: number) => {
  if (valor <= 1) return '😠';
  if (valor <= 2) return '😟';
  if (valor <= 3) return '😐';
  if (valor <= 4) return '😊';
  return '😄';
};

const CarometroAluno: React.FC = () => {
  const { turmaId, alunoId } = useParams<CarometroParams>();

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);

  const [assiduidade, setAssiduidade] = useState(1.5);
  const [participacao, setParticipacao] = useState(1.5);
  const [responsabilidade, setResponsabilidade] = useState(1.5);
  const [sociabilidade, setSociabilidade] = useState(1.5);
  const [observacao, setObservacao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [presentToast] = useIonToast();

  useEffect(() => {
    const fetchAlunoData = async () => {
      if (!alunoId) return;

      setLoading(true);
      setError(null);

      try{
        const response = await api.get<Aluno>(`/alunos/${alunoId}`);
        const alunoData = response.data;

        if(!alunoData.fotoUrl){
          alunoData.fotoUrl = `https://i.pravatar.cc/400?u=${turmaId}`
        }

        setAluno(alunoData);
      } catch (err: any) {
        console.error("Erro ao buscar dados do aluno:", err);
        setError("Não foi possível carregar os dados do aluno.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlunoData();

  }, [alunoId]);

  const handleSalvarAvaliacao = async () => {
    if (!aluno) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const avaliacaoBody = {
      alunoId: aluno.id,
      assiduidade: assiduidade,
      participacao: participacao,
      responsabilidade: responsabilidade,
      sociabilidade: sociabilidade,
      observacao: observacao
    };

    try{
      await api.post('/avaliacoes', avaliacaoBody);

      setIsSubmitting(false);
      setModalAberto(false);
      presentToast({
        message: 'Avaliação salva com sucesso!',
        duration: 2000,
        color: 'success'
      });

    } catch (err: any){
      console.error("Erro ao salvar avaliação:", err);
      setSubmitError(err.response?.data?.message || 'Erro ao salvar. Verifique os dados e tente novamente');
      setIsSubmitting(false);
    }
  };

  const abrirModal = () => {
    setAssiduidade(1.5);
    setParticipacao(1.5);
    setResponsabilidade(1.5);
    setSociabilidade(1.5);
    setObservacao('')
    setSubmitError(null)
    setModalAberto(true);
  };

  const medias = {
    assiduidade: 4,
    participacao: 3,
    responsabilidade: 5,
    sociabilidade: 4
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              {/* Aponta o botão "voltar" para a turma de onde viemos */}
              <IonBackButton text="Voltar" defaultHref={`/turma/${turmaId}`} />
            </IonButtons>
            <IonTitle><IonSkeletonText animated style={{ width: '50%' }} /></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard>
            <IonCardContent>
              <div style={{ width: '100%', paddingTop: '100%', background: '#eee', borderRadius: 8 }} />
              <IonSkeletonText animated style={{ width: '80%', height: '1.5rem', marginTop: 16 }} />
              <IonSkeletonText animated style={{ width: '60%', marginTop: 8 }} />
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  if (error || !aluno) {
     return (
       <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton text="Voltar" defaultHref={`/turma/${turmaId}`} />
            </IonButtons>
            <IonTitle>Erro</IonTitle>
          </IonToolbar>
        </IonHeader>
         <IonContent className="ion-padding ion-text-center">
            <IonIcon icon={schoolOutline} style={{ fontSize: '4rem', color: 'var(--ion-color-medium)', marginTop: '20vh' }} />
            <IonText color="medium">
               <h2>{error || 'Aluno não encontrado.'}</h2>
               <p>Não foi possível carregar os dados. Tente novamente.</p>
            </IonText>
         </IonContent>
       </IonPage>
     );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {/* O botão 'voltar' agora sabe de onde veio */}
            <IonBackButton text="Voltar" defaultHref={`/turma/${turmaId}`} />
          </IonButtons>
          {/* Usa o nome do aluno real */}
          <IonTitle>{aluno.nome}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Card de identificação */}
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <IonCol size="12" sizeMd="6" className="ion-text-center">
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 380,
                      margin: '0 auto',
                      height: 0,
                      paddingBottom: '100%', 
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 8,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    {/* Usa a foto e nome reais */}
                    <img
                      src={aluno.fotoUrl}
                      alt={aluno.nome}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  </div>

                  {/* Informações abaixo da imagem com dados reais */}
                  <div style={{ marginTop: 16, textAlign: 'left', maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
                    <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{aluno.nome}</h2>
                    {/* A API /alunos/{id} pode não ter o nome da turma.
                        Se 'aluno.turmaNome' não existir, podes esconder ou mostrar o turmaId. */}
                    {aluno.turmaNome && <p style={{ margin: '6px 0' }}><strong>Turma:</strong> {aluno.turmaNome}</p>}
                    <p style={{ margin: '6px 0', color: 'var(--ion-color-medium)' }}><strong>Matrícula:</strong> {aluno.matricula}</p>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Seção de Desempenho Geral */}
        <IonCard>
          <IonCardContent>
            <IonLabel>
              <h2 style={{ fontWeight: '700', marginBottom: 8 }}>Desempenho Geral (Média)</h2>
            </IonLabel>

            <IonGrid>
              <IonRow>
                <IonCol size="6" className="ion-text-center">
                  <div style={{ fontSize: '2.2rem' }}>{gerarEmoji(medias.assiduidade)}</div>
                  <IonLabel>Assiduidade</IonLabel>
                </IonCol>
                <IonCol size="6" className="ion-text-center">
                  <div style={{ fontSize: '2.2rem' }}>{gerarEmoji(medias.participacao)}</div>
                  <IonLabel>Participação</IonLabel>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="6" className="ion-text-center">
                  <div style={{ fontSize: '2.2rem' }}>{gerarEmoji(medias.responsabilidade)}</div>
                  <IonLabel>Responsabilidade</IonLabel>
                </IonCol>
                <IonCol size="6" className="ion-text-center">
                  <div style={{ fontSize: '2.2rem' }}>{gerarEmoji(medias.sociabilidade)}</div>
                  <IonLabel>Sociabilidade</IonLabel>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* FAB para abrir avaliação */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary" onClick={() => setModalAberto(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Modal de nova avaliação (simulado) */}
        <IonModal isOpen={modalAberto} onDidDismiss={() => setModalAberto(false)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => setModalAberto(false)} disabled={isSubmitting}>
                  Cancelar
                </IonButton>
              </IonButtons>
              <IonTitle>Nova Avaliação</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={handleSalvarAvaliacao} disabled={isSubmitting}>
                  {isSubmitting ? <IonSpinner name="crescent" /> : 'Salvar'}
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonText>
              <h3>{aluno.nome}</h3>
            </IonText>
            
            <IonList>
              {/* Item 1: Assiduidade */}
              <IonItem lines="none">
                <IonLabel position="stacked">Assiduidade ({assiduidade})</IonLabel>
                <IonRange
                  min={0}
                  max={2.5}
                  step={0.5}
                  snaps={true} // "Prende" nos valores do 'step'
                  ticks={true} // Mostra as "marcas"
                  value={assiduidade}
                  onIonChange={e => setAssiduidade(e.detail.value as number)}
                  disabled={isSubmitting}
                />
              </IonItem>

              {/* Item 2: Participação */}
              <IonItem lines="none">
                <IonLabel position="stacked">Participação ({participacao})</IonLabel>
                <IonRange
                  min={0}
                  max={2.5}
                  step={0.5}
                  snaps={true}
                  ticks={true}
                  value={participacao}
                  onIonChange={e => setParticipacao(e.detail.value as number)}
                  disabled={isSubmitting}
                />
              </IonItem>

              {/* Item 3: Responsabilidade */}
              <IonItem lines="none">
                <IonLabel position="stacked">Responsabilidade ({responsabilidade})</IonLabel>
                <IonRange
                  min={0}
                  max={2.5}
                  step={0.5}
                  snaps={true}
                  ticks={true}
                  value={responsabilidade}
                  onIonChange={e => setResponsabilidade(e.detail.value as number)}
                  disabled={isSubmitting}
                />
              </IonItem>

              {/* Item 4: Sociabilidade */}
              <IonItem lines="none">
                <IonLabel position="stacked">Sociabilidade ({sociabilidade})</IonLabel>
                <IonRange
                  min={0}
                  max={2.5}
                  step={0.5}
                  snaps={true}
                  ticks={true}
                  value={sociabilidade}
                  onIonChange={e => setSociabilidade(e.detail.value as number)}
                  disabled={isSubmitting}
                />
              </IonItem>
            
              {/* Item 5: Observação */}
              <IonItem style={{ marginTop: 12 }}>
                <IonTextarea
                  label="Observação / Ocorrência"
                  labelPlacement="stacked"
                  placeholder="Digite uma observação (opcional)..."
                  autoGrow
                  value={observacao}
                  onIonChange={e => setObservacao(e.detail.value!)}
                  disabled={isSubmitting}
                />
              </IonItem>
            </IonList>

            {/* Mostra erros de submissão (ex: "Aluno já avaliado hoje") */}
            {submitError && (
              <IonText color="danger" className="ion-padding-start">
                <p>{submitError}</p>
              </IonText>
            )}

          </IonContent>
        </IonModal>
        
      </IonContent>
    </IonPage>
  );
};

export default CarometroAluno;
