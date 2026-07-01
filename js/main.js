// js/main.js — tune celebration: more hearts and longer confetti; play a celebratory sound on celebrate
console.log('main.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready');

  // Config
  const birthDate = new Date(1978, 6, 2);
  const bMonth = 6, bDay = 2;

  // Elements
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');
  const ageText = document.getElementById('age-text');

  const envelope = document.getElementById('envelope');
  const openBtn = document.getElementById('open-btn');
  const letter = document.getElementById('letter');
  const letterText = document.getElementById('letter-text');
  const flapEl = document.getElementById('flap');

  const playMusicBtn = document.getElementById('play-music');
  const bgMusic = document.getElementById('bg-music');
  const audioStatus = document.getElementById('audio-status');
  const forcePlayBtn = document.getElementById('force-play');

  // celebratory sound element (new) — short, hosted sound that reliably plays
  let celebrateSound = document.getElementById('celebrate-sound');
  if (!celebrateSound){
    celebrateSound = document.createElement('audio');
    celebrateSound.id = 'celebrate-sound';
    celebrateSound.preload = 'auto';
    celebrateSound.src = 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg';
    celebrateSound.style.display = 'none';
    document.body.appendChild(celebrateSound);
  }

  // Ensure audio element configured
  if (bgMusic) {
    bgMusic.preload = 'auto';
    bgMusic.loop = true;
    bgMusic.volume = bgMusic.volume || 1.0;
  }

  console.log('elements', { envelope: !!envelope, bgMusic: !!bgMusic, celebrateSound: !!celebrateSound });

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
  function formatNumber(n){ return String(n).padStart(2,'0'); }

  // Full letter message provided by user
  const defaultMessage = `
    <p>Selamat ulang tahun, Ayahku tercinta, <strong>Indra</strong>. ❤️</p>

    <p>Hari ini adalah hari yang sangat spesial karena Allah telah memberikan satu tahun lagi untuk kehidupan Ayah. Terima kasih atas semua pengorbanan, kerja keras, kasih sayang, dan doa yang selalu Ayah berikan tanpa pernah meminta balasan. Mungkin tidak semua lelah Ayah terlihat, tetapi setiap usaha Ayah selalu menjadi alasan kami bisa tumbuh dan menjalani hidup dengan lebih baik.</p>

    <p>Ayah, semoga di usia yang baru ini Allah SWT senantiasa memberikan kesehatan yang sempurna, umur yang penuh keberkahan, rezeki yang halal dan melimpah, hati yang tenang, serta kebahagiaan di setiap langkah Ayah. Semoga setiap doa yang Ayah panjatkan dikabulkan, setiap kesulitan dimudahkan, dan setiap kebaikan yang Ayah lakukan menjadi amal jariyah yang terus mengalir.</p>

    <p>Terima kasih karena telah menjadi sosok ayah yang kuat, penyayang, sabar, dan selalu berjuang untuk keluarga. Maaf jika selama ini aku masih sering membuat Ayah kecewa atau belum bisa membalas semua pengorbanan Ayah. Semoga suatu hari nanti aku bisa menjadi anak yang membanggakan dan membalas semua kebaikan yang telah Ayah berikan.</p>

    <p>Selamat bertambah usia, Ayah Indra. Semoga Allah selalu menjaga Ayah di mana pun berada, melindungi setiap langkah Ayah, dan memberikan kehidupan yang dipenuhi keberkahan hingga dunia dan akhirat.</p>

    <p>Aku sayang Ayah. 🤍</p>

    <p><strong>Barakallahu fii 'umrik, Ayah. Semoga Allah senantiasa melimpahkan rahmat, keberkahan, dan ridha-Nya untuk setiap langkah kehidupan Ayah. Aamiin ya Rabbal 'alamin.</strong></p>
  `;

  let celebrated = false; // prevent repeat

  function updateCountdown() {
    try {
      const target = nextBirthdayDate();
      const now = new Date();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000*60*60*24));
      const hours = Math.floor((diff / (1000*60*60)) % 24);
      const minutes = Math.floor((diff / (1000*60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = formatNumber(hours);
      if (minsEl) minsEl.textContent = formatNumber(minutes);
      if (secsEl) secsEl.textContent = formatNumber(seconds);
      const age = computeAge();
      if (ageText) ageText.textContent = `Ulang tahun: 2 Juli 1978 — Usia: ${age + (days===0 && hours===0 && minutes===0 && seconds===0 ? 1 : 0)} tahun`;

      // When countdown reaches zero, trigger celebration once
      if (diff === 0 && !celebrated) {
        celebrated = true;
        // small delay to allow UI transitions
        setTimeout(() => {
          celebrate();
        }, 250);
      }
    } catch (err) {
      console.error('countdown error', err);
    }
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Confetti implementation (canvas-based)
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  let particles = [], animId = null;
  function resizeCanvas(){ if (canvas){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; } }
  window.addEventListener('resize', resizeCanvas); resizeCanvas();
  function makeConfetti(n=120){ if (!canvas || !ctx) return; particles=[]; const colors=['#FFD166','#FF61A6','#9BF6FF','#C1FFD7','#FF9F43']; for (let i=0;i<n;i++){ particles.push({ x: Math.random()*canvas.width, y: Math.random()*-canvas.height, r: Math.random()*8+6, tilt: Math.random()*10-10, tiltAngle:0, tiltSpeed: Math.random()*0.12+0.02, speedY: Math.random()*4+2, speedX: Math.random()*6-3, color: colors[Math.floor(Math.random()*colors.length)] }); } }
  function drawConfetti(){ if (!ctx) return; ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{ p.tiltAngle += p.tiltSpeed; p.y += p.speedY; p.x += p.speedX + Math.sin(p.tiltAngle)*0.6; p.tilt = Math.sin(p.tiltAngle)*15; ctx.fillStyle = p.color; ctx.fillRect(p.x + p.tilt, p.y, p.r, p.r/2); if (p.y > canvas.height + 20) { p.y = Math.random()*-canvas.height; p.x = Math.random()*canvas.width; } }); animId = requestAnimationFrame(drawConfetti); }
  function startConfetti(ms=4500){ if (!ctx) return; makeConfetti(180); drawConfetti(); setTimeout(()=>{ stopConfetti(); }, ms); }
  function stopConfetti(){ if (animId) cancelAnimationFrame(animId); animId=null; if (ctx) ctx.clearRect(0,0,canvas.width,canvas.height); }

  // Hearts animation (DOM elements)
  function startHearts(n=40){ const containerId = 'hearts-container'; let container = document.getElementById(containerId); if (!container){ container = document.createElement('div'); container.id = containerId; container.style.position = 'fixed'; container.style.left = 0; container.style.top = 0; container.style.width = '100%'; container.style.height = '100%'; container.style.pointerEvents = 'none'; container.style.overflow = 'visible'; container.style.zIndex = 10060; document.body.appendChild(container); } for (let i=0;i<n;i++){ const heart = document.createElement('div'); heart.className = 'floating-heart'; const size = Math.floor(Math.random()*24)+16; heart.style.width = `${size}px`; heart.style.height = `${size}px`; heart.style.left = `${Math.random()*90 + 5}%`; heart.style.opacity = String(0.8 + Math.random()*0.2); heart.style.position = 'absolute'; heart.style.background = 'radial-gradient(circle at 30% 30%, #FF6B9A, #FF2D95)'; heart.style.borderRadius = '50%'; heart.style.transform = `translateY(-20px) rotate(${Math.random()*40-20}deg)`; const duration = 3000 + Math.random()*4000; heart.style.transition = `transform ${duration}ms linear, top ${duration}ms linear, opacity ${duration}ms linear`; heart.style.top = '-10%'; container.appendChild(heart); setTimeout(()=>{ heart.style.top = (80 + Math.random()*10) + '%'; heart.style.transform = `translateY(0) rotate(${Math.random()*30-15}deg)`; heart.style.opacity = '0.95'; }, Math.random()*600); setTimeout(()=> heart.remove(), duration + 800); } }
  
  function celebrate(){
    // start confetti and hearts
    startConfetti(8000);
    startHearts(60);
    // try to play music (if user already interacted)
    if (bgMusic){
      bgMusic.play().catch(()=>{});
    }
    // open the envelope and insert the full message
    if (envelope && !envelope.classList.contains('open')){
      envelope.classList.add('open');
    }
    if (letterText){
      letterText.innerHTML = defaultMessage;
      // ensure letter-body is scrollable
      letterText.style.overflowY = 'auto';
      letterText.style.maxHeight = '58vh';
      letterText.style.paddingRight = '12px';
    }
  }

  // expose celebrate so it can be triggered from console if needed
  window.celebrate = celebrate;

  // Audio helpers
  function showAudioControls(){ if (!bgMusic) return; bgMusic.style.display='block'; }
  function showAudioStatus(msg, isError){ if (!audioStatus) return; audioStatus.textContent = msg; audioStatus.style.display = 'block'; audioStatus.style.color = isError ? '#b91c1c' : '#374151'; }
  function clearAudioStatus(){ if (!audioStatus) return; audioStatus.textContent=''; audioStatus.style.display='none'; }

  function setMusic(play){ if (!bgMusic) return Promise.resolve(false); clearAudioStatus(); if (play){ const p = bgMusic.play(); if (p && p.then){ return p.then(()=>{ if (playMusicBtn) { playMusicBtn.textContent = 'Pause Musik'; playMusicBtn.setAttribute('aria-pressed','true'); } clearAudioStatus(); return true; }).catch((err)=>{ showAudioControls(); showAudioStatus('Browser memblokir pemutaran otomatis. Silakan tekan tombol Play pada pemutar.', true); if (playMusicBtn) playMusicBtn.textContent='Putar Musik'; playMusicBtn.setAttribute('aria-pressed','false'); return false; }); } else { if (!bgMusic.paused){ if (playMusicBtn) { playMusicBtn.textContent='Pause Musik'; playMusicBtn.setAttribute('aria-pressed','true'); } return Promise.resolve(true); } else { showAudioControls(); showAudioStatus('Klik Play pada pemutar untuk memulai musik.', true); return Promise.resolve(false); } } } else { bgMusic.pause(); if (playMusicBtn) { playMusicBtn.textContent = 'Putar Musik'; playMusicBtn.setAttribute('aria-pressed','false'); } clearAudioStatus(); return Promise.resolve(false); } }

  if (playMusicBtn) { playMusicBtn.addEventListener('click', (e)=>{ if (!bgMusic) return; if (bgMusic.paused) { setMusic(true); } else { setMusic(false); } }); }

  // Wire force-play button (if visible)
  if (forcePlayBtn){ forcePlayBtn.addEventListener('click', ()=>{ if (!bgMusic) return; bgMusic.play().then(()=>{ forcePlayBtn.style.display='none'; clearAudioStatus(); if (playMusicBtn) { playMusicBtn.textContent='Pause Musik'; playMusicBtn.setAttribute('aria-pressed','true'); } }).catch((e)=>{ console.error('manual play failed', e); showAudioStatus('Gagal memulai. Silakan tekan Play pada pemutar.', true); }); } )}

  // Flap transition hide/show
  if (flapEl) { flapEl.addEventListener('transitionend', (e)=>{ if (e.propertyName && e.propertyName.includes('transform') && envelope && envelope.classList.contains('open')){ flapEl.style.display='none'; } }); }
  function showFlapBeforeClose(){ if (!flapEl) return; flapEl.style.display=''; void flapEl.offsetWidth; }

  let opened=false;
  function setOpen(state){ const opening = Boolean(state); if (!opening) showFlapBeforeClose(); opened = opening; if (envelope) envelope.classList.toggle('open', opened); if (envelope) envelope.setAttribute('aria-expanded', String(opened)); if (letter) letter.setAttribute('aria-hidden', String(!opened)); if (openBtn) { openBtn.setAttribute('aria-expanded', String(opened)); openBtn.textContent = opened ? 'Tutup Amplop' : 'Buka amplop'; } if (opened){ if (letterText && (!letterText.innerHTML || letterText.innerHTML.trim()==='')) letterText.innerHTML = defaultMessage; startConfetti(5000); setMusic(true).then(()=>{}); } else { stopConfetti(); } }

  if (envelope){ envelope.style.position = envelope.style.position || 'relative'; envelope.style.zIndex = envelope.style.zIndex || '9999'; envelope.addEventListener('click', ()=> setOpen(!opened)); envelope.addEventListener('keydown', (e)=>{ if (e.key==='Enter' || e.key===' '||e.key==='Spacebar'){ e.preventDefault(); setOpen(!opened); } }); }
  if (openBtn) openBtn.addEventListener('click', ()=> setOpen(!opened));

  console.log('main init complete');
});
