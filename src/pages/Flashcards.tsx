import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flashcard, Subject, Topic } from '@/types';
import { flashcardService, subjectService, topicService } from '@/services';
import {
  Button,
  FlashcardCard,
  FlashcardForm,
  FlashcardStats,
  Spinner,
  Alert,
} from '@/components';
import { Plus, PlayCircle, BookOpen } from 'lucide-react';
import { getErrorMessage } from '@/utils/errorHandler';

export function Flashcards() {
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [stats, setStats] = useState({
    totalCards: 0,
    dueForReview: 0,
    newCards: 0,
    masteredCards: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [filterSubject, setFilterSubject] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [flashcardsData, subjectsData, statsData] = await Promise.all([
        flashcardService.getAll(),
        subjectService.getAll(),
        flashcardService.getStats(),
      ]);

      setFlashcards(flashcardsData);
      setSubjects(subjectsData);
      setStats(statsData);

      if (subjectsData.length > 0) {
        const allTopics = await Promise.all(
          subjectsData.map((subject) => topicService.getBySubjectId(subject.id))
        );
        setTopics(allTopics.flat());
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFlashcard = async (data: {
    front: string;
    back: string;
    subjectId?: string;
    topicId?: string;
  }) => {
    const newFlashcard = await flashcardService.create(data);
    setFlashcards([newFlashcard, ...flashcards]);
    const newStats = await flashcardService.getStats();
    setStats(newStats);
  };

  const handleUpdateFlashcard = async (data: {
    front: string;
    back: string;
    subjectId?: string;
    topicId?: string;
  }) => {
    if (!editingFlashcard) return;
    const updated = await flashcardService.update(editingFlashcard.id, {
      front: data.front,
      back: data.back,
    });
    setFlashcards(flashcards.map((f) => (f.id === editingFlashcard.id ? updated : f)));
    setEditingFlashcard(null);
  };

  const handleDeleteFlashcard = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este flashcard?')) return;

    try {
      setDeletingId(id);
      await flashcardService.delete(id);
      setFlashcards(flashcards.filter((f) => f.id !== id));
      const newStats = await flashcardService.getStats();
      setStats(newStats);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const openEditForm = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setTimeout(() => setEditingFlashcard(null), 300);
  };

  const filteredFlashcards = filterSubject
    ? flashcards.filter((f) => f.subjectId === filterSubject)
    : flashcards;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              🗂️ Meus Flashcards
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Sistema de repetição espaçada com algoritmo SM-2
            </p>
          </div>

          <div className="flex gap-3">
            {stats.dueForReview > 0 && (
              <Button
                variant="success"
                onClick={() => navigate('/flashcards/review')}
                className="flex items-center justify-center gap-2"
              >
                <PlayCircle size={20} />
                Revisar ({stats.dueForReview})
              </Button>
            )}
            <Button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-2">
              <Plus size={20} />
              Novo Flashcard
            </Button>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={loadData}>
              {error}. <button className="underline">Tentar novamente</button>
            </Alert>
          </div>
        )}

        {/* Estatísticas */}
        <div className="mb-8">
          <FlashcardStats stats={stats} />
        </div>

        {/* Filtros */}
        {subjects.length > 0 && (
          <div className="mb-6 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtrar por matéria:
            </label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todas as matérias</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Lista de flashcards */}
        {filteredFlashcards.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {filterSubject ? 'Nenhum flashcard nesta matéria' : 'Nenhum flashcard criado ainda'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Crie flashcards para começar a estudar com repetição espaçada
            </p>
            <Button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-2 mx-auto">
              <Plus size={20} />
              Criar Primeiro Flashcard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlashcards.map((flashcard) => (
              <div key={flashcard.id} className="relative">
                {deletingId === flashcard.id && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
                    <Spinner />
                  </div>
                )}
                <FlashcardCard
                  flashcard={flashcard}
                  onEdit={() => openEditForm(flashcard)}
                  onDelete={() => handleDeleteFlashcard(flashcard.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Formulário */}
        <FlashcardForm
          isOpen={showForm}
          onClose={closeForm}
          onSubmit={editingFlashcard ? handleUpdateFlashcard : handleCreateFlashcard}
          flashcard={editingFlashcard}
          subjects={subjects}
          topics={topics}
          title={editingFlashcard ? 'Editar Flashcard' : 'Novo Flashcard'}
        />
      </div>
    </div>
  );
}