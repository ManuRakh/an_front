import "../css/ViewRequests.css";
import axios from 'axios';
import { sendRequest } from '../utils/sendRequest';
import React, { useState, useEffect } from 'react';
import "../css/IncomingRequests.css";
import generateWorkersPromises from "./utils/getWorkers";
import updateRequestStatus from "./utils/updateRequestStatus";
import { Link } from 'react-router-dom'; // Импортируйте Link из react-router-dom
import { convertStatusToEn, convertStatusToRu } from "./utils/convertStatusToEn";
import dotenv from "dotenv";
dotenv.config();

function ViewRequests() {
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [groupedRequests, setGroupedRequests] = useState({});
    const [statusOptions] = useState(['Отправлено', 'В процессе', 'На проверке', 'Подтверждено']);

    useEffect(() => {
      const fetchIncomingRequests = async () => {
        try {
          const token = localStorage.getItem('token');
          const selectedAcademy = localStorage.getItem('academy');
          const config = {
            method: 'get',
            url: `${process.env.main_host}/requests/outcoming/requests?selected_academy=${selectedAcademy}`,
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
          const newGroupedRequests = statusOptions.reduce((acc, status) => {
            acc[status] = updatedRequests.filter(request => request.status === convertStatusToEn(status));
            return acc;
          }, {});
          setGroupedRequests(newGroupedRequests);

        } catch (error) {
          console.error('Ошибка при получении присланных заявок', error);
          const errMsg = error.response?.data?.error || 'Произошла ошибка';
          setErrorMessage(errMsg);
        }
      };
  
      fetchIncomingRequests();
    }, []);

      return (
<div className='incoming-requests-container'>
  <h2>Отправленные заявки</h2>
  {errorMessage && <p className="error">{errorMessage}</p>}
  <div className="requests-columns">
          {
          statusOptions.map(status => (
            <div key={status} className={`request-column request-column-${status}`}>
              <h2 className='open-request-button'>{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
              
              {(
                <ul>
                  { (groupedRequests[status] || []).map(request => (
                    <li key={request.id} className="incoming-requests-item">
                      <div className="request-info">
                      <strong>Академия Получвшая Запрос:</strong> {request.receiving_academy}
                      </div>
                      <div className="request-info">
                          <strong>Исполнитель:</strong> {request.workerData?.name} {request.workerData?.surname}
                      </div>
                      <div className="request-info">
                          <strong>Описание:</strong> {request.description}
                      </div>
                      <div className="request-info">
                      <strong>Статус:</strong> { convertStatusToRu(request.status)}
                      </div>
                      <div className="request-info">

                      <Link to={`/incoming-requests/${request.id}`} className="view-request-button">
                        Открыть карточку заявки
                      </Link>
                      </div>

                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
</div>
      );
}

export default ViewRequests;
