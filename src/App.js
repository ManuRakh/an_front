import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts'; // Импорт нового компонента
import About from "./components/About";
import './css/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (data) => {
    if (data && data.token) {
      localStorage.setItem('token', data.token); // Сохраняем токен в localStorage
      setIsAuthenticated(true);
    } else {
      console.error('Токен не был получен');
    }
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <MainContent handleLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
          <Route
            path="/login"
            element={<LoginForm onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/about" element={<About />} /> {/* Добавление маршрута для страницы "about" */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
