import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginForm, User } from "../../types";
import { axiosInstance } from "../../services/api";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  users: User[];
  user: {
    id: string;
    role: "admin" | "user" | null;
    name: string;
    email: string;
    password: string;
    username: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
  users: [],
};

const storedUser = localStorage.getItem("user");
if (storedUser) {
  const parsedUser = JSON.parse(storedUser);
  initialState.isAuthenticated = true;
  initialState.user = parsedUser;
}

export const getUserByUsername = createAsyncThunk(
  "users/getUserByUsername",
  async (payload: LoginForm) => {
    const response = await axiosInstance.get(
      `users?username=${payload.username}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch user");
    }

    const data = await response.data;
    const user = data.find((user: User) => user.password === payload.password);
    if (!user) {
      throw new Error("User not found or password incorrect");
    }

    localStorage.setItem("user", JSON.stringify(user));
    return user;
  }
);

export const getUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserByUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserByUsername.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.error = null;
          state.user = action.payload;
        }
      )
      .addCase(getUserByUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      });
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
