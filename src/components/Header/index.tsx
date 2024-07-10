import React, { useState } from "react";
import "./styles.css";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/auth/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const loggedInLinks = [
  {
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    title: "Tasks",
    path: "/tasks",
  },
];

const unLoggedLinks = [
  {
    title: "Home",
    path: "/",
  },
];

const adminLinks = [
  {
    title: "Reports",
    path: "/reports",
  },
];

const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const handleNavigation = (path: string) => {
    if (path === "/logout") {
      handleLogout();
      return;
    }

    navigate(path);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className={`topnav ${isOpen ? "responsive" : ""}`}>
      {isAuthenticated ? (
        <>
          {loggedInLinks.map((link, index) => (
            <span
              key={index}
              className={window.location.pathname === link.path ? "active" : ""}
              onClick={() => handleNavigation(link.path)}
            >
              {link.title}
            </span>
          ))}
          {user && user.role === "admin" && (
            <>
              {adminLinks.map((link, index) => (
                <span
                  key={index}
                  className={
                    window.location.pathname === link.path ? "active" : ""
                  }
                  onClick={() => handleNavigation(link.path)}
                >
                  {link.title}
                </span>
              ))}
            </>
          )}
        </>
      ) : (
        <>
          {unLoggedLinks.map((link, index) => (
            <span
              key={index}
              className={window.location.pathname === link.path ? "active" : ""}
              onClick={() => handleNavigation(link.path)}
            >
              {link.title}
            </span>
          ))}
        </>
      )}
      {user ? (
        <span onClick={() => handleNavigation("/logout")}>{"Logout"}</span>
      ) : (
        <span onClick={() => handleNavigation("/login")}>{"Login"}</span>
      )}
      <span className="icon">
        <Bars3Icon
          height={20}
          width={20}
          color="white"
          onClick={() => setIsOpen(!isOpen)}
        />
      </span>
    </div>
  );
};

export default Header;
