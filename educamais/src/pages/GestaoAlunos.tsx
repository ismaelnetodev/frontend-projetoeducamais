import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonImg,
  IonText,
  IonAlert,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonIcon,
  IonFab,
  IonFabButton
} from '@ionic/react';
import { add, trash, pencil } from 'ionicons/icons';
import api from '../services/api';
import AlunoFormModal from '../components/AlunoFormModal';

interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  fotoUrl?: string;
  turmaId?: number;
}

const PAGE_SIZE = 20;

const GestaoAlunos: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [editAlunoId, setEditAlunoId] = useState<number | null>(null);

  const [alertDelete, setAlertDelete] = useState<{open: boolean; id: number | null}>({
    open: false,
    id: null
  });

  // Chamada para buscar alunos paginados e com busca
  const fetchAlunos = async (reset = false) => {
    try {
      const currentPage = reset ? 0 : page;
      const res = await api.get('/alunos', {
        params: {
          page: currentPage,
          size: PAGE_SIZE,
          search: searchTerm.trim() || undefined
        }
      });

      const content = res.data.content || [];
      const last = res.data.last;

      if (reset) {
        setAlunos(content);
      } else {
        setAlunos(prev => [...prev, ...content]);
      }

      setHasMore(!last);
      if (!reset) setPage(prev => prev + 1);
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  // Load inicial
  useEffect(() => {
    fetchAlunos(true);
    // eslint-disable-next-line
  }, []);

  // Busca
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setPage(0);
    await fetchAlunos(true);
  };

  // Scroll infinito
  const loadMore = async (ev: any) => {
    if (!hasMore) {
      ev.target.complete();
      return;
    }
    await fetchAlunos(false);
    ev.target.complete();
  };

  // Pull to refresh
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) =>
  {
    setPage(0);
    await fetchAlunos(true);
    event.detail.complete();
  };

  // Abrir modal CRIAR
  const openCreateModal = () => {
    setIsCreateMode(true);
    setEditAlunoId(null);
    setIsModalOpen(true);
  };

  // Abrir modal EDITAR
  const openEditModal = (id: number) => {
    setIsCreateMode(false);
    setEditAlunoId(id);
    setIsModalOpen(true);
  };

  // Salvar → atualizar localmente sem novo GET
  const handleSaved = (updatedAluno?: Aluno) => {
    if (!updatedAluno) {
      // Caso o modal não envie nada, fazemos um refresh completo
      fetchAlunos(true);
      return;
    }

    setAlunos(prev => {
      // Se é create, adiciona no topo
      if (!prev.some(a => a.id === updatedAluno.id)) {
        return [updatedAluno, ...prev];
      }

      // Se é edit, substitui localmente
      return prev.map(a => (a.id === updatedAluno.id ? updatedAluno : a));
    });
  };

  // Remover aluno
  const deleteAluno = async (id: number) => {
    try {
      await api.delete(`/alunos/${id}`);
      setAlunos(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erro ao deletar aluno:', err);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Gestão de Alunos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>

        {/* Busca */}
        <IonSearchbar
          value={searchTerm}
          onIonInput={e => handleSearch(e.detail.value!)}
          debounce={400}
          placeholder="Buscar aluno por nome ou matrícula..."
        />

        {/* Pull to Refresh */}
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Lista de alunos */}
        <IonGrid>
          <IonRow>
            {alunos.map(a => (
              <IonCol size="12" sizeMd="4" sizeLg="3" key={a.id}>
                <IonCard>
                  <IonImg
                    src={
                      a.fotoUrl ||
                      'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
                    }
                    style={{ height: 160, objectFit: 'cover' }}
                  />
                  <IonCardContent>
                    <IonText>
                      <h2 style={{ marginBottom: 8 }}>{a.nome}</h2>
                    </IonText>

                    <IonText color="medium">
                      <p>Matrícula: {a.matricula}</p>
                    </IonText>

                    <div style={{ display: 'flex', marginTop: 12, justifyContent: 'space-between' }}>
                      <IonButton
                        size="small"
                        color="warning"
                        onClick={() => openEditModal(a.id)}
                      >
                        <IonIcon icon={pencil} slot="start" />
                        Editar
                      </IonButton>

                      <IonButton
                        size="small"
                        color="danger"
                        onClick={() => setAlertDelete({ open: true, id: a.id })}
                      >
                        <IonIcon icon={trash} />
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* Scroll infinito */}
        <IonInfiniteScroll onIonInfinite={loadMore} threshold="100px" disabled={!hasMore}>
          <IonInfiniteScrollContent loadingText="Carregando..." />
        </IonInfiniteScroll>

        {/* Botão flutuante de adicionar */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="success" onClick={openCreateModal}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Modal de criar/editar */}
        <AlunoFormModal
          isOpen={isModalOpen}
          onDidDismiss={() => setIsModalOpen(false)}
          alunoId={editAlunoId}
          isCreateMode={isCreateMode}
          onSaved={handleSaved}
        />

        {/* Alerta de remoção */}
        <IonAlert
          isOpen={alertDelete.open}
          header="Confirmar remoção"
          message="Tem certeza que deseja excluir este aluno?"
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Remover',
              role: 'destructive',
              handler: () => deleteAluno(alertDelete.id!)
            }
          ]}
          onDidDismiss={() => setAlertDelete({ open: false, id: null })}
        />
      </IonContent>
    </IonPage>
  );
};

export default GestaoAlunos;
