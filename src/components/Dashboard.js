import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Dashboard.css';
import WorkerList from "./WorkerList.js";
import { sendRequest } from '../utils/sendRequest.js';
import fetchWorkersFn from './utils/fetchAllWorkers.js';
import getMe from './utils/getMe.js';

function Dashboard({ onSetIsAuthenticated }) {
  const [worker, setWorker] = useState({ spec: '', name: '', surname: '' });
  const [workers, setWorkers] = useState([]);
  const [allWorkers, setAllWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState([]);

  const handleChange = (e) => {
    setWorker({ ...worker, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const token = localStorage.getItem('token');
        const currentAcademy = localStorage.getItem('academy');

        const config = {
          method: 'get',
          url: `http://localhost:3002/workers?selected_academy=${currentAcademy}`,
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await sendRequest(config);

        setWorkers(response);
      } catch (error) {
        console.error('Ошибка при получении данных о сотрудниках', error);
        const errMsg = error.response.data.error;
        if (errMsg === "Not authenticated") onSetIsAuthenticated(false)
      }
    };

    const fetchAllWorkers = async () => {
      try {
        const response = await fetchWorkersFn();

        setAllWorkers(response);
      } catch (error) {
        console.error('Ошибка при получении данных о сотрудниках', error);
        const errMsg = error.response.data.error;
        if (errMsg === "Not authenticated") onSetIsAuthenticated(false)
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await getMe();

        setIsAdmin(response.role === "admin");
      } catch (error) {
        console.error('Ошибка при получении данных о пользователях', error);
      }
    };

    
    fetchWorkers();
    fetchAllWorkers();
    fetchUsers();
  }, []);

  const handleDeleteWorker = async (workerId) => {
    try {
      const token = localStorage.getItem('token');
      const currentAcademy = localStorage.getItem('academy');
      await sendRequest({
        method: 'delete',
        url: `http://localhost:3002/workers/${workerId}?selected_academy=${currentAcademy}`,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      // Обновляем состояние, исключая удаленного сотрудника
      setWorkers(currentWorkers => currentWorkers.filter(w => w.id !== workerId));
    } catch (error) {
      console.error('Ошибка при удалении сотрудника', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const config = {
        method: 'post',
        url: 'http://localhost:3002/workers',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: worker
      };

      const foundWorker = await sendRequest(config);

      if (foundWorker) setWorkers(currentWorkers => [...currentWorkers, foundWorker]);

    } catch (error) {
      console.error('Ошибка при создании воркера', error);
    }
  };
  return (
    <div className="dashboard-container">
            <h4>Один пользователь может иметь не более 1 работника академии в системе. Если вы админ, вам доступно создание пользователей, после этого пользователь сам создаст себе работника академии</h4>

            <WorkerList workers={allWorkers} onDeleteWorker={handleDeleteWorker} />

      { !workers.length && (
      <div className="create-worker-form">
        <h2>Создание Работника</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="spec" value={worker.spec} onChange={handleChange} placeholder="Должность" />
          <input type="text" name="name" value={worker.name} onChange={handleChange} placeholder="Имя" />
          <input type="text" name="surname" value={worker.surname} onChange={handleChange} placeholder="Фамилия" />
          {/* <select 
            name="user_id" 
            value={worker.user_id} 
            onChange={handleChange} 
            required
          >
            <option value="">Выберите пользователя</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name} {user.surname}</option>
            ))}
          </select> */}
          <button type="submit">Создать Работника</button>
        </form>
      </div>)}
      <br/>
      {isAdmin && (
              <div className="create-worker-form">
              <h2>Создание Пользователя</h2>
              <form onSubmit={handleSubmit}>
          <input type="text" name="spec" value={worker.spec} onChange={handleChange} placeholder="Должность" />
          <input type="text" name="name" value={worker.name} onChange={handleChange} placeholder="Имя" />
          <input type="text" name="surname" value={worker.surname} onChange={handleChange} placeholder="Фамилия" />
</form>
                </div>
      )}
    </div>
  );
}

export default Dashboard;
