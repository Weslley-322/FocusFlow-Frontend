import { Goal } from '@/types';
import { formatMinutes, getProgressColor, getProgressMessage } from '@/utils/goalHelpers';

interface GoalProgressProps {
    goal: Goal;
}

export function GoalProgress({ goal }: GoalProgressProps){
    const progressColor = getProgressColor(goal.progress);
    const message = getProgressMessage(goal);

    return (
        <div className="space-y-3">
            {/* Barra de progresso */}
            <div className="relative">
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">
                        { formatMinutes(goal.currentMinutes)} de {formatMinutes(goal.targetMinutes)}
                    </span>
                    <span className="font-bold text-gray-800">{goal.progress.toFixed(0)}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-4 rounded-full transition-all duration-500 ease-out ${progressColor}`}
                      style={{ width: `${Math.min(goal.progress, 100)}%`}}
                    >
                        {goal.progress >= 15 && (
                            <div className="h-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">
                                    {goal.progress.toFixed(0)}%
                                </span>
                    </div>
                    )}
                </div>
            </div>
        </div>

        <p className="text-sm text-gray-600 text-center">{message}</p>
    </div>
    );
}