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
  fetchTasks,
} from "../../store/tasks/taskSlice";
import { AppDispatch } from "../../store";
import TaskModal from "../../components/TaskModal/TaskModal";
import styles from "./Dashboard.module.css";
import { useTranslation } from "react-i18next";
import SearchModal from "../../components/SearchModal";

const Dashboard: React.FC = () => {
  const [view, setView] = useState("list");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [showSearchModal, setShowSearchModal] = useState(false);

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
        className={styles.headerItems}>
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
              <MagnifyingGlassIcon width={20} height={20} color="white" onClick={() => setShowSearchModal(true)} />
            </button>
          </div>
        </div>
      </div>
      <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
        <div style={{maxWidth: '80%'}}>
          {view === "list" && <TaskList />}
        </div>
        {view === "grid" && <GirdView />}
      </div>

      <TaskModal
        onSave={() => alert("on save")}
        showModal={showModal}
        selectedTask={{
          id: "1",
          title: "Task 1",
          description: "Description 1",
          userId: "1",
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

      { showSearchModal &&
        <SearchModal setShowModal={setShowModal} />
      }
      {/* {view === "calendar" && <TaskCalendar />} */}
    </div>
  );
};

export default Dashboard;
