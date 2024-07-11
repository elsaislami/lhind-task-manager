import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../services/api";
import { Comment, Task } from "../../types";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axiosInstance.get("/tasks");
  return response.data;
});

export const addTask = createAsyncThunk('tasks/addTask', async (task:Task) => {
  const response = await axiosInstance.post('/tasks', task);
  return response.data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (task:Task) => {
  const response = await axiosInstance.put(`/tasks/${task.id}`, task);
  return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId: string) => {
  await axiosInstance.delete(`/tasks/${taskId}`);
  return taskId;
});

export const addComment = createAsyncThunk('comments/addComment', async (comment:Comment) => {
  const response = await axiosInstance.post(`/comments`, comment);
  return response.data;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export const { } = tasksSlice.actions;
export default tasksSlice.reducer;
