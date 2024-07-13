import React from "react";
import { TrashIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { TaskData } from "../../types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { deleteTask } from "../../store/tasks/taskSlice";
import "./TaskCard.module.css";

const TaskCard: React.FC<{
  task: TaskData;
  className?: string;
  onPress?: () => void;
}> = ({ task, className, onPress }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const getInitial = (name: string) => {
    return name?.charAt(0).toUpperCase();
  };

  return (
    <div
      className={`${className ? className : "task-card"} `}
      onClick={onPress}
    >
      <div style={{display: 'flex', justifyContent: 'end'}}>
        <button
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(task.id);
          }}
        >
          <TrashIcon width={20} height={20} color="rgb(229, 65, 65)" />
        </button>
      </div>
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <div className="task-footer">
          <p className={`priority-${task.priority}`}>
            <ChartBarIcon width={16} height={16} color="lightgrey" />
            {task.priority}
          </p>
          <div className="avatar">
            {task.user
              ? getInitial(task.user.name) +
                "" +
                getInitial(task.user.last_name)
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
