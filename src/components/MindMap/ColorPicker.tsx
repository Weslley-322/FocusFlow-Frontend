import { MINDMAP_COLORS, ColorOption } from '@/utils/mindMapColors';

interface ColorPickerProps {
  currentColor: string;
  onColorSelect: (color: ColorOption) => void;
}

export function ColorPicker({ currentColor, onColorSelect }: ColorPickerProps) {
  return (
    <div className="p-3">
      <p className="text-xs text-gray-600 mb-2 font-medium">Escolha uma cor:</p>
      <div className="grid grid-cols-4 gap-2">
        {MINDMAP_COLORS.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorSelect(color)}
            className="group relative"
            title={color.name}
          >
            <div
              style={{
                backgroundColor: color.bg,
                borderColor: color.border,
              }}
              className={`w-8 h-8 rounded border-2 transition-transform hover:scale-110 ${
                currentColor === color.bg ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            />
            {currentColor === color.bg && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}