import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/LoginScreen/index";
import DashboardScreen from "./pages/DashboardScreen";
import { Provider } from "react-redux";
import store from "./store";
import Layout from "./components/Layout";
import ReportScreen from "./pages/ReportsScreen";

const unFilteredRoutes = [
  {
    path: "/dashboard",
    element: <DashboardScreen />,
    allowed_roles: ["all"],
  },
  {
    path: "/reports",
    element: <ReportScreen />,
    allowed_roles: ["admin"],
  },
  {
    path: "/login",
    element: <Login />,
  },
];

const App: React.FC = () => {
  const filteredRoutes = () => {
    const { user } = store.getState().auth;

    if (user) {
      return unFilteredRoutes.filter(
        (route: any) => {
          if (route.allowed_roles) {
            return route.allowed_roles.includes(user.role) || route.allowed_roles.includes("all");
          }
          return true;
        }
      );
    }
    return unFilteredRoutes.filter(
      (route: any) =>  !route.allowed_roles);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: filteredRoutes(),
    },
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
