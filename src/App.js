import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts'; // Импорт нового компонента
import About from "./components/About";
import CreateRequestForm from "./components/CreateRequestForm";
import IncomingRequests from "./components/IncomingRequests";
import ViewRequests from "./components/ViewRequests";
import './css/App.css';
import RequestDetail from './components/RequestDetail';

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
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data?.user?.id);

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
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard onSetIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
          <Route
            path="/login"
            element={<LoginForm onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/about" element={<About />} /> {/* Добавление маршрута для страницы "about" */}
          <Route path="/create-request" element={<CreateRequestForm />} /> {/* Добавление маршрута для страницы "about" */}
          <Route path="/incoming-requests" element={<IncomingRequests />} /> {/* Добавляем новый маршрут */}
          <Route path="/view-requests" element={<ViewRequests />} /> {/* Добавляем новый маршрут */}
          <Route path="/incoming-requests/:requestId" element={<RequestDetail/>} />          
        </Routes>
        <Footer />
      </div>
    </Router>
  );

}

export default App;
