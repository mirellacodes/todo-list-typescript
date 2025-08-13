import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskItem from './TaskItem';
import type { Task } from '../types';

type Props = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onToggleCompletion: (id: string) => void;
  animatingTasks: Set<string>;
};

const TaskList: React.FC<Props> = ({ tasks, setTasks, onDelete, onEdit, onToggleCompletion, animatingTasks }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Don't render drag and drop if no tasks
  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        No tasks yet. Add one above!
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {tasks.map((task, index) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            index={index} 
            onDelete={onDelete} 
            onEdit={onEdit} 
            onToggleCompletion={onToggleCompletion}
            isAnimating={animatingTasks.has(task.id)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default TaskList;
