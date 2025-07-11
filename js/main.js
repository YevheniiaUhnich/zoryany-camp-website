import { initAccordion } from './accordion.js';
import { initBubblesAnimation } from './bubbles.js';
import { renderWeatherWidget } from './weather.js';
import { renderCalendarWidget } from './calendar.js';
import { initAboutSlider, initGallerySlider, initGalleryLightbox } from './slider.js';
import { initButtons } from './buttons.js';
import { initBookingModal } from './booking.js';

// MAIN JAVASCRIPT FILE - INITIALIZES ALL MODULES
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initBubblesAnimation();
  initAboutSlider();
  initGallerySlider();
  initGalleryLightbox();
  initButtons();
  initBookingModal();
  
  // Initialize widgets
  renderWeatherWidget();
  renderCalendarWidget();

  // Accordion
  initAccordion();
}); 