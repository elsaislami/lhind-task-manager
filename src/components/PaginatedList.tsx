import React, { useState, useEffect } from "react";
import { Task } from "../types";
import { axiosInstance } from "../services/api";
import TaskCard from "./TaskCard/TaskCard";

const PaginatedList: React.FC = () => {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/tasks`, {
          params: { _page: page, _per_page: 4 },
        });

        setData((prevData) => [...prevData, ...response.data.data]);
        if (
          response.data.data.length === 0 ||
          response.data.data.length < 4 ||
          !response.data.next
        ) {
          setHasMore(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      {/* <h1>Paginated Task List</h1> */}
      <ul>
        {data.map((item) => (
          <TaskCard task={item} className="list" />
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {hasMore && !loading && <button onClick={loadMore}>Load More</button>}
      {!hasMore && <p>No more data</p>}
    </div>
  );
};

export default PaginatedList;
