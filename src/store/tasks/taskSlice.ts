import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../services/api";
import { Comment, Task, TaskData } from "../../types";

interface TasksState {
  tasks: TaskData[];
  loading: boolean;
  error: string | null;
  paginationTasks: TaskData[];
  lastPage: boolean;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  paginationTasks: [],
  lastPage: false,
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axiosInstance.get(
    "/tasks?_embed=comments&_embed=user"
  );
  return response.data;
});

export const addTask = createAsyncThunk("tasks/addTask", async (task: Task) => {
  const response = await axiosInstance.post("/tasks", task);
  return response.data;
});

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task: TaskData ) => {
    const user = 'user' in task ? task.user : null;
    const comments = 'comments' in task ? task.comments : null;

    delete task.user;
    delete task.comments;

    let response = await axiosInstance.put(`/tasks/${task.id}`, task);

    if (user) {
      response.data.user = user;
    }

    if (comments) {
      response.data.comments = comments;
    }
    
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    await axiosInstance.delete(`/tasks/${taskId}`);
    return taskId;
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (comment: Comment) => {
    const response = await axiosInstance.post(`/comments`, comment);
    return response.data;
  }
);

interface FetchTasksParams {
  page: number;
  perPage: number;
  search?: string;
}

export const fetchTasksForPagination = createAsyncThunk(
  "tasks/fetchTasksForPagination",
  async (params: FetchTasksParams) => {
    const { page, perPage, search } = params;

    const response = await axiosInstance.get(
      "/tasks?_embed=comments&_embed=user",
      {
        params: { _page: page, _per_page: perPage, title: search || ''},
      }
    );
    return response.data;
  }
);

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

        state.paginationTasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        state.tasks[index] = action.payload;

        const indexPag = state.paginationTasks.findIndex(
          (task) => task.id === action.payload.id
        );
        state.paginationTasks[indexPag] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.paginationTasks = state.paginationTasks.filter(
          (task) => task.id !== action.payload
        );
      })
      .addCase(fetchTasksForPagination.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastPage = false;
      })
      .addCase(fetchTasksForPagination.fulfilled, (state, action) => {
        state.loading = false;

        const { next, data, prev } = action.payload;
        if (action.payload.data.length === 0 || !next) {
          state.lastPage = true;
        }

        if (!prev) {
          state.paginationTasks = data;
          return;
        }

        state.paginationTasks = [...state.paginationTasks, ...data];
      })
      .addCase(fetchTasksForPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const taskIndex = state.tasks.findIndex(
          (task) => task.id === action.payload.taskId
        );
        if (taskIndex > -1) { 
          state.tasks[taskIndex].comments?.push(action.payload);
        }
      
        const taskIndexPag = state.paginationTasks.findIndex(
          (task) => task.id === action.payload.taskId
        );
        if (taskIndexPag > -1) { 
          state.paginationTasks[taskIndexPag].comments?.push(action.payload);
        }
      });
  },
});

export const {} = tasksSlice.actions;
export default tasksSlice.reducer;
