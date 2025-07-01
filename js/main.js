// MAIN JAVASCRIPT FILE - INITIALIZES ALL MODULES
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initBubblesAnimation();
  initAboutSlider();
  initButtons();
  
  // Initialize widgets
  renderWeatherWidget();
  renderCalendarWidget();
});

// Слайдер для школи вожатого
(function() {
  const images = [
    'images/school/Image1.jpg',
    'images/school/image2.jpg',
    'images/school/image3.jpg'
  ];
  let current = 0;
  const img = document.getElementById('counselorSliderImg');
  const prev = document.getElementById('counselorSliderPrev');
  const next = document.getElementById('counselorSliderNext');
  if (img && prev && next) {
    prev.addEventListener('click', function() {
      current = (current - 1 + images.length) % images.length;
      img.src = images[current];
      img.alt = 'Школа вожатого ' + (current + 1);
    });
    next.addEventListener('click', function() {
      current = (current + 1) % images.length;
      img.src = images[current];
      img.alt = 'Школа вожатого ' + (current + 1);
    });
  }
})(); 