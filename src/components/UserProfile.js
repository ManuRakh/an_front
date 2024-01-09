import React, { useState, useEffect } from 'react';
import '../css/UserProfile.css'; // Убедитесь, что путь к файлу стилей верный
import axios from 'axios';
import Logout from './Logout';
import { sendRequest } from '../utils/sendRequest';
import "../css/UserProfile.css";
import getMe from './utils/getMe';
import dotenv from "dotenv";
dotenv.config();

function UserProfile() {
    const [editing, setEditing] = useState(false);
    const [user, setUser] = useState({
      name: 'Имя',
    });
  
    const fetchUser = async () => {
      try {
        const response = await getMe();

        setUser(response);
      } catch (error) {
        console.error('Ошибка при получении данных пользователя', error);
      }
    };

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        const interval = setInterval(() => {
          const token = localStorage.getItem('token');
          if (token) {
            fetchUser();
            clearInterval(interval);
          }
        }, 1000);
    
      }
      else fetchUser();
    }, []);

    const handleSave = async () => {
      // Функция для сохранения данных пользователя
      try {
        const token = localStorage.getItem('token'); // Получите токен из localStorage
        const config = {
          method: 'patch',
          url: `${process.env.main_host}/users/me`,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: JSON.stringify(user),
        };

        await sendRequest(config);
        await fetchUser();
        setEditing(false);
      } catch (error) {
        console.error('Ошибка при сохранении данных пользователя', error);
      }
    };

    const handleLogout = () => {
      // Ваш код для обработки выхода из системы
    };
  
    const toggleEdit = () => {
      setEditing(!editing);
    };

    return (
      <div className="user-profile">
        {editing ? (
          <>
            <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
            {/* Добавьте другие поля для редактирования, если необходимо */}
            <button className="save-button" onClick={handleSave}>Сохранить</button>
          </>
        ) : (
          <>
            <div className="user-details">
              <div className="user-name">{user.name} {user.surname}</div>
              {/* Другая информация о пользователе */}
            </div>
            <button className="edit-button" onClick={toggleEdit}>Редактировать</button>
          </>
        )}
        <Logout />
      </div>
    );
    }
  
  export default UserProfile;
  