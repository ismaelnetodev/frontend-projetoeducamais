// src/pages/CriarSimulado.tsx
import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonList,
  IonText,
  IonIcon,
  IonChip,
  IonLoading,
  IonToast,
  IonModal,
  IonButtons,
  IonSearchbar,
  IonCheckbox,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonBackButton
} from '@ionic/react';
import {
  add,
  search,
  closeCircle,
  documentTextOutline,
  calendarOutline,
  timeOutline,
  arrowBackOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import api from '../services/api';
import QuestaoFormModal from '../components/QuestaoFormModal';

interface Turma {
  id: number;
  nome: string;
  anoLetivo: number;
}

interface Questao {
  id: number;
  enunciado: string;
  disciplina: string;
  tipo: string;
  pontuacao: number;
  alternativas: string[];
}

const CriarSimulado: React.FC = () => {
  const history = useHistory();
  const [titulo, setTitulo] = useState('');
  const [turmaId, setTurmaId] = useState<number | null>(null);
  const [disciplinaId, setDisciplinaId] = useState<number>(0);
  const [inicioDisponivel, setInicioDisponivel] = useState('');
  const [fimDisponivel, setFimDisponivel] = useState('');
  const [questoesSelecionadas, setQuestoesSelecionadas] = useState<number[]>([]);

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [questoesDisponiveis, setQuestoesDisponiveis] = useState<Questao[]>([]);
  const [questoesFiltradas, setQuestoesFiltradas] = useState<Questao[]>([]);
  
  const [showQuestaoModal, setShowQuestaoModal] = useState(false);
  const [showSelecionarQuestoesModal, setShowSelecionarQuestoesModal] = useState(false);
  const [searchQuestao, setSearchQuestao] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTurmas();
    fetchQuestoes();
  }, []);

  const fetchTurmas = async () => {
    try {
      const response = await api.get('/professores/minhas-turmas');
      const data = response.data.content || response.data;
      setTurmas(data);
    } catch (err) {
      console.error('Erro ao buscar turmas:', err);
    }
  };

  const fetchQuestoes = async () => {
    try {
      const response = await api.get('/questao');
      const data = response.data.content || response.data;
      setQuestoesDisponiveis(data);
      setQuestoesFiltradas(data);
    } catch (err) {
      console.error('Erro ao buscar questões:', err);
    }
  };

  const handleSearchQuestao = (term: string) => {
    setSearchQuestao(term);
    const filtered = questoesDisponiveis.filter(q =>
      q.enunciado.toLowerCase().includes(term.toLowerCase()) ||
      q.disciplina.toLowerCase().includes(term.toLowerCase())
    );
    setQuestoesFiltradas(filtered);
  };

  const toggleQuestao = (questaoId: number) => {
    setQuestoesSelecionadas(prev => {
      if (prev.includes(questaoId)) {
        return prev.filter(id => id !== questaoId);
      }
      return [...prev, questaoId];
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!turmaId) newErrors.turmaId = 'Selecione uma turma';
    if (!inicioDisponivel) newErrors.inicioDisponivel = 'Data de início é obrigatória';
    if (!fimDisponivel) newErrors.fimDisponivel = 'Data de fim é obrigatória';
    if (questoesSelecionadas.length === 0) newErrors.questoes = 'Selecione pelo menos uma questão';

    const inicio = new Date(inicioDisponivel);
    const fim = new Date(fimDisponivel);
    if (fim <= inicio) {
      newErrors.fimDisponivel = 'Data de fim deve ser posterior à data de início';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setToastMsg('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const body = {
        titulo: titulo.trim(),
        turmaId,
        disciplinaId,
        questoesId: questoesSelecionadas,
        inicioDisponivel,
        fimDisponivel
      };

      await api.post('/simulados/criar', body);
      
      setToastMsg('Simulado criado com sucesso!');
      
      setTimeout(() => {
        history.goBack();
      }, 1500);
      
    } catch (err: any) {
      console.error('Erro ao criar simulado:', err);
      setToastMsg(err.response?.data?.message || 'Erro ao criar simulado');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestaoCreated = (novaQuestao: Questao) => {
    setQuestoesDisponiveis(prev => [novaQuestao, ...prev]);
    setQuestoesFiltradas(prev => [novaQuestao, ...prev]);
    setQuestoesSelecionadas(prev => [...prev, novaQuestao.id]);
  };

  const getTotalPontuacao = () => {
    return questoesDisponiveis
      .filter(q => questoesSelecionadas.includes(q.id))
      .reduce((sum, q) => sum + q.pontuacao, 0)
      .toFixed(1);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/minhas-turmas" icon={arrowBackOutline} />
          </IonButtons>
          <IonTitle>Criar Simulado</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText color="dark">
          <h1 style={{ fontWeight: 700, fontSize: '1.8rem', marginBottom: '0.3rem' }}>
            Novo Simulado
          </h1>
        </IonText>
        <IonText color="medium">
          <p style={{ marginTop: 0, marginBottom: '1.5rem' }}>
            Configure e crie simulados para suas turmas
          </p>
        </IonText>

        <IonCard style={{ borderRadius: '12px' }}>
          <IonCardHeader>
            <IonCardTitle>Informações Básicas</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonInput
                  label="Título do Simulado *"
                  labelPlacement="stacked"
                  value={titulo}
                  onIonInput={e => setTitulo(e.detail.value!)}
                  placeholder="Ex: Avaliação Diagnóstica - Matemática"
                />
              </IonItem>
              {errors.titulo && (
                <IonText color="danger">
                  <p style={{ marginLeft: 12, fontSize: '0.85rem' }}>{errors.titulo}</p>
                </IonText>
              )}

              <IonItem>
                <IonLabel position="stacked">Turma *</IonLabel>
                <IonSelect
                  value={turmaId}
                  placeholder="Selecione a turma"
                  onIonChange={e => setTurmaId(e.detail.value)}
                >
                  {turmas.map(t => (
                    <IonSelectOption key={t.id} value={t.id}>
                      {t.nome} - {t.anoLetivo}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              {errors.turmaId && (
                <IonText color="danger">
                  <p style={{ marginLeft: 12, fontSize: '0.85rem' }}>{errors.turmaId}</p>
                </IonText>
              )}
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard style={{ borderRadius: '12px', marginTop: '1rem' }}>
          <IonCardHeader>
            <IonCardTitle>Período de Disponibilidade</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">
                  <IonIcon icon={calendarOutline} style={{ marginRight: '0.5rem' }} />
                  Início Disponível *
                </IonLabel>
                <IonInput
                  type="datetime-local"
                  value={inicioDisponivel}
                  onIonInput={e => setInicioDisponivel(e.detail.value!)}
                />
              </IonItem>
              {errors.inicioDisponivel && (
                <IonText color="danger">
                  <p style={{ marginLeft: 12, fontSize: '0.85rem' }}>{errors.inicioDisponivel}</p>
                </IonText>
              )}

              <IonItem>
                <IonLabel position="stacked">
                  <IonIcon icon={timeOutline} style={{ marginRight: '0.5rem' }} />
                  Fim Disponível *
                </IonLabel>
                <IonInput
                  type="datetime-local"
                  value={fimDisponivel}
                  onIonInput={e => setFimDisponivel(e.detail.value!)}
                />
              </IonItem>
              {errors.fimDisponivel && (
                <IonText color="danger">
                  <p style={{ marginLeft: 12, fontSize: '0.85rem' }}>{errors.fimDisponivel}</p>
                </IonText>
              )}
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard style={{ borderRadius: '12px', marginTop: '1rem' }}>
          <IonCardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <IonCardTitle>Questões</IonCardTitle>
              <IonBadge color="primary">
                {questoesSelecionadas.length} selecionada(s)
              </IonBadge>
            </div>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeMd="6">
                  <IonButton
                    expand="block"
                    onClick={() => setShowSelecionarQuestoesModal(true)}
                  >
                    <IonIcon icon={search} slot="start" />
                    Selecionar Questões
                  </IonButton>
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <IonButton
                    expand="block"
                    fill="outline"
                    color="success"
                    onClick={() => setShowQuestaoModal(true)}
                  >
                    <IonIcon icon={add} slot="start" />
                    Criar Nova Questão
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>

            {errors.questoes && (
              <IonText color="danger">
                <p style={{ marginLeft: 12, fontSize: '0.85rem' }}>{errors.questoes}</p>
              </IonText>
            )}

            {questoesSelecionadas.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <IonText color="medium">
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    Questões selecionadas:
                  </p>
                </IonText>
                {questoesDisponiveis
                  .filter(q => questoesSelecionadas.includes(q.id))
                  .map(q => (
                    <IonChip key={q.id} color="primary">
                      {q.enunciado.substring(0, 40)}...
                      <IonIcon icon={closeCircle} onClick={() => toggleQuestao(q.id)} />
                    </IonChip>
                  ))
                }
                <IonText color="success">
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.75rem' }}>
                    Pontuação Total: {getTotalPontuacao()} pontos
                  </p>
                </IonText>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        <IonButton
          expand="block"
          color="success"
          onClick={handleSubmit}
          disabled={loading}
          style={{ marginTop: '2rem', marginBottom: '2rem' }}
          size="large"
        >
          <IonIcon icon={add} slot="start" />
          Criar Simulado
        </IonButton>

        <QuestaoFormModal
          isOpen={showQuestaoModal}
          onDidDismiss={() => setShowQuestaoModal(false)}
          onQuestaoCreated={handleQuestaoCreated}
        />

        <IonModal
          isOpen={showSelecionarQuestoesModal}
          onDidDismiss={() => setShowSelecionarQuestoesModal(false)}
        >
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Selecionar Questões</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowSelecionarQuestoesModal(false)}>
                  Concluir
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent>
            <IonSearchbar
              value={searchQuestao}
              onIonInput={e => handleSearchQuestao(e.detail.value!)}
              placeholder="Buscar questão..."
              debounce={300}
            />

            <div className="ion-padding">
              <IonText color="medium">
                <p style={{ fontSize: '0.9rem' }}>
                  {questoesSelecionadas.length} questão(ões) selecionada(s)
                </p>
              </IonText>

              {questoesFiltradas.map(questao => (
                <IonCard key={questao.id} style={{ marginBottom: '0.75rem' }}>
                  <IonCardContent>
                    <IonItem lines="none">
                      <IonCheckbox
                        slot="start"
                        checked={questoesSelecionadas.includes(questao.id)}
                        onIonChange={() => toggleQuestao(questao.id)}
                      />
                      <IonLabel>
                        <h3>{questao.enunciado}</h3>
                        <p>
                          <IonChip color="primary" style={{ fontSize: '0.8rem' }}>
                            {questao.disciplina}
                          </IonChip>
                          <IonChip color="success" style={{ fontSize: '0.8rem' }}>
                            {questao.pontuacao} pts
                          </IonChip>
                        </p>
                      </IonLabel>
                    </IonItem>
                  </IonCardContent>
                </IonCard>
              ))}

              {questoesFiltradas.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <IonIcon
                    icon={documentTextOutline}
                    style={{ fontSize: '3rem', color: 'var(--ion-color-medium)' }}
                  />
                  <IonText color="medium">
                    <p>Nenhuma questão encontrada</p>
                  </IonText>
                </div>
              )}
            </div>
          </IonContent>
        </IonModal>

        <IonLoading isOpen={loading} message="Criando simulado..." />
        
        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg!}
          duration={2500}
          onDidDismiss={() => setToastMsg(null)}
          color={toastMsg?.includes('sucesso') ? 'success' : 'danger'}
        />
      </IonContent>
    </IonPage>
  );
};

export default CriarSimulado;