import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "./TaskGrid.css";

const TaskGrid: React.FC = () => {
  const { tasks, loading, error } = useSelector(
    (state: RootState) => state.tasks
  );

  return (
    <div className="grid-container">
      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>{task.date?.toDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default TaskGrid;
