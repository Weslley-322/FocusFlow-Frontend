import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Subject, Topic, CreateTopicData, UpdateTopicData } from '@/types';
import { useSubjectStore } from '@/store';
import { subjectService, topicService } from '@/services';
import {
  Button,
  TopicItem,
  TopicForm,
  Spinner,
  Alert,
  Card,
} from '@/components';
import { ArrowLeft, Plus, BookOpen } from 'lucide-react';
import { getErrorMessage } from '@/utils/errorHandler';

export function SubjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchSubjects } = useSubjectStore();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [subjectData, topicsData] = await Promise.all([
        subjectService.getById(id!),
        topicService.getBySubjectId(id!),
      ]);

      setSubject(subjectData);
      setTopics(topicsData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTopic = async (data: CreateTopicData) => {
    const newTopic = await topicService.create(data);
    setTopics([...topics, newTopic]);
    await fetchSubjects();
  };

  const handleUpdateTopic = async (data: UpdateTopicData) => {
    if (!editingTopic) return;
    const updated = await topicService.update(editingTopic.id, data);
    setTopics(topics.map((t) => (t.id === editingTopic.id ? updated : t)));
    setEditingTopic(null);
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este tópico?')) return;

    try {
      setDeletingId(topicId);
      await topicService.delete(topicId);
      setTopics(topics.filter((t) => t.id !== topicId));
      await fetchSubjects();
      console.log('subjects no store após fetchSubjects:', useSubjectStore.getState().subjects);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const openEditForm = (topic: Topic) => {
    setEditingTopic(topic);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setTimeout(() => setEditingTopic(null), 300);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="p-8">
        <Alert type="error">Matéria não encontrada</Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/subjects')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Voltar para matérias</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: `${subject.color}20` }}>
              <BookOpen size={32} style={{ color: subject.color }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{subject.name}</h1>
              {subject.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">{subject.description}</p>
              )}
            </div>
          </div>

          <Button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-2">
            <Plus size={20} />
            Novo Tópico
          </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Tópicos</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{topics.length}</p>
          </Card>

          <Card>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tópicos Ativos</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {topics.filter((t) => t.isActive).length}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-gray-600 dark:text-gray-400">Cor da Matéria</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded" style={{ backgroundColor: subject.color }} />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{subject.color}</span>
            </div>
          </Card>
        </div>

        {/* Lista de tópicos */}
        {topics.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nenhum tópico criado ainda
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Adicione tópicos para organizar o conteúdo desta matéria
              </p>
              <Button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-2 mx-auto">
                <Plus size={20} />
                Criar Primeiro Tópico
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              📖 Tópicos ({topics.length})
            </h2>
            {topics.map((topic) => (
              <div key={topic.id} className="relative">
                {deletingId === topic.id && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <Spinner />
                  </div>
                )}
                <TopicItem
                  topic={topic}
                  onEdit={() => openEditForm(topic)}
                  onDelete={() => handleDeleteTopic(topic.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Formulário */}
        <TopicForm
          isOpen={showForm}
          onClose={closeForm}
          onSubmit={editingTopic ? handleUpdateTopic : handleCreateTopic}
          topic={editingTopic}
          subjectId={id!}
          title={editingTopic ? 'Editar Tópico' : 'Novo Tópico'}
        />
      </div>
    </div>
  );
}