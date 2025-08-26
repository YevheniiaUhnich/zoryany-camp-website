// BUTTON FLASH + CONFETTI
function initButtons() {
  document.querySelectorAll(".button").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      // Prevent re-triggering during the flash animation
      if (btn.classList.contains("toggled")) {
        return;
      }

      // Flash blue and show confetti
      btn.classList.add("toggled");
      showConfetti(btn);

      // Return to pink after a short delay
      setTimeout(function () {
        btn.classList.remove("toggled");
      }, 400); // Duration of the flash
    });
  });
}

function showConfetti(button) {
  // Sound effect for confetti
  function playConfettiSound() {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Create multiple oscillators for rich sound
      for (let i = 0; i < 3; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Different frequencies for variety
        const frequencies = [800, 1200, 1600];
        oscillator.frequency.setValueAtTime(
          frequencies[i],
          audioContext.currentTime
        );
        oscillator.frequency.exponentialRampToValueAtTime(
          frequencies[i] * 0.5,
          audioContext.currentTime + 0.3
        );

        // Volume envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.1,
          audioContext.currentTime + 0.01
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (e) {
      // Fallback for browsers that don't support Web Audio API
      console.log("Audio not supported");
    }
  }

  // Play sound immediately
  playConfettiSound();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(canvas);

  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = [];
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
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

  function createParticle(i) {
    const angle = (i / 50) * Math.PI * 2;
    const velocity = random(2, 8);
    return {
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 2,
      life: 1,
      decay: random(0.01, 0.03),
      color: colors[Math.floor(random(0, colors.length))],
      size: random(3, 8),
      type: Math.random() > 0.5 ? "circle" : "star",
    };
  }

  for (let i = 0; i < 50; i++) {
    particles.push(createParticle(i));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;

      if (p.type === "star") {
        drawStar(p.x, p.y, p.size, 5);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    if (particles.length > 0) {
      requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }

  draw();
}

export { initButtons };
