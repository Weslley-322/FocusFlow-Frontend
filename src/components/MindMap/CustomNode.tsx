import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { connectionState } from '@/utils/connectionState';

export interface CustomNodeData {
  label: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  onEdit?: (newLabel: string) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export const CustomNode = memo(({ data, selected }: NodeProps<CustomNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editValue, setEditValue] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') handleCancel();
  };

  const handleSave = () => {
    if (editValue.trim() && data.onEdit) data.onEdit(editValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(data.label);
    setIsEditing(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (data.onContextMenu) data.onContextMenu(e);
  };

  const show = isHovered || selected;
  const hs = {
    background: '#555',
    width: 10,
    height: 10,
    opacity: show ? 1 : 0,
    transition: 'opacity 0.15s',
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: data.backgroundColor,
        color: data.textColor,
        border: `2px solid ${selected ? '#000000' : data.borderColor}`,
        borderRadius: '8px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '500',
        minWidth: '120px',
        maxWidth: '200px',
        textAlign: 'center',
        cursor: isEditing ? 'text' : 'pointer',
        boxShadow: selected ? '0 0 0 2px #3B82F6' : 'none',
        transition: 'all 0.2s',
      }}
    >
      <Handle id="top"    type="source" position={Position.Top}    style={hs} onMouseDown={() => { connectionState.sourceHandle = 'top'; }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={hs} onMouseDown={() => { connectionState.sourceHandle = 'bottom'; }} />
      <Handle id="left"   type="source" position={Position.Left}   style={hs} onMouseDown={() => { connectionState.sourceHandle = 'left'; }} />
      <Handle id="right"  type="source" position={Position.Right}  style={hs} onMouseDown={() => { connectionState.sourceHandle = 'right'; }} />

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: data.textColor,
            fontSize: '14px',
            fontWeight: '500',
            textAlign: 'center',
            width: '100%',
            padding: 0,
          }}
          className="nodrag"
        />
      ) : (
        <div>{data.label}</div>
      )}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';