import "../css/ViewRequests.css";
import axios from 'axios';
import { sendRequest } from '../utils/sendRequest';
import React, { useState, useEffect } from 'react';
import "../css/IncomingRequests.css";
import generateWorkersPromises from "./utils/getWorkers";
function ViewRequests() {
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [newStatus, setNewStatus] = useState('processing');
    const [statusOptions] = useState(['scheduled', 'processing', 'review', 'approved']);
  
    useEffect(() => {
      const fetchIncomingRequests = async () => {
        try {
          const token = localStorage.getItem('token');
          const selectedAcademy = localStorage.getItem('academy');
          const config = {
            method: 'get',
            url: `http://localhost:3002/requests/outcoming/requests?selected_academy=${selectedAcademy}`,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          };
  
          const response = await sendRequest(config);
  
          // Запрос для получения данных о сотрудниках на основе worker_id
          const workersPromises = generateWorkersPromises(response, token, false)
  
          const workersData = await Promise.all(workersPromises);

          const updatedRequests = response.map((request) => {
            console.log(request, workersData)
            const matchingWorker = workersData.find((worker) => worker.id === request.worker_id);
  
            return {
              ...request,
              workerData: matchingWorker,
            };
          });
  
          setIncomingRequests(updatedRequests);
        } catch (error) {
          console.error('Ошибка при получении присланных заявок', error);
          const errMsg = error.response?.data?.error || 'Произошла ошибка';
          setErrorMessage(errMsg);
        }
      };
  
      fetchIncomingRequests();
    }, []);
    const handleUpdateStatus = async (requestId, newStatus, selectedAcademy) => {
        try {
          const token = localStorage.getItem('token');
          
          const config = {
            method: 'patch',
            url: `http://localhost:3002/requests/${requestId}?selected_academy=${selectedAcademy}`,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            data: JSON.stringify({
              status: newStatus,
            }),
          };
    
          await sendRequest(config);
    
          // Обновление статуса в incomingRequests
          const updatedRequests = incomingRequests.map((request) => {
            if (request.id === requestId) {
              return {
                ...request,
                status: newStatus,
              };
            }
            return request;
          });
    
          setIncomingRequests(updatedRequests);
    
          console.log(`Статус заявки ${requestId} обновлен на ${newStatus}`);
        } catch (error) {
          console.error('Ошибка при обновлении статуса', error);
          const errMsg = error.response?.data?.error || 'Произошла ошибка';
          setErrorMessage(errMsg);
        }
      };
      return (
<div className='incoming-requests-container'>
  <h2>Присланные заявки</h2>
  {errorMessage && <p className="error">{errorMessage}</p>}
  <ul>
    {incomingRequests.map((request) => (
      <li key={request.id} className="incoming-requests-item">
        <strong>Академия Отправившая запрос:</strong> {request.sender_academy} | <strong>Исполнитель:</strong> {request.workerData?.name || ""} {request.workerData.surname} | <strong>Описание:</strong> {request.description} | <strong>Статус:</strong> {request.status === "scheduled" ? "Запрошено" : request.status }
        <select onChange={(e) => setNewStatus(e.target.value)} value={newStatus} className="status-select">

          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button onClick={() => handleUpdateStatus(request.id, newStatus, request.receiving_academy)} className="update-status-button">Обновить статус</button>

      </li>
    ))}
  </ul>
</div>
      );
}

export default ViewRequests;
