import React, { useState } from 'react';
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
};

const TaskWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 8px;
`;

const TaskContainer = styled.div<{ isDragging: boolean }>`
  background-color: ${props => props.isDragging ? '#333' : '#222'};
  border: 1px solid ${props => props.isDragging ? '#ff69b4' : 'violet'};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  flex: 1;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: ${props => props.isDragging ? '0 5px 15px rgba(255, 105, 180, 0.3)' : 'none'};
  transform: ${props => props.isDragging ? 'rotate(2deg)' : 'none'};
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
  
  &:hover {
    .task-title {
      color: #ff69b4;
    }
  }
`;

const TaskTitle = styled.span`
  flex: 1;
  word-break: break-word;
  transition: color 0.2s ease;
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

const TaskItem: React.FC<Props> = ({ task, index, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

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
    console.log('Edit icon clicked, current state:', { isEditing, editValue, taskTitle: task.title });
    
    if (isEditing) {
      // If already editing, save the changes
      console.log('Currently editing, saving changes...');
      handleSave();
    } else {
      // If not editing, enter edit mode
      console.log('Entering edit mode...');
      setIsEditing(true);
      setEditValue(task.title);
    }
  };

  const handleSave = () => {
    console.log('Saving task:', { id: task.id, oldTitle: task.title, newTitle: editValue });
    
    try {
      // Always save if there's content, even if it's the same (allows for spaces)
      if (editValue.trim()) {
        console.log('Calling onEdit with new title');
        onEdit(task.id, editValue);
      } else {
        console.log('Empty title, not saving');
      }
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      // Always disable edit mode
      setIsEditing(false);
      console.log('Edit mode disabled');
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
    <TaskWrapper>
      <TaskContainer
        ref={setNodeRef}
        style={style}
        isDragging={isDragging}
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
          <TaskTitle className="task-title">{task.title}</TaskTitle>
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
