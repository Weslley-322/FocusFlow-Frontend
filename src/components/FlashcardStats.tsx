import { FlashcardStats as StatsType } from '@/types';
import { Card } from './Card';
import { BookOpen, Clock, Sparkles, Award } from 'lucide-react';

interface FlashcardStatsProps {
  stats: StatsType;
}

export function FlashcardStats({ stats }: FlashcardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Cards</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.totalCards}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Para Revisar Hoje</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.dueForReview}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Cards Novos</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.newCards}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Dominados</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.masteredCards}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}