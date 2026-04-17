import { useCallback, useMemo, useEffect, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
  NodeDragHandler,
  Connection,
  OnSelectionChangeParams,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode } from './MindMap/CustomNode';
import { connectionState } from '@/utils/connectionState';
import { ContextMenu } from './MindMap/ContextMenu';
import { ColorPicker } from './MindMap/ColorPicker';
import { getColorByHex, ColorOption } from '@/utils/mindMapColors';
import { Modal } from './Modal';

interface MindMapNode {
  id: string;
  content: string;
  level: number;
  parentId?: string;
  positionX: number;
  positionY: number;
  backgroundColor?: string;
  textColor?: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface MindMapCanvasProps {
  nodes: MindMapNode[];
  onNodeClick?: (nodeId: string) => void;
  onNodesPositionChange?: (nodeId: string, x: number, y: number) => void;
  onConnect?: (childId: string, parentId: string, sourceHandle?: string, targetHandle?: string) => void;
  onNodeEdit?: (nodeId: string, newContent: string) => void;
  onNodeColorChange?: (nodeId: string, color: ColorOption) => void;
  onNodeDelete?: (nodeId: string) => void;
  onEdgeDelete?: (childId: string) => void;
}

const nodeTypes = { custom: CustomNode };

export function MindMapCanvas({ 
  nodes: mindMapNodes, 
  onNodeClick,
  onNodesPositionChange,
  onConnect,
  onNodeEdit,
  onNodeColorChange,
  onNodeDelete,
  onEdgeDelete,
}: MindMapCanvasProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId?: string;
    edgeId?: string;
  } | null>(null);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedNodeForColor, setSelectedNodeForColor] = useState<string | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

  const flowNodes: Node[] = useMemo(() => {
    return mindMapNodes.map((node) => {
      const color = getColorByHex(node.backgroundColor || '#3B82F6');
      return {
        id: node.id,
        position: { x: node.positionX, y: node.positionY },
        data: {
          label: node.content,
          backgroundColor: node.backgroundColor || color.bg,
          textColor: node.textColor || color.text,
          borderColor: color.border,
          onEdit: (newLabel: string) => {
            if (onNodeEdit) onNodeEdit(node.id, newLabel);
          },
          onContextMenu: (e: React.MouseEvent) => {
            setContextMenu({ x: e.clientX, y: e.clientY, nodeId: node.id });
          },
        },
        type: 'custom',
      };
    });
  }, [mindMapNodes, onNodeEdit]);

  // Edges preservam sourceHandle/targetHandle para manter a direção correta
  const flowEdges: Edge[] = useMemo(() => {
    return mindMapNodes
      .filter((node) => node.parentId)
      .map((node) => ({
        id: `${node.parentId}-${node.id}`,
        source: node.parentId!,
        target: node.id,
        sourceHandle: node.sourceHandle ?? null,
        targetHandle: node.targetHandle ?? null,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#94A3B8', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#94A3B8',
        },
      }));
  }, [mindMapNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  useEffect(() => { setNodes(flowNodes); }, [flowNodes, setNodes]);
  useEffect(() => { setEdges(flowEdges); }, [flowEdges, setEdges]);

  const handleNodeDragStop: NodeDragHandler = useCallback(
    (_event, node) => {
      if (onNodesPositionChange) {
        onNodesPositionChange(node.id, Math.round(node.position.x), Math.round(node.position.y));
      }
    },
    [onNodesPositionChange]
  );

  // source = PAI (de onde a linha foi puxada)
  // target = FILHO (onde a linha foi solta)
  const handleConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target && onConnect) {
        // sourceHandle vem do connectionState (capturado no onMouseDown do handle)
        const srcHandle = connectionState.sourceHandle;
        const tgtHandle = connection.targetHandle ?? undefined;
        connectionState.sourceHandle = undefined;

        onConnect(
          connection.target,  // childId
          connection.source,  // parentId
          srcHandle,          // handle no pai (de onde saiu)
          tgtHandle,          // handle no filho (onde chegou)
        );
      }
    },
    [onConnect]
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (onNodeClick) onNodeClick(node.id);
    },
    [onNodeClick]
  );

  const handleSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelectedNodes(params.nodes.map(n => n.id));
    setSelectedEdges(params.edges.map(e => e.id));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodes.length > 0 && onNodeDelete) {
          selectedNodes.forEach(nodeId => {
            if (window.confirm('Tem certeza que deseja deletar este nó?')) {
              onNodeDelete(nodeId);
            }
          });
        }
        if (selectedEdges.length > 0 && onEdgeDelete) {
          selectedEdges.forEach(edgeId => {
            // edge id = "parentUUID-childUUID", cada UUID tem 5 partes
            const parts = edgeId.split('-');
            const childId = parts.slice(5).join('-');
            if (childId && window.confirm('Tem certeza que deseja remover esta conexão?')) {
              onEdgeDelete(childId);
            }
          });
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodes, selectedEdges, onNodeDelete, onEdgeDelete]);

  const handleDeleteFromMenu = () => {
    if (contextMenu?.nodeId && onNodeDelete) {
      if (window.confirm('Tem certeza que deseja deletar este nó?')) {
        onNodeDelete(contextMenu.nodeId);
      }
    } else if (contextMenu?.edgeId && onEdgeDelete) {
      const parts = contextMenu.edgeId.split('-');
      const childId = parts.slice(5).join('-');
      if (childId && window.confirm('Tem certeza que deseja remover esta conexão?')) {
        onEdgeDelete(childId);
      }
    }
    setContextMenu(null);
  };

  const handleChangeColorFromMenu = () => {
    if (contextMenu?.nodeId) {
      setSelectedNodeForColor(contextMenu.nodeId);
      setShowColorPicker(true);
    }
    setContextMenu(null);
  };

  const handleColorSelect = (color: ColorOption) => {
    if (selectedNodeForColor && onNodeColorChange) {
      onNodeColorChange(selectedNodeForColor, color);
    }
    setShowColorPicker(false);
    setSelectedNodeForColor(null);
  };

  const handlePaneContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu(null);
  }, []);

  const handleEdgeContextMenu = useCallback((e: React.MouseEvent, edge: Edge) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, edgeId: edge.id });
  }, []);

  if (mindMapNodes.length === 0) {
    return (
      <div className="w-full h-[600px] bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">🧠 Mapa Mental Vazio</p>
          <p className="text-gray-400 text-sm">Adicione o primeiro nó para começar</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-[600px] bg-gray-50 rounded-lg border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onNodeDragStop={handleNodeDragStop}
          onConnect={handleConnect}
          onSelectionChange={handleSelectionChange}
          onPaneContextMenu={handlePaneContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu}
          connectionMode={ConnectionMode.Loose}
          fitView
          attributionPosition="bottom-left"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onDelete={handleDeleteFromMenu}
          onChangeColor={contextMenu.nodeId ? handleChangeColorFromMenu : undefined}
          showColorOption={!!contextMenu.nodeId}
        />
      )}

      <Modal
        isOpen={showColorPicker}
        onClose={() => { setShowColorPicker(false); setSelectedNodeForColor(null); }}
        title="Escolher Cor do Nó"
        size="sm"
      >
        <ColorPicker
          currentColor={mindMapNodes.find(n => n.id === selectedNodeForColor)?.backgroundColor || '#3B82F6'}
          onColorSelect={handleColorSelect}
        />
      </Modal>
    </>
  );
}