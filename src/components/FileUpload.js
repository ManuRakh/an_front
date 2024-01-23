import React, { useState } from 'react';
import { sendRequest } from '../utils/sendRequest';

const FileUpload = ({ onFileUpload }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    setFiles([...files, ...selectedFiles]);
    const filesArray = Array.from(selectedFiles); // Преобразовать FileList в массив
    const filePromises = [];

    filesArray.forEach((file) => {
        console.log(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        console.log({reader})
        filePromises.push(
            new Promise((resolve, reject) => {
              reader.onload = async () => {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('user_id');
                const createFileData = {
                    data: reader.result,
                    filename: file.name,
                    user_id: userId,
                };

                const config = {
                  method: 'post',
                  url: `http://45.87.247.215:3002/files`,
                  headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  data: JSON.stringify(createFileData)
                };
        
                const response = await sendRequest(config);
        
                resolve(response);
              };
              reader.onerror = (error) => {
                reject(error);
              };
            })
          );
    });
    const uploadedFiles = await Promise.all(filePromises);
    onFileUpload(uploadedFiles);
    setFiles([]);
  };

  const handleUpload = async () => {
    const filePromises = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      filePromises.push(
        new Promise((resolve, reject) => {
          reader.onload = () => {
            resolve({ filename: file.name, data: reader.result });
          };
          reader.onerror = (error) => {
            reject(error);
          };
        })
      );
    });

    const uploadedFiles = await Promise.all(filePromises);
    onFileUpload(uploadedFiles);
    setFiles([]);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;
