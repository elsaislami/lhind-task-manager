import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { updateTask } from "../../store/tasks/taskSlice";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import TaskCard from "../TaskCard/TaskCard";
import style from "./GridView.module.css";
import { TaskData } from "../../types";
import { useTranslation } from "react-i18next";

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface GridViewProps {
  tasks: TaskData[];
  onOpenModal: (task?: TaskData, priority?: string) => void;
}

const GridView: React.FC<GridViewProps> = ({ tasks, onOpenModal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState<string>("");

  type ColumnKey = "low" | "medium" | "high";

  const [columns, setColumns] = useState<Record<ColumnKey, Column>>({
    low: {
      id: "low",
      title: t("lowPriority"),
      taskIds: [],
    },
    medium: {
      id: "medium",
      title: t("mediumPriority"),
      taskIds: [],
    },
    high: {
      id: "high",
      title: t("highPriority"),
      taskIds: [],
    },
  });

  useEffect(() => {
    if(tasks) {
      let taskArray = tasks;

      if(search) {
        taskArray = tasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));
      }
      setColumns({
        low: {
          id: "low",
          title: t("lowPriority"),
          taskIds: taskArray
            .filter((task) => task.priority === "low")
            .map((task) => task.id),
        },
        medium: {
          id: "medium",
          title: t("mediumPriority"),
          taskIds: taskArray
            .filter((task) => task.priority === "medium")
            .map((task) => task.id),
        },
        high: {
          id: "high",
          title: t("highPriority"),
          taskIds: taskArray
            .filter((task) => task.priority === "high")
            .map((task) => task.id),
        },
      });
    }
  }, [tasks, search, i18n.language]);


  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceColumn = columns[source.droppableId as ColumnKey];
    const movedTaskId = sourceColumn.taskIds[source.index];
    const movedTask = tasks.find((task) => task.id === movedTaskId);
    if (!movedTask) return;

    const updatedTask = {
      ...movedTask,
      priority: destination.droppableId as ColumnKey,
    };
    dispatch(updateTask(updatedTask));
  };

  const handleAddTask = (priority: string) => {
    onOpenModal(undefined, priority);
  };

  const handleEditTask = (task: TaskData) => {
    onOpenModal(task);
  };


  return (
    <>
    <div>
        <h2>{t("searchTask")}</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={style.inputField}
        />
      </div>
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="columns">
        {Object.keys(columns).map((columnId) => {
          const column = columns[columnId as ColumnKey];
          return (
            <div key={column.id} className="column">
              <div className={style.columnHeader}>
                <h3>{column.title}</h3>
                <button onClick={() => handleAddTask(column.id)}>
                  <PlusCircleIcon
                    width={24}
                    height={24}
                    color="rgb(255,173,0)"
                  />
                </button>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="no-bullets"
                  >
                    {column.taskIds.map((taskId, index) => {
                      const task = tasks.find((task) => task.id === taskId);
                      if (!task) return null;
                      return (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                onPress={() => handleEditTask(task)}
                                className="grid-view-task"
                                task={task}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
    </>

  );
};

export default GridView;
