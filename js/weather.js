// WEATHER WIDGET (Open-Meteo API, Kremenchuk)
function renderWeatherWidget() {
  const widget = document.querySelector('.weather-widget');
  if (!widget) return;
  widget.innerHTML = '<i class="fa-solid fa-cloud-sun"></i> Завантаження...';
  // Kremenchuk: lat 49.0731, lon 33.4198
  fetch('https://api.open-meteo.com/v1/forecast?latitude=49.0731&longitude=33.4198&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=Europe%2FKiev&forecast_days=7')
    .then(r => r.json())
    .then(data => {
      if (!data || !data.daily) {
        widget.innerHTML = '<i class="fa-solid fa-cloud-sun"></i> Немає даних';
        return;
      }
      // Today
      const w = data.current_weather;
      const temp = Math.round(w.temperature);
      const code = w.weathercode;
      const icon = getWeatherIcon(code);
      const desc = getWeatherDesc(code);
      // Main weather info (icon, temp, desc, min/max, wind, precip)
      let html = `<div class=\"weather-today-main\" style=\"display:flex;align-items:center;gap:10px;margin-bottom:8px;justify-content:center;\">
        <span style=\"font-size:2.2em;background:#FDB8C0;border-radius:12px;padding:6px 12px;\">${icon}</span>
        <div style=\"display:flex;flex-direction:column;align-items:flex-start;gap:2px;\">
          <span style=\"font-size:1.1em;font-weight:700;color:#fff;\">${desc}</span>
          <span style=\"font-size:1.1em;color:#fff;\">${temp}&deg;C</span>
          <span style=\"font-size:0.95em;color:#fff;\">Макс: <b>${Math.round(data.daily.temperature_2m_max[0])}&deg;C</b>, Мін: <b>${Math.round(data.daily.temperature_2m_min[0])}&deg;C</b></span>
          <span style=\"font-size:0.95em;color:#fff;\">Вітер: <b>${w.windspeed} м/с</b></span>
          <span style=\"font-size:0.95em;color:#fff;\">Опади: <b>${data.daily.precipitation_sum ? data.daily.precipitation_sum[0] : 0} мм</b></span>
        </div>
      </div>`;
      // Forecast for 7 days (no scroll needed)
      html += '<div class=\"weather-forecast-7days\"></div>';
      // City name at the bottom
      html += '<div class=\"weather-city\" style=\"margin-top:auto;text-align:center;font-size:1em;opacity:0.8;\">Кременчук</div>';
      widget.innerHTML = html;
      // Fill forecast days
      const days = data.daily.time;
      const maxT = data.daily.temperature_2m_max;
      const minT = data.daily.temperature_2m_min;
      const codes = data.daily.weathercode;
      const weekDays = ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'];
      const todayDate = new Date();
      const forecastDiv = widget.querySelector('.weather-forecast-7days');
      forecastDiv.style.cssText = 'display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin: 10px 0;';
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(days[i]);
        const isToday = date.toDateString() === todayDate.toDateString();
        forecastDiv.innerHTML += `<div class=\"weather-day${isToday ? ' today' : ''}\" data-idx=\"${i}\" style=\"
          background: ${isToday ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'};
          border-radius: 8px;
          padding: 8px;
          text-align: center;
          min-width: 50px;
          cursor: pointer;
          transition: background 0.2s;
        \" onmouseover=\"this.style.background='rgba(255,255,255,0.3)'\" onmouseout=\"this.style.background='${isToday ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}'\">
          <span class=\"icon\" style=\"font-size: 1.2em; display: block; margin-bottom: 4px;\">${getWeatherIcon(codes[i])}</span>
          <span style=\"font-size:0.8em; display: block; margin-bottom: 2px;\">${weekDays[date.getDay()]}</span>
          <span style=\"font-size:0.8em; display: block; margin-bottom: 2px;\">${Math.round(maxT[i])}&deg;/${Math.round(minT[i])}&deg;</span>
          <span style=\"font-size:0.6em;opacity:0.7; display: block;\">${date.getDate()}</span>
        </div>`;
      }
      
      // Make all days open modal
      setTimeout(() => {
        forecastDiv.querySelectorAll('.weather-day').forEach(dayEl => {
          dayEl.addEventListener('click', function() {
            const idx = parseInt(dayEl.getAttribute('data-idx'));
            showModalDay(data, idx);
          });
        });
      }, 0);
    })
    .catch(() => {
      widget.innerHTML = '<i class="fa-solid fa-cloud-sun"></i> Немає даних';
    });
}

// Add interactive scroll to weather forecast (only right arrow, mouseenter animates right loop)
function addWeatherForecastScroll(totalDays, todayIdx = 0) {
  const scrollWrap = document.querySelector('.weather-forecast-scroll');
  const forecast = document.querySelector('.weather-forecast');
  const rightBtn = document.querySelector('.weather-arrow.right');
  if (!scrollWrap || !forecast || !rightBtn) return;
  scrollWrap.style.overflow = 'hidden';
  forecast.style.display = 'flex';
  forecast.style.transition = 'transform 0.5s cubic-bezier(.4,1.5,.5,1)';
  let currentIdx = Math.max(0, todayIdx - 3); // show today in visible area
  const dayWidth = 28; // px, approx min-width + gap
  const visibleDays = 7;
  const maxIdx = totalDays - visibleDays;
  function updateArrow() {
    rightBtn.disabled = currentIdx >= maxIdx;
  }
  function scrollTo(idx) {
    currentIdx = Math.max(0, Math.min(idx, maxIdx));
    forecast.style.transform = `translateX(-${currentIdx * dayWidth}px)`;
    updateArrow();
  }
  rightBtn.addEventListener('click', () => {
    scrollTo(currentIdx + 3);
  });
  // No auto-loop, only manual drag
  // Init
  updateArrow();
  scrollTo(currentIdx);
}

function getWeatherIcon(code) {
  // Simplified mapping for demo
  if ([0].includes(code)) return '☀️';
  if ([1,2,3].includes(code)) return '🌤️';
  if ([45,48].includes(code)) return '🌫️';
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return '🌦️';
  if ([71,73,75,77,85,86].includes(code)) return '❄️';
  if ([95,96,99].includes(code)) return '⛈️';
  return '☁️';
}

function getWeatherDesc(code) {
  if ([0].includes(code)) return 'Ясно';
  if ([1,2,3].includes(code)) return 'Хмарно';
  if ([45,48].includes(code)) return 'Туман';
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return 'Дощ';
  if ([71,73,75,77,85,86].includes(code)) return 'Сніг';
  if ([95,96,99].includes(code)) return 'Гроза';
  return 'Хмарно';
}

function showTodayWeatherModal(data) {
  const modal = document.createElement('div');
  modal.className = 'weather-modal';
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
  
  const w = data.current_weather;
  const temp = Math.round(w.temperature);
  const code = w.weathercode;
  const icon = getWeatherIcon(code);
  const desc = getWeatherDesc(code);
  
  content.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="font-size: 4em; margin-bottom: 10px;">${icon}</div>
      <h2 style="margin: 0 0 10px 0; color: #333;">${desc}</h2>
      <div style="font-size: 2em; font-weight: bold; color: #4A90E2;">${temp}°C</div>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
      <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Максимум</div>
        <div style="font-size: 1.2em; font-weight: bold; color: #e74c3c;">${Math.round(data.daily.temperature_2m_max[0])}°C</div>
      </div>
      <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Мінімум</div>
        <div style="font-size: 1.2em; font-weight: bold; color: #3498db;">${Math.round(data.daily.temperature_2m_min[0])}°C</div>
      </div>
      <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Вітер</div>
        <div style="font-size: 1.2em; font-weight: bold; color: #2c3e50;">${w.windspeed} м/с</div>
      </div>
      <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Опади</div>
        <div style="font-size: 1.2em; font-weight: bold; color: #27ae60;">${data.daily.precipitation_sum ? data.daily.precipitation_sum[0] : 0} мм</div>
      </div>
    </div>
    <button onclick="this.closest('.weather-modal').remove()" style="
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

function showModalDay(data, idx) {
  const modal = document.createElement('div');
  modal.className = 'weather-modal';
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
  
  const date = new Date(data.daily.time[idx]);
  const maxT = Math.round(data.daily.temperature_2m_max[idx]);
  const minT = Math.round(data.daily.temperature_2m_min[idx]);
  const code = data.daily.weathercode[idx];
  const icon = getWeatherIcon(code);
  const desc = getWeatherDesc(code);
  const precip = data.daily.precipitation_sum ? data.daily.precipitation_sum[idx] : 0;
  
  const weekDays = ['Неділя','Понеділок','Вівторок','Середа','Четвер','П\'ятниця','Субота'];
  const monthNames = ['Січня','Лютого','Березня','Квітня','Травня','Червня','Липня','Серпня','Вересня','Жовтня','Листопада','Грудня'];
  
  content.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="font-size: 4em; margin-bottom: 10px;">${icon}</div>
      <h2 style="margin: 0 0 10px 0; color: #333;">${desc}</h2>
      <div style="font-size: 1.2em; color: #666; margin-bottom: 15px;">
        ${weekDays[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]}
      </div>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
      <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Максимум</div>
        <div style="font-size: 1.2em; font-weight: bold; color: #e74c3c;">${maxT}°C</div>
      </div>
      <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Мінімум</div>
        <div style="font-size: 1.2em; font-weight: bold; color: #3498db;">${minT}°C</div>
      </div>
      <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; grid-column: 1 / -1;">
        <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Опади</div>
        <div style="font-size: 1.2em; font-weight: bold; color: #27ae60;">${precip} мм</div>
      </div>
    </div>
    <button onclick="this.closest('.weather-modal').remove()" style="
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