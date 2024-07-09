import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/LoginScreen/index";
import HomeScreen from "./pages/HomeScreen";
import { Provider } from "react-redux";
import store from "./store";
import Layout from "./components/Layout";
import ReportScreen from "./pages/ReportsScreen";

const Redirect = ({ to }: { to: string }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  }, []);
  return null;
};
const unFilteredRoutes = [
  {
    path: "home",
    element: <HomeScreen />,
    allowed_roles: ["all"],
  },
  {
    path: "reports",
    element: <ReportScreen />,
    allowed_roles: ["admin"],
  },
  {
    path: "",
    element: <Redirect to="/" />,
  },
];
function App() {
  const filteredRoutes = () => {
    const user = JSON.parse(localStorage.getItem("user") as any);

    if (user) {
      return unFilteredRoutes.filter(
        (route: any) =>
          route.allowed_roles?.includes("all") ||
          route.allowed_roles?.includes(user.role)
      );
    }
    return [];
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: filteredRoutes(),
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />{" "}
    </Provider>
  );
}

export default App;
