import React from 'react';
import axios from 'axios';
import "../css/Header.css";
import dotenv from "dotenv";
dotenv.config();

function Logout() {
  const handleLogout = () => {
    // Get the access token from local storage
    const token = localStorage.getItem('token');
    
    // Prepare the axios configuration
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.main_host}/auth/logout`,
      headers: { 
        'accept': 'application/json', 
        'Content-Type': 'application/json', 
        'authorization': `Bearer ${token}`, 
      },
    };

    // Make the axios request
    axios.request(config)
    .then((response) => {
      console.log('Logout successful', response.data);
      // Clear the local storage
      localStorage.clear();
      // Redirect to the home page or login page
      window.location.href = '/';
    })
    .catch((error) => {
      console.error('Logout failed', error);
    });
  };

  return (
    <button className="logout-button" onClick={handleLogout}>Выйти</button>
  );
}

export default Logout;
