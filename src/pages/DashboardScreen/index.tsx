import React, { useEffect, useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import TaskList from "../../components/TaskList";
import GirdView from "../../components/GridView/GirdView";
// import TaskCalendar from "./TaskCalendar";
import { useDispatch } from "react-redux";
import {
  addTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "../../store/tasks/taskSlice";
import { AppDispatch } from "../../store";
import { Task } from "../../types";
import TaskModal from "../../components/TaskModal/TaskModal";
import styles from "./Dashboard.module.css";
import { useTranslation } from "react-i18next";

const Dashboard: React.FC = () => {
  const [view, setView] = useState("list");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const handleAddTask = () => {
    const newTask = {
      title: "New Task",
      description: "New Description",
      assignedTo: "User3",
      priority: "medium",
    } as Task;
    dispatch(addTask(newTask));
  };

  const handleUpdateTask = (task: Task) => {
    dispatch(updateTask(task));
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div>
      <div className={styles.headerContainer}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 15,
          }}
        >
          <div>
            <button
              className={view === "list" ? styles.active : ""}
              onClick={() => setView("list")}
            >
              {t("listView")}
            </button>
            <button
              className={view === "grid" ? styles.active : ""}
              onClick={() => setView("grid")}
            >
              {t("gridView")}
            </button>
            <button
              className={view === "calendar" ? styles.active : ""}
              onClick={() => setView("calendar")}
            >
              {t("calendarView")}
            </button>
          </div>
          <div>
            <button onClick={() => {}}>
              <AdjustmentsHorizontalIcon width={20} height={20} color="white" />
            </button>
            <button onClick={() => {}}>
              <MagnifyingGlassIcon width={20} height={20} color="white" />
            </button>
          </div>
        </div>

        {/* <button onClick={handleAddTask}>Add Task</button> */}
        {/* <button
          onClick={() =>
            handleUpdateTask({
              id: "1",
              title: "Task 1",
              description: "Description 1",
              assignedTo: "User1",
              priority: "high",
            })
          }
        >
          Update Task
        </button> */}
        {/* <button onClick={() => handleDeleteTask("1")}>Delete Task</button> */}
      </div>
      <div style={{ padding: 20 }}>
        {view === "list" && <TaskList />}
        {view === "grid" && <GirdView />}
      </div>

      <TaskModal
        onSave={() => alert("on save")}
        showModal={showModal}
        selectedTask={{
          id: "1",
          title: "Task 1",
          description: "Description 1",
          assignedTo: "User1",
          priority: "High",
          comments: [
            {
              id: "1",
              taskId: "1",
              text: "This is a comment on task 1",
              user: "John",
              date: new Date(),
            },
          ],
        }}
        onClose={handleCloseModal} // Pass the close handler
      />
      {/* {view === "calendar" && <TaskCalendar />} */}
    </div>
  );
};

export default Dashboard;
