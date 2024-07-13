import React, { useState, useEffect, useCallback } from "react";
import TaskCard from "../TaskCard/TaskCard";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchTasksForPagination } from "../../store/tasks/taskSlice";
import styles from "./ListView.module.css";
import { TaskData } from "../../types";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

interface ListViewProps {
  onOpenModal: (task?: TaskData, priority?: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ onOpenModal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
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
        fetchTasksForPagination({ page: 1, perPage: 4, search: searchValue })
      );
    }, 800),
    [dispatch]
  );

  useEffect(() => {
    handleSearch(search);
  }, [search, handleSearch]);

  useEffect(() => {
    dispatch(fetchTasksForPagination({ page, perPage: 4, search }));
  }, [page, search, dispatch]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleAddTask = (priority: string) => {
    onOpenModal(undefined, priority);
  };

  return (
    <div>
      <div>
        <h2>{"Search for task"}</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.inputField}
        />
      </div>
      <button onClick={() => handleAddTask("low")}>
        <PlusCircleIcon width={24} height={24} color="rgb(255,173,0)" />
      </button>
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
