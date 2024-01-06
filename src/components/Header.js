import React from 'react';
import "../css/Header.css";
import UserProfile from './UserProfile'; // Импорт нового компонента

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><a href="/">Главная страница</a></li>
          <li><a href="/create-request">Создать заявку</a></li>
          <li><a href="/view-requests">Посмотреть созданные заявки</a></li>
          <li><a href="/incoming-requests">Посмотреть присланные заявки</a></li>
          <li><a href="/about">Об Институте</a></li>
          <li><a href="/contacts">Контактная Информация</a></li>
          <UserProfile />

        </ul>
      </nav>
    </header>
  );
}

export default Header;
