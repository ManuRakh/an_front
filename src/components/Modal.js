import React, { useState } from 'react';
import "../css/Modal.css";
import { sendRequest } from '../utils/sendRequest';
import { useParams } from 'react-router-dom';
import FileUpload from './FileUpload';
import dotenv from "dotenv";
dotenv.config();

const AddCommentModal = ({ requestId }) => {
  const [showModal, setShowModal] = useState(false);
  const [commentData, setCommentData] = useState({
    description: '',
    name: '',
    files: []
  });

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setCommentData({ ...commentData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCommentData({ ...commentData, files: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here, add your logic to send commentData to your backend or state management
    // For example, a POST request to your server
    const currentAcademy = localStorage.getItem('academy');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    if (!currentAcademy) throw new Error("Academy not found");

    let data = JSON.stringify({
        description: commentData.description,
        name: commentData.name,
        file_ids: commentData.files || [], // Here you need to process and include the file IDs
        academy: currentAcademy, // Assuming this is static or passed as a prop
        request_id: requestId,
        user_id: userId,
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.main_host}/comments`,
        headers: { 
          'accept': 'application/json', 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` // Assuming the token is passed as a prop
        },
        data: data
      };
  
      await sendRequest(config);
    handleCloseModal();
  };
  const handleFileUpload = (uploadedFiles) => {
    // Здесь вы можете обработать массив uploadedFiles и отправить их на бэкенд
    console.log(uploadedFiles)
    setCommentData({ ...commentData, files: uploadedFiles });

  };
  return (
    <div>
      <div className="add-comment-button-container">
        <button className="add-comment-button" onClick={handleOpenModal}>Добавить комментарий</button>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>&times;</span>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Name" value={commentData.name} onChange={handleInputChange} />
              <textarea name="description" placeholder="Description" value={commentData.description} onChange={handleInputChange} />
              <FileUpload onFileUpload={handleFileUpload} /> {/* Добавьте компонент FileUpload здесь */}
              <button type="submit">Submit Comment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCommentModal;
