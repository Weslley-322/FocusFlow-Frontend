import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import {
  Clock,
  BookOpen,
  Brain,
  Target,
  FolderOpen,
} from 'lucide-react';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <Clock size={24} />,
      label: 'Iniciar Pomodoro',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/pomodoro'),
    },
    {
      icon: <BookOpen size={24} />,
      label: 'Estudar Flashcards',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => navigate('/flashcards'),
    },
    {
      icon: <Brain size={24} />,
      label: 'Mapas Mentais',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/mindmaps'),
    },
    
    {
      icon: <Target size={24} />,
      label: 'Ver Metas',
      color: 'bg-red-500 hover:bg-red-600',
      onClick: () => navigate('/goals'),
    },
    {
      icon: <FolderOpen size={24} />,
      label: 'Minhas Matérias',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: () => navigate('/subjects'),
    },
  ];

  return (
    <Card title="🚀 Ações Rápidas">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center gap-2`}
          >
            {action.icon}
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}