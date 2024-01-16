import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { sendRequest } from '../utils/sendRequest';
import '../css/RequestForm.css';
import fetchWorkersFn from './utils/fetchAllWorkers';


function CreateRequestForm({ onSetIsAuthenticated }) {
    const [academies, setAcademies] = useState([]);
    const [selectedAcademy, setSelectedAcademy] = useState('physics');
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState('');
    const [description, setDescription] = useState('');
    const [isRequestSent, setIsRequestSent] = useState(false); // Состояние для отслеживания отправки заявки
    const [errorMessage, setErrorMessage] = useState('');
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messageType, setMessageType] = useState('success'); // Добавляем тип сообщения

    const showMessage = (text, type = 'success', duration = 3000) => {
        setMessageText(text);
        setMessageType(type);
        setIsMessageVisible(true);
        setTimeout(() => {
          setIsMessageVisible(false);
        }, duration);
      };
  
  
    useEffect(() => {
      const fetchAcademies = async () => {
        try {
          const token = localStorage.getItem('token');
          const config = {
            method: 'get',
            url: `https://b286-62-89-209-162.ngrok-free.app/supporting_academies`, // Обратите внимание, что мы убрали базовый URL
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          };
  
          const response = await sendRequest(config);

          setAcademies(response);
          setSelectedAcademy(response[0]);
        } catch (error) {
          console.error('Ошибка при получении данных о академиях', error);
          const errMsg = error.response?.data?.error || 'Произошла ошибка';
          setErrorMessage(errMsg);
  
          showMessage(errMsg, 'error', 3000);
  
          if (errMsg === 'Not authenticated') {
            return onSetIsAuthenticated(false);
          }
        }
      };
  
      fetchAcademies();
    }, []);
  
    useEffect(() => {
        if (selectedAcademy) {
          const fetchWorkers = async () => {
            try {  
              const response = await fetchWorkersFn(selectedAcademy);

              setWorkers(response);
              setSelectedWorker(response[0] || '');
            } catch (error) {
              console.error('Ошибка при получении данных о сотрудниках', error);
              const errMsg = error.response?.data?.error;
              if (errMsg === 'Not authenticated') {
                onSetIsAuthenticated(false);
              }
            }
          };
    
          fetchWorkers();
        }
      }, [selectedAcademy, onSetIsAuthenticated]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const foundWorker = typeof selectedWorker === "string" ? workers.find(worker => {
        return worker.id === selectedWorker;
      }): selectedWorker;

      console.log(foundWorker)
      const requestData = {
      worker_id: foundWorker.id,
      receiver_user_id: foundWorker.user_id,
      description,
    };
    const token = localStorage.getItem('token'); 

    const config = {
        method: 'post',
        url: `https://b286-62-89-209-162.ngrok-free.app/requests?selected_academy=${selectedAcademy}`, // Обратите внимание на базовый URL
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(requestData),
      };
      await sendRequest(config);

      showMessage('Заявка успешно создана!', 'success', 3000);

      // Очищаем поля для ввода
      setSelectedWorker('');
      setDescription('');
    } catch (error) {
        console.error('Ошибка при отправке заявки', error);
        const errMsg = error.response?.data?.error || 'Произошла ошибка';
        setErrorMessage(errMsg);

        showMessage(errMsg, 'error', 3000);

        if (errMsg === 'Not authenticated') {
          return onSetIsAuthenticated(false);
        }

      }
  
  };

  return (
    <div>
              {errorMessage && <p className="error">{errorMessage}</p>}

    <form onSubmit={handleSubmit} className="create-request-form">
      <div>
        <label>Выберите академию:</label>
        <select
          value={selectedAcademy}
          onChange={(e) => setSelectedAcademy(e.target.value)}
        >
  
          {academies.map((academy) => (
            <option key={academy} value={academy}>
              {academy}  
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Выберите сотрудника:</label>
        <select
          value={selectedWorker}
          onChange={(e) => setSelectedWorker(e.target.value)}
        >
          {workers.map((worker) => (
            <option key={worker.id} value={worker.id}>
              {worker.name} {worker.surname}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Описание заявки:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
        ></textarea>
      </div>
      <div>
        <button type="submit">Отправить заявку</button>
      </div>
    </form>
    {isMessageVisible && (
        <div className={`popup-message ${messageType}`}>
          <p>{messageText}</p>
        </div>
      )}

        </div>
    
  );
}

export default CreateRequestForm;
