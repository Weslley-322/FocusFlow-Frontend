export interface ColorOption{
    name: string;
    bg: string;
    border: string;
    text: string;
}

export const MINDMAP_COLORS: ColorOption[] = [
    // Linha 1
    { name: 'Azul', bg: '#3B82F6', border: '#2563EB', text: '#FFFFFF' },
    { name: 'Verde', bg: '#10B981', border: '059669', text: '#FFFFFF' },
    { name: 'Roxo', bg: '#8B5CF6', border: '#7C3AED', text: '#FFFFFF'},
    { name: 'Laranja', bg: '#F59E0B', border: '#D97706', text: '#FFFFFF'},

    // Linha 2
    { name: 'Vermelho', bg: '#EF4444', border: '#DC2626', text: '#FFFFFF' },
    { name: 'Rosa', bg: '#EC4899', border: '#DB2777', text: '#FFFFFF' },
    { name: 'Amarelo', bg: '#FBBF24', border: '#F59E0B', text: '#000000' },
    { name: 'Cyan', bg: '#06B6D4', border: '#0891B2', text: '#FFFFFF' },

    // Linha 3
    { name: 'Indigo', bg: '#6366F1', border: '#4F46E5', text: '#FFFFFF' },
    { name: 'Teal', bg: '#14B8A6', border: '#0D9488', text: '#FFFFFF' },
    { name: 'Lime', bg: '#84CC16', border: '#65A30D', text: '#000000' },
    { name: 'Cinza', bg: '#6B7280', border: '#4B5563', text: '#FFFFFF' },
];

export function getColorByName(name: string): ColorOption{
    return MINDMAP_COLORS.find(c => c.name === name) || MINDMAP_COLORS[0];
}

export function getColorByHex(bg: string): ColorOption{
    return MINDMAP_COLORS.find(c => c.bg === bg) || MINDMAP_COLORS[0];
}