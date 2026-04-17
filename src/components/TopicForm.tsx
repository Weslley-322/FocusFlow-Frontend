import { useState, useEffect } from 'react';
import { Topic, CreateTopicData } from '@/types';
import { Modal, Input, Textarea, Button, Alert } from '@/components';
import { getErrorMessage } from '@/utils/errorHandler';

interface TopicFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTopicData) => Promise<void>;
  topic?: Topic | null;
  subjectId: string;
  title?: string;
}

export function TopicForm({
  isOpen,
  onClose,
  onSubmit,
  topic,
  subjectId,
  title = 'Novo Tópico',
}: TopicFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setDescription(topic.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError('');
  }, [topic, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('O nome deve ter no mínimo 2 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        subjectId,
      });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert type="error">{error}</Alert>}

        <Input
          label="Nome do tópico"
          placeholder="Ex: Derivadas"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />

        <Textarea
          label="Descrição (opcional)"
          placeholder="Ex: Conceitos básicos de derivadas e suas aplicações"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          disabled={isLoading}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            fullWidth
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading} fullWidth>
            {topic ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}