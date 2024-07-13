import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { addTask, updateTask } from "../../store/tasks/taskSlice";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import TaskCard from "../TaskCard/TaskCard";
import style from "./GridView.module.css";
import TaskModal from "../TaskModal/TaskModal";
import { TaskData } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

const GridView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>("");

  const { t } = useTranslation();

  const columns: {
    [key: string]: { id: string; title: string; taskIds: string[] };
  } = {
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
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const movedTaskId = sourceColumn.taskIds[source.index];
    const movedTask = tasks.find((task) => task.id === movedTaskId);
    if (!movedTask) return;

    const updatedTask = {
      ...movedTask,
      priority: destination.droppableId as "low" | "medium" | "high",
    };

    dispatch(updateTask(updatedTask));
  };

  const handleAddTask = (priority: string) => {
    setSelectedPriority(priority);
    setShowModal(true);
    setSelectedTask(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const generateUniqueId = (): string => {
    let newId = uuidv4();
    while (tasks.some((task) => task.id === newId)) {
      newId = uuidv4();
    }
    return newId;
  };

  const handleSaveTask = (task: TaskData) => {
    if (selectedTask) {
      dispatch(updateTask(task));
    } else {
      const newTask = {
        ...task,
        id: generateUniqueId(),
      };
      dispatch(addTask(newTask));
    }
    handleCloseModal();
  };

  const handleEditTask = (task: TaskData) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="columns">
          {Object.keys(columns).map((columnId) => {
            const column = columns[columnId];
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

      {showModal && (
        <TaskModal
          selectedTask={selectedTask}
          priority={selectedPriority}
          showModal={showModal}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}
    </>
  );
};

export default GridView;
