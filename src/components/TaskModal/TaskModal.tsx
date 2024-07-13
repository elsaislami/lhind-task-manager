import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import { Comment, TaskData, User } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { addComment } from "../../store/tasks/taskSlice";
import styles from "./TaskModal.module.css";
import { useTranslation } from "react-i18next";
import { getUsers } from "../../store/auth/authSlice";

const TaskModal: React.FC<{
  selectedTask: TaskData | null;
  priority?: string;
  showModal: boolean;

  onClose: () => void;
  onSave: (task: TaskData) => void;
}> = ({ selectedTask, priority, showModal, onClose, onSave }) => {
  const dispatch = useDispatch<AppDispatch>();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const [task, setTask] = useState<TaskData>({
    id: "",
    title: "",
    description: "",
    priority: priority ? priority : "low",
    userId: "",
  });

  const [comment, setComment] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  const users = useSelector((state: RootState) => state.auth.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedTask) {
      setTask(selectedTask);
      const user = users.find((user) => user.id === selectedTask.userId);
      setSelectedUserName(user ? `${user.name} ${user.last_name}` : "");
    } else if (priority) {
      setTask((prev) => ({ ...prev, priority }));
    }
  }, [selectedTask, priority, users]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    setSelectedUserName("");
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

  const handleUserSelect = (user: User) => {
    setTask({
      ...task,
      userId: user.id,
    });
    setSelectedUserName(`${user.name} ${user.last_name}`);
    setSearchTerm("");
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <h2>{selectedTask ? t("editTask") : t("addTask")}</h2>
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
          <option value="low">{t("lowPriority")}</option>
          <option value="medium">{t("mediumPriority")}</option>
          <option value="high">{t("highPriority")}</option>
        </select>

        <div className={styles.selectContainer}>
          <input
            type="text"
            placeholder="Assign to user"
            autoComplete="off"
            value={selectedUserName || searchTerm}
            onChange={handleSearchInput}
            className={styles.inputField}
          />
          {searchTerm && filteredUsers.length > 0 && (
            <ul className={styles.suggestionsList}>
              {filteredUsers.map((user, index) => (
                <li
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => handleUserSelect(user)}
                >
                  {user.name} {user.last_name} (ID: {user.id})
                </li>
              ))}
            </ul>
          )}
        </div>

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
            {t("save")}
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
            {t("cancel")}
          </button>
          <button
            onClick={() => {
              onSave(task);
              onClose();
            }}
            className={styles.saveButton}
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
