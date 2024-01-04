import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [academy, setAcademy] = useState('physics'); // Значение по умолчанию

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3002/auth/login', {
        username,
        password,
        academy, // Отправляем выбранное значение академии
      });
      console.log(response.data);
      onLoginSuccess(response.data);
    } catch (error) {
      console.error('Ошибка авторизации', error);
    }
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
        onChange={(e) => setAcademy(e.target.value)}
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
