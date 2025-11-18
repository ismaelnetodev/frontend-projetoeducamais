import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSkeletonText,
  IonText,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonChip,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonAvatar
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  peopleOutline, 
  logOutOutline, 
  schoolOutline,
  calendarOutline,
  personOutline,
  searchOutline
} from 'ionicons/icons';
import api from '../services/api';

interface Turma {
  id: number;
  nome: string;
  anoLetivo: number;
  nomesProfessores: string[];
  numeroDeAlunos: number;
}

interface MinhasTurmasProps {
  onLogout: () => void;
}

const PAGE_SIZE = 12;

const MinhasTurmas: React.FC<MinhasTurmasProps> = ({ onLogout }) => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [filteredTurmas, setFilteredTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const history = useHistory();

  const fetchTurmas = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(0);
      }
      
      setError(null);
      const currentPage = reset ? 0 : page;

      const response = await api.get('/professores/minhas-turmas', {
        params: {
          page: currentPage,
          size: PAGE_SIZE
        }
      });

      const data = response.data;
      const content = data.content || data;
      const isLast = data.last !== undefined ? data.last : content.length < PAGE_SIZE;

      if (reset) {
        setTurmas(content);
        setFilteredTurmas(content);
      } else {
        setTurmas(prev => [...prev, ...content]);
        setFilteredTurmas(prev => [...prev, ...content]);
      }

      setHasMore(!isLast);
      if (!reset) setPage(prev => prev + 1);

    } catch (err: any) {
      console.error('Erro ao buscar turmas:', err);
      if (err.response) {
        setError('Não foi possível carregar as turmas.');
      } else if (err.request) {
        setError('Erro de conexão. Verifique a internet.');
      } else {
        setError('Erro inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurmas(true);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = turmas.filter(turma =>
      turma.nome.toLowerCase().includes(term.toLowerCase()) ||
      turma.anoLetivo.toString().includes(term)
    );
    setFilteredTurmas(filtered);
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchTurmas(true);
    event.detail.complete();
  };

  const loadMore = async (ev: any) => {
    if (!hasMore || searchTerm) {
      ev.target.complete();
      return;
    }
    await fetchTurmas(false);
    ev.target.complete();
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar color="primary">
          <IonTitle>Minhas Turmas</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onLogout} color="light">
              <IonIcon icon={logOutOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Minhas Turmas</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="ion-padding">
          <IonText color="dark">
            <h1 style={{ 
              fontWeight: 700, 
              fontSize: '1.8rem', 
              marginBottom: '0.3rem',
              marginTop: '1rem' 
            }}>
              Olá, Professor!
            </h1>
          </IonText>

          <IonText color="medium">
            <p style={{ marginTop: 0, marginBottom: '1.5rem' }}>
              Gerencie suas turmas e acompanhe o desempenho dos alunos
            </p>
          </IonText>

          {/* Barra de pesquisa */}
          <IonSearchbar
            value={searchTerm}
            onIonInput={e => handleSearch(e.detail.value!)}
            placeholder="Buscar turma por nome ou ano..."
            debounce={300}
            animated
            style={{ 
              '--background': 'var(--ion-color-light)',
              '--border-radius': '12px',
              padding: '0',
              marginBottom: '1rem'
            }}
          />

          {/* Estado de carregamento */}
          {loading && (
            <IonGrid>
              <IonRow>
                {[1, 2, 3, 4].map((_, index) => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={index}>
                    <IonCard style={{ margin: 0 }}>
                      <IonCardHeader>
                        <IonSkeletonText animated style={{ width: '60%', height: '1.5rem' }} />
                      </IonCardHeader>
                      <IonCardContent>
                        <IonSkeletonText animated style={{ width: '40%' }} />
                        <IonSkeletonText animated style={{ width: '50%', marginTop: '0.5rem' }} />
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          )}

          {/* Estado de erro */}
          {error && !loading && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '4rem',
              padding: '2rem'
            }}>
              <IonIcon 
                icon={schoolOutline} 
                style={{ 
                  fontSize: '4rem', 
                  color: 'var(--ion-color-danger)',
                  marginBottom: '1rem' 
                }} 
              />
              <IonText color="danger">
                <h2 style={{ fontWeight: 600 }}>Erro ao carregar turmas</h2>
                <p>{error}</p>
              </IonText>
              <IonButton 
                onClick={() => fetchTurmas(true)} 
                style={{ marginTop: '1rem' }}
              >
                Tentar novamente
              </IonButton>
            </div>
          )}

          {/* Estado vazio */}
          {!loading && !error && filteredTurmas.length === 0 && !searchTerm && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '4rem',
              padding: '2rem'
            }}>
              <IonIcon 
                icon={schoolOutline} 
                style={{ 
                  fontSize: '4rem', 
                  color: 'var(--ion-color-medium)',
                  marginBottom: '1rem' 
                }} 
              />
              <IonText color="medium">
                <h2 style={{ fontWeight: 600 }}>Nenhuma turma encontrada</h2>
                <p>Você ainda não possui turmas associadas.</p>
                <p style={{ fontSize: '0.9rem' }}>
                  Entre em contato com a gestão para verificar sua alocação.
                </p>
              </IonText>
            </div>
          )}

          {/* Resultado vazio da busca */}
          {!loading && !error && filteredTurmas.length === 0 && searchTerm && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '4rem',
              padding: '2rem'
            }}>
              <IonIcon 
                icon={searchOutline} 
                style={{ 
                  fontSize: '4rem', 
                  color: 'var(--ion-color-medium)',
                  marginBottom: '1rem' 
                }} 
              />
              <IonText color="medium">
                <h2 style={{ fontWeight: 600 }}>Nenhum resultado</h2>
                <p>Não encontramos turmas com "{searchTerm}"</p>
              </IonText>
            </div>
          )}

          {/* Grid de turmas */}
          {!loading && !error && filteredTurmas.length > 0 && (
            <IonGrid>
              <IonRow>
                {filteredTurmas.map((turma) => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={turma.id}>
                    <IonCard 
                      button 
                      onClick={() => history.push(`/turma/${turma.id}`)}
                      style={{ 
                        margin: 0,
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        borderRadius: '12px'
                      }}
                      className="turma-card"
                    >
                      <IonCardHeader style={{ paddingBottom: '0.5rem' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '0.75rem',
                          marginBottom: '0.5rem'
                        }}>
                          <IonAvatar style={{ 
                            width: '48px', 
                            height: '48px',
                            background: 'linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-primary-shade) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <IonIcon 
                              icon={peopleOutline} 
                              style={{ 
                                fontSize: '1.5rem',
                                color: 'white'
                              }} 
                            />
                          </IonAvatar>
                          <div style={{ flex: 1 }}>
                            <IonCardTitle style={{ 
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              marginBottom: '0.25rem'
                            }}>
                              {turma.nome}
                            </IonCardTitle>
                          </div>
                        </div>
                      </IonCardHeader>

                      <IonCardContent>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IonIcon 
                              icon={calendarOutline} 
                              style={{ 
                                fontSize: '1.1rem',
                                color: 'var(--ion-color-medium)'
                              }} 
                            />
                            <IonText color="medium">
                              <span style={{ fontSize: '0.95rem' }}>
                                Ano Letivo: <strong>{turma.anoLetivo}</strong>
                              </span>
                            </IonText>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IonIcon 
                              icon={personOutline} 
                              style={{ 
                                fontSize: '1.1rem',
                                color: 'var(--ion-color-medium)'
                              }} 
                            />
                            <IonText color="medium">
                              <span style={{ fontSize: '0.95rem' }}>
                                Alunos: <strong>{turma.numeroDeAlunos || 0}</strong>
                              </span>
                            </IonText>
                          </div>

                          <div style={{ marginTop: '0.5rem' }}>
                            <IonBadge 
                              color="primary" 
                              style={{ 
                                padding: '0.5rem 1rem',
                                fontSize: '0.85rem',
                                fontWeight: 600
                              }}
                            >
                              Ver Detalhes →
                            </IonBadge>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          )}

          {/* Scroll infinito */}
          {!searchTerm && (
            <IonInfiniteScroll 
              onIonInfinite={loadMore} 
              threshold="100px" 
              disabled={!hasMore}
            >
              <IonInfiniteScrollContent loadingText="Carregando mais turmas..." />
            </IonInfiniteScroll>
          )}
        </div>

        <style>{`
          .turma-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          }
        `}</style>
      </IonContent>
    </IonPage>
  );
};

export default MinhasTurmas;
