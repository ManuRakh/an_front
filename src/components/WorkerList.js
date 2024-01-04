import React, { useState } from 'react';

function WorkerList({ workers, onDeleteWorker }) {
  const [isListOpen, setIsListOpen] = useState(false);

  return (
    <div className="dashboard-header">
      <h2>Список Сотрудников</h2>
      <button onClick={() => setIsListOpen(!isListOpen)}>
        {isListOpen ? 'Скрыть список' : 'Показать список'}
      </button>
      {isListOpen && (
        <ul className="worker-list">
          {workers.map((worker) => (
            <li className="worker-item" key={worker.id}>
              {worker.name} {worker.surname} - {worker.spec}
              <button onClick={() => onDeleteWorker(worker.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WorkerList;
