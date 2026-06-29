// countdown + envelope open/close + confetti + music
(() => {
  // Tanggal ultah: 2 Juli 1978
  const birthDate = new Date(1978, 6, 2);
  const bMonth = 6, bDay = 2;

  // Helpers
  function nextBirthdayDate() {
    const now = new Date();
    let year = now.getFullYear();
    const cand = new Date(year, bMonth, bDay, 0, 0, 0);
    if (cand <= now) year += 1;
    return new Date(year, bMonth, bDay, 0, 0, 0);
  }
  function computeAge() {
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const had = (now.getMonth() > birthDate.getMonth()) ||
      (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());
    if (!had) age -= 1;
    return age;
  }

  // Countdown DOM
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');
  const ageText = document.getElementById('age-text');

  function updateCountdown() {
    const target = nextBirthdayDate();
    const now = new Date();
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2,'0');
    minsEl.textContent = String(minutes).padStart(2,'0');
    secsEl.textContent = String(seconds).padStart(2,'0');
    const age = computeAge();
    ageText.textContent = `Ulang tahun: 2 Juli 1978 — Usia: ${age + (days===0 && hours===0 && minutes===0 && seconds===0 ? 1 : 0)} tahun`;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Envelope + buttons
  const envelope = document.getElementById('envelope');
  const openBtn = document.getElementById('open-btn');
  const letter = document.getElementById('letter');
  const letterText = document.getElementById('letter-text');
  const flap = document.getElementById('flap');

  const playMusicBtn = document.getElementById('play-music');
  const bgMusic = document.getElementById('bg-music');

  // Confetti setup
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext && canvas.getContext('2d');
  let particles = [], animId = null;
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function makeConfetti(n=120){
    particles = [];
    const colors = ['#FFD166','#FF61A6','#9BF6FF','#C1FFD7'];
    for (let i=0;i<n;i++){
      particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*-canvas.height,
        r: Math.random()*8+4,
        tilt: Math.random()*10-10,
        tiltAngle: 0,
        tiltSpeed: Math.random()*0.1+0.05,
        speedY: Math.random()*3+2,
        speedX: Math.random()*4-2,
        color: colors[Math.floor(Math.random()*colors.length)]
      });
    }
  }
  function draw(){
    if (!ctx) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.tiltAngle += p.tiltSpeed;
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.tiltAngle)*0.5;
      p.tilt = Math.sin(p.tiltAngle)*15;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + p.tilt, p.y, p.r, p.r/2);
      if (p.y > canvas.height + 20) {
        p.y = Math.random()*-canvas.height;
        p.x = Math.random()*canvas.width;
      }
    });
    animId = requestAnimationFrame(draw);
  }
  function startConfetti(ms=4500){
    if (!ctx) return;
    makeConfetti(140);
    draw();
    setTimeout(()=>{ stopConfetti(); }, ms);
  }
  function stopConfetti(){ if (animId) cancelAnimationFrame(animId); animId=null; if (ctx) ctx.clearRect(0,0,canvas.width,canvas.height); }

  // Music control
  function setMusic(play){
    if (!bgMusic) return;
    if (play) bgMusic.play().catch(()=>{});
    else bgMusic.pause();
    const playing = !bgMusic.paused;
    playMusicBtn.textContent = playing ? 'Pause Musik' : 'Putar Musik';
    playMusicBtn.setAttribute('aria-pressed', String(playing));
  }
  playMusicBtn.addEventListener('click', ()=> {
    if (!bgMusic) return;
    if (bgMusic.paused) setMusic(true); else setMusic(false);
  });

  // Fill letter content (you can change this message)
  const defaultMessage = `
    Ayah Indra yang tercinta,<br><br>
    Selamat ulang tahun! Terima kasih atas cinta, bimbingan, dan semua pengorbanan yang telah Ayah berikan.
    Semoga selalu sehat, bahagia, dan diberkati di setiap langkah. Kami sangat menyayangimu.<br><br>
    Peluk hangat dan doa dari keluarga.
  `;

  // open/close state
  let opened = false;
  function setOpen(state){
    opened = Boolean(state);
    envelope.classList.toggle('open', opened);
    envelope.setAttribute('aria-expanded', String(opened));
    letter.setAttribute('aria-hidden', String(!opened));
    openBtn.setAttribute('aria-expanded', String(opened));
    openBtn.textContent = opened ? 'Tutup Amplop' : 'Buka amplop';
    if (opened){
      // fill letter (only if empty)
      if (!letterText.innerHTML || letterText.innerHTML.trim()==='') letterText.innerHTML = defaultMessage;
      // animate confetti and try to play music (user gesture)
      startConfetti(5000);
      setMusic(true);
    } else {
      stopConfetti();
      // we don't forcibly pause music so user can continue, but you can uncomment:
      // setMusic(false);
    }
  }

  // Click and keyboard handlers
  envelope.addEventListener('click', (e) => { setOpen(!opened); });
  openBtn.addEventListener('click', (e) => { setOpen(!opened); });
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setOpen(!opened);
    }
  });

  // Ensure focus style for keyboard users
  envelope.addEventListener('focus', ()=> envelope.classList.add('focused'));
  envelope.addEventListener('blur', ()=> envelope.classList.remove('focused'));

})();
