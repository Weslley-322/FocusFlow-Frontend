import { Topic } from "@/types";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface TopicItemProps {
  topic: Topic;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TopicItem({ topic, onEdit, onDelete }: TopicItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 dark:text-gray-100">{topic.name}</h4>
          {topic.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{topic.description}</p>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Criado em {new Date(topic.createdAt).toLocaleDateString('pt-br')}
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
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
    </div>
  );
}