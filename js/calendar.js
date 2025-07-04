// CALENDAR WIDGET
function renderCalendarWidget(targetDate = new Date()) {
  const widget = document.querySelector('.calendar-widget');
  if (!widget) return;

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  
  const monthNames = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
  
  // Header with navigation
  let html = `<div class="calendar-header">
    <button class="calendar-nav prev-month" aria-label="Попередній місяць">&lt;</button>
    <div class="calendar-title">${monthNames[month]} ${year}</div>
    <button class="calendar-nav next-month" aria-label="Наступний місяць">&gt;</button>
  </div>`;
  
  html += '<div class="calendar-weekdays">';
  const weekDays = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
  weekDays.forEach(d => html += `<div>${d}</div>`);
  html += '</div>';

  html += '<div class="calendar-grid">';
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Monday=0
  for(let i=0; i<firstDay; i++) html += '<div class="calendar-cell empty"></div>';
  
  const today = new Date();
  for(let d=1; d<=daysInMonth; d++) {
    const isToday = (d === today.getDate() && month === today.getMonth() && year === today.getFullYear());
    html += `<div class="calendar-cell${isToday?' today':''}" data-day="${d}">${d}</div>`;
  }
  
  // Fill remaining cells to complete the grid
  const totalCells = firstDay + daysInMonth;
  const remainingCells = (7 - (totalCells % 7)) % 7;
  for(let i=0; i<remainingCells; i++) html += '<div class="calendar-cell empty"></div>';
  
  html += '</div>';
  widget.innerHTML = html;
  
  // Add navigation event listeners
  const prevBtn = widget.querySelector('.prev-month');
  const nextBtn = widget.querySelector('.next-month');
  
  prevBtn.addEventListener('click', () => {
    const newDate = new Date(year, month - 1, 1);
    renderCalendarWidget(newDate);
  });
  
  nextBtn.addEventListener('click', () => {
    const newDate = new Date(year, month + 1, 1);
    renderCalendarWidget(newDate);
  });
  
  // Add click handlers for days
  widget.querySelectorAll('.calendar-cell:not(.empty)').forEach(cell => {
    cell.addEventListener('click', () => {
      const day = parseInt(cell.getAttribute('data-day'));
      const clickedDate = new Date(year, month, day);
      showCalendarDayModal(clickedDate);
    });
  });
}

function showCalendarDayModal(date) {
  const modal = document.createElement('div');
  modal.className = 'calendar-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    border-radius: 16px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    transform: scale(0.8);
    transition: transform 0.3s;
  `;
  
  const weekDays = ['Неділя','Понеділок','Вівторок','Середа','Четвер','П\'ятниця','Субота'];
  const monthNames = ['Січня','Лютого','Березня','Квітня','Травня','Червня','Липня','Серпня','Вересня','Жовтня','Листопада','Грудня'];
  
  const isToday = date.toDateString() === new Date().toDateString();
  
  content.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="font-size: 2em; color: #4A90E2; margin-bottom: 10px;">📅</div>
      <h2 style="margin: 0 0 10px 0; color: #333;">${weekDays[date.getDay()]}</h2>
      <div style="font-size: 1.5em; color: #666; margin-bottom: 15px;">
        ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}
      </div>
      ${isToday ? '<div style="background: #4A90E2; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 0.9em;">Сьогодні</div>' : ''}
    </div>
    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 15px 0; color: #333;">Події в таборі "Зоряний"</h3>
      <div style="color: #666; line-height: 1.6;">
        <p>• Ранкова зарядка</p>
        <p>• Сніданок</p>
        <p>• Заняття в гуртках</p>
        <p>• Обід</p>
        <p>• Спортивні ігри</p>
        <p>• Полуденок</p>
        <p>• Вечірні заходи</p>
        <p>• Вечеря</p>
        <p>• Дискотека</p>
      </div>
    </div>
    <button onclick="this.closest('.calendar-modal').remove()" style="
      width: 100%;
      padding: 12px;
      background: #4A90E2;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1em;
      cursor: pointer;
      transition: background 0.2s;
    " onmouseover="this.style.background='#357abd'" onmouseout="this.style.background='#4A90E2'">
      Закрити
    </button>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Animate in
  setTimeout(() => {
    modal.style.opacity = '1';
    content.style.transform = 'scale(1)';
  }, 10);
  
  function closeModal() {
    modal.style.opacity = '0';
    content.style.transform = 'scale(0.8)';
    setTimeout(() => modal.remove(), 300);
  }
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  });
}

export { renderCalendarWidget }; 