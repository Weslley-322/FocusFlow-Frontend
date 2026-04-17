import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flashcard } from '@/types';
import { flashcardService } from '@/services';
import {
  FlashcardCard,
  ReviewButtons,
  Spinner,
  Alert,
  Button,
  Card,
} from '@/components';
import { ReviewQuality } from '@/utils/reviewLabels';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { getErrorMessage } from '@/utils/errorHandler';

export function FlashcardReview() {
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState('');
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      setIsLoading(true);
      setError('');
      const cards = await flashcardService.getDueForReview();
      setFlashcards(cards);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (quality: ReviewQuality) => {
    const currentCard = flashcards[currentIndex];
    if (!currentCard || isReviewing) return;
    if (!currentCard) return;
    console.log('🔍 handleReview chamado, quality:', quality, 'isReviewing:', isReviewing);
    console.log('🔍 Revisando card:', currentCard.id);
    console.log('🔍 Quality:', quality);
    console.log('🔍 Tipo de quality:', typeof quality);

    try {
      setIsReviewing(true);
      setError('');

      const reviewData = { quality };
      console.log('🔍 Dados enviados:', reviewData);

      await flashcardService.review(currentCard.id, reviewData);

      setReviewedCount(reviewedCount + 1);

      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
      setCurrentIndex(0);
      setFlashcards([]);
    }
    } catch (err) {
      console.error('❌ Erro ao revisar:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsReviewing(false);
    }
  };

  const currentCard = flashcards[currentIndex];
  const totalCards = flashcards.length;
  const progress = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/flashcards')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Voltar para flashcards</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            🎯 Sessão de Revisão
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Use o algoritmo SM-2 para memorizar melhor
          </p>
        </div>

        {/* Erro */}
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError('')}>
              {error}
            </Alert>
          </div>
        )}

        {/* Progresso */}
        {totalCards > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progresso: {currentIndex + 1} de {totalCards}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {reviewedCount} revisados
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Card atual */}
        {currentCard ? (
          <div className="space-y-6">
            <FlashcardCard
              flashcard={currentCard}
              showAnswer={showAnswer}
              onToggleAnswer={() => setShowAnswer(!showAnswer)}
              isReviewMode
            />

            {showAnswer && (
              <div className="space-y-4">
                <p className="text-center text-gray-700 dark:text-gray-300 font-medium">
                  Como foi sua resposta?
                </p>
                <ReviewButtons onReview={handleReview} disabled={isReviewing} />
              </div>
            )}
          </div>
        ) : (
          // Revisão completa
          <Card>
            <div className="text-center py-12">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                🎉 Parabéns!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Você revisou {reviewedCount} flashcard{reviewedCount !== 1 ? 's' : ''}!
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  O algoritmo SM-2 calculou automaticamente quando você deve revisar cada card novamente.
                </p>
                <Button onClick={() => navigate('/flashcards')} size="lg">
                  Voltar para Flashcards
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Informação sobre o algoritmo */}
        {currentCard && (
          <div className="mt-8">
            <Card>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  💡 Como funciona o algoritmo SM-2:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li><strong>Novamente:</strong> Volta para 1 dia</li>
                  <li><strong>Difícil:</strong> Intervalo menor, revisão mais frequente</li>
                  <li><strong>Bom:</strong> Intervalo aumenta moderadamente</li>
                  <li><strong>Fácil:</strong> Intervalo aumenta muito, revisão mais espaçada</li>
                </ul>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}