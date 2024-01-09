import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sendRequest } from '../utils/sendRequest';
import "../css/RequestDetail.css";
import generateWorkersPromises from './utils/getWorkers';
import updateRequestStatus from './utils/updateRequestStatus';
import { convertStatusToRu } from './utils/convertStatusToEn';
import Comments from './Comments';
import dotenv from "dotenv";
dotenv.config();

const RequestDetail = () => {
    const { requestId } = useParams();
    const [requestData, setRequestData] = useState(null);
    const [statusOptions] = useState(['scheduled', 'processing', 'review', 'approved']);
    const [newStatus, setNewStatus] = useState(statusOptions[0]); // Состояние для нового статуса

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const selectedAcademy = localStorage.getItem('academy');

        const config = {
          method: 'get',
          url: `${process.env.main_host}/requests/${requestId}?selected_academy=${selectedAcademy}`,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        const response = await sendRequest(config);
        const workersPromises = generateWorkersPromises([response], token, true);
  
        const [workersData] = await Promise.all(workersPromises);
        response.workerData = workersData;
        console.log(response)
        setRequestData(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [requestId]);

  const handleStatusChange = async () => {
    try {
      const token = localStorage.getItem('token');
      const selectedAcademy = localStorage.getItem('academy');

      const config = {
        method: 'get',
        url: `${process.env.main_host}/requests/${requestId}?selected_academy=${selectedAcademy}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await sendRequest(config);
      const workersPromises = generateWorkersPromises([response], token, true);

      const [workersData] = await Promise.all(workersPromises);
      response.workerData = workersData;
      setRequestData(response);
    } catch (error) {
      console.error(error);
    }
  };
  const updateStatus = async () => {
    try {
      await updateRequestStatus(requestData, newStatus, requestData.receiving_academy);
      
      setRequestData((prevData) => ({
        ...prevData,
        status: newStatus, // Обновляем статус новым значением
      }));
      } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="incoming-requests-container-details"> {/* Применяем класс стиля к контейнеру */}
      {requestData ? (
        <div>
          <h1>Запрос полученный от {requestData.sender_academy}</h1>

          <strong>Статус:</strong> { convertStatusToRu(requestData.status)}
          <strong>Исполнитель:</strong> {requestData.workerData?.name} {requestData.workerData?.surname}
          <strong>Должность:</strong> {requestData.workerData?.name} {requestData.workerData?.spec}

          <strong>Описание:</strong> {requestData.description}
          {/* Добавляем выпадающий список для выбора нового статуса */}
          <select
            className="status-select"
            onChange={(e) => setNewStatus(e.target.value)}
            value={newStatus}
          >
                      {statusOptions.map((option) => (
                        <option key={convertStatusToRu(option)} value={option}>
                          {convertStatusToRu(option)}
                        </option>
                      ))}
          </select>

          <button
  className="update-status-button"
  onClick={updateStatus} // Уберите () после функции
>
  Обновить статус
</button>
<Comments requestId={requestData.identifier} />

        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RequestDetail;
