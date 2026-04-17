import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Subject, CreateSubjectData, UpdateSubjectData } from '@/types';
import { subjectService } from '@/services';
import { useSubjectStore } from '@/store';
import {
  Button,
  SubjectCard,
  SubjectForm,
  Spinner,
  Alert,
} from '@/components';
import { Plus, FolderOpen } from 'lucide-react';
import { getErrorMessage } from '@/utils/errorHandler';

export function Subjects() {
  const navigate = useNavigate();
  const { subjects, fetchSubjects, addSubject, updateSubject, removeSubject } = useSubjectStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setIsLoading(true);
      setError('');
      await fetchSubjects();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubject = async (data: CreateSubjectData) => {
    const newSubject = await subjectService.create(data);
    addSubject(newSubject);
  };

  const handleUpdateSubject = async (data: UpdateSubjectData) => {
    if (!editingSubject) return;
    const updated = await subjectService.update(editingSubject.id, data);
    updateSubject(editingSubject.id, updated);
    setEditingSubject(null);
  };

  const handleDeleteSubject = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta matéria?')) return;

    try {
      setDeletingId(id);
      await subjectService.delete(id);
      removeSubject(id);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const openEditForm = (subject: Subject) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setTimeout(() => setEditingSubject(null), 300);
  };

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
              📚 Minhas Matérias
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organize seus tópicos de estudo por matéria
            </p>
          </div>

          <Button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-2">
            <Plus size={20} />
            Nova Matéria
          </Button>
        </div>

        {/* Erro */}
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={loadSubjects}>
              {error}. <button className="underline">Tentar novamente</button>
            </Alert>
          </div>
        )}

        {/* Lista de matérias */}
        {subjects.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nenhuma matéria criada ainda
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Comece criando sua primeira matéria para organizar seus estudos
            </p>
            <Button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-2 mx-auto">
              <Plus size={20} />
              Criar Primeira Matéria
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div key={subject.id} className="relative">
                {deletingId === subject.id && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <Spinner />
                  </div>
                )}
                <SubjectCard
                  subject={subject}
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                  onEdit={() => openEditForm(subject)}
                  onDelete={() => handleDeleteSubject(subject.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Formulário */}
        <SubjectForm
          isOpen={showForm}
          onClose={closeForm}
          onSubmit={editingSubject ? handleUpdateSubject : handleCreateSubject}
          subject={editingSubject}
          title={editingSubject ? 'Editar Matéria' : 'Nova Matéria'}
        />
      </div>
    </div>
  );
}