import { Goal, GoalType, GoalStatus } from '@/types';

export function getGoalTypeLabel(type: GoalType): string {
  const labels = {
    daily: '📅 Diária',
    weekly: '📆 Semanal',
    monthly: '🗓️ Mensal',
    custom: '⚙️ Personalizada',
  };
  return labels[type];
}

export function getGoalStatusLabel(status: GoalStatus): { label: string; color: string; bgColor: string } {
  const statusMap = {
    pending: { label: '⏳ Pendente', color: 'text-gray-600', bgColor: 'bg-gray-100' },
    in_progress: { label: '🔥 Em Progresso', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    completed: { label: '✅ Completada', color: 'text-green-600', bgColor: 'bg-green-100' },
    failed: { label: '❌ Falhada', color: 'text-red-600', bgColor: 'bg-red-100' },
  };
  return statusMap[status];
}

/**
 * Formata uma string de data (ex: '2026-03-07') para o formato pt-BR
 * sem deslocamento de fuso horário (UTC-3 de Recife).
 */
export function formatDate(dateStr: string): string {
  console.log('formatDate input:', dateStr);
  const datePart = dateStr.split('T')[0];
  const date = new Date(datePart + 'T12:00:00');
  const result = date.toLocaleDateString('pt-BR');
  console.log('formatDate output:', result);
  return result;
}

/**
 * Calcula dias restantes a partir de uma string de data.
 * Usa T12:00:00 para evitar deslocamento de fuso horário.
 */
export function calculateDaysRemaining(endDate: string): number {
  const datePart = endDate.split('T')[0];
  const end = new Date(datePart + 'T12:00:00');
  const now = new Date();
  // Zera a hora do "agora" para comparar só por dia
  now.setHours(12, 0, 0, 0);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

export function getProgressColor(progress: number): string {
  if (progress >= 100) return 'bg-green-500';
  if (progress >= 75) return 'bg-blue-500';
  if (progress >= 50) return 'bg-yellow-500';
  if (progress >= 25) return 'bg-orange-500';
  return 'bg-red-500';
}

export function getProgressMessage(goal: Goal): string {
  const daysRemaining = calculateDaysRemaining(goal.endDate);

  if (goal.status === 'completed') {
    return '🎉 Meta completada! Parabéns!';
  }

  if (goal.status === 'failed') {
    return '😔 Meta não completada. Tente novamente!';
  }

  if (daysRemaining < 0) {
    return '⏰ Prazo expirado!';
  }

  if (daysRemaining === 0) {
    return '🔥 Último dia! Você consegue!';
  }

  if (daysRemaining === 1) {
    return '⚡ 1 dia restante! Falta pouco!';
  }

  if (goal.progress >= 100) {
    return '🎯 Meta atingida! Complete para finalizar!';
  }

  if (goal.progress >= 75) {
    return `💪 ${daysRemaining} dias restantes. Quase lá!`;
  }

  if (goal.progress >= 50) {
    return `🚀 ${daysRemaining} dias restantes. Continue assim!`;
  }

  return `📈 ${daysRemaining} dias restantes. Vamos lá!`;
}