import React, { useState } from 'react';
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [academy, setAcademy] = useState('physics'); // Значение по умолчанию

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${process.env.main_host}/auth/login`, {
        username,
        password,
        academy, // Отправляем выбранное значение академии
      });
      console.log(response.data);
      localStorage.setItem('academy', academy);
      onLoginSuccess(response.data);
    } catch (error) {
      console.error('Ошибка авторизации', error);
    }
  };

  const handleAcademyChange = (e) => {
    const selectedAcademy = e.target.value;
    setAcademy(selectedAcademy);
    localStorage.setItem('academy', selectedAcademy);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Имя пользователя"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        required
      />
      <select
  value={academy}
  onChange={handleAcademyChange}
        required
      >
        <option value="physics">Академия Физики</option>
        <option value="math">Академия Математики</option>
      </select>
      <button type="submit">Войти</button>
    </form>
  );
}

export default LoginForm;
