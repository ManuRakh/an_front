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

  const [user, setUser] = useState({ 
    name: '', 
    phone: '',
    telegram: '',
    role: '',
    username: '',
    password: '',
  });
  const handleChange = (e) => {
    setWorker({ ...worker, [e.target.name]: e.target.value });
  };

  const handleChangeUser = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const token = localStorage.getItem('token');
        const currentAcademy = localStorage.getItem('academy');

        const config = {
          method: 'get',
          url: `http://45.87.247.215:3002/workers?selected_academy=${currentAcademy}`,
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = (await sendRequest(config))?.filter(res => res !== null);
        
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
        url: `http://45.87.247.215:3002/workers/${workerId}?selected_academy=${currentAcademy}`,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      // Обновляем состояние, исключая удаленного сотрудника
      setAllWorkers(currentWorkers => currentWorkers.filter(w => w.id !== workerId));
      if (workers[0]?.id === workerId) setWorkers([]);

    } catch (error) {
      console.error('Ошибка при удалении сотрудника', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      worker.user_id = userId;
      const config = {
        method: 'post',
        url: `http://45.87.247.215:3002/workers`,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: worker
      };

      const foundWorker = await sendRequest(config);

      if (foundWorker) setAllWorkers(currentWorkers => [...currentWorkers, foundWorker]);

      setWorkers([foundWorker]);

    } catch (error) {
      console.error('Ошибка при создании воркера', error);
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const currentAcademy = localStorage.getItem('academy');

      const config = {
        method: 'post',
        url: `http://45.87.247.215:3002/users?selected_academy=${currentAcademy}`,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: user
      };

      await sendRequest(config);

      console.log("User was created successfully");
    } catch (error) {
      console.error('Ошибка при создании воркера', error);
    }
  };
  return (
    <div className="dashboard-container">
            <h4>Один пользователь может иметь не более 1 работника академии в системе. Если вы админ, вам доступно создание пользователей, после этого пользователь сам создаст себе работника академии</h4>

            <WorkerList workers={allWorkers} onDeleteWorker={handleDeleteWorker} />

      { workers.length === 0 && (
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
              <h1>Админ может создавать пользователей</h1>
        <br/>
              <h2>Создание Пользователя</h2>

              <form onSubmit={handleSubmitUser}>
                Имя пользователя <br/>
          <input type="text" name="name" value={user.name} onChange={handleChangeUser} placeholder="Имя" />
          Роль (admin, работник) <br/>
          <input type="text" name="role" value={user.role} onChange={handleChangeUser} placeholder="Роль (админ, работник)" />
          Номер телефона <br/>
          <input type="phone" name="phone" value={user.phone} onChange={handleChangeUser} placeholder="Номер телефона" />
          Телеграм(если есть) <br/>
          <input type="text" name="telegram" value={user.telegram} onChange={handleChangeUser} placeholder="Telegram" />
          Никнейм пользователя,должен быть уникальным <br/>
          <input type="text" name="username" value={user.username} onChange={handleChangeUser} placeholder="Никнейм, уникальный" />
          Пароль <br/>
          <input type="text" name="password" value={user.password} onChange={handleChangeUser} placeholder="Пароль" />
          <button type="submit">Создать Пользователя</button>


</form>
                </div>
      )}
    </div>
  );
}

export default Dashboard;
