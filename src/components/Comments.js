import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { sendRequest } from '../utils/sendRequest';
import "../css/Comments.css";
import Modal from "./Modal";

const Comments = ({ requestId }) => {
  const [comments, setComments] = useState([]);
  const [showAddCommentModal, setShowAddCommentModal] = useState(false); // State to control the modal visibility
  const [user_id] = useState(localStorage.getItem('user_id'));
  const [token] = useState(localStorage.getItem('token'));
  const [selectedAcademy] = useState(localStorage.getItem('academy'));

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const config = {
            method: 'get',
            url: `http://localhost:3002/comments/requests/${requestId}`,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          };
    
          const response = await sendRequest(config);

          setComments(response);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
    setInterval(() => {
        fetchComments();
    }, 10000);
  }, [requestId]);

  const handleDeleteComment = async (comment) => {
    try {
        const commentId = comment.id;
      if (user_id === comment.user_id) {
        const config = {
          method: 'delete',
          url: `http://localhost:3002/comments/${commentId}`,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        await sendRequest(config);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
<div className="comments-section">
  <h2>Комментарии</h2>
  <ul className="comments-list">
    {comments.map((comment, index) => (
      <li className="comment-item" key={index}>
        <div className="comment-header">
          <h3 className="comment-author">{comment.name}</h3>
          <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="comment-academy">Академия: {comment.academy}</p>
        <p className="comment-description">{comment.description}</p>
        {user_id === comment.user_id && (
            <div className="comment-buttons">
              <button
                className="delete-comment-button"
                onClick={() => handleDeleteComment(comment)}
              >
                Удалить
              </button>
            </div>
        )}

      </li>
    ))}
  </ul>
  <div className="add-comment-button-container">
  <Modal requestId={requestId} />
      </div>
      
</div>


  );
}

export default Comments;