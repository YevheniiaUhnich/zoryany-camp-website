// ABOUT SLIDER LOGIC
function initAboutSlider() {
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
} 