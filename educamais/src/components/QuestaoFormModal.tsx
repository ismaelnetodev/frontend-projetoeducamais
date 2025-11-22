import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonList,
  IonText,
  IonIcon,
  IonCard,
  IonCardContent,
  IonChip,
  IonLoading,
  IonToast
} from '@ionic/react';
import { add, trash, image } from 'ionicons/icons';
import api from '../services/api';

interface Props {
  isOpen: boolean;
  onDidDismiss: () => void;
  onQuestaoCreated: (questao: any) => void;
}

const QuestaoFormModal: React.FC<Props> = ({ isOpen, onDidDismiss, onQuestaoCreated }) => {
  const [enunciado, setEnunciado] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [tipo] = useState('MULTIPLA_ESCOLHA');
  const [pontuacao, setPontuacao] = useState('1.0');
  const [imagemUrl, setImagemUrl] = useState('');
  const [alternativas, setAlternativas] = useState<string[]>(['', '', '', '']);
  const [respostaCorreta, setRespostaCorreta] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setEnunciado('');
    setDisciplina('');
    setPontuacao('1.0');
    setImagemUrl('');
    setAlternativas(['', '', '', '']);
    setRespostaCorreta(0);
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!enunciado.trim()) newErrors.enunciado = 'Enunciado é obrigatório';
    if (!disciplina.trim()) newErrors.disciplina = 'Disciplina é obrigatória';
    if (!pontuacao || parseFloat(pontuacao) <= 0) newErrors.pontuacao = 'Pontuação deve ser maior que 0';
    
    const alternativasPreenchidas = alternativas.filter(a => a.trim());
    if (alternativasPreenchidas.length < 2) {
      newErrors.alternativas = 'Preencha pelo menos 2 alternativas';
    }

    if (!alternativas[respostaCorreta]?.trim()) {
      newErrors.respostaCorreta = 'Selecione uma resposta correta válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const alternativasLimpas = alternativas.filter(a => a.trim());
      
      const body = {
        enunciado: enunciado.trim(),
        disciplina: disciplina.trim(),
        tipo,
        pontuacao: parseFloat(pontuacao),
        imagemUrl: imagemUrl.trim() || undefined,
        alternativas: alternativasLimpas,
        respostaCorreta: alternativasLimpas[respostaCorreta]
      };

      const response = await api.post('/questoes', body);
      
      setToastMsg('Questão criada com sucesso!');
      onQuestaoCreated(response.data);
      resetForm();
      
      setTimeout(() => {
        onDidDismiss();
      }, 500);
      
    } catch (err: any) {
      console.error('Erro ao criar questão:', err);
      setToastMsg(err.response?.data?.message || 'Erro ao criar questão');
    } finally {
      setLoading(false);
    }
  };

  const handleAlternativaChange = (index: number, value: string) => {
    const newAlternativas = [...alternativas];
    newAlternativas[index] = value;
    setAlternativas(newAlternativas);
  };

  const addAlternativa = () => {
    setAlternativas([...alternativas, '']);
  };

  const removeAlternativa = (index: number) => {
    if (alternativas.length <= 2) {
      setToastMsg('É necessário ter pelo menos 2 alternativas');
      return;
    }
    const newAlternativas = alternativas.filter((_, i) => i !== index);
    setAlternativas(newAlternativas);
    if (respostaCorreta >= newAlternativas.length) {
      setRespostaCorreta(0);
    }
  };

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Nova Questão</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onDidDismiss} disabled={loading}>
                Cancelar
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <IonList>
            {/* Enunciado */}
            <IonItem>
              <IonTextarea
                label="Enunciado da Questão *"
                labelPlacement="stacked"
                value={enunciado}
                onIonInput={e => setEnunciado(e.detail.value!)}
                placeholder="Digite o enunciado da questão..."
                autoGrow
                rows={3}
              />
            </IonItem>
            {errors.enunciado && (
              <IonText color="danger">
                <p style={{ marginLeft: 12, fontSize: '0.85rem' }}>{errors.enunciado}</p>
              </IonText>
            )}

            {/* Disciplina */}
            <IonItem>
              <IonInput
                label="Disciplina *"
                labelPlacement="stacked"
                value={disciplina}
                onIonInput={e => setDisciplina(e.detail.value!)}
                placeholder="Ex: Matemática, Português..."
              />
            </IonItem>
            {errors.disciplina && (
              <IonText color="danger">
                <p style={{ marginLeft: 12, fontSize: '0.85rem' }}>{errors.disciplina}</p>
              </IonText>
            )}

            {/* Pontuação */}
            <IonItem>
              <IonInput
                label="Pontuação *"
                labelPlacement="stacked"
                type="number"
                value={pontuacao}
                onIonInput={e => setPontuacao(e.detail.value!)}
                placeholder="1.0"
                min="0.1"
                step="0.1"
              />
            </IonItem>
            {errors.pontuacao && (
              <IonText color="danger">
                <p style={{ marginLeft: 12, fontSize: '0.85rem' }}>{errors.pontuacao}</p>
              </IonText>
            )}

            {/* URL da Imagem (opcional) */}
            <IonItem>
              <IonInput
                label="URL da Imagem (opcional)"
                labelPlacement="stacked"
                value={imagemUrl}
                onIonInput={e => setImagemUrl(e.detail.value!)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </IonItem>

            {imagemUrl && (
              <IonCard style={{ marginTop: '1rem' }}>
                <IonCardContent>
                  <img 
                    src={imagemUrl} 
                    alt="Preview" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </IonCardContent>
              </IonCard>
            )}

            {/* Alternativas */}
            <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
              <IonText color="dark">
                <h3 style={{ marginLeft: 12, fontWeight: 600 }}>Alternativas *</h3>
              </IonText>
            </div>

            {alternativas.map((alt, index) => (
              <IonCard key={index} style={{ marginBottom: '0.75rem' }}>
                <IonCardContent>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <IonItem lines="none">
                        <IonInput
                          label={`Alternativa ${String.fromCharCode(65 + index)}`}
                          labelPlacement="stacked"
                          value={alt}
                          onIonInput={e => handleAlternativaChange(index, e.detail.value!)}
                          placeholder={`Digite a alternativa ${String.fromCharCode(65 + index)}...`}
                        />
                      </IonItem>
                      
                      <div style={{ marginTop: '0.5rem', marginLeft: '12px' }}>
                        <IonChip
                          color={respostaCorreta === index ? 'success' : 'medium'}
                          onClick={() => setRespostaCorreta(index)}
                          style={{ cursor: 'pointer' }}
                        >
                          {respostaCorreta === index ? '✓ Resposta Correta' : 'Marcar como correta'}
                        </IonChip>
                      </div>
                    </div>

                    {alternativas.length > 2 && (
                      <IonButton
                        fill="clear"
                        color="danger"
                        onClick={() => removeAlternativa(index)}
                        style={{ marginTop: '1.5rem' }}
                      >
                        <IonIcon icon={trash} slot="icon-only" />
                      </IonButton>
                    )}
                  </div>
                </IonCardContent>
              </IonCard>
            ))}

            {errors.alternativas && (
              <IonText color="danger">
                <p style={{ marginLeft: 12, fontSize: '0.85rem' }}>{errors.alternativas}</p>
              </IonText>
            )}

            {errors.respostaCorreta && (
              <IonText color="danger">
                <p style={{ marginLeft: 12, fontSize: '0.85rem' }}>{errors.respostaCorreta}</p>
              </IonText>
            )}

            <IonButton 
              expand="block" 
              fill="outline" 
              onClick={addAlternativa}
              style={{ marginTop: '0.5rem' }}
            >
              <IonIcon icon={add} slot="start" />
              Adicionar Alternativa
            </IonButton>
          </IonList>

          <IonButton
            expand="block"
            color="success"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: '2rem' }}
          >
            Criar Questão
          </IonButton>

          <IonLoading isOpen={loading} message="Criando questão..." />
        </IonContent>
      </IonModal>

      <IonToast
        isOpen={!!toastMsg}
        message={toastMsg!}
        duration={2500}
        onDidDismiss={() => setToastMsg(null)}
        color={toastMsg?.includes('sucesso') ? 'success' : 'danger'}
      />
    </>
  );
};

export default QuestaoFormModal;
