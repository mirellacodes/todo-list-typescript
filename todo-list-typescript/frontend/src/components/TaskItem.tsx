import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from 'styled-components';
import { NeonButton } from '../styles';
import type { Task } from '../types';

type Props = {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onToggleCompletion: (id: string) => void;
  isAnimating: boolean;
};

const TaskWrapper = styled.div<{ isAnimating: boolean }>`
  display: grid;
  grid-template-columns: 24px 1fr auto;
  gap: 0.5rem;
  margin-bottom: 8px;
  align-items: center;
  transition: ${props => props.isAnimating ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'all 0.2s ease'};
  transform: ${props => props.isAnimating ? 'translateX(120%)' : 'translateX(0)'};
  opacity: ${props => props.isAnimating ? 0 : 1};
  overflow: hidden;
  height: ${props => props.isAnimating ? '0' : 'auto'};
  margin-bottom: ${props => props.isAnimating ? '0' : '10px'};
  pointer-events: ${props => props.isAnimating ? 'none' : 'auto'};
  
  /* Essential: These visual properties are required for the animation to function */
  background-color: ${props => props.isAnimating ? '#4a148c' : 'transparent'};
  border: ${props => props.isAnimating ? '5px solid #4a148c' : 'none'};
  padding: ${props => props.isAnimating ? '2px' : '0'};
  
  /* Color transition animation: dark purple to light purple during fade */
  ${props => props.isAnimating && `
    animation: colorShift 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    
    @keyframes colorShift {
      0% {
        background-color: #4a148c;
        border-color: #4a148c;
      }
      50% {
        background-color: #8a2be2;
        border-color: #8a2be2;
      }
      100% {
        background-color: #e1bee7;
        border-color: #e1bee7;
      }
    }
  `}
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  grid-column: 1;
`;

const TaskContainer = styled.div<{ isDragging: boolean; completed: boolean; isAnimating: boolean }>`
  background-color: ${props => props.isDragging ? '#333' : props.completed ? '#1a1a1a' : '#222'};
  border: 1px solid ${props => props.isDragging ? '#ff69b4' : props.completed ? '#666' : '#8a2be2'};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: ${props => props.isDragging ? '0 5px 15px rgba(255, 105, 180, 0.3)' : 'none'};
  transform: ${props => props.isDragging ? 'rotate(2deg)' : 'none'};
  cursor: grab;
  opacity: ${props => props.completed ? 0.7 : 1};
  grid-column: 2;
  
  &:active {
    cursor: grabbing;
  }
  
  &:hover {
    .task-title {
      color: #8a2be2;
    }
  }
`;

const TaskTitle = styled.span<{ completed: boolean }>`
  flex: 1;
  word-break: break-word;
  transition: color 0.2s ease;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? '#888' : 'inherit'};
`;

const CompletionCheckbox = styled.input`
  cursor: pointer;
  transform: scale(1.2);
  accent-color: #00ff00;
  
  &:checked {
    accent-color: #00ff00;
  }
`;

const EditInput = styled.input`
  flex: 1;
  background: transparent;
  border: 1px solid #ff69b4;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  color: white;
  font-size: inherit;
  width: 100%;
  min-width: 0;
  
  &:focus {
    outline: none;
    border-color: #ff69b4;
    box-shadow: 0 0 5px rgba(255, 105, 180, 0.3);
  }
`;

const EditIcon = styled(NeonButton)`
  padding: 0.5rem;
  min-width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background-color: rgba(255, 255, 0, 0.1);
    border-color: #ffff00;
    color: #ffff00;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  grid-column: 3;
  justify-self: end;
`;

const IconButton = styled(NeonButton)`
  padding: 0.5rem;
  min-width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(0, 255, 0, 0.1);
    border-color: #00ff00;
    color: #00ff00;
  }
`;

const DeleteButton = styled(NeonButton)`
  padding: 0.5rem;
  min-width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background-color: rgba(255, 0, 0, 0.1);
    border-color: #ff4444;
    color: #ff4444;
  }
`;

const TaskItem: React.FC<Props> = ({ task, index, onDelete, onEdit, onToggleCompletion, isAnimating }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  // Essential: This useEffect hook is critical for the animation to work
  useEffect(() => {
    // This effect ensures proper React re-rendering and state synchronization
  }, [isAnimating]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isEditing) {
      // If already editing, save the changes
      handleSave();
    } else {
      // If not editing, enter edit mode
      setIsEditing(true);
      setEditValue(task.title);
    }
  };

  const handleSave = () => {
    try {
      // Always save if there's content, even if it's the same (allows for spaces)
      if (editValue.trim()) {
        onEdit(task.id, editValue);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      // Always disable edit mode
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent drag and drop from interfering with input
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
    // Allow all other keys including spacebar to work normally
  };

  return (
    <TaskWrapper isAnimating={isAnimating}>
      <CheckboxContainer>
        <CompletionCheckbox
          type="checkbox"
          checked={task.completed}
          onChange={(e) => {
            e.stopPropagation();
            onToggleCompletion(task.id);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </CheckboxContainer>
      <TaskContainer
        ref={setNodeRef}
        style={style}
        isDragging={isDragging}
        completed={task.completed}
        isAnimating={isAnimating}
        {...(isEditing ? {} : attributes)}
        {...(isEditing ? {} : listeners)}
      >
        {isEditing ? (
          <EditInput
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <TaskTitle className="task-title" completed={task.completed}>{task.title}</TaskTitle>
        )}
      </TaskContainer>
      
      <ActionButtons>
        <EditIcon onClick={handleEditClick}>
          {isEditing ? '✓' : '✏️'}
        </EditIcon>
        <DeleteButton onClick={() => onDelete(task.id)}>🗑️</DeleteButton>
      </ActionButtons>
    </TaskWrapper>
  );
};

export default TaskItem;
