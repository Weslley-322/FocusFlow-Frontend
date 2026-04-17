import { GoalStats as StatsType } from '@/types';
import { Card } from './Card';
import { Target, CheckCircle, XCircle, TrendingUp, Clock } from 'lucide-react';
import { formatMinutes } from '@/utils/goalHelpers';

interface GoalStatsProps {
  stats: StatsType;
}

export function GoalStats({ stats }: GoalStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Metas</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.totalGoals}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completadas</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completedGoals}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ativas</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.activeGoals}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Falhadas</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failedGoals}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tempo Total</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {formatMinutes(stats.totalMinutesCompleted)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}