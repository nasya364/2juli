// js/main.js — robust audio handling so playback starts from user gesture and keeps playing until user pauses
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

  // Ensure audio element configured
  if (bgMusic) {
    bgMusic.preload = 'auto';
    bgMusic.loop = true;
    bgMusic.volume = bgMusic.volume || 1.0;
  }

  console.log('elements', { envelope: !!envelope, bgMusic: !!bgMusic });

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
    } catch (err) {
      console.error('countdown error', err);
    }
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Confetti (unchanged)
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  let particles = [], animId = null;
  function resizeCanvas(){ if (canvas){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; } }
  window.addEventListener('resize', resizeCanvas); resizeCanvas();
  function makeConfetti(n=120){ if (!canvas || !ctx) return; particles=[]; const colors=['#FFD166','#FF61A6','#9BF6FF','#C1FFD7']; for(let i=0;i<n;i++){ particles.push({ x:Math.random()*canvas.width, y:Math.random()*-canvas.height, r:Math.random()*8+4, tilt:Math.random()*10-10, tiltAngle:0, tiltSpeed:Math.random()*0.1+0.05, speedY:Math.random()*3+2, speedX:Math.random()*4-2, color:colors[Math.floor(Math.random()*colors.length)] }); } }
  function draw(){ if(!ctx) return; ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{ p.tiltAngle+=p.tiltSpeed; p.y+=p.speedY; p.x+=p.speedX+Math.sin(p.tiltAngle)*0.5; p.tilt=Math.sin(p.tiltAngle)*15; ctx.fillStyle=p.color; ctx.fillRect(p.x+p.tilt,p.y,p.r,p.r/2); if(p.y>canvas.height+20){ p.y=Math.random()*-canvas.height; p.x=Math.random()*canvas.width; } }); animId=requestAnimationFrame(draw); }
  function startConfetti(ms=4500){ if(!ctx) return; makeConfetti(140); draw(); setTimeout(()=>{ stopConfetti(); }, ms); }
  function stopConfetti(){ if (animId) cancelAnimationFrame(animId); animId=null; if (ctx) ctx.clearRect(0,0,canvas.width,canvas.height); }

  // Audio handling helpers
  function showAudioControls(){ if (!bgMusic) return; bgMusic.style.display='block'; }
  function hideAudioControls(){ if (!bgMusic) return; /* keep hidden if you want */ }
  function showAudioStatus(msg, isError){ if (!audioStatus) return; audioStatus.textContent = msg; audioStatus.style.display = 'block'; audioStatus.style.color = isError ? '#b91c1c' : '#374151'; }
  function clearAudioStatus(){ if (!audioStatus) return; audioStatus.textContent=''; audioStatus.style.display='none'; }

  // setMusic attempts to play/pause and handles promise rejection
  function setMusic(play){
    if (!bgMusic) return Promise.resolve(false);
    clearAudioStatus();
    if (play){
      // try to play — this must be triggered by user gesture to avoid rejection
      const p = bgMusic.play();
      if (p && p.then){
        return p.then(()=>{
          // playing
          if (playMusicBtn) { playMusicBtn.textContent = 'Pause Musik'; playMusicBtn.setAttribute('aria-pressed','true'); }
          clearAudioStatus();
          return true;
        }).catch((err)=>{
          console.warn('audio play failed', err);
          // show the controls and an instruction so user can manually start
          showAudioControls();
          showAudioStatus('Browser memblokir pemutaran otomatis. Silakan tekan tombol Play pada pemutar.', true);
          // focus the player for convenience
          try{ bgMusic.focus(); }catch(e){}
          if (playMusicBtn) playMusicBtn.textContent = 'Putar Musik'; playMusicBtn.setAttribute('aria-pressed','false');
          return false;
        });
      } else {
        // older browsers: bgMusic.play may not return promise
        if (!bgMusic.paused){ if (playMusicBtn) { playMusicBtn.textContent='Pause Musik'; playMusicBtn.setAttribute('aria-pressed','true'); } return Promise.resolve(true); }
        else { showAudioControls(); showAudioStatus('Klik Play pada pemutar untuk memulai musik.', true); return Promise.resolve(false); }
      }
    } else {
      // pause
      bgMusic.pause();
      if (playMusicBtn) { playMusicBtn.textContent = 'Putar Musik'; playMusicBtn.setAttribute('aria-pressed','false'); }
      clearAudioStatus();
      return Promise.resolve(false);
    }
  }

  // Wire play button
  if (playMusicBtn) {
    playMusicBtn.addEventListener('click', (e)=>{
      if (!bgMusic) return;
      if (bgMusic.paused) {
        // user gesture: try to play; if fails, controls already shown
        setMusic(true);
      } else {
        setMusic(false);
      }
    });
  }

  // Ensure opening envelope tries to play using the user gesture
  const defaultMessage = `\n    Ayah Indra yang tercinta,<br><br>    Selamat ulang tahun! Terima kasih atas cinta, bimbingan, dan semua pengorbanan yang telah Ayah berikan.    Semoga selalu sehat, bahagia, dan diberkati di setiap langkah. Kami sangat menyayangimu.<br><br>    Peluk hangat dan doa dari keluarga.\n  `;

  // Flap transition hide/show
  if (flapEl) {
    flapEl.addEventListener('transitionend', (e)=>{
      if (e.propertyName && e.propertyName.includes('transform') && envelope && envelope.classList.contains('open')){
        flapEl.style.display='none';
      }
    });
  }
  function showFlapBeforeClose(){ if (!flapEl) return; flapEl.style.display=''; void flapEl.offsetWidth; }

  let opened=false;
  function setOpen(state){
    const opening = Boolean(state);
    if (!opening) showFlapBeforeClose();
    opened = opening;
    if (envelope) envelope.classList.toggle('open', opened);
    if (envelope) envelope.setAttribute('aria-expanded', String(opened));
    if (letter) letter.setAttribute('aria-hidden', String(!opened));
    if (openBtn) { openBtn.setAttribute('aria-expanded', String(opened)); openBtn.textContent = opened ? 'Tutup Amplop' : 'Buka amplop'; }
    if (opened){
      if (letterText && (!letterText.innerHTML || letterText.innerHTML.trim()==='')) letterText.innerHTML = defaultMessage;
      startConfetti(5000);
      // Important: this call happens inside a direct click handler (user gesture) so browser should allow play
      setMusic(true).then((ok)=>{
        if (!ok){
          // if play failed, show a hint near the play button (already handled in setMusic)
          console.log('play not started automatically');
        }
      });
    } else {
      stopConfetti();
      // Do not auto-pause on close — keep playing until user pauses
    }
  }

  // Defensive: ensure envelope topmost and clickable
  if (envelope){ envelope.style.position = envelope.style.position || 'relative'; envelope.style.zIndex = envelope.style.zIndex || '9999'; envelope.addEventListener('click', ()=> setOpen(!opened)); envelope.addEventListener('keydown', (e)=>{ if (e.key==='Enter' || e.key===' '||e.key==='Spacebar'){ e.preventDefault(); setOpen(!opened); } }); }
  if (openBtn) openBtn.addEventListener('click', ()=> setOpen(!opened));

  console.log('main init complete');
});
