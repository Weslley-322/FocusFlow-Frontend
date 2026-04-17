import { Goal } from '@/types';
import { Card } from './Card';
import { GoalProgress } from './GoalProgress';
import { getGoalTypeLabel, getGoalStatusLabel, calculateDaysRemaining, formatDate } from '@/utils/goalHelpers';
import { MoreVertical, Edit, Trash2, TrendingUp, Calendar, Target } from 'lucide-react';
import { useState } from 'react';

interface GoalCardProps {
  goal: Goal;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddProgress?: () => void;
}

export function GoalCard({ goal, onEdit, onDelete, onAddProgress }: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const statusInfo = getGoalStatusLabel(goal.status);
  const daysRemaining = calculateDaysRemaining(goal.endDate);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      {/* Linha superior: badge de status + menu */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 ${statusInfo.bgColor} ${statusInfo.color} text-xs font-medium rounded-full`}>
          {statusInfo.label}
        </span>

        {/* Menu de ações */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                {goal.status !== 'completed' && goal.status !== 'failed' && onAddProgress && (
                  <button
                    onClick={() => { setShowMenu(false); onAddProgress(); }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-gray-700 dark:text-gray-300"
                  >
                    <TrendingUp size={16} />
                    <span>Adicionar Progresso</span>
                  </button>
                )}
                <button
                  onClick={() => { setShowMenu(false); onEdit?.(); }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-gray-700 dark:text-gray-300"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => { setShowMenu(false); onDelete?.(); }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-left"
                >
                  <Trash2 size={16} />
                  <span>Excluir</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex items-start gap-3 mb-4">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
          <Target size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-1">
            {goal.title}
          </h3>
          {goal.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
          )}
        </div>
      </div>

      {/* Progresso */}
      <GoalProgress goal={goal} />

      {/* Informações adicionais */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span className="font-medium">Tipo:</span>
          <span>{getGoalTypeLabel(goal.type)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span className="font-medium">Período:</span>
          <span>{formatDate(goal.startDate)} até {formatDate(goal.endDate)}</span>
        </div>

        {daysRemaining >= 0 && goal.status !== 'completed' && goal.status !== 'failed' && (
          <div className="flex items-center gap-2">
            <span className="font-medium">⏰ Dias restantes:</span>
            <span className="font-bold text-primary-600 dark:text-primary-400">{daysRemaining}</span>
          </div>
        )}
      </div>
    </Card>
  );
}