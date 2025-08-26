// ABOUT SLIDER LOGIC
function initAboutSlider() {
  const aboutSliderImages = [
    "images/slider/1.png",
    "images/slider/2.png",
    "images/slider/3.png",
    "images/slider/4.png",
    "images/slider/5.png",
  ];
  let aboutSliderIdx = 0;
  const mainImg = document.querySelector(".about-slider-main-img");
  const leftBtn = document.querySelector(".about-slider-arrow.left");
  const rightBtn = document.querySelector(".about-slider-arrow.right");

  if (mainImg && leftBtn && rightBtn) {
    function updateAboutSlider() {
      mainImg.src = aboutSliderImages[aboutSliderIdx];
    }

    leftBtn.addEventListener("click", function () {
      aboutSliderIdx =
        (aboutSliderIdx - 1 + aboutSliderImages.length) %
        aboutSliderImages.length;
      updateAboutSlider();
    });

    rightBtn.addEventListener("click", function () {
      aboutSliderIdx = (aboutSliderIdx + 1) % aboutSliderImages.length;
      updateAboutSlider();
    });
  }
}

// GALLERY SLIDER LOGIC
function initGallerySlider() {
  const track = document.querySelector(".gallery-slider-track");
  const slides = Array.from(document.querySelectorAll(".gallery-slide"));
  const leftBtn = document.querySelector(".gallery-slider-arrow.left");
  const rightBtn = document.querySelector(".gallery-slider-arrow.right");
  const visibleSlides = 3;
  let current = 0;

  function updateGallerySlider() {
    const slideWidth = slides[0].offsetWidth + 24; // 24px gap
    // Для циклічності: якщо current > slides.length-1, повертаємо на початок
    let offset = current * slideWidth;
    // Якщо current > slides.length-1, повертаємо на початок
    if (current > slides.length - 1) {
      current = 0;
      offset = 0;
    }
    // Якщо current < 0, переходимо в кінець
    if (current < 0) {
      current = slides.length - 1;
      offset = current * slideWidth;
    }
    track.style.transform = `translateX(-${offset}px)`;
  }

  leftBtn.addEventListener("click", function () {
    current = (current - 1 + slides.length) % slides.length;
    updateGallerySlider();
  });

  rightBtn.addEventListener("click", function () {
    current = (current + 1) % slides.length;
    updateGallerySlider();
  });

  // Початковий стан
  updateGallerySlider();

  // Адаптація при зміні розміру
  window.addEventListener("resize", updateGallerySlider);
}

// LIGHTBOX для галереї
function initGalleryLightbox() {
  const overlay = document.getElementById("galleryLightbox");
  const overlayImg = document.getElementById("galleryLightboxImg");
  const gallerySlides = document.querySelectorAll(".gallery-slide img");

  gallerySlides.forEach((img) => {
    img.addEventListener("click", function (e) {
      overlayImg.src = img.src;
      overlay.classList.add("active");
    });
  });

  overlay.addEventListener("click", function (e) {
    overlay.classList.remove("active");
    overlayImg.src = "";
  });
}

export { initAboutSlider, initGallerySlider, initGalleryLightbox };
