export function getNodeColor(level: number): { bg: string; border: string; text: string } {
  const colors = [
    { bg: '#3B82F6', border: '#2563EB', text: '#FFFFFF' }, // Azul - Nível 0 (raiz)
    { bg: '#10B981', border: '#059669', text: '#FFFFFF' }, // Verde - Nível 1
    { bg: '#F59E0B', border: '#D97706', text: '#FFFFFF' }, // Laranja - Nível 2
    { bg: '#8B5CF6', border: '#7C3AED', text: '#FFFFFF' }, // Roxo - Nível 3
    { bg: '#EC4899', border: '#DB2777', text: '#FFFFFF' }, // Rosa - Nível 4
    { bg: '#06B6D4', border: '#0891B2', text: '#FFFFFF' }, // Cyan - Nível 5+
  ];

  return colors[Math.min(level, colors.length - 1)];
}

export function calculateNodePosition(
  parentPosition: { x: number; y: number } | null,
  siblingIndex: number,
  totalSiblings: number
): { x: number; y: number } {
  if (!parentPosition) {
    // Nó raiz - centro do canvas
    return { x: 400, y: 50 };
  }

  // Espaçamento entre níveis
  const verticalSpacing = 150;
  const horizontalSpacing = 200;

  // Calcular posição Y 
  const y = parentPosition.y + verticalSpacing;

  // Calcular posição X 
  const totalWidth = (totalSiblings - 1) * horizontalSpacing;
  const startX = parentPosition.x - totalWidth / 2;
  const x = startX + siblingIndex * horizontalSpacing;

  return { x, y };
}

interface HierarchyNode {
  id: string;
  parentId?: string;
  children: HierarchyNode[];
  [key: string]: unknown;
}

export function buildHierarchy(nodes: HierarchyNode[]): HierarchyNode[] {
  const nodeMap = new Map<string, HierarchyNode>();
  const roots: HierarchyNode[] = [];

  // Criar mapa de nós
  nodes.forEach((node) => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  // Construir hierarquia
  nodes.forEach((node) => {
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children.push(nodeMap.get(node.id)!);
      }
    } else {
      roots.push(nodeMap.get(node.id)!);
    }
  });

  return roots;
}