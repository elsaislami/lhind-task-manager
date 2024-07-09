import React from "react";
import "./styles.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const ReportScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  console.log(user);

  return (
    <div className="container">
      <h1> Reports</h1>
    </div>
  );
};

export default ReportScreen;
