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
import { use } from "i18next";

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
  const { t } = useTranslation();
  type ColumnKey = "low" | "medium" | "high";

  const [columns, setColumns] = useState< Record<ColumnKey, Column>>({
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
      console.log(tasks);
      
      setColumns({
        low: {
          id: "low",
          title: t("lowPriority"),
          taskIds: tasks
            .filter((task) => task.priority === "low")
            .map((task) => task.id),
        },
        medium: {
          id: "medium",
          title: t("mediumPriority"),
          taskIds: tasks
            .filter((task) => task.priority === "medium")
            .map((task) => task.id),
        },
        high: {
          id: "high",
          title: t("highPriority"),
          taskIds: tasks
            .filter((task) => task.priority === "high")
            .map((task) => task.id),
        },
      });
    }
  }, [tasks]);


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
  );
};

export default GridView;
