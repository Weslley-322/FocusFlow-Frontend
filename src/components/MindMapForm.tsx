import { useState, useEffect } from 'react';
import { Modal, Input, Textarea, Button, Alert } from '@/components';
import { Topic } from '@/types';
import { getErrorMessage } from '@/utils/errorHandler';

interface MindMapFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string; topicId?: string }) => Promise<void>;
  topics: Topic[];
  title?: string;
}

export function MindMapForm({
  isOpen,
  onClose,
  onSubmit,
  topics,
  title = 'Novo Mapa Mental',
}: MindMapFormProps) {
  const [mapTitle, setMapTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topicId, setTopicId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMapTitle('');
    setDescription('');
    setTopicId('');
    setError('');
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mapTitle.trim().length < 3) {
      setError('O título deve ter no mínimo 3 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit({
        title: mapTitle.trim(),
        description: description.trim() || undefined,
        topicId: topicId || undefined,
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
          label="Título do mapa mental"
          placeholder="Ex: Cálculo Diferencial"
          value={mapTitle}
          onChange={(e) => setMapTitle(e.target.value)}
          required
          disabled={isLoading}
        />

        <Textarea
          label="Descrição (opcional)"
          placeholder="Ex: Conceitos principais de derivadas e aplicações"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          disabled={isLoading}
        />

        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Tópico (opcional)
  </label>
  <select
    value={topicId}
    onChange={(e) => setTopicId(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
    disabled={isLoading}
  >
    <option value="">Nenhum</option>
    {Object.entries(
      topics.reduce((groups, topic) => {
        const subject = topic.subjectName || 'Sem matéria';
        if (!groups[subject]) groups[subject] = [];
        groups[subject].push(topic);
        return groups;
      }, {} as Record<string, Topic[]>)
    ).map(([subjectName, subjectTopics]) => (
      <optgroup key={subjectName} label={subjectName}>
        {subjectTopics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.name}
          </option>
        ))}
      </optgroup>
    ))}
  </select>
  {topics.length === 0 && (
    <p className="text-xs text-gray-400 mt-1">
      Nenhum tópico cadastrado ainda. Crie tópicos em Matérias.
    </p>
  )}
</div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-800">
            🧠 <strong>Dica:</strong> Após criar o mapa, você poderá adicionar nós
            para organizar conceitos hierarquicamente!
          </p>
        </div>

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
            Criar Mapa
          </Button>
        </div>
      </form>
    </Modal>
  );
}