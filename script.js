// Main interactions: countdown, envelope open, confetti, play music
(() => {
  // Tanggal lahir Ayah: 2 Juli 1978
  const birthDate = new Date(1978, 6, 2); // month 6 = Juli (0-indexed)
  const birthdayMonth = 6; // July (0-indexed)
  const birthdayDay = 2;

  // Countdown targets next occurrence of July 2
  function nextBirthdayDate() {
    const now = new Date();
    let year = now.getFullYear();
    const thisYearBirthday = new Date(year, birthdayMonth, birthdayDay, 0, 0, 0);
    if (thisYearBirthday <= now) year += 1;
    return new Date(year, birthdayMonth, birthdayDay, 0, 0, 0);
  }

  function computeAge() {
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear = (now.getMonth() > birthDate.getMonth()) ||
      (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());
    if (!hasHadBirthdayThisYear) age -= 1;
    return age;
  }

  // Countdown update
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');
  const ageText = document.getElementById('age-text');

  function updateCountdown() {
    const target = nextBirthdayDate();
    const now = new Date();
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');

    const age = computeAge();
    ageText.textContent = `Ulang tahun: 2 Juli 1978 — Usia: ${age + (days === 0 && hours === 0 && minutes === 0 && seconds === 0 ? 1 : 0)} tahun`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Envelope open and interactions
  const envelope = document.getElementById('envelope');
  const openBtn = document.getElementById('open-btn');
  const letterText = document.getElementById('letter-text');
  const playMusicBtn = document.getElementById('play-music');
  const bgMusic = document.getElementById('bg-music');

  // Confetti canvas
  const confettiCanvas = document.getElementById('confetti-canvas');
  const ctx = confettiCanvas.getContext && confettiCanvas.getContext('2d');
  let confettiParticles = [];
  let confettiAnimId = null;

  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function createConfetti() {
    confettiParticles = [];
    const count = 120;
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * -confettiCanvas.height,
        r: Math.random() * 8 + 4,
        d: Math.random() * 40 + 10,
        color: ['#FFD166','#FF61A6','#9BF6FF','#C1FFD7'][Math.floor(Math.random() * 4)],
        tilt: Math.random() * 10 - 10,
        tiltAngle: 0,
        tiltSpeed: Math.random() * 0.1 + 0.05,
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 4 - 2
      });
    }
  }

  function drawConfetti() {
    if (!ctx) return;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = 0; i < confettiParticles.length; i++) {
      const p = confettiParticles[i];
      p.tiltAngle += p.tiltSpeed;
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.tiltAngle) * 0.5;
      p.tilt = Math.sin(p.tiltAngle) * 15;

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + p.tilt, p.y, p.r, p.r / 2);
      ctx.closePath();

      if (p.y > confettiCanvas.height + 20) {
        p.y = Math.random() * -confettiCanvas.height;
        p.x = Math.random() * confettiCanvas.width;
      }
    }
    confettiAnimId = requestAnimationFrame(drawConfetti);
  }

  function startConfetti(duration = 4000) {
    if (!ctx) return;
    createConfetti();
    drawConfetti();
    setTimeout(stopConfetti, duration);
  }

  function stopConfetti() {
    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
    confettiAnimId = null;
    if (ctx) ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }

  // Play/pause music with button; note browser autoplay restrictions require user gesture
  function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.play().catch(()=>{ /* ignore play errors */ });
      playMusicBtn.textContent = 'Pause Musik';
      playMusicBtn.setAttribute('aria-pressed', 'true');
    } else {
      bgMusic.pause();
      playMusicBtn.textContent = 'Putar Musik';
      playMusicBtn.setAttribute('aria-pressed', 'false');
    }
  }

  playMusicBtn.addEventListener('click', () => {
    toggleMusic();
  });

  // Envelope open handler
  let opened = false;
  openBtn.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    envelope.classList.add('open');
    // Default letter content (editable in HTML)
    letterText.innerHTML = `Ayah Indra yang tercinta,<br><br>
      Selamat ulang tahun! Semoga tahun ini membawa lebih banyak tawa, kesehatan, dan kebahagiaan. Terima kasih untuk segala cinta dan pengorbanan. Kami sangat menyayangimu.<br><br>
      Dengan cinta, keluargamu.`;
    // Play confetti and play music (user already clicked open = user gesture)
    startConfetti(6000);
    // Try to play music if available
    if (bgMusic) {
      bgMusic.play().catch(()=>{/* may fail if no user gesture */});
      playMusicBtn.textContent = 'Pause Musik';
      playMusicBtn.setAttribute('aria-pressed', 'true');
    }
  });

})();
