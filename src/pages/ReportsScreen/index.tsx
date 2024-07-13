import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { useDispatch } from "react-redux";
import { fetchTasks } from "../../store/tasks/taskSlice";
import { getUsers } from "../../store/auth/authSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ReportScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const users = useSelector((state: RootState) => state.auth.users);

  const priorities = ["low", "medium", "high"];
  const priorityCounts = priorities.map(
    (priority) => tasks.filter((task) => task.priority === priority).length
  );

  const userTaskCounts = users.map(
    (user) => tasks.filter((task) => task.userId === user.id).length
  );

  const completionTimes = tasks
    .filter((task) => task.date && task.due_date)
    .map((task) => ({
      ...task,
      date: task.date ? new Date(task.date) : null,
      due_date: task.due_date ? new Date(task.due_date) : null,
    }))
    .map((task) =>
      task.date && task.due_date
        ? (task.due_date.getTime() - task.date.getTime()) /
          (1000 * 60 * 60 * 24)
        : 0
    );

  console.log("Tasks: ", tasks);
  console.log("Completion Times: ", completionTimes);

  const completionData = {
    labels: tasks.map((task) => task.title),
    datasets: [
      {
        label: "Completion Time (days)",
        data: completionTimes,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const priorityData = {
    labels: priorities,
    datasets: [
      {
        label: `Number of Tasks: ${tasks.length}`,
        data: priorityCounts,
        backgroundColor: ["#008000", "#ffa500", "#e54141"],
      },
    ],
  };

  const userData = {
    labels: users.map((user) => user.username),
    datasets: [
      {
        label: "Number of Tasks",
        data: userTaskCounts,
        backgroundColor: users.map(
          () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
        ),
      },
    ],
  };

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(getUsers());
  }, []);

  return (
    <div>
      <h2>Task Performance Report</h2>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <h3>Tasks by Priority</h3>
          <div
            style={{
              width: "400px",
              height: "400px",
              alignContent: "center",
            }}
          >
            <Bar data={priorityData} />
          </div>
        </div>
        <div>
          <h3>Tasks by User</h3>
          <div style={{ width: "300px", height: "300px" }}>
            <Pie data={userData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportScreen;
