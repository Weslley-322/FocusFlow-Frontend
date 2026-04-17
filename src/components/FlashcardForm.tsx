import { useState, useEffect } from 'react';
import { Flashcard, Subject, Topic } from '@/types';
import { Modal, Textarea, Button, Alert } from '@/components';
import { getErrorMessage } from '@/utils/errorHandler';

interface FlashcardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    front: string;
    back: string;
    subjectId?: string;
    topicId?: string;
  }) => Promise<void>;
  flashcard?: Flashcard | null;
  subjects?: Subject[];
  topics?: Topic[];
  title?: string;
}

export function FlashcardForm({
  isOpen,
  onClose,
  onSubmit,
  flashcard,
  subjects = [],
  topics = [],
  title = 'Novo Flashcard',
}: FlashcardFormProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (flashcard) {
      setFront(flashcard.front);
      setBack(flashcard.back);
      setSubjectId(flashcard.subjectId || '');
      setTopicId(flashcard.topicId || '');
    } else {
      setFront('');
      setBack('');
      setSubjectId('');
      setTopicId('');
    }
    setError('');
  }, [flashcard, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (front.trim().length < 2) {
      setError('A frente do card deve ter no mínimo 2 caracteres');
      return;
    }

    if (back.trim().length < 2) {
      setError('O verso do card deve ter no mínimo 2 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit({
        front: front.trim(),
        back: back.trim(),
        subjectId: subjectId || undefined,
        topicId: topicId || undefined,
      });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTopics = subjectId
    ? topics.filter((t) => t.subjectId === subjectId)
    : topics;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert type="error">{error}</Alert>}

        <Textarea
          label="Frente do card (pergunta)"
          placeholder="Ex: O que é uma derivada?"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          required
          rows={3}
          disabled={isLoading}
        />

        <Textarea
          label="Verso do card (resposta)"
          placeholder="Ex: Taxa de variação instantânea de uma função..."
          value={back}
          onChange={(e) => setBack(e.target.value)}
          required
          rows={4}
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Matéria (opcional)
            </label>
            <select
              value={subjectId}
              onChange={(e) => { setSubjectId(e.target.value); setTopicId(''); }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            >
              <option value="">Nenhuma</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tópico (opcional)
            </label>
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              disabled={isLoading || !subjectId}
            >
              <option value="">Nenhum</option>
              {filteredTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading} fullWidth>
            {flashcard ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}