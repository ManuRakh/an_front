import React from 'react';
import RequestForm from './RequestForm';

function MainContent() {
  return (
    <main>
      <h1>Система обмена сообщениями стала еще доступнее!</h1>
      <p>Добро пожаловать в интерактивную систему для обмена сообщениями и заявками между институтами Академии Наук Республики Таджикистан</p>
      <RequestForm />
      {/* Добавьте остальные секции здесь */}
    </main>
  );
}

export default MainContent;
