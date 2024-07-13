import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, fetchTasks, updateTask } from "../../store/tasks/taskSlice";
import { AppDispatch, RootState } from "../../store";
import TaskModal from "../../components/TaskModal/TaskModal";
import styles from "./Dashboard.module.css";
import { useTranslation } from "react-i18next";
import TaskCalendar from "../../components/TaskCalendar";
import { TaskData } from "../../types";
import { v4 as uuidv4 } from "uuid";
import GridView from "../../components/GridView/GirdView";
import ListView from "../../components/ListView/ListView";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [view, setView] = useState("list");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const { tasks } = useSelector((state: RootState) => state.tasks);

  const [latestTasks, setLatestTasks] = useState<TaskData[]>([]);

  const { t } = useTranslation();

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedTask(null);
  }, []);

  const generateUniqueId = (): string => {
    let newId = uuidv4();
    while (tasks.some((task) => task.id === newId)) {
      newId = uuidv4();
    }
    return newId;
  };

  const handleSaveTask = (task: TaskData) => {
    if (selectedTask) {
      dispatch(updateTask(task));
    } else {
      const newTask = {
        ...task,
        id: generateUniqueId(),
      };
      dispatch(addTask(newTask));
    }
    handleCloseModal();
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleOpenModal = (task?: TaskData, priority?: string) => {
    setSelectedTask(task || null);
    setSelectedPriority(priority || "");
    setShowModal(true);
  };

  useEffect(() => {
    if (tasks.length > 0) {
      setLatestTasks(tasks);
    }
  }, [tasks]);

  const Header = () => (
    <div className={styles.headerContainer}>
      <div className={styles.headerItems}>
        <div>
          {["list", "grid", "calendar"].map((type) => (
            <button
              key={type}
              className={view === type ? styles.active : ""}
              onClick={() => setView(type)}
            >
              {t(`${type}View`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      <div className={styles.bodyAlign}>
        {view === "list" && <ListView onOpenModal={handleOpenModal} />}
        {view === "grid" && (
          <GridView tasks={latestTasks} onOpenModal={handleOpenModal} />
        )}
        {view === "calendar" && <TaskCalendar />}
      </div>

      <TaskModal
        onSave={handleSaveTask}
        showModal={showModal}
        selectedTask={selectedTask}
        priority={selectedPriority}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Dashboard;
