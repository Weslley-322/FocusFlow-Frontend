import { useAuthStore } from '@/store';
import { StatCard, QuickActions, Spinner, Alert } from '@/components';
import { useStats } from '@/hooks/useStats';
import {
  Clock,
  BookOpen,
  Target,
  FolderOpen,
  TrendingUp,
  Award,
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuthStore();
  const { stats, refetch } = useStats();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (stats.isLoading) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Bem-vindo(a) de volta, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Aqui está o resumo dos seus estudos
          </p>
        </div>

        {/* Erro ao carregar */}
        {stats.error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => refetch()}>
              {stats.error}. <button className="underline">Tentar novamente</button>
            </Alert>
          </div>
        )}

        {/* Estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Clock size={24} />}
            label="Tempo Estudado"
            value={formatTime(stats.pomodoro.totalMinutes)}
            subtext={`${stats.pomodoro.completedSessions} sessões completadas`}
            color="blue"
          />
          <StatCard
            icon={<BookOpen size={24} />}
            label="Flashcards"
            value={stats.flashcards.dueForReview}
            subtext={`${stats.flashcards.totalCards} cards no total`}
            color="green"
          />
          <StatCard
            icon={<Target size={24} />}
            label="Metas Ativas"
            value={stats.goals.activeGoals}
            subtext={`${stats.goals.completionRate}% de conclusão`}
            color="purple"
          />
          <StatCard
            icon={<FolderOpen size={24} />}
            label="Matérias"
            value={stats.subjects.activeSubjects}
            subtext={`${stats.subjects.totalSubjects} no total`}
            color="orange"
          />
        </div>

        {/* Cards detalhados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pomodoro Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                ⏱️ Sessões Pomodoro
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total de sessões:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {stats.pomodoro.totalSessions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completadas:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {stats.pomodoro.completedSessions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tempo total:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {formatTime(stats.pomodoro.totalMinutes)}
                </span>
              </div>
            </div>
          </div>

          {/* Flashcards Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                🗂️ Flashcards
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total de cards:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {stats.flashcards.totalCards}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Para revisar hoje:</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {stats.flashcards.dueForReview}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Novos:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {stats.flashcards.newCards}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Dominados:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {stats.flashcards.masteredCards}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<TrendingUp size={24} />}
            label="Taxa de Conclusão"
            value={`${stats.goals.completionRate}%`}
            subtext="De metas completadas"
            color="green"
          />
          <StatCard
            icon={<Award size={24} />}
            label="Metas Concluídas"
            value={stats.goals.completedGoals}
            subtext={`De ${stats.goals.totalGoals} metas totais`}
            color="purple"
          />
          <StatCard
            icon={<Target size={24} />}
            label="Cards Dominados"
            value={stats.flashcards.masteredCards}
            subtext="Flashcards memorizados"
            color="orange"
          />
        </div>

        {/* Ações Rápidas */}
        <QuickActions />

        {/* Mensagem motivacional */}
        {stats.pomodoro.completedSessions === 0 && stats.flashcards.totalCards === 0 && (
          <div className="mt-8 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6 text-center">
            <p className="text-primary-800 dark:text-primary-300 font-medium mb-2">
              🎯 Pronto para começar sua jornada de estudos?
            </p>
            <p className="text-primary-600 dark:text-primary-400 text-sm">
              Comece criando suas matérias e organizando seus tópicos de estudo!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}