import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Topic } from '@/types';
import { mindMapService, topicService, subjectService } from '@/services';
import {
  Button,
  MindMapCard,
  MindMapForm,
  MindMapCanvas,
  NodeForm,
  Spinner,
  Alert,
  Card,
} from '@/components';
import { Plus, Network, ArrowLeft } from 'lucide-react';
import { getErrorMessage } from '@/utils/errorHandler';
import { ColorOption } from '@/utils/mindMapColors';

interface MindMap {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  topicName?: string;
  topicId?: string;
  nodesCount?: number;
}

interface MindMapNode {
  id: string;
  content: string;
  level: number;
  parentId?: string;
  positionX: number;
  positionY: number;
  mindMapId: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export function MindMaps() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mapIdParam = searchParams.get('map');

  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentMap, setCurrentMap] = useState<MindMap | null>(null);
  const [nodes, setNodes] = useState<MindMapNode[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showMapForm, setShowMapForm] = useState(false);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [editingNode, setEditingNode] = useState<MindMapNode | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (mapIdParam && mindMaps.length > 0) {
      const map = mindMaps.find((m) => m.id === mapIdParam);
      if (map) {
        loadMapDetails(map);
      }
    }
  }, [mapIdParam, mindMaps]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [mapsData, subjectsData] = await Promise.all([
        mindMapService.getAll(),
        subjectService.getAll(),
      ]);

      const typedMaps: MindMap[] = mapsData.map((map) => ({
        id: map.id,
        title: map.title,
        description: map.description,
        createdAt: map.createdAt,
        topicName: map.topicName,
        nodesCount: map.nodesCount,
      }));

      setMindMaps(typedMaps);

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

  const loadMapDetails = async (map: MindMap) => {
    try {
      console.log('🔍 Carregando detalhes do mapa:', map.id);
      const nodesData = await mindMapService.getNodes(map.id);
      console.log('✅ Nós carregados:', nodesData);
      setNodes(nodesData);
      setCurrentMap(map);
    } catch (err) {
      console.error('❌ Erro ao carregar nós:', err);
      setError(getErrorMessage(err));
    }
  };

  const handleCreateMap = async (data: { title: string; description?: string; topicId?: string }) => {
    const newMap = await mindMapService.create(data);
    const typedMap: MindMap = {
      id: newMap.id,
      title: newMap.title,
      description: newMap.description,
      createdAt: newMap.createdAt,
      topicName: newMap.topicName,
      topicId: newMap.topicId,
      nodesCount: 0,
    };
    setMindMaps([typedMap, ...mindMaps]);
    navigate(`/mindmaps?map=${newMap.id}`);
    loadMapDetails(typedMap);
  };

  const handleDeleteMap = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este mapa mental?')) return;

    try {
      setDeletingId(id);
      await mindMapService.delete(id);
      setMindMaps(mindMaps.filter((m) => m.id !== id));

      if (currentMap?.id === id) {
        setCurrentMap(null);
        setNodes([]);
        navigate('/mindmaps');
      }
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateNode = async (data: { content: string; parentId?: string }) => {
    if (!currentMap) return;

    console.log('Criando nó:', data);

    const newNode = await mindMapService.createNode(currentMap.id, data);
    console.log('Nó criado:', newNode);
    const typedNode: MindMapNode = {
      id: newNode.id,
      content: newNode.content,
      level: newNode.level,
      parentId: newNode.parentId,
      positionX: newNode.positionX,
      positionY: newNode.positionY,
      mindMapId: newNode.mindMapId,
    };
    setNodes([...nodes, typedNode]);
    console.log('Nodes atualizados:', [...nodes, typedNode]);
  };

  const handleUpdateNode = async (data: { content: string }) => {
    if (!editingNode) return;

    const updated = await mindMapService.updateNode(editingNode.id, data);
    const typedNode: MindMapNode = {
      id: updated.id,
      content: updated.content,
      level: updated.level,
      parentId: updated.parentId,
      positionX: updated.positionX,
      positionY: updated.positionY,
      mindMapId: updated.mindMapId,
    };
    setNodes(nodes.map((n) => (n.id === editingNode.id ? typedNode : n)));
    setEditingNode(null);
  };

  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setEditingNode(node);
      setShowNodeForm(true);
    }
  };

  const handleNodesPositionChange = async (nodeId: string, x: number, y: number) => {
    try {
      console.log('💾 [FRONTEND] Tentando salvar posição:', { nodeId, x, y });
      const result = await mindMapService.updateNodePosition(nodeId, { positionX: x, positionY: y });
      console.log('✅ [FRONTEND] Resposta do backend:', result);
      setNodes(nodes.map((n) => (n.id === nodeId ? { ...n, positionX: x, positionY: y } : n)));
      console.log('✅ [FRONTEND] Estado atualizado localmente');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('❌ [FRONTEND] Erro completo:' + err);
      alert('Erro ao salvar posição: ' + errorMessage);
    }
  };

  const handleConnect = async (
    childId: string,
    parentId: string,
    sourceHandle?: string,
    targetHandle?: string,
  ) => {
    console.log('🔗 childId:', childId);
    console.log('🔗 parentId:', parentId);
    console.log('🔗 sourceHandle:', sourceHandle);
    console.log('🔗 targetHandle:', targetHandle);
    try {
      console.log('🔗 [FRONTEND] Conectando:', { childId, parentId, sourceHandle, targetHandle });
      await mindMapService.updateNode(childId, { parentId, sourceHandle, targetHandle });
      console.log('✅ [FRONTEND] Conexão salva!');
      const updatedNodes = await mindMapService.getNodes(currentMap!.id);
      setNodes(updatedNodes);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('❌ [FRONTEND] Erro ao conectar:', err);
      alert('Erro ao conectar nós: ' + errorMessage);
    }
  };

  const handleNodeEdit = async (nodeId: string, newContent: string) => {
    try {
      console.log('✏️ [FRONTEND] Editando nó:', { nodeId, newContent });
      await mindMapService.updateNode(nodeId, { content: newContent });
      console.log('✅ [FRONTEND] Nó editado!');
      setNodes(nodes.map((n) => (n.id === nodeId ? { ...n, content: newContent } : n)));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('❌ [FRONTEND] Erro ao editar:', err);
      alert('Erro ao editar nó: ' + errorMessage);
    }
  };

  const handleNodeColorChange = async (nodeId: string, color: ColorOption) => {
    try {
      console.log('🎨 [FRONTEND] ========== INÍCIO ==========');
      console.log('🎨 [FRONTEND] NodeId:', nodeId);
      console.log('🎨 [FRONTEND] Color:', color);

      const node = nodes.find((n) => n.id === nodeId);
      console.log('🔍 [FRONTEND] Nó encontrado:', node);

      if (!node) {
        throw new Error('Nó não encontrado no estado!');
      }

      const payload = { backgroundColor: color.bg, textColor: color.text };
      console.log('📦 [FRONTEND] Payload:', payload);

      const result = await mindMapService.updateNode(nodeId, payload);
      console.log('✅ [FRONTEND] Sucesso:', result);

      setNodes(nodes.map((n) => (n.id === nodeId ? { ...n, backgroundColor: color.bg, textColor: color.text } : n)));
      console.log('🎨 [FRONTEND] ========== FIM ==========');
    } catch (err) {
      console.error('❌ [FRONTEND] ========== ERRO ==========');
      console.error('❌ [FRONTEND] Erro:', err);

      if (err && typeof err === 'object') {
        const error = err as { response?: { data?: unknown; status?: number } };
        if (error.response) {
          console.error('❌ [FRONTEND] Status:', error.response.status);
          console.error('❌ [FRONTEND] Data:', error.response.data);
        }
      }

      const errorMessage = getErrorMessage(err);
      alert('Erro ao mudar cor: ' + errorMessage);
    }
  };

  const handleNodeDelete = async (nodeId: string) => {
    try {
      console.log('🗑️ [FRONTEND] Deletando nó:', nodeId);
      await mindMapService.deleteNode(nodeId);
      console.log('✅ [FRONTEND] Nó deletado!');
      setNodes(nodes.filter((n) => n.id !== nodeId));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('❌ [FRONTEND] Erro ao deletar:', err);
      alert('Erro ao deletar nó: ' + errorMessage);
    }
  };

  const handleEdgeDelete = async (childId: string) => {
    try {
      console.log('✂️ [FRONTEND] Removendo conexão do nó:', childId);
      await mindMapService.updateNode(childId, { parentId: null });
      console.log('✅ [FRONTEND] Conexão removida!');
      setNodes(nodes.map((n) => (n.id === childId ? { ...n, parentId: undefined, level: 0 } : n)));
      const updatedNodes = await mindMapService.getNodes(currentMap!.id);
      setNodes(updatedNodes);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('❌ [FRONTEND] Erro ao remover conexão:', err);
      alert('Erro ao remover conexão: ' + errorMessage);
    }
  };

  const handleBackToList = () => {
    setCurrentMap(null);
    setNodes([]);
    navigate('/mindmaps');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Vista de edição de mapa
  if (currentMap) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Voltar */}
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Voltar para mapas</span>
          </button>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {currentMap.title}
              </h1>
              {currentMap.description && (
                <p className="text-gray-600 dark:text-gray-400">{currentMap.description}</p>
              )}
              {currentMap.topicName && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  📖 {currentMap.topicName}
                </p>
              )}
            </div>

            <Button onClick={() => setShowNodeForm(true)}>
              <Plus size={20} className="mr-2" />
              Adicionar Nó
            </Button>
          </div>

          {/* Canvas */}
          <div className="mb-8">
            <MindMapCanvas
              nodes={nodes}
              onNodeClick={handleNodeClick}
              onNodesPositionChange={handleNodesPositionChange}
              onConnect={handleConnect}
              onNodeEdit={handleNodeEdit}
              onNodeColorChange={handleNodeColorChange}
              onNodeDelete={handleNodeDelete}
              onEdgeDelete={handleEdgeDelete}
            />
          </div>

          {/* Informações */}
          <Card className="bg-gradient-to-r from-purple-50 dark:from-purple-900/20 to-blue-50 dark:to-blue-900/20">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              🧠 Dicas de uso:
            </h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>• Adicionar nó:</strong> Clique em "Adicionar Nó" e escolha um pai (ou deixe vazio para nó raiz)</p>
              <p><strong>• Editar nó:</strong> Clique em um nó no canvas</p>
              <p><strong>• Cores:</strong> Cada nível tem uma cor diferente para facilitar a visualização</p>
              <p><strong>• Organização:</strong> Os nós são organizados automaticamente de forma hierárquica</p>
            </div>
          </Card>

          {/* Formulário de nó */}
          <NodeForm
            isOpen={showNodeForm}
            onClose={() => { setShowNodeForm(false); setEditingNode(null); }}
            onSubmit={editingNode ? handleUpdateNode : handleCreateNode}
            availableParents={nodes}
            editingNode={editingNode}
            title={editingNode ? 'Editar Nó' : 'Novo Nó'}
          />
        </div>
      </div>
    );
  }

  // Vista de lista de mapas
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              🧠 Mapas Mentais
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organize conceitos visualmente de forma hierárquica
            </p>
          </div>

          <Button onClick={() => setShowMapForm(true)} className="flex items-center justify-center gap-1">
            <Plus size={20} />
            Novo Mapa Mental
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

        {/* Informação sobre mapas mentais */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 dark:from-purple-900/20 to-blue-50 dark:to-blue-900/20">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            🎨 O que são Mapas Mentais?
          </h3>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>Mapas mentais são representações visuais de informações que ajudam a:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Organizar conceitos hierarquicamente</li>
              <li>Visualizar relações entre ideias</li>
              <li>Memorizar informações de forma mais eficiente</li>
              <li>Fazer brainstorming e planejamento</li>
            </ul>
          </div>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <Network size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Mapas</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{mindMaps.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Network size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Nós</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {mindMaps.reduce((sum, map) => sum + (map.nodesCount || 0), 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <Network size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Média de Nós</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {mindMaps.length > 0
                    ? Math.round(
                        mindMaps.reduce((sum, map) => sum + (map.nodesCount || 0), 0) / mindMaps.length
                      )
                    : 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de mapas */}
        {mindMaps.length === 0 ? (
          <div className="text-center py-16">
            <Network size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nenhum mapa mental criado ainda
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Crie seu primeiro mapa mental para organizar conceitos visualmente
            </p>
            <Button onClick={() => setShowMapForm(true)} className="flex items-center justify-center gap-2 mx-auto">
              <Plus size={20} />
              Criar Primeiro Mapa
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mindMaps.map((map) => (
              <div key={map.id} className="relative">
                {deletingId === map.id && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <Spinner />
                  </div>
                )}
                <MindMapCard
                  mindMap={map}
                  onClick={() => { navigate(`/mindmaps?map=${map.id}`); loadMapDetails(map); }}
                  onEdit={() => { navigate(`/mindmaps?map=${map.id}`); loadMapDetails(map); }}
                  onDelete={() => handleDeleteMap(map.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Formulário de mapa */}
        <MindMapForm
          isOpen={showMapForm}
          onClose={() => setShowMapForm(false)}
          onSubmit={handleCreateMap}
          topics={topics}
        />
      </div>
    </div>
  );
}