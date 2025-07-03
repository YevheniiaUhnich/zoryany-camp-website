// MAIN JAVASCRIPT FILE - INITIALIZES ALL MODULES
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initBubblesAnimation();
  initAboutSlider();
  initButtons();
  
  // Initialize widgets
  renderWeatherWidget();
  renderCalendarWidget();

  // Accordion
  initAccordion();
});

// Слайдер для школи вожатого
// (видалено, бо слайдер більше не використовується)

// Accordion logic for 'Важливе для батьків'
import { initAccordion } from './accordion.js';

// Accordion
initAccordion(); 