import React from 'react';
import '../css/App.css'; // Путь к вашему CSS файлу
import ReactDOM from 'react-dom';

function mainPage() {
  return (
    <div className="app">
      <header>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="intro">
          <h1>Система обмена сообщениями стала еще доступнее!</h1>
          <p>Добро пожаловать в интерактивную систему для обмена сообщениями и заявками между институтами Академии Наук Республики Таджикистан</p>
          <button>Sign up today</button>
        </section>
        <section className="features">
          <div className="feature">
            <h2>Обменивайтесь заявками между институтами</h2>
            <p>Система позволяет обмениваться сообщениями между институтами академии РТ.</p>
          </div>
          <div className="feature">
            <h2>Получайте интерактивные оповещения</h2>
            <p>Система позволяет получать уведомления посредством sms/email, обеспечивая оперативность оповещений.</p>
          </div>
          <div className="feature">
            <h2>Будьте в курсе изменений</h2>
            <p>Система позволяет отслеживать изменения в вашей заявке и своевременно за ней следить.</p>
          </div>
        </section>
      </main>
      <footer>
        Академия Наук РТ. 2024
      </footer>
    </div>
  );
}

export default mainPage;
