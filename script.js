// Main interactions: countdown, envelope open/close (click + keyboard), confetti, play music
(() => {
  // Tanggal lahir Ayah: 2 Juli 1978
  const birthDate = new Date(1978, 6, 2); // month 6 = Juli (0-indexed)
  const birthdayMonth = 6; // July (0-indexed)
  const birthdayDay = 2;

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

  // Elements for envelope + music
  const envelope = document.getElementById('envelope');
  const openBtn = document.getElementById('open-btn');
  const letter = document.getElementById('letter');
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

  function toggleMusic(play) {
    if (!bgMusic) return;
    if (typeof play === 'boolean') {
      if (play) bgMusic.play().catch(()=>{});
      else bgMusic.pause();
    } else {
      if (bgMusic.paused) bgMusic.play().catch(()=>{});
      else bgMusic.pause();
    }
    const isPlaying = !bgMusic.paused;
    playMusicBtn.textContent = isPlaying ? 'Pause Musik' : 'Putar Musik';
    playMusicBtn.setAttribute('aria-pressed', String(isPlaying));
  }

  playMusicBtn.addEventListener('click', () => toggleMusic());

  // Envelope open/close logic (click + keyboard)
  let opened = false;

  function setOpenState(state) {
    opened = !!state;
    if (opened) {
      envelope.classList.add('open');
      envelope.setAttribute('aria-expanded', 'true');
      letter.setAttribute('aria-hidden', 'false');
      openBtn.textContent = 'Tutup Amplop';
      openBtn.setAttribute('aria-expanded', 'true');
      // Fill default letter content (only set if placeholder)
      if (!letterText.dataset.filled) {
        letterText.innerHTML = `Ayah Indra yang tercinta,<br><br>
          Selamat ulang tahun! Semoga tahun ini membawa lebih banyak tawa, kesehatan, dan kebahagiaan. Terima kasih untuk segala cinta dan pengorbanan. Kami sangat menyayangimu.<br><br>
          Dengan cinta, keluargamu.`;
        letterText.dataset.filled = 'true';
      }
      // confetti + try play music (user gesture triggered by click/keyboard)
      startConfetti(6000);
      toggleMusic(true);
    } else {
      envelope.classList.remove('open');
      envelope.setAttribute('aria-expanded', 'false');
      letter.setAttribute('aria-hidden', 'true');
      openBtn.textContent = 'Buka amplop';
      openBtn.setAttribute('aria-expanded', 'false');
      // stop confetti and optionally pause music
      stopConfetti();
      // do not auto-pause music on close to respect user's intent--but you could:
      // toggleMusic(false);
    }
  }

  // Click envelope or button
  envelope.addEventListener('click', (e) => {
    setOpenState(!opened);
  });

  openBtn.addEventListener('click', (e) => {
    setOpenState(!opened);
  });

  // Keyboard support: Enter / Space to open when envelope focused
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setOpenState(!opened);
    }
  });

})();
