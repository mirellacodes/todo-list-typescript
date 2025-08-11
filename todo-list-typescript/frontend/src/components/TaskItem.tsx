import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { NeonButton } from '../styles';
import type { Task } from '../types';

type Props = {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
};

const TaskContainer = styled.div`
  background-color: #222;
  border: 1px solid violet;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
`;

const TaskItem: React.FC<Props> = ({ task, index, onDelete }) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided) => (
      <TaskContainer
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {task.title}
        <NeonButton onClick={() => onDelete(task.id)}>Delete</NeonButton>
      </TaskContainer>
    )}
  </Draggable>
);

export default TaskItem;
