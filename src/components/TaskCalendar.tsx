import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const TaskCalendar: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  // const tasks = [{ title: "elsa", date: "07/07/2024" }];

  console.log("tasks", tasks);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    alert("here");
    // const title = window.prompt("New Event name");
    // if (title) {
    //   const newTask = {
    //     title,
    //     date: slotInfo.start,
    //   };
    // dispatch(addTask(newTask)); // Dispatching action to add a new task
    // setNewEvent({ title, start: slotInfo.start, end: slotInfo.end });
  };

  const events = tasks.map((task) => ({
    title: task.title,
    start: moment(task.date).toDate(),
    end: moment(task.date).toDate(),
  }));

  // alert(events);

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
