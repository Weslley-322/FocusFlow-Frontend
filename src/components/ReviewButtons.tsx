import { reviewQualityLabels, ReviewQuality } from '@/utils/reviewLabels';

interface ReviewButtonsProps {
  onReview: (quality: ReviewQuality) => void;
  disabled?: boolean;
}

export function ReviewButtons({ onReview, disabled = false }: ReviewButtonsProps) {
  const qualities: ReviewQuality[] = [0, 1, 2, 3];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {qualities.map((quality) => {
        const info = reviewQualityLabels[quality];
        return (
          <button
            key={quality}
            onClick={() => onReview(quality)}
            disabled={disabled}
            className={`${info.color} text-white p-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2`}
          >
            <span className="text-3xl">{info.emoji}</span>
            <span className="font-semibold">{info.label}</span>
            <span className="text-xs opacity-90">{info.description}</span>
          </button>
        );
      })}
    </div>
  );
}