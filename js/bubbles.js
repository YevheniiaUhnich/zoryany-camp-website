// BUBBLES AND STARS ANIMATION
function initBubblesAnimation() {
  const canvas = document.getElementById('bubbles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const bubbles = [];
  const stars = [];
  // Неонові кольори для бульбашок та зірочок
  const neonColors = [
    '#FF00FF', // Неоновий рожевий
    '#00FFFF', // Неоновий блакитний
    '#FFFF00', // Неоновий жовтий
    '#00FF00', // Неоновий зелений
    '#FF0080', // Неоновий фуксія
    '#8000FF', // Неоновий фіолетовий
    '#FF8000', // Неоновий помаранчевий
    '#0080FF'  // Неоновий синій
  ];
  
  function random(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  function drawStar(x, y, radius, points) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const r = i % 2 === 0 ? radius : radius * 0.5;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }
  
  function createBubble() {
    return {
      x: random(0, canvas.width),
      y: canvas.height + 40, // Збільшено початкову позицію
      vx: random(-0.3, 0.3), // Повільніший рух по горизонталі
      vy: random(-1, -0.5),  // Повільніший рух по вертикалі
      size: random(20, 60),  // Збільшено розмір в 2 рази
      opacity: random(0.4, 0.8),
      color: neonColors[Math.floor(random(0, neonColors.length))],
      life: 1,
      decay: random(0.0005, 0.0015) // Повільніше зникнення
    };
  }
  
  function createStar() {
    return {
      x: random(0, canvas.width),
      y: -40, // Збільшено початкову позицію
      vx: random(-0.3, 0.3), // Повільніший рух по горизонталі
      vy: random(0.5, 1),    // Повільніший рух по вертикалі
      size: random(16, 40),  // Збільшено розмір в 2 рази
      opacity: random(0.5, 0.9),
      color: neonColors[Math.floor(random(0, neonColors.length))],
      life: 1,
      decay: random(0.0005, 0.0015) // Повільніше зникнення
    };
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create new bubbles (менша частота появи)
    if (Math.random() < 0.01) {
      bubbles.push(createBubble());
    }
    
    // Create new stars (менша частота появи)
    if (Math.random() < 0.005) {
      stars.push(createStar());
    }
    
    // Update and draw bubbles
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const bubble = bubbles[i];
      
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;
      bubble.life -= bubble.decay;
      
      if (bubble.life <= 0 || bubble.y < -40) {
        bubbles.splice(i, 1);
        continue;
      }
      
      ctx.save();
      ctx.globalAlpha = bubble.opacity * bubble.life;
      
      // Додаємо неоновий ефект
      ctx.shadowColor = bubble.color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = bubble.color;
      
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    
    // Update and draw stars
    for (let i = stars.length - 1; i >= 0; i--) {
      const star = stars[i];
      
      star.x += star.vx;
      star.y += star.vy;
      star.life -= star.decay;
      
      if (star.life <= 0 || star.y > canvas.height + 40) {
        stars.splice(i, 1);
        continue;
      }
      
      ctx.save();
      ctx.globalAlpha = star.opacity * star.life;
      
      // Додаємо неоновий ефект
      ctx.shadowColor = star.color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = star.color;
      
      drawStar(star.x, star.y, star.size, 5);
      ctx.fill();
      
      ctx.restore();
    }
    
    requestAnimationFrame(draw);
  }
  
  draw();
} 