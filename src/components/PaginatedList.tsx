import React, { useState, useEffect } from "react";
import TaskCard from "./TaskCard/TaskCard";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useDispatch } from "react-redux";
import { fetchTasksForPagination } from "../store/tasks/taskSlice";

const PaginatedList: React.FC = () => {
  const dispatch = useDispatch() as AppDispatch;
  const [page, setPage] = useState<number>(1);
  const taskState = useSelector((state: RootState) => state.tasks);
  const { paginationTasks, loading, lastPage } = taskState;
 
  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchTasksForPagination({ page, perPage: 4 }));
    };

    fetchData();
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
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
