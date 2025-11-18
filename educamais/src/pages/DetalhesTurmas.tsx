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
  IonSkeletonText,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonAvatar,
  IonBadge,
  IonChip,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { 
  arrowBackOutline, 
  peopleOutline, 
  personOutline,
  calendarOutline,
  schoolOutline,
  searchOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

interface TurmaDetalhesParams {
  id: string;
}

interface Aluno {
  id: string;
  nome: string;
  login: string;
  matricula: string;
  turmaNome: string;
  fotoUrl?: string;
}

interface TurmaInfo {
  id: number;
  nome: string;
  anoLetivo: number;
  nomesProfessores: string[];
  numeroDeAlunos: number;
}

const TurmaDetalhes: React.FC = () => {
  const { id } = useParams<TurmaDetalhesParams>();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]);
  const [turmaInfo, setTurmaInfo] = useState<TurmaInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchTurma = async () => {
    if (!id) {
      history.goBack();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const turmaPromise = api.get<TurmaInfo>(`/turmas/${id}`);
      const alunosPromise = api.get<Aluno[]>(`/turmas/${id}/alunos`);

      const [turmaResponse, alunosResponse] = await Promise.all([
        turmaPromise,
        alunosPromise
      ]);

      setTurmaInfo(turmaResponse.data);
      setAlunos(alunosResponse.data);
      setFilteredAlunos(alunosResponse.data);
    } catch (err: any) {
      console.error("Erro ao buscar detalhes da turma:", err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurma();
  }, [id, history]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = alunos.filter(aluno =>
      aluno.nome.toLowerCase().includes(term.toLowerCase()) ||
      aluno.matricula.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredAlunos(filtered);
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchTurma();
    event.detail.complete();
  };

  const getInitials = (nome: string) => {
    const names = nome.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()} color="light">
              <IonIcon icon={arrowBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>Detalhes da Turma</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Detalhes da Turma</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="ion-padding">
          {loading ? (
            <>
              {/* Skeleton do card de informações */}
              <IonCard style={{ marginBottom: '1.5rem', borderRadius: '12px' }}>
                <IonCardHeader>
                  <IonSkeletonText animated style={{ width: '70%', height: '2rem' }} />
                </IonCardHeader>
                <IonCardContent>
                  <IonSkeletonText animated style={{ width: '50%', marginBottom: '0.5rem' }} />
                  <IonSkeletonText animated style={{ width: '60%' }} />
                </IonCardContent>
              </IonCard>

              {/* Skeleton da lista */}
              <IonSkeletonText animated style={{ width: '40%', height: '1rem', marginBottom: '1rem' }} />
              {[1, 2, 3, 4].map((i) => (
                <IonCard key={i} style={{ marginBottom: '0.75rem', borderRadius: '12px' }}>
                  <IonCardContent style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <IonSkeletonText animated style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                    <div style={{ flex: 1 }}>
                      <IonSkeletonText animated style={{ width: '60%', marginBottom: '0.25rem' }} />
                      <IonSkeletonText animated style={{ width: '40%' }} />
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </>
          ) : error ? (
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
                <h2 style={{ fontWeight: 600 }}>Erro ao carregar turma</h2>
                <p>{error}</p>
              </IonText>
              <IonButton 
                onClick={fetchTurma} 
                style={{ marginTop: '1rem' }}
              >
                Tentar novamente
              </IonButton>
            </div>
          ) : (
            <>
              {/* Card com informações da turma */}
              <IonCard style={{ 
                marginBottom: '1.5rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-primary-shade) 100%)',
                color: 'white'
              }}>
                <IonCardHeader>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <IonAvatar style={{ 
                      width: '56px', 
                      height: '56px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IonIcon 
                        icon={schoolOutline} 
                        style={{ fontSize: '2rem', color: 'white' }} 
                      />
                    </IonAvatar>
                    <div style={{ flex: 1 }}>
                      <IonCardTitle style={{ 
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        marginBottom: '0.25rem',
                        color: 'white'
                      }}>
                        {turmaInfo?.nome}
                      </IonCardTitle>
                    </div>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <IonGrid style={{ padding: 0 }}>
                    <IonRow>
                      <IonCol size="6">
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          color: 'rgba(255, 255, 255, 0.9)'
                        }}>
                          <IonIcon icon={calendarOutline} />
                          <span style={{ fontSize: '0.95rem' }}>
                            Ano: <strong>{turmaInfo?.anoLetivo}</strong>
                          </span>
                        </div>
                      </IonCol>
                      <IonCol size="6">
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          color: 'rgba(255, 255, 255, 0.9)'
                        }}>
                          <IonIcon icon={peopleOutline} />
                          <span style={{ fontSize: '0.95rem' }}>
                            Alunos: <strong>{turmaInfo?.numeroDeAlunos || 0}</strong>
                          </span>
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>

              {/* Header da lista de alunos */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <IonText color="dark">
                  <h2 style={{ 
                    fontWeight: 700, 
                    fontSize: '1.3rem',
                    margin: 0
                  }}>
                    Alunos
                  </h2>
                </IonText>
                <IonBadge color="primary" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                  {filteredAlunos.length}
                </IonBadge>
              </div>

              {/* Barra de pesquisa */}
              <IonSearchbar
                value={searchTerm}
                onIonInput={e => handleSearch(e.detail.value!)}
                placeholder="Buscar aluno por nome ou matrícula..."
                debounce={300}
                animated
                style={{ 
                  '--background': 'var(--ion-color-light)',
                  '--border-radius': '12px',
                  padding: '0',
                  marginBottom: '1rem'
                }}
              />

              {/* Lista de alunos */}
              {filteredAlunos.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '3rem',
                  padding: '2rem'
                }}>
                  <IonIcon 
                    icon={searchTerm ? searchOutline : peopleOutline} 
                    style={{ 
                      fontSize: '3.5rem', 
                      color: 'var(--ion-color-medium)',
                      marginBottom: '1rem' 
                    }} 
                  />
                  <IonText color="medium">
                    <h3 style={{ fontWeight: 600 }}>
                      {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno na turma'}
                    </h3>
                    <p style={{ fontSize: '0.9rem' }}>
                      {searchTerm 
                        ? `Não encontramos alunos com "${searchTerm}"`
                        : 'Esta turma ainda não possui alunos cadastrados'
                      }
                    </p>
                  </IonText>
                </div>
              ) : (
                <div>
                  {filteredAlunos.map((aluno) => (
                    <IonCard 
                      key={aluno.id}
                      button
                      onClick={() => history.push(`/turma/${id}/aluno/${aluno.id}`)}
                      style={{ 
                        marginBottom: '0.75rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      className="aluno-card"
                    >
                      <IonCardContent style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        padding: '1rem'
                      }}>
                        <IonAvatar style={{ 
                          width: '48px', 
                          height: '48px',
                          flexShrink: 0
                        }}>
                          {aluno.fotoUrl ? (
                            <img src={aluno.fotoUrl} alt={aluno.nome} />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-primary-shade) 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '1rem'
                            }}>
                              {getInitials(aluno.nome)}
                            </div>
                          )}
                        </IonAvatar>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <IonText>
                            <h3 style={{ 
                              margin: 0,
                              marginBottom: '0.25rem',
                              fontSize: '1.05rem',
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {aluno.nome}
                            </h3>
                          </IonText>
                          <IonText color="medium">
                            <p style={{ 
                              margin: 0,
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              <IonIcon 
                                icon={personOutline} 
                                style={{ fontSize: '0.9rem' }} 
                              />
                              Matrícula: {aluno.matricula}
                            </p>
                          </IonText>
                        </div>

                        <IonIcon 
                          icon={chevronForwardOutline} 
                          style={{ 
                            fontSize: '1.5rem',
                            color: 'var(--ion-color-medium)',
                            flexShrink: 0
                          }} 
                        />
                      </IonCardContent>
                    </IonCard>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <style>{`
          .aluno-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
          }
        `}</style>
      </IonContent>
    </IonPage>
  );
};

export default TurmaDetalhes;