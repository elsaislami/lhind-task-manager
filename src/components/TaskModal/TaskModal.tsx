import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import { Comment, TaskData } from "../../types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { addComment } from "../../store/tasks/taskSlice";
import styles from "./TaskModal.module.css";
import { useTranslation } from "react-i18next";

const TaskModal: React.FC<{
  selectedTask: TaskData | null;
  priority?: string;
  showModal: boolean;
  onClose: () => void;
  onSave: (task: TaskData) => void; // New prop for save handler
}> = ({ selectedTask, priority, showModal, onClose, onSave }) => {
  const dispatch = useDispatch<AppDispatch>();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const [task, setTask] = useState<TaskData>({
    id: "",
    title: "",
    description: "",
    priority: priority ? priority : "low",
    assignedTo: "",
  });

  const [comment, setComment] = useState<string>("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleCommentSubmit = () => {
    dispatch(
      addComment({
        taskId: selectedTask?.id,
        text: comment,
        user: "John",
        date: new Date(),
      } as Comment)
    );
    setComment("");
  };

  useEffect(() => {
    if (selectedTask) {
      setTask(selectedTask);
    } else if (priority) {
      setTask((prev) => ({ ...prev, priority }));
    }
  }, [selectedTask, priority]);

  const handleOutsideClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <h2>{selectedTask ? "Edit Task" : "Add New Task"}</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={task.title}
          onChange={handleInputChange}
          className={styles.inputField}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={task.description}
          onChange={handleInputChange}
          className={styles.textArea}
        />
        <select
          name="priority"
          value={task.priority}
          onChange={handleInputChange}
          className={styles.selectField}
        >
          <option value="low"> {t("lowPriority")} </option>
          <option value="medium">{t("mediumPriority")}</option>
          <option value="high">{t("highPriority")}</option>
        </select>
        <input
          type="text"
          name="assignedTo"
          placeholder="Assign to user"
          value={task.assignedTo}
          onChange={handleInputChange}
          className={styles.inputField}
        />
        <input
          type="file"
          onChange={(e) => console.log(e.target.files)}
          className={styles.fileInput}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <textarea
            name="comment"
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.textArea}
          />
          <button onClick={handleCommentSubmit} className={styles.button}>
            Save
          </button>
        </div>
        {task.comments && task.comments.length > 0 && (
          <div className={styles.commentSection}>
            <h3>Comments</h3>
            {task.comments.map((comment: Comment, index) => (
              <div key={index} className={styles.comment}>
                <p>{comment.text}</p>
                <p className={styles.commentUser}>{comment.user}</p>
              </div>
            ))}
          </div>
        )}
        <div className={styles.buttonGroup}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(task);
              onClose();
            }}
            className={styles.saveButton}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
