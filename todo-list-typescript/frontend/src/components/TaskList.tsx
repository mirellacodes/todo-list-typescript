import React from 'react';
import { DragDropContext, Droppable, type DropResult } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';
import type { Task } from '../types';

type Props = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onDelete: (id: string) => void;
};

const TaskList: React.FC<Props> = ({ tasks, setTasks, onDelete }) => {
  const handleDrag = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = [...tasks];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    setTasks(reordered);
  };

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {tasks.map((task, index) => (
              <TaskItem key={task.id} task={task} index={index} onDelete={onDelete} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;
