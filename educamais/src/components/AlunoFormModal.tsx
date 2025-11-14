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
  IonToast,
  IonAvatar,
  IonText
} from '@ionic/react';
import api from '../services/api';

interface Turma {
  id: number;
  nome: string;
  anoLetivo?: number;
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
  const [matricula, setMatricula] = useState('');
  const [turmaId, setTurmaId] = useState<number | null>(null);
  const [fotoUrl, setFotoUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Estados da criação de turma dentro do select
  const [showCriarTurmaModal, setShowCriarTurmaModal] = useState(false);
  const [novoNomeTurma, setNovoNomeTurma] = useState('');
  const [novoAnoLetivo, setNovoAnoLetivo] = useState('');

  // Busca turmas
  const fetchTurmas = async () => {
    try {
      const res = await api.get('/turmas');
      setTurmas(res.data);
    } catch (err) {
      console.error('Erro ao buscar turmas', err);
    }
  };

  // Busca aluno para edição
  const fetchAluno = async () => {
    if (!alunoId) return;
    setLoading(true);
    try {
      const res = await api.get(`/alunos/${alunoId}`);
      const a = res.data;
      setNome(a.nome || '');
      setMatricula(a.matricula || '');
      setTurmaId(a.turmaId ?? null);
      setFotoUrl(a.fotoUrl || '');
    } catch (err) {
      console.error('Erro ao carregar aluno:', err);
      setToastMsg('Erro ao carregar aluno');
    } finally {
      setLoading(false);
    }
  };

  // Quando o modal abre
  useEffect(() => {
    if (isOpen) {
      fetchTurmas();

      if (!isCreateMode) {
        fetchAluno();
      } else {
        // reset
        setNome('');
        setMatricula('');
        setTurmaId(null);
        setFotoUrl('');
        setFile(null);
        setFieldErrors({});
      }
    } else {
      setFile(null);
      setFieldErrors({});
    }
  }, [isOpen]);

  // Arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setFile(f);
      setFotoUrl(URL.createObjectURL(f));
    }
  };

  // Validação
  const validate = () => {
    const errors: Record<string, string> = {};
    if (!nome.trim()) errors.nome = 'Nome é obrigatório';
    if (!matricula.trim()) errors.matricula = 'Matrícula é obrigatória';
    if (!turmaId) errors.turmaId = 'Selecione a turma';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Upload
  const uploadFileIfNeeded = async (): Promise<string | null> => {
    if (!file) return fotoUrl || null;
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/upload/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const possibleUrl =
        res?.data?.url ||
        res?.data?.fileUrl ||
        res?.data?.path ||
        res?.data?.location ||
        res?.data;

      if (typeof possibleUrl === 'object') {
        return (possibleUrl as any).url || (possibleUrl as any).fileUrl || null;
      }

      return possibleUrl ?? null;
    } catch (err: any) {
      console.error('Erro no upload:', err);
      throw new Error('Erro ao enviar imagem');
    }
  };

  // Salvar aluno
  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    setFieldErrors({});
    try {
      let fotoUrlFinal = fotoUrl || null;
      if (file) {
        fotoUrlFinal = await uploadFileIfNeeded();
      }

      const body: any = {
        nome: nome.trim(),
        matricula: matricula.trim(),
        turmaId,
        fotoUrl: fotoUrlFinal || ''
      };

      if (isCreateMode) {
        await api.post('/alunos', body);
        setToastMsg('Aluno criado com sucesso!');
      } else {
        await api.put(`/alunos/${alunoId}`, body);
        setToastMsg('Aluno atualizado com sucesso!');
      }

      onSaved();
      onDidDismiss();
    } catch (err: any) {
      console.error('Erro ao salvar aluno:', err);
      setToastMsg(err?.message || 'Erro ao salvar aluno');
    } finally {
      setLoading(false);
    }
  };

  // Criar turma pelo fluxo A
  const handleCriarTurma = async () => {
    if (!novoNomeTurma.trim() || !novoAnoLetivo.trim()) {
      setToastMsg('Preencha todos os campos da nova turma');
      return;
    }

    try {
      const res = await api.post('/turmas', {
        nome: novoNomeTurma.trim(),
        anoLetivo: Number(novoAnoLetivo)
      });

      const novaTurma = res.data;

      // adiciona à lista
      setTurmas(prev => [...prev, novaTurma]);

      // seleciona automaticamente
      setTurmaId(novaTurma.id);

      // fechar modal
      setShowCriarTurmaModal(false);
      setNovoNomeTurma('');
      setNovoAnoLetivo('');
    } catch (err) {
      console.error(err);
      setToastMsg('Erro ao criar turma');
    }
  };

  return (
    <>
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
            <IonInput value={nome} onIonInput={e => setNome(e.detail.value!)} />
          </IonItem>
          {fieldErrors.nome && <IonText color="danger"><p style={{ marginLeft: 12 }}>{fieldErrors.nome}</p></IonText>}

          <IonItem>
            <IonLabel position="floating">Matrícula</IonLabel>
            <IonInput value={matricula} onIonInput={e => setMatricula(e.detail.value!)} />
          </IonItem>
          {fieldErrors.matricula && <IonText color="danger"><p style={{ marginLeft: 12 }}>{fieldErrors.matricula}</p></IonText>}

          <IonItem>
            <IonLabel>Turma</IonLabel>

            <IonSelect
              value={turmaId ?? undefined}
              placeholder="Selecione a turma"
              onIonChange={(e) => {
                const value = e.detail.value;

                if (value === "__new") {
                  setShowCriarTurmaModal(true);
                  return;
                }

                setTurmaId(Number(value));
              }}
            >
              {turmas.map(t => (
                <IonSelectOption key={t.id} value={t.id}>
                  {t.nome}{t.anoLetivo ? ` - ${t.anoLetivo}` : ''}
                </IonSelectOption>
              ))}

              <IonSelectOption value="__new" style={{ color: 'var(--ion-color-primary)' }}>
                + Criar nova turma
              </IonSelectOption>
            </IonSelect>
          </IonItem>
          {fieldErrors.turmaId && <IonText color="danger"><p style={{ marginLeft: 12 }}>{fieldErrors.turmaId}</p></IonText>}

          <IonItem style={{ alignItems: 'center' }}>
            <IonLabel>Foto (arquivo)</IonLabel>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginLeft: 12 }} />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">URL da Foto (opcional)</IonLabel>
            <IonInput value={fotoUrl} onIonInput={e => setFotoUrl(e.detail.value!)} />
          </IonItem>

          {fotoUrl && (
            <IonAvatar className="ion-margin-top ion-margin-start" style={{ width: 80, height: 80 }}>
              <img src={fotoUrl} alt="Foto do aluno" />
            </IonAvatar>
          )}

          <IonButton expand="block" color="success" className="ion-margin-top" onClick={handleSave}>
            Salvar
          </IonButton>

          <IonLoading isOpen={loading} message="Salvando..." />
          <IonToast isOpen={!!toastMsg} message={toastMsg!} duration={2500} onDidDismiss={() => setToastMsg(null)} />
        </IonContent>
      </IonModal>

      {/* MODAL CRIAR TURMA */}
      <IonModal isOpen={showCriarTurmaModal} onDidDismiss={() => setShowCriarTurmaModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Criar Turma</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowCriarTurmaModal(false)}>Cancelar</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <IonItem>
            <IonLabel position="floating">Nome da Turma</IonLabel>
            <IonInput value={novoNomeTurma} onIonInput={e => setNovoNomeTurma(e.detail.value!)} />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Ano Letivo</IonLabel>
            <IonInput type="number" value={novoAnoLetivo} onIonInput={e => setNovoAnoLetivo(e.detail.value!)} />
          </IonItem>

          <IonButton expand="block" className="ion-margin-top" onClick={handleCriarTurma}>
            Criar
          </IonButton>
        </IonContent>
      </IonModal>
    </>
  );
};

export default AlunoFormModal;
