export const reviewQualityLabels = {
    0:{
        label: 'Novamente',
        emoji: '❌',
        description: 'Não lembrei de nada',
        color: 'bg-red-500 hover:bg-red-600',
        textColor: 'text-red-600',
    },

    1:{
        label: 'Difícil',
        emoji: '😥',
        description: 'Lembrei com muita dificuldade',
        color: 'bg-orange-500 hover:bg-orange-600',
        textColor: 'text-orange-600',
    },

    2:{
        label: 'Bom',
        emoji: '☺️',
        description: 'Lembrei após pensar',
        color: 'bg-blue-500 hover:bg-blue-600',
        textColor: 'text-blue-600',
    },

    3:{
        label: 'Fácil',
        emoji: '🥳',
        description: 'Lembrei perfeitamente',
        color: 'bg-green-500 hover:bg-green-600',
        textColor: 'text-green-600',
    },
};

export type ReviewQuality = 0 | 1 | 2 | 3;