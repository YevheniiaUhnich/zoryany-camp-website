// Toggle effect for all buttons: toggled = blue, text remains, confetti burst

document.addEventListener('DOMContentLoaded', function() {
  // Weather widget
  renderWeatherWidget();
  // Calendar widget
  renderCalendarWidget();

  // About slider logic
  const aboutSliderImages = [
    'images/slider/1.png',
    'images/slider/2.png',
    'images/slider/3.png',
    'images/slider/4.png',
    'images/slider/5.png'
  ];
  let aboutSliderIdx = 0;
  const mainImg = document.querySelector('.about-slider-main-img');
  const leftBtn = document.querySelector('.about-slider-arrow.left');
  const rightBtn = document.querySelector('.about-slider-arrow.right');
  if (mainImg && leftBtn && rightBtn) {
    function updateAboutSlider() {
      mainImg.src = aboutSliderImages[aboutSliderIdx];
    }
    leftBtn.addEventListener('click', function() {
      aboutSliderIdx = (aboutSliderIdx - 1 + aboutSliderImages.length) % aboutSliderImages.length;
      updateAboutSlider();
    });
    rightBtn.addEventListener('click', function() {
      aboutSliderIdx = (aboutSliderIdx + 1) % aboutSliderImages.length;
      updateAboutSlider();
    });
  }

  // Button flash + confetti
  document.querySelectorAll('.button').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      // Prevent re-triggering during the flash animation
      if (btn.classList.contains('toggled')) {
        return;
      }
      
      // Flash blue and show confetti
      btn.classList.add('toggled');
      showConfetti(btn);

      // Return to pink after a short delay
      setTimeout(function() {
        btn.classList.remove('toggled');
      }, 400); // Duration of the flash
    });
  });
});

// WEATHER WIDGET (Open-Meteo API, Kremenchuk)
function renderWeatherWidget() {
  const widget = document.querySelector('.weather-widget');
  if (!widget) return;
  widget.innerHTML = '<i class="fa-solid fa-cloud-sun"></i> Завантаження...';
  // Kremenchuk: lat 49.0731, lon 33.4198
  fetch('https://api.open-meteo.com/v1/forecast?latitude=49.0731&longitude=33.4198&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=Europe%2FKiev&forecast_days=16')
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
      // Forecast for up to 31 days (interactive scroll + arrows)
      html += '<div class=\"weather-forecast-scroll\"><div class=\"weather-forecast\"></div><button class=\"weather-arrow right\" aria-label=\"Наступні дні\">&#8594;</button></div>';
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
      const forecastDiv = widget.querySelector('.weather-forecast');
      const limit = Math.min(31, days.length);
      let todayForecastIdx = 0;
      for (let i = 0; i < limit; i++) {
        const date = new Date(days[i]);
        const isToday = date.toDateString() === todayDate.toDateString();
        if (isToday) todayForecastIdx = i;
        forecastDiv.innerHTML += `<div class=\"weather-day${isToday ? ' today' : ''}\" data-idx=\"${i}\">
          <span class=\"icon\">${getWeatherIcon(codes[i])}</span>
          <span style=\"font-size:0.95em;\">${weekDays[date.getDay()]}</span>
          <span style=\"font-size:0.95em;\">${Math.round(maxT[i])}&deg;/${Math.round(minT[i])}&deg;</span>
          <span style=\"font-size:0.7em;opacity:0.7;\">${date.getDate()}</span>
        </div>`;
      }
      addWeatherForecastScroll(limit, todayForecastIdx);
      // Make all days open modal
      setTimeout(() => {
        forecastDiv.querySelectorAll('.weather-day').forEach(dayEl => {
          dayEl.style.cursor = 'pointer';
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
  html += '</div>';
  widget.innerHTML = html;

  // Add event listeners for navigation
  widget.querySelector('.prev-month').addEventListener('click', () => {
    renderCalendarWidget(new Date(year, month - 1, 1));
  });
  widget.querySelector('.next-month').addEventListener('click', () => {
    // Limit to 1 year ahead
    const nextMonth = new Date(year, month + 1, 1);
    if (nextMonth > new Date(new Date().setFullYear(new Date().getFullYear() + 1))) {
        return;
    }
    renderCalendarWidget(nextMonth);
  });

  // Make dates interactive
  const cells = widget.querySelectorAll('.calendar-cell:not(.empty)');
  cells.forEach(cell => {
    cell.addEventListener('click', function() {
      const selected = widget.querySelector('.calendar-cell.selected');
      if (selected) {
        selected.classList.remove('selected');
      }
      this.classList.add('selected');
    });
  });
}

// Simple confetti burst effect
function showConfetti(button) {
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = 9999;
  document.body.appendChild(canvas);

  // Get button position
  const rect = button.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  canvas.style.left = (window.scrollX + rect.left - rect.width / 2) + 'px';
  canvas.style.top = (window.scrollY + rect.top - rect.height / 2) + 'px';

  const ctx = canvas.getContext('2d');
  const colors = ['#FDB8C0', '#4A90E2', '#fff', '#FFD700', '#4AE2B8'];
  const confetti = [];
  const count = 24;
  for (let i = 0; i < count; i++) {
    confetti.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      r: Math.random() * 6 + 4,
      d: Math.random() * 30 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 2 * Math.PI,
      speed: Math.random() * 3 + 2
    });
  }
  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(c => {
      c.x += Math.cos(c.angle) * c.speed;
      c.y += Math.sin(c.angle) * c.speed + frame * 0.1;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
    frame++;
    if (frame < 32) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }
  animate();
}

// Modal for today weather
function showTodayWeatherModal(data) {
  // Remove old modal if exists
  document.querySelectorAll('.weather-modal').forEach(m => m.remove());
  window.weatherModalOpen = true;
  // Get today index
  const today = new Date();
  const days = data.daily.time;
  let todayIdx = 0;
  for (let i = 0; i < days.length; i++) {
    if (new Date(days[i]).toDateString() === today.toDateString()) {
      todayIdx = i;
      break;
    }
  }
  // Get details
  const temp = Math.round(data.current_weather.temperature);
  const wind = data.current_weather.windspeed;
  const code = data.current_weather.weathercode;
  const icon = getWeatherIcon(code);
  const maxT = Math.round(data.daily.temperature_2m_max[todayIdx]);
  const minT = Math.round(data.daily.temperature_2m_min[todayIdx]);
  const precip = data.daily.precipitation_sum ? data.daily.precipitation_sum[todayIdx] : 0;
  const desc = getWeatherDesc(code);
  // Modal markup
  const modal = document.createElement('div');
  modal.className = 'weather-modal';
  modal.innerHTML = `
    <div class="weather-modal-content">
      <button class="weather-modal-close" aria-label="Закрити">&times;</button>
      <div class="weather-modal-main-row" style="display:flex;align-items:flex-start;gap:18px;justify-content:center;">
        <span style="font-size:1.7em;background:#FDB8C0;border-radius:12px;padding:6px 12px;">${icon}</span>
        <div style="text-align:left;min-width:120px;">
          <div style="font-size:1.25em;font-weight:700;color:#fff;">${desc}</div>
          <div style="font-size:1.1em;color:#fff;">${temp}&deg;C</div>
          <div style="font-size:0.95em;color:#fff;">Макс: <b>${maxT}&deg;C</b>, Мін: <b>${minT}&deg;C</b></div>
          <div style="font-size:0.95em;color:#fff;">Вітер: <b>${wind} м/с</b></div>
          <div style="font-size:0.95em;color:#fff;">Опади: <b>${precip ?? 0} мм</b></div>
        </div>
      </div>
      <div style="margin-top:10px;font-size:0.85em;opacity:0.8;color:#fff;">Дані Open-Meteo</div>
    </div>
  `;
  // Overlay modal exactly above main weather block
  const mainBlock = document.querySelector('.weather-widget');
  const rect = mainBlock.getBoundingClientRect();
  Object.assign(modal.style, {
    position: 'fixed',
    left: rect.left + 'px',
    top: rect.top + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px',
    background: 'linear-gradient(135deg, #FDB8C0 0%, #4A90E2 100%)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 32px #0002',
    borderRadius: '18px',
    transition: 'box-shadow 0.2s',
    fontSize: '0.95em',
    color: '#fff',
  });
  const content = modal.querySelector('.weather-modal-content');
  Object.assign(content.style, {
    background: 'none',
    borderRadius: '18px',
    padding: '18px 14px 10px 14px',
    minWidth: '120px',
    maxWidth: '100%',
    boxShadow: 'none',
    textAlign: 'center',
    position: 'relative',
    width: '100%',
    color: '#fff',
    fontSize: '0.95em',
  });
  // Place close button at top right
  const closeBtn = modal.querySelector('.weather-modal-close');
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '8px',
    right: '12px',
    background: '#fff',
    border: '1px solid #FDB8C0',
    color: '#4A90E2',
    fontSize: '1.5em',
    cursor: 'pointer',
    zIndex: 2,
    padding: '2px 8px',
    lineHeight: 1,
    borderRadius: '50%',
    boxShadow: '0 2px 8px #0002',
    fontWeight: 'bold',
    transition: 'background 0.2s, color 0.2s',
  });
  document.body.appendChild(modal);
  // Close logic
  function closeModal() {
    modal.remove();
    window.weatherModalOpen = false;
  }
  modal.querySelector('.weather-modal-close').onclick = closeModal;
  modal.onclick = e => { if (e.target === modal) closeModal(); };
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  });
  // Mouse drag for modal: left/right to switch days
  let startX = 0, dragging = false;
  content.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX;
  });
  content.addEventListener('mousemove', e => {
    if (!dragging) return;
    let dx = e.clientX - startX;
    if (Math.abs(dx) > 30) {
      if (dx < 0) showModalDay(data, 1);
      else showModalDay(data, -1);
      dragging = false;
    }
  });
  content.addEventListener('mouseup', e => { dragging = false; });
  content.addEventListener('mouseleave', e => { dragging = false; });
}

// Show modal for offset day (relative to today)
function showModalDay(data, idx) {
  // Remove old modal
  document.querySelectorAll('.weather-modal').forEach(m => m.remove());
  const days = data.daily.time;
  if (idx < 0 || idx >= days.length) return;
  // Get details for idx
  const temp = Math.round(data.daily.temperature_2m_max[idx]);
  const minT = Math.round(data.daily.temperature_2m_min[idx]);
  const code = data.daily.weathercode[idx];
  const icon = getWeatherIcon(code);
  const wind = data.current_weather.windspeed;
  const precip = data.daily.precipitation_sum ? data.daily.precipitation_sum[idx] : 0;
  const desc = getWeatherDesc(code);
  const modal = document.createElement('div');
  modal.className = 'weather-modal';
  modal.innerHTML = `
    <div class="weather-modal-content">
      <button class="weather-modal-close" aria-label="Закрити">&times;</button>
      <div class="weather-modal-main-row" style="display:flex;align-items:flex-start;gap:18px;justify-content:center;">
        <span style="font-size:1.7em;background:#FDB8C0;border-radius:12px;padding:6px 12px;">${icon}</span>
        <div style="text-align:left;min-width:120px;">
          <div style="font-size:1.25em;font-weight:700;color:#fff;">${desc}</div>
          <div style="font-size:1.1em;color:#fff;">${temp}&deg;C</div>
          <div style="font-size:0.95em;color:#fff;">Макс: <b>${temp}&deg;C</b>, Мін: <b>${minT}&deg;C</b></div>
          <div style="font-size:0.95em;color:#fff;">Вітер: <b>${wind} м/с</b></div>
          <div style="font-size:0.95em;color:#fff;">Опади: <b>${precip ?? 0} мм</b></div>
        </div>
      </div>
      <div style="margin-top:10px;font-size:0.85em;opacity:0.8;color:#fff;">Дані Open-Meteo</div>
    </div>
  `;
  document.body.appendChild(modal);
  // Overlay modal exactly above main weather block
  const mainBlock = document.querySelector('.weather-widget');
  const rect = mainBlock.getBoundingClientRect();
  Object.assign(modal.style, {
    position: 'fixed',
    left: rect.left + 'px',
    top: rect.top + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px',
    background: 'linear-gradient(135deg, #FDB8C0 0%, #4A90E2 100%)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 32px #0002',
    borderRadius: '18px',
    transition: 'box-shadow 0.2s',
    fontSize: '0.95em',
    color: '#fff',
  });
  const content = modal.querySelector('.weather-modal-content');
  Object.assign(content.style, {
    background: '#fff', borderRadius: '18px', padding: '32px 24px', minWidth: '320px', maxWidth: '90vw', boxShadow: '0 6px 32px #0002', textAlign: 'center', position: 'relative'
  });
  modal.querySelector('.weather-modal-close').onclick = () => { modal.remove(); window.weatherModalOpen = false; };
  modal.onclick = e => { if (e.target === modal) { modal.remove(); window.weatherModalOpen = false; } };
  // Mouse drag for modal
  let startX = 0, dragging = false;
  content.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX;
  });
  content.addEventListener('mousemove', e => {
    if (!dragging) return;
    let dx = e.clientX - startX;
    if (Math.abs(dx) > 30) {
      if (dx < 0) showModalDay(data, 1);
      else showModalDay(data, -1);
      dragging = false;
    }
  });
  content.addEventListener('mouseup', e => { dragging = false; });
  content.addEventListener('mouseleave', e => { dragging = false; });
}

// Weather description by code
function getWeatherDesc(code) {
  if ([0].includes(code)) return 'Ясно';
  if ([1,2,3].includes(code)) return 'Мінлива хмарність';
  if ([45,48].includes(code)) return 'Туман';
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return 'Дощ';
  if ([71,73,75,77,85,86].includes(code)) return 'Сніг';
  if ([95,96,99].includes(code)) return 'Гроза';
  return 'Хмарно';
}

// BUBBLES ANIMATION
(function() {
  const canvas = document.getElementById('bubbles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  resize();
  window.addEventListener('resize', resize);

  // Bubble config
  const COLORS = [
    'rgba(255,182,193,0.25)', // light pink
    'rgba(135,206,250,0.22)', // light blue
    'rgba(255,255,255,0.18)', // white
    'rgba(144,238,144,0.22)', // light green
    'rgba(255,255,224,0.18)', // light yellow
    'rgba(221,160,221,0.22)', // plum
    'rgba(255,192,203,0.18)', // pink
    'rgba(173,216,230,0.18)', // light sky blue
    'rgba(255,240,245,0.18)'  // lavender blush
  ];
  const BUBBLE_COUNT = Math.max(32, Math.floor(width/32));
  const bubbles = [];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 0; i < BUBBLE_COUNT; i++) {
    const fromTop = Math.random() < 0.5;
    bubbles.push({
      x: random(0, width),
      y: fromTop ? random(-height, 0) : random(height, height*2),
      r: random(32, 80),
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      speed: random(0.3, 1.2),
      dir: fromTop ? 1 : -1, // 1: top->down, -1: bottom->up
      alpha: random(0.28, 0.5),
      drift: random(-0.3, 0.3),
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const b of bubbles) {
      ctx.save();
      ctx.globalAlpha = b.alpha;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, 2*Math.PI);
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.restore();
      // Move
      b.y += b.speed * b.dir;
      b.x += b.drift;
      // Respawn if out of bounds
      if (b.dir === 1 && b.y - b.r > height) {
        b.y = random(-height*0.2, 0);
        b.x = random(0, width);
        b.r = random(32, 80);
        b.color = COLORS[Math.floor(Math.random()*COLORS.length)];
        b.alpha = random(0.28, 0.5);
        b.drift = random(-0.3, 0.3);
      } else if (b.dir === -1 && b.y + b.r < 0) {
        b.y = random(height, height*1.2);
        b.x = random(0, width);
        b.r = random(32, 80);
        b.color = COLORS[Math.floor(Math.random()*COLORS.length)];
        b.alpha = random(0.28, 0.5);
        b.drift = random(-0.3, 0.3);
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})(); 