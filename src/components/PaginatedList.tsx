import React, { useState, useEffect, useCallback } from "react";
import TaskCard from "./TaskCard/TaskCard";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTasksForPagination } from "../store/tasks/taskSlice";
import styles from "./PaginatedList.module.css";

const PaginatedList: React.FC = () => {
  const dispatch = useDispatch() as AppDispatch;
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const taskState = useSelector((state: RootState) => state.tasks);
  const { paginationTasks, loading, lastPage } = taskState;

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
      dispatch(fetchTasksForPagination({ page: 1, perPage: 4, search: searchValue }));
    }, 800),
    [] // empty dependency array ensures the debounce function is not recreated on each render
  );

  useEffect(() => {
    handleSearch(search);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchTasksForPagination({ page, perPage: 4, search }));
    };

    fetchData();
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <div className={''}>
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
      <ul>
        {paginationTasks.map((item, index) => (
          <TaskCard task={item} className="list" key={index} />
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {!lastPage && !loading && <button onClick={loadMore}>Load More</button>}
      {lastPage && <p>No more data</p>}
    </div>
  );
};

export default PaginatedList;
