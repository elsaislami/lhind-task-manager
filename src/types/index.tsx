export interface LoginForm {
  username: string;
  password: string;
}

export interface User {
  id: string;
  role: "admin" | "user";
  name: string;
  email: string;
  password: string;
  username: string;
}
