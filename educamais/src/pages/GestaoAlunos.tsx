import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonFab,
  IonFabButton,
  IonIcon,
  IonAlert,
  IonSkeletonText,
  IonToast
} from '@ionic/react';
import { add, trash } from 'ionicons/icons';
import api from '../services/api';
import AlunoFormModal from './AlunoFormModal';

interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  turmaNome?: string;
}

const GestaoAlunos: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alunoToDelete, setAlunoToDelete] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [selectedAlunoId, setSelectedAlunoId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(true);

  const fetchAlunos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/alunos');
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const handleAdd = () => {
    setIsCreateMode(true);
    setSelectedAlunoId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    setSelectedAlunoId(id);
    setIsCreateMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setAlunoToDelete(id);
    setShowAlert(true);
  };

  const confirmDelete = async () => {
    if (alunoToDelete) {
      try {
        await api.delete(`/alunos/${alunoToDelete}`);
        setShowToast(true);
        fetchAlunos();
      } catch (error) {
        console.error('Erro ao deletar aluno:', error);
      } finally {
        setShowAlert(false);
      }
    }
  };

  const filteredAlunos = alunos.filter(a =>
    a.nome.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Gestão de Alunos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSearchbar
          placeholder="Pesquisar aluno..."
          value={searchText}
          onIonInput={e => setSearchText(e.detail.value!)}
        />

        {loading ? (
          <IonList>
            {[...Array(5)].map((_, i) => (
              <IonItem key={i}>
                <IonLabel>
                  <h2><IonSkeletonText animated style={{ width: '60%' }} /></h2>
                  <p><IonSkeletonText animated style={{ width: '40%' }} /></p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <IonList>
            {filteredAlunos.map(aluno => (
              <IonItemSliding key={aluno.id}>
                <IonItem button onClick={() => handleEdit(aluno.id)}>
                  <IonLabel>
                    <h2>{aluno.nome}</h2>
                    <p>{aluno.turmaNome || `Matrícula: ${aluno.matricula}`}</p>
                  </IonLabel>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => handleDelete(aluno.id)}>
                    <IonIcon icon={trash} />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        )}

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={handleAdd}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <AlunoFormModal
          isOpen={isModalOpen}
          onDidDismiss={() => setIsModalOpen(false)}
          alunoId={selectedAlunoId}
          isCreateMode={isCreateMode}
          onSaved={fetchAlunos}
        />

        <IonAlert
          isOpen={showAlert}
          header="Confirmar Exclusão"
          message="Tem a certeza? Esta ação não pode ser desfeita."
          buttons={[
            { text: 'Cancelar', role: 'cancel', handler: () => setShowAlert(false) },
            { text: 'Deletar', handler: confirmDelete }
          ]}
        />

        <IonToast
          isOpen={showToast}
          message="Aluno removido com sucesso"
          duration={2000}
          color="success"
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default GestaoAlunos;
