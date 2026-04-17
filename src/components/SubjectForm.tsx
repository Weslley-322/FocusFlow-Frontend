import { useState, useEffect } from 'react';
import { Subject, CreateSubjectData } from '@/types';
import { Modal, Input, Textarea, Button, Alert } from '@/components';
import { subjectColors } from '@/utils/colors';
import { getErrorMessage } from '@/utils/errorHandler';
import { Check } from 'lucide-react';

interface SubjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubjectData) => Promise<void>;
  subject?: Subject | null;
  title?: string;
}

export function SubjectForm({
  isOpen,
  onClose,
  onSubmit,
  subject,
  title = 'Nova Matéria',
}: SubjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(subjectColors[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setDescription(subject.description || '');
      setColor(subject.color);
    } else {
      setName('');
      setDescription('');
      setColor(subjectColors[0].value);
    }
    setError('');
  }, [subject, isOpen]);

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
        color,
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
          label="Nome da matéria"
          placeholder="Ex: Matemática"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />

        <Textarea
          label="Descrição (opcional)"
          placeholder="Ex: Cálculo diferencial e integral"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          disabled={isLoading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor da matéria
          </label>
          <div className="grid grid-cols-5 gap-3">
            {subjectColors.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`h-12 rounded-lg border-2 transition-all relative ${
                  color === c.value ? 'border-gray-800 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.value }}
                disabled={isLoading}
              >
                {color === c.value && (
                  <Check size={20} className="text-white absolute inset-0 m-auto" />
                )}
              </button>
            ))}
          </div>
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
            {subject ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}