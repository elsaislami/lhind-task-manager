import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { updateTask } from '../../store/tasks/taskSlice';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

const TaskBoard: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [priorityToAdd, setPriorityToAdd] = React.useState(null);


  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const columns: { [key: string]: { id: string; title: string; taskIds: string[] } } = {
    low: {
      id: 'low',
      title: 'Low Priority',
      taskIds: tasks.filter(task => task.priority === 'low').map(task => task.id),
    },
    medium: {
      id: 'medium',
      title: 'Medium Priority',
      taskIds: tasks.filter(task => task.priority === 'medium').map(task => task.id),
    },
    high: {
      id: 'high',
      title: 'High Priority',
      taskIds: tasks.filter(task => task.priority === 'high').map(task => task.id),
    },
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
  
    if (!destination) {
      return;
    }
  
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
  
    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const movedTaskId = sourceColumn.taskIds[source.index];
  
    const movedTask = tasks.find(task => task.id === movedTaskId);
    if (!movedTask) {
      return;
    }
  
    const updatedTask = {
      ...movedTask,
      priority: destination.droppableId as 'low' | 'medium' | 'high', 
    };
  
    dispatch(updateTask(updatedTask));
  };
  
  const handleAddTask = (priority:string) => {

    alert(`Add Task to ${priority} Priority`)

  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="columns">
        {Object.keys(columns).map(columnId => {
          const column = columns[columnId];
          return (
            <div key={column.id} className="column">
              <h3>{column.title}</h3>
              <button onClick={() => handleAddTask(column.id) }><PlusCircleIcon width={20} height={20} color='white' /></button>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="no-bullets"
                  >
                    {column.taskIds.map((taskId: any, index:number) => {
                      const task = tasks.find(task => task.id === taskId);
                      if (!task) return null;
                      return (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (

                            <li 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card"
                            >
                              <h3>{task.title}</h3>
                              <p>{task.description}</p>
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
