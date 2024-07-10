import React, { useEffect, useState } from "react";
import TaskList from "../../components/TaskList";
import TaskGrid from "../../components/TaskGrid/TaskGrid";
// import TaskCalendar from "./TaskCalendar";
import { useDispatch } from "react-redux";
import { fetchTasks } from "../../store/tasks/taskSlice";
import { AppDispatch } from "../../store";

const Dashboard: React.FC = () => {
  const [view, setView] = useState("list");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div>
      <div>
        <button onClick={() => setView("list")}>List View</button>
        <button onClick={() => setView("grid")}>Grid View</button>
        <button onClick={() => setView("calendar")}>Calendar View</button>
      </div>
      {view === "list" && <TaskList />}
      {view === "grid" && <TaskGrid />}
      {/* {view === "calendar" && <TaskCalendar />} */}
    </div>
  );
};

export default Dashboard;
