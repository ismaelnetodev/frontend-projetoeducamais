import React, { useEffect, useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonLoading,
  IonNote,
  IonToast,
  IonAvatar
} from '@ionic/react';
import api from '../services/api';

interface Turma {
  id: number;
  nome: string;
}

interface Props {
  isOpen: boolean;
  onDidDismiss: () => void;
  alunoId?: number | null;
  isCreateMode: boolean;
  onSaved: () => void;
}

const AlunoFormModal: React.FC<Props> = ({ isOpen, onDidDismiss, alunoId, isCreateMode, onSaved }) => {
  const [nome, setNome] = useState('');
  const [login, setLogin] = useState('');
  const [matricula, setMatricula] = useState('');
  const [turmaId, setTurmaId] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchTurmas = async () => {
    try {
      const res = await api.get('/turmas');
      setTurmas(res.data);
    } catch (err) {
      console.error('Erro ao buscar turmas', err);
    }
  };

  const fetchAluno = async () => {
    if (!alunoId) return;
    setLoading(true);
    try {
      const res = await api.get(`/alunos/${alunoId}`);
      const a = res.data;
      setNome(a.nome);
      setLogin(a.login);
      setMatricula(a.matricula);
      setTurmaId(a.turmaId);
      setFotoUrl(a.fotoUrl || '');
    } catch (err) {
      console.error('Erro ao carregar aluno:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTurmas();
      if (!isCreateMode) fetchAluno();
      else {
        setNome('');
        setLogin('');
        setMatricula('');
        setTurmaId(null);
        setPassword('');
        setFotoUrl('');
      }
    }
  }, [isOpen]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = { nome, login, matricula, turmaId, password, fotoUrl };
      if (isCreateMode) {
        await api.post('/alunos', data);
        setToastMsg('Aluno criado com sucesso!');
      } else {
        await api.put(`/alunos/${alunoId}`, data);
        setToastMsg('Aluno atualizado com sucesso!');
      }
      onSaved();
      onDidDismiss();
    } catch (err: any) {
      console.error(err);
      setToastMsg('Erro ao salvar aluno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{isCreateMode ? 'Novo Aluno' : 'Editar Aluno'}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDidDismiss}>Cancelar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Nome</IonLabel>
          <IonInput value={nome} onIonInput={e => setNome(e.detail.value!)} required />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Login</IonLabel>
          <IonInput value={login} onIonInput={e => setLogin(e.detail.value!.replace(/\s/g, ''))} required />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Matrícula</IonLabel>
          <IonInput value={matricula} onIonInput={e => setMatricula(e.detail.value!)} required />
        </IonItem>

        <IonItem>
          <IonLabel>Turma</IonLabel>
          <IonSelect
            value={turmaId ?? undefined}
            placeholder="Selecione a turma"
            onIonChange={e => setTurmaId(Number(e.detail.value))}
          >
            {turmas.map(t => (
              <IonSelectOption key={t.id} value={t.id}>{t.nome}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        {isCreateMode && (
          <>
            <IonItem>
              <IonLabel position="floating">Senha Provisória</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonInput={e => setPassword(e.detail.value!)}
                required
              />
            </IonItem>
            <IonNote color="medium" className="ion-padding-start">
              Defina uma senha provisória. O aluno será solicitado a alterá-la no primeiro acesso.
            </IonNote>
          </>
        )}

        <IonItem>
          <IonLabel position="floating">URL da Foto</IonLabel>
          <IonInput value={fotoUrl} onIonInput={e => setFotoUrl(e.detail.value!)} />
        </IonItem>

        {fotoUrl && (
          <IonAvatar className="ion-margin-top ion-margin-start">
            <img src={fotoUrl} alt="Foto do aluno" />
          </IonAvatar>
        )}

        <IonButton expand="block" color="success" className="ion-margin-top" onClick={handleSave}>
          Salvar
        </IonButton>

        <IonLoading isOpen={loading} message="Salvando..." />
        <IonToast isOpen={!!toastMsg} message={toastMsg!} duration={2000} onDidDismiss={() => setToastMsg(null)} />
      </IonContent>
    </IonModal>
  );
};

export default AlunoFormModal;
