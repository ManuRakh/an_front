import React from 'react';
import LoginForm from './LoginForm';

function MainContent({ isAuthenticated, handleLoginSuccess }) {
  return (
    <main>
      <main>
        <section className="intro">
          <h1>Система обмена сообщениями стала еще доступнее!</h1>
          <p>Добро пожаловать в интерактивную систему для обмена сообщениями и заявками между институтами Академии Наук Республики Таджикистан</p>
          {!isAuthenticated && <LoginForm onLoginSuccess={handleLoginSuccess} />}
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
      {/* Добавьте остальные секции здесь */}
    </main>
  );
}

export default MainContent;
