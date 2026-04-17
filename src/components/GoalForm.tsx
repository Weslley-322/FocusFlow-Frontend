import { useState, useEffect } from 'react';
import { Goal } from '@/types';
import { Modal, Input, Textarea, Button, Alert } from '@/components';
import { getErrorMessage } from '@/utils/errorHandler';

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    targetMinutes: number;
    startDate: string;
    endDate: string;
  }) => Promise<void>;
  goal?: Goal | null;
  title?: string;
}

export function GoalForm({
  isOpen,
  onClose,
  onSubmit,
  goal,
  title = 'Nova Meta',
}: GoalFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'daily' as 'daily' | 'weekly' | 'monthly' | 'custom',
    targetMinutes: 120,
    startDate: '',
    endDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description || '',
        type: goal.type,
        targetMinutes: goal.targetMinutes,
        startDate: goal.startDate.split('T')[0],
        endDate: goal.endDate.split('T')[0],
      });
    } else {
      const today = new Date();
      const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      setFormData({
        title: '',
        description: '',
        type: 'daily',
        targetMinutes: 120,
        startDate,
        endDate: startDate,
      });
    }
    setError('');
  }, [goal, isOpen]);

  useEffect(() => {
    if (goal) return;
    if (!formData.startDate) return;
    if (formData.type === 'custom') return;

    const start = new Date(formData.startDate + 'T12:00:00');
    const endDate = new Date(start);

    if (formData.type === 'weekly') {
      endDate.setDate(start.getDate() + 6);
    } else if (formData.type === 'monthly') {
      endDate.setMonth(start.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);
    }

    setFormData((prev) => ({
      ...prev,
      endDate: endDate.toISOString().split('T')[0],
    }));
  }, [formData.type, formData.startDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.title.trim().length < 3) {
      setError('O título deve ter no mínimo 3 caracteres');
      return;
    }

    if (formData.targetMinutes <= 0) {
      setError('A meta de minutos deve ser maior que zero');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('A data final deve ser posterior à data inicial');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Enviando para backend:', {
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        targetMinutes: formData.targetMinutes,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert type="error">{error}</Alert>}

        <Input
          label="Título da meta"
          placeholder="Ex: Estudar 2 horas por dia"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          disabled={isLoading}
        />

        <Textarea
          label="Descrição (opcional)"
          placeholder="Ex: Focar em matemática e física"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
          disabled={isLoading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de meta
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as 'daily' | 'weekly' | 'monthly' | 'custom',
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            disabled={isLoading || !!goal}
          >
            <option value="daily">📅 Diária</option>
            <option value="weekly">📆 Semanal</option>
            <option value="monthly">🗓️ Mensal</option>
            <option value="custom">⚙️ Personalizada</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Meta de tempo
          </label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={formData.targetMinutes}
              onChange={(e) =>
                setFormData({ ...formData, targetMinutes: Number(e.target.value) })
              }
              min={1}
              required
              disabled={isLoading}
            />
            <span className="text-gray-600 dark:text-gray-400">minutos</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.targetMinutes >= 60
              ? `≈ ${Math.floor(formData.targetMinutes / 60)}h ${formData.targetMinutes % 60}min`
              : `${formData.targetMinutes} minutos`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Data de início"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
            disabled={isLoading || !!goal}
          />

          <Input
            label="Data final"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
            disabled={isLoading || !!goal || formData.type === 'weekly' || formData.type === 'monthly'}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading} fullWidth>
            {goal ? 'Salvar' : 'Criar Meta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}