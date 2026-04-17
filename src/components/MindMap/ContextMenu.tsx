import { useEffect, useRef } from 'react';
import { Trash2, Palette } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete?: () => void;
  onChangeColor?: () => void;
  showColorOption?: boolean;
}

export function ContextMenu({
  x,
  y,
  onClose,
  onDelete,
  onChangeColor,
  showColorOption = true,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 1000,
      }}
      className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
    >
      {showColorOption && onChangeColor && (
        <button
          onClick={() => {
            onChangeColor();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-left text-sm text-gray-700"
        >
          <Palette size={16} />
          <span>Mudar Cor</span>
        </button>
      )}

      {onDelete && (
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-left text-sm text-red-600"
        >
          <Trash2 size={16} />
          <span>Deletar</span>
        </button>
      )}
    </div>
  );
}