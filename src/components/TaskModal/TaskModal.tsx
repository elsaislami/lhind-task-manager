import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import { Comment, TaskData, User } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { addComment } from "../../store/tasks/taskSlice";
import styles from "./TaskModal.module.css";
import { useTranslation } from "react-i18next";
import { getUsers } from "../../store/auth/authSlice";
import { use } from "i18next";

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
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const initialTaskObject = {
    id: "",
    title: "",
    description: "",
    priority: priority ? priority : "low",
    userId: "",
  };
  const [task, setTask] = useState<TaskData>(initialTaskObject);

  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
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
    if (selectedUserName) setSelectedUserName("");
  };

  const handleCommentSubmit = () => {
    dispatch(
      addComment({
        taskId: selectedTask?.id,
        text: comment,
        userId: currentUser?.id,
        date: new Date(),
      } as Comment)
    );
    setComments((prev:any) => {
      return [
        ...prev,
        {
          text: comment,
          userId: currentUser?.id,
          date: new Date(),
        },
      ];
    });
    
    setComment("");
  };

  const handleUserSelect = (user: User) => {
    setTask({
      ...task,
      userId: user.id,
      user: user,
    });
    setSelectedUserName(`${user.name} ${user.last_name}`);
    if (searchTerm) setSearchTerm("");
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const clearPageState = () => {
    setSearchTerm("");
    setSelectedUserName("");
    setTask(initialTaskObject);
  };

  const getCommentUser = (commentUserId: string) => {
    const user = users.find((user) => user.id === commentUserId);
    return user ? user : null;
  };

  useEffect(() => { 
    if(task && task.comments && task.comments.length > 0) {
      setComments(task.comments);
    }
  }, [task]);
  
  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => {
      onClose();
    }}>
      <div className={styles.modalContent} ref={modalRef} onClick={(e) => e.stopPropagation()}>
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
          {task.user && (
            <>
              <button
                onClick={() => {
                  setTask({ ...task, userId: "", user: undefined });
                  setSelectedUserName("");
                }}
                className={styles.clearButton}
              >
                {t("removeAssignedUser")}
              </button>
            </>
          )}
        </div>

        <input
          type="file"
          onChange={(e) => console.log(e.target.files)}
          className={styles.fileInput}
        />
        {selectedTask && selectedTask.id && (
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
        )}
        {comments && comments.length > 0 && (
          <>
            <h3>Comments</h3>

            <div className={styles.commentSection}>
              {comments.map((comment: Comment, index) => (
                <div key={index} className={styles.comment}>
                  <p>{comment.text}</p>
                  <p className={styles.commentUser}>
                    {getCommentUser(comment.userId)?.name +
                      " " +
                      getCommentUser(comment.userId)?.last_name}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
        <div className={styles.buttonGroup}>
          <button
            onClick={() => {
              onClose();
              clearPageState();
            }}
            className={styles.cancelButton}
          >
            {t("cancel")}
          </button>
          <button
            onClick={() => {
              onSave(task);
              clearPageState();
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
