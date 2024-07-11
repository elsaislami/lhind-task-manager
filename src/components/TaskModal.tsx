import React, { useState, ChangeEvent, useEffect } from 'react';
import { Comment, TaskData } from '../types';
import { useDispatch } from "react-redux";
import { AppDispatch } from '../store';
import { addComment } from '../store/tasks/taskSlice';


const TaskModal: React.FC<{ selectedTask: TaskData | null, priority?:string }> = ({ selectedTask, priority }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [task, setTask] = useState<TaskData>({
    id: '',
    title: '',
    description: '',
    priority: priority ? priority : 'low',
    assignedTo: "",
  });

  const [comment, setComment] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {

      //todo handle file upload
      console.log(e.target.files);
    }
  };

  const handleSubmit = () => {
    // Handle form submission logic
    console.log(task);
  };
  
  const handleCommentSubmit = () => {
    dispatch(addComment({ taskId: selectedTask?.id, text: comment, user: "John", date: new Date()} as Comment));
    setComment('');
    console.log(comment);
  }

  useEffect(() => {
    if (selectedTask) {
      setTask(selectedTask);
    }
  }, [selectedTask]);

  return (
    <div className="task-card">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={task.title}
        onChange={handleInputChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={task.description}
        onChange={handleInputChange}
      ></textarea>
      <select name="priority" value={task.priority} onChange={handleInputChange}>
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>
      <input
        type="text"
        name="assignedTo"
        placeholder="Assign to user"
        value={task.assignedTo}
        onChange={handleInputChange}
      />
      <input type="file" onChange={handleAttachmentChange} />
      {/* //todo handle new comment */}
      <textarea
        name="comment"
        placeholder="Add a comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button onClick={handleCommentSubmit}>Save Comment</button>

      {task.comments && (
        <div>
          <h3>Comments</h3>
          {task.comments.map((comment: Comment,index) => (
            <div key={index}>
              <p>{comment.text}</p>
              <p>{comment.user}</p>
            </div>
          ))}
        </div>
      )}

      
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
};

export default TaskModal;
