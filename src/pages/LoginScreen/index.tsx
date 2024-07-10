import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUserByUsername } from "../../store/auth/authSlice";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../types";
import { useTranslation } from "react-i18next";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(getUserByUsername(formData));
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="container">
      <div className="full-screen">
        <div className="card">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label> {t("username")}: </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </div>
            <div>
              <label> {t("password")}:</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>
            <button type="submit">{t("login")}</button>
          </form>
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
