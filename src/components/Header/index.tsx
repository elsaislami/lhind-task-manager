import React, { useState } from "react";
import styles from "./Header.module.css";
import {
  HomeIcon,
  ArrowRightOnRectangleIcon,
  ChartPieIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/auth/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useTranslation } from "react-i18next";

const loggedInLinks = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: HomeIcon,
  },
];

const unLoggedLinks = [
  // {
  //   title: "Home",
  //   path: "/",
  //   icon: HomeIcon,
  // },
] as any;

const adminLinks = [
  {
    title: "Reports",
    path: "/reports",
    icon: ChartPieIcon,
  },
];

const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

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

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
  };

  return (
    <div className={styles.topnav}>
      <div className={styles.left}>
        {isAuthenticated ? (
          <>
            {loggedInLinks.map((link, index) => (
              <span
                key={index}
                className={
                  window.location.pathname === link.path ? styles.active : ""
                }
                onClick={() => handleNavigation(link.path)}
              >
                <link.icon width={30} height={30} color="white" />
              </span>
            ))}
            {user && user.role === "admin" && (
              <>
                {adminLinks.map((link, index) => (
                  <span
                    key={index}
                    className={
                      window.location.pathname === link.path
                        ? styles.active
                        : ""
                    }
                    onClick={() => handleNavigation(link.path)}
                  >
                    <link.icon width={30} height={30} color="white" />
                  </span>
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {unLoggedLinks?.map((link: any, index: number) => (
              <span
                key={index}
                className={
                  window.location.pathname === link.path ? styles.active : ""
                }
                onClick={() => handleNavigation(link.path)}
              >
                <link.icon width={30} height={30} color="white" />
              </span>
            ))}
          </>
        )}
      </div>

      <div className={styles.right}>
        <span
          className={`${styles.languageSwitcher} ${
            selectedLanguage === "en" ? styles.selectedLanguage : ""
          }`}
          onClick={() => handleLanguageChange("en")}
        >
          EN
        </span>
        <span
          className={`${styles.languageSwitcher} ${
            selectedLanguage === "de" ? styles.selectedLanguage : ""
          }`}
          onClick={() => handleLanguageChange("de")}
        >
          DE
        </span>
        {user ? (
          <span onClick={() => handleNavigation("/logout")}>
            <ArrowRightOnRectangleIcon width={30} height={30} color="white" />
          </span>
        ) : (
          <span onClick={() => handleNavigation("/login")}>{"Login"}</span>
        )}
      </div>
    </div>
  );
};

export default Header;
