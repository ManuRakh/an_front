import React, { useState, useEffect } from 'react';
import '../css/UserProfile.css'; // Убедитесь, что путь к файлу стилей верный
import axios from 'axios';
import Logout from './Logout';
function UserProfile() {
    const [editing, setEditing] = useState(false);
    const [user, setUser] = useState({
      name: 'Имя',
      surname: 'Фамилия',
      // другие данные пользователя...
    });
  
    const handleLogout = () => {
      // Ваш код для обработки выхода из системы
    };
  
    const toggleEdit = () => {
      setEditing(!editing);
    };
  
    const handleSave = () => {
      // Ваш код для сохранения данных пользователя
      setEditing(false);
    };
  
    return (
      <div className="user-profile">
        {editing ? (
          <>
            <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
            <input type="text" value={user.surname} onChange={(e) => setUser({ ...user, surname: e.target.value })} />
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
        <Logout/>
      </div>
    );
  }
  
  export default UserProfile;
  