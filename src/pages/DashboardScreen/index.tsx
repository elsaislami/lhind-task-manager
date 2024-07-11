import React, { useEffect, useState } from "react";
import TaskList from "../../components/TaskList";
import TaskGrid from "../../components/TaskGrid/TaskGrid";
// import TaskCalendar from "./TaskCalendar";
import { useDispatch } from "react-redux";
import { addTask, deleteTask, fetchTasks, updateTask } from "../../store/tasks/taskSlice";
import { AppDispatch } from "../../store";
import { Task } from "../../types";
import TaskModal from "../../components/TaskModal";

const Dashboard: React.FC = () => {
  const [view, setView] = useState("list");
  const dispatch = useDispatch<AppDispatch>();

  const handleAddTask = () => {
    const newTask = { title: "New Task", description: "New Description", assignedTo: "User3", priority: "medium" } as Task;
    dispatch(addTask(newTask));
  };

  const handleUpdateTask = (task:Task) => {
    dispatch(updateTask(task));
  };

  const handleDeleteTask = (taskId:string) => {
    dispatch(deleteTask(taskId));
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div>
      <div>
        <button onClick={() => setView("list")}>List View</button>
        <button onClick={() => setView("grid")}>Grid View</button>
        <button onClick={() => setView("calendar")}>Calendar View</button>

        <button onClick={handleAddTask}>Add Task</button>
        <button onClick={() => handleUpdateTask({ id: '1', title: "Task 1", description: "Description 1", assignedTo: "User1", priority: "high" })}>Update Task</button>
        <button onClick={() => handleDeleteTask('1')}>Delete Task</button>

      </div>
      {view === "list" && <TaskList />}
      {view === "grid" && <TaskGrid />}


      <TaskModal selectedTask={{
      "id": "1",
      "title": "Task 1",
      "description": "Description 1",
      "assignedTo": "User1",
      "priority": "High",
      "comments": [
        {
          "id": '1',
          "taskId": "1",
          "text": "This is a comment on task 1",
          "user": "John",
          "date": new Date()
        }
      ]
    }} />
      {/* {view === "calendar" && <TaskCalendar />} */}
    </div>
  );
};

export default Dashboard;
