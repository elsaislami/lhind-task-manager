import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const TaskCalendar: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  console.log("tasks", tasks);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    console.log(slotInfo);
  };

  const events = tasks.map((task) => ({
    title: task.title,
    start: moment(task.date).toDate(),
    end: moment(task.due_date).toDate(),
  }));

  return (
    <div style={{ height: "500px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        onSelectSlot={() => handleSelectSlot}
        endAccessor="end"
        style={{ height: "100%" }}
      />
    </div>
  );
};

export default TaskCalendar;
