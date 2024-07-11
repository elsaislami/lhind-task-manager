import React from 'react';
import { Task } from '../types';
import { useDispatch } from "react-redux";
import { AppDispatch } from '../store';
import { deleteTask } from '../store/tasks/taskSlice';


const TaskCard: React.FC<{ task: Task, className?:string }> = ({ task, className }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  return (
    <div className={`${className ? className: 'task-card'} `}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>{task.assignedTo}</p>
      <p className={`priority-${task.priority}`}>{task.priority}</p>
      <button onClick={() => handleDelete(task.id)}>Delete</button>
    </div>
  );
};

export default TaskCard;
