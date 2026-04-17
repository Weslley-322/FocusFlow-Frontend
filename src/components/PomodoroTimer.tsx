import { usePomodoroStore } from '@/store';

export function PomodoroTimer() {
  const { timeLeft, duration, isBreak, isRunning } = usePomodoroStore();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalSeconds = duration * 60;
  const percentage = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg width="280" height="280" className="transform -rotate-90">
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            className="dark:stroke-gray-700"
            strokeWidth="12"
          />
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke={isBreak ? '#10B981' : '#3B82F6'}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold text-gray-800 dark:text-gray-100 font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            {isBreak ? '☕ Pausa' : isRunning ? '🎯 Foco!' : '⏱️ Pomodoro'}
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        {!isRunning && <p className="text-gray-500 dark:text-gray-400">Configure e inicie seu timer</p>}
        {isRunning && !isBreak && <p className="text-blue-600 dark:text-blue-400 font-medium">Mantenha o foco! 💪</p>}
        {isBreak && <p className="text-green-600 dark:text-green-400 font-medium">Aproveite sua pausa! Você merece! 🎉</p>}
      </div>
    </div>
  );
}