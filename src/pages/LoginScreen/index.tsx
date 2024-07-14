import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/auth/authSlice";
import { AppDispatch, RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../types";
import { useTranslation } from "react-i18next";
import styles from "./login.module.css";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <h2>{t("login")}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{t("username")}:</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>{t("password")}:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
          </div>
          <button className={styles.loginButton} type="submit">
            {t("login")}
          </button>
        </form>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
