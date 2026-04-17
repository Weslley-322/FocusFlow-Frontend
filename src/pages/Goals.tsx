import { useState, useEffect } from 'react';
import { Goal } from '@/types';
import { goalService } from '@/services';
import {
  Button,
  GoalCard,
  GoalForm,
  GoalStats,
  Spinner,
  Alert,
  Modal,
  Input,
} from '@/components';
import { Plus, Target } from 'lucide-react';
import { getErrorMessage } from '@/utils/errorHandler';

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    failedGoals: 0,
    activeGoals: 0,
    totalMinutesCompleted: 0,
    completionRate: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressGoalId, setProgressGoalId] = useState<string | null>(null);
  const [minutesToAdd, setMinutesToAdd] = useState(30);
  const [isAddingProgress, setIsAddingProgress] = useState(false);

  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'failed'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [goalsData, statsData] = await Promise.all([
        goalService.getAll(),
        goalService.getStats(),
      ]);

      setGoals(goalsData);
      setStats(statsData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoal = async (data: {
    title: string;
    description?: string;
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    targetMinutes: number;
    startDate: string;
    endDate: string;
  }) => {
    const newGoal = await goalService.create(data);
    setGoals([newGoal, ...goals]);
    const newStats = await goalService.getStats();
    setStats(newStats);
  };

  const handleUpdateGoal = async (data: {
    title: string;
    description?: string;
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    targetMinutes: number;
    startDate: string;
    endDate: string;
  }) => {
    if (!editingGoal) return;

    const updateData = {
      title: data.title,
      description: data.description,
      targetMinutes: data.targetMinutes,
    };

    const updated = await goalService.update(editingGoal.id, updateData);
    setGoals(goals.map((g) => (g.id === editingGoal.id ? updated : g)));
    setEditingGoal(null);
    const newStats = await goalService.getStats();
    setStats(newStats);
  };

  const handleDeleteGoal = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta meta?')) return;

    try {
      setDeletingId(id);
      await goalService.delete(id);
      setGoals(goals.filter((g) => g.id !== id));
      const newStats = await goalService.getStats();
      setStats(newStats);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const openEditForm = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setTimeout(() => setEditingGoal(null), 300);
  };

  const openProgressModal = (goalId: string) => {
    setProgressGoalId(goalId);
    setShowProgressModal(true);
  };

  const handleAddProgress = async () => {
    if (!progressGoalId) return;

    try {
      setIsAddingProgress(true);
      const updated = await goalService.updateProgress(progressGoalId, { minutesToAdd });

      setGoals(goals.map((g) => (g.id === progressGoalId ? updated : g)));
      setShowProgressModal(false);
      setProgressGoalId(null);
      setMinutesToAdd(30);

      const newStats = await goalService.getStats();
      setStats(newStats);

      if (updated.status === 'completed') {
        alert('🎉 Parabéns! Meta completada!');
      }
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setIsAddingProgress(false);
    }
  };

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'all') return true;
    if (filter === 'active') return goal.status === 'pending' || goal.status === 'in_progress';
    return goal.status === filter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">🎯 Minhas Metas</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Acompanhe seu progresso e conquiste seus objetivos!
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-2">
            <Plus size={20} className="mr-2" />
            Nova Meta
          </Button>
        </div>

        {/* Erro */}
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={loadData}>
              {error}. <button className="underline">Tentar novamente</button>
            </Alert>
          </div>
        )}

        {/* Estatísticas */}
        <div className="mb-8">
          <GoalStats stats={stats} />
        </div>

        {/* Taxa de conclusão */}
        {stats.totalGoals > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Taxa de Conclusão</p>
                  <p className="text-4xl font-bold">{stats.completionRate.toFixed(1)}%</p>
                </div>
                <div className="text-6xl">🏆</div>
              </div>
              <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Ativas ({stats.activeGoals})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Completadas ({stats.completedGoals})
          </button>
          <button
            onClick={() => setFilter('failed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'failed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Falhadas ({stats.failedGoals})
          </button>
        </div>

        {/* Lista de metas */}
        {filteredGoals.length === 0 ? (
          <div className="text-center py-16">
            <Target size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {filter === 'all'
                ? 'Nenhuma meta criada ainda'
                : `Nenhuma meta ${filter === 'active' ? 'ativa' : filter === 'completed' ? 'completada' : 'falhada'}`}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Crie metas para acompanhar seu progresso nos estudos
            </p>
            <Button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-1 mx-auto">
              <Plus size={20} className="mr-2" />
              Criar Primeira Meta
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => (
              <div key={goal.id} className="relative">
                {deletingId === goal.id && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <Spinner />
                  </div>
                )}
                <GoalCard
                  goal={goal}
                  onEdit={() => openEditForm(goal)}
                  onDelete={() => handleDeleteGoal(goal.id)}
                  onAddProgress={() => openProgressModal(goal.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Formulário de meta */}
        <GoalForm
          isOpen={showForm}
          onClose={closeForm}
          onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
          goal={editingGoal}
          title={editingGoal ? 'Editar Meta' : 'Nova Meta'}
        />

        {/* Modal de progresso */}
        <Modal
          isOpen={showProgressModal}
          onClose={() => { setShowProgressModal(false); setProgressGoalId(null); }}
          title="➕ Adicionar Progresso"
        >
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Quanto tempo você estudou? Adicione os minutos ao progresso da sua meta!
            </p>

            <Input
              label="Minutos estudados"
              type="number"
              value={minutesToAdd}
              onChange={(e) => setMinutesToAdd(Number(e.target.value))}
              min={1}
              disabled={isAddingProgress}
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>Dica:</strong> Você também pode adicionar progresso automaticamente ao completar sessões Pomodoro!
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => { setShowProgressModal(false); setProgressGoalId(null); }}
                disabled={isAddingProgress}
                fullWidth
              >
                Cancelar
              </Button>
              <Button onClick={handleAddProgress} isLoading={isAddingProgress} fullWidth>
                Adicionar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}