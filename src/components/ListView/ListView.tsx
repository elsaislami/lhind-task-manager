import React, { useState, useEffect, useCallback } from "react";
import TaskCard from "../TaskCard/TaskCard";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchTasksForPagination } from "../../store/tasks/taskSlice";
import styles from "./ListView.module.css";
import { TaskData } from "../../types";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

interface ListViewProps {
  onOpenModal: (task?: TaskData, priority?: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ onOpenModal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");
  const users = useSelector((state: RootState) => state.auth.users);
  const { t } = useTranslation();

  const { paginationTasks, loading, lastPage } = useSelector(
    (state: RootState) => state.tasks
  );

  const debounce = (func: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const handleSearch = useCallback(
    debounce((searchValue: string) => {
      setPage(1);
      dispatch(
        fetchTasksForPagination({
          page: 1,
          perPage: 4,
          search: searchValue,
          priority: priorityFilter,
          user: userFilter,
        })
      );
    }, 800),
    [dispatch, priorityFilter, userFilter]
  );

  useEffect(() => {
    handleSearch(search);
  }, [search, handleSearch, priorityFilter, userFilter]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserFilter(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    dispatch(
      fetchTasksForPagination({
        page,
        perPage: 4,
        search,
        priority: priorityFilter,
        user: userFilter,
      })
    );
  }, [page, search, dispatch, priorityFilter, userFilter]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleAddTask = (priority: string) => {
    onOpenModal(undefined, priority);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriorityFilter(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <div>
        <h2>{t("searchTask")}</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.inputField}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button onClick={() => handleAddTask("low")}>
          <PlusCircleIcon width={24} height={24} color="rgb(255,173,0)" />
        </button>
        <div>
          <select
            className={styles.selectBorder}
            id="priorityFilter"
            value={priorityFilter}
            onChange={handlePriorityChange}
          >
            <option value="">Filter by Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            className={styles.selectBorder}
            id="userFilter"
            value={userFilter}
            onChange={handleUserChange}
          >
            <option value="">Filter by user</option>
            {users.length > 0 ? (
              users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))
            ) : (
              <option disabled>No users available</option>
            )}
          </select>
        </div>
      </div>

      <ul>
        {paginationTasks.map((task) => (
          <TaskCard
            task={task}
            className="list"
            key={task.id}
            onPress={() => onOpenModal(task)}
          />
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {!lastPage && !loading && <button onClick={loadMore}>Load More</button>}
      {lastPage && <p>No more data</p>}
    </div>
  );
};

export default ListView;
