export interface LoginForm {
  username: string;
  password: string;
}

export interface User {
  id: string;
  role: "admin" | "user";
  name: string;
  last_name: string;
  email: string;
  password: string;
  username: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  userId: string;
  priority: string;
  date?: Date;
}

export interface Comment {
  id: string;
  taskId: string;
  text: string;
  user: string;
  date: Date;
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  userId: string;
  priority: string;
  date?: Date;
  comments?: Comment[];
  user?: User;
}
