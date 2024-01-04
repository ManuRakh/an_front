import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Dashboard.css';
import WorkerList from "./WorkerList.js";

function Dashboard() {
  const [worker, setWorker] = useState({ spec: '', name: '', surname: '' });
  const [workers, setWorkers] = useState([]);

  const handleChange = (e) => {
    setWorker({ ...worker, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          method: 'get',
          url: 'http://localhost:3000/workers',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await axios.request(config);
        setWorkers(response.data.data.result);
      } catch (error) {
        console.error('Ошибка при получении данных о сотрудниках', error);
      }
    };

    fetchWorkers();
  }, []);

  const handleDeleteWorker = async (workerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.request({
        method: 'delete',
        url: `http://localhost:3000/workers/${workerId}`,
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
        url: 'http://localhost:3000/workers',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: worker
      };

      const response = await axios.request(config);
      const foundWorker = response.data?.data?.result;
      console.log({workers, foundWorker})
      if (foundWorker) setWorkers(currentWorkers => [...currentWorkers, foundWorker]);

    } catch (error) {
      console.error('Ошибка при создании воркера', error);
    }
  };
  return (
    <div className="dashboard-container">
            <WorkerList workers={workers} onDeleteWorker={handleDeleteWorker} />

      <div className="create-worker-form">
        <h2>Создание Сотрудника</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="spec" value={worker.spec} onChange={handleChange} placeholder="Должность" />
          <input type="text" name="name" value={worker.name} onChange={handleChange} placeholder="Имя" />
          <input type="text" name="surname" value={worker.surname} onChange={handleChange} placeholder="Фамилия" />
          <button type="submit">Создать Сотрудника</button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;