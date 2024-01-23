import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { sendRequest } from '../utils/sendRequest';
import "../css/Comments.css";
import Modal from "./Modal";


const downloadFile = (base64Data, fileName) => {
    const byteArray = atob(base64Data.split(',')[1]);
    const byteNumbers = new Array(byteArray.length);
  
    for (let i = 0; i < byteArray.length; i++) {
      byteNumbers[i] = byteArray.charCodeAt(i);
    }
  
    const byteArrayBuffer = new Uint8Array(byteNumbers);
    const fileBlob = new Blob([byteArrayBuffer], { type: 'application/octet-stream' });
  
    const fileUrl = URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  
    URL.revokeObjectURL(fileUrl);
  };

  
const Comments = ({ requestId }) => {
  const [comments, setComments] = useState([]);
  const [showAddCommentModal, setShowAddCommentModal] = useState(false); // State to control the modal visibility
  const [user_id] = useState(localStorage.getItem('user_id'));
  const [token] = useState(localStorage.getItem('token'));
  const [selectedAcademy] = useState(localStorage.getItem('academy'));
  const [base64Files, setBase64Files] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const config = {
            method: 'get',
            url: `http://45.87.247.215:3002/comments/requests/${requestId}`,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          };
    
          const response = await sendRequest(config);
          for (const res of response) {
            if (res.file_ids) {
                const parsedFiles = JSON.parse(res.file_ids);
                if (!parsedFiles.length) continue;
                res.parsedFiles = [];

                for (const fileId of parsedFiles) {
                    const fileConfig = {
                        method: 'get',
                        url: `http://45.87.247.215:3002/files/${fileId}`,
                        headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json',
                        },
                      };
                
                      const fileResponse = await sendRequest(fileConfig);
                      res.parsedFiles.push(fileResponse);
                }
                
              }
          }

          console.log({response})
          setComments(response);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
    setInterval(() => {
        fetchComments();
    }, 2000);
  }, [requestId]);

  const handleDeleteComment = async (comment) => {
    try {
        const commentId = comment.id;
      if (user_id === comment.user_id) {
        const config = {
          method: 'delete',
          url: `http://45.87.247.215:3002/comments/${commentId}`,
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

  const handleDownloadFile = (base64Data, fileName) => {
    downloadFile(base64Data, fileName);
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
        {comment?.parsedFiles?.length && comment.parsedFiles.map((file) => 
        
        (

            <section>
            <div class="center">

        <a 
        className="trigger"
        onClick={() => handleDownloadFile(file.data, file.filename)}
      >
      <span>
        <em>{file.filename}</em>
        <i aria-hidden="true"></i>
      </span>
            </a>
            </div>
</section>

            )
      
      )}

            <br/>
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