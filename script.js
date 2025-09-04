/* ===========================
   Ultimate Yes/No Game Script
   Corrected version
   Features:
   - name modal (iPhone style)
   - personalized messages
   - running No button (max 5 repeats)
   - Yes button grows (and 10x Yes -> easter egg)
   - background shifts + parallax
   - floating words & emoji rain
   - confetti (canvas-confetti)
   - ripple canvas and final water-droplet letters that pile
   - WebAudio-generated sound effects & background music toggle
   - Corrected: No button returns after popup
   =========================== */

/* -------- SETTINGS (toggle here) -------- */
const SETTINGS = {
  emojiOnClick: true,
  emojiRainOnConfetti: true,
  confettiOnMilestones: true,
  backgroundShift: true,
  noRunsMax: 5,
  rippleOnLanding: true,
  soundEnabled: true,
  musicEnabled: true
};

/* -------- DOM refs -------- */
const messageEl = document.getElementById('message');
const yesBtn = document.getElementById('yesBtn');
const noBtn  = document.getElementById('noBtn');
const nameModal = document.getElementById('nameModal');
const nameInput = document.getElementById('nameInput');
const nameStart = document.getElementById('nameStart');
const noPopup = document.getElementById('noPopup');
const rippleCanvas = document.getElementById('rippleCanvas');
const musicToggle = document.getElementById('musicToggle');

/* canvas setup */
const ctx = rippleCanvas.getContext && rippleCanvas.getContext('2d');
function resizeCanvas(){ rippleCanvas.width = innerWidth; rippleCanvas.height = innerHeight; }
addEventListener('resize', resizeCanvas);
resizeCanvas();

/* -------- web audio (simple synths) -------- */
let audioCtx = null;
function ensureAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playBeep(freq=600, time=0.08, type='sine', vol=0.06){
  if(!SETTINGS.soundEnabled) return;
  try{
    const ctx = ensureAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + time);
    o.stop(ctx.currentTime + time + 0.02);
  }catch(e){}
}
function playBoing(){ playBeep(420,0.16,'sine',0.06); }
function playPop(){ playBeep(880,0.08,'triangle',0.04); }
function playSplash(){ playBeep(240,0.26,'sawtooth',0.04); }

/* background music loop (very light ambient using oscillator) */
let musicOsc = null;
let musicGain = null;
function startMusic(){
  if(!SETTINGS.musicEnabled) return;
  try{
    const ctx = ensureAudio();
    if(musicOsc) return;
    musicOsc = ctx.createOscillator();
    musicGain = ctx.createGain();
    musicOsc.type = 'sine';
    musicOsc.frequency.value = 120;
    musicGain.gain.value = 0.0025; // quiet
    musicOsc.connect(musicGain); musicGain.connect(ctx.destination);
    musicOsc.start();
    setInterval(()=> {
      if(!musicOsc) return;
      musicOsc.frequency.setTargetAtTime(90 + Math.random()*120, ctx.currentTime, 0.6);
    }, 2200);
    musicToggle.textContent = '🔊';
  }catch(e){}
}
function stopMusic(){
  if(musicOsc){ musicOsc.stop(); musicOsc.disconnect(); musicGain.disconnect(); musicOsc=null; musicGain=null; }
  musicToggle.textContent = '🔈';
}
musicToggle.addEventListener('click', ()=>{
  if(!audioCtx) ensureAudio();
  if(musicOsc) { stopMusic(); SETTINGS.musicEnabled = false; }
  else { SETTINGS.musicEnabled = true; startMusic(); }
});

/* -------- messages (use name placeholder {name}) -------- */
let playerName = '';
const baseMessages = [
  "Hey {name}! 👋 Can I ask you something?",
  "Promise you'll answer honestly? 🤨",
  "Do you like surprises? 🎁",
  "Good... because this will be fun 😏",
  "Do you think I can guess your favorite color? 🎨",
  "Haha — I was going to say blue anyway 💙",
  "Want to try a tiny game?",
  "Okay... ready?",
  "Here we go — 3... 2... 1...",
  "SURPRISE! 🎉 You're awesome!",
  "Seriously, you made it this far... respect ✊",
  "Final question incoming...",
  "Do you want to see the grand finale? 🤯",
  "YOU WON 🎊" // final trigger
];
let messages = [...baseMessages];

/* -------- state -------- */
let idx = 0;
let noRunCount = 0;       // how many times No ran so far
let noClicksConsec = 0;   // consecutive No clicks for popup
let yesConsec = 0;        // count of consecutive Yes clicks (for easter)
let yesSizeScale = 1;
let runningUsed = 0;

/* -------- utilities -------- */
const rand = (a,b)=> Math.random()*(b-a)+a;
const choose = arr => arr[Math.floor(Math.random()*arr.length)];

/* -------- parallax mouse movement -------- */
document.addEventListener('mousemove', (e)=>{
  const x = (e.clientX / innerWidth - 0.5) * 10;
  const y = (e.clientY / innerHeight - 0.5) * 10;
  const card = document.getElementById('card');
  if(card) card.style.transform = `translateZ(0) rotateX(${ -y }deg) rotateY(${ x }deg)`;
});

/* -------- show message -------- */
let typing = false;
function showMessage(text, cb){
  typing = true;
  messageEl.classList.remove('pop');
  messageEl.textContent = '';
  const chars = Array.from(text);
  let i = 0;
  const t = setInterval(()=>{
    messageEl.textContent += chars[i] ?? '';
    i++;
    if(i >= chars.length){ clearInterval(t);
      setTimeout(()=>{ messageEl.classList.add('pop'); }, 60);
      typing = false;
      if(cb) cb();
    }
  }, 28);
}

/* -------- background shift per question -------- */
function shiftBackground(){
  if(!SETTINGS.backgroundShift) return;
  const palettes = [
    ['#0f172a','#0f3753'],
    ['#071b2e','#011627'],
    ['#0f2027','#2c5364'],
    ['#232526','#414345'],
    ['#141E30','#243B55'],
    ['#283048','#859398']
  ];
  const p = choose(palettes);
  document.body.style.background = `linear-gradient(120deg, ${p[0]}, ${p[1]})`;
}

/* -------- floating words & emoji rain -------- */
function spawnFloatingWord(text){
  const el = document.createElement('div');
  el.className = 'float-thing';
  el.textContent = text;
  el.style.left = `${rand(40, innerWidth - 140)}px`;
  el.style.top = `${rand(innerHeight*0.55, innerHeight - 80)}px`;
  el.style.fontSize = `${rand(14,22)}px`;
  document.body.appendChild(el);
  requestAnimationFrame(()=> el.style.transform = `translateY(-${rand(40,140)}px) translateX(${rand(-40,40)}px) scale(${rand(0.9,1.06)})`);
  setTimeout(()=> el.remove(), 2500);
}
function emojiRain(count=18, list=['🎉','✨','💖','🌟','🥳','🫧','🍾']){
  for(let i=0;i<count;i++){
    const e = document.createElement('div');
    e.className = 'float-thing';
    e.textContent = choose(list);
    e.style.fontSize = `${rand(18,36)}px`;
    e.style.left = `${rand(0, innerWidth)}px`;
    e.style.top = `-40px`;
    document.body.appendChild(e);
    const dur = rand(1200,2600);
    e.style.transition = `transform ${dur}ms linear, opacity 300ms`;
    requestAnimationFrame(()=> e.style.transform = `translateY(${innerHeight + 80}px) rotate(${rand(-360,360)}deg)`);
    setTimeout(()=> e.remove(), dur+120);
  }
}

/* -------- confetti -------- */
function doConfetti(){
  if(typeof confetti === 'function' && SETTINGS.confettiOnMilestones){
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.45 } });
  }
}

/* -------- screen shake -------- */
function screenShake(){
  const card = document.getElementById('card');
  card.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-8px)' },
    { transform: 'translateX(8px)' },
    { transform: 'translateX(-6px)' },
    { transform: 'translateX(0)' }
  ], { duration: 420, easing: 'ease-out' });
}

/* -------- No button running -------- */
function makeNoRunOnce(){
  const pad = 12;
  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  const left = rand(pad, innerWidth - w - pad);
  const top = rand(120, innerHeight - h - 120);
  noBtn.style.position = 'fixed';
  noBtn.style.left = `${left}px`;
  noBtn.style.top  = `${top}px`;
  playBoing();
}

/* -------- click emojis -------- */
function spawnClickEmoji(x=null,y=null){
  if(!SETTINGS.emojiOnClick) return;
  const list = ['🎉','😂','😍','😏','💖','✨','💦','🔥','🥳','🫧'];
  const el = document.createElement('div');
  el.className = 'float-thing';
  el.textContent = choose(list);
  el.style.left = `${(x ?? rand(80, innerWidth-80))}px`;
  el.style.top  = `${(y ?? (innerHeight - 80))}px`;
  el.style.fontSize = `${rand(18,32)}px`;
  document.body.appendChild(el);
  requestAnimationFrame(()=> el.style.transform = `translateY(-${rand(120,240)}px) rotate(${rand(-16,16)}deg)`);
  setTimeout(()=> el.remove(), 2200);
}

/* -------- ripple system -------- */
const ripples = [];
function spawnRipple(x,y){
  if(!SETTINGS.rippleOnLanding || !ctx) return;
  ripples.push({ x, y, start: performance.now(), life: 800, maxR: rand(26,44) });
}
function renderRipples(){
  if(!ctx) return;
  ctx.clearRect(0,0,rippleCanvas.width, rippleCanvas.height);
  const now = performance.now();
  for(let i=ripples.length-1;i>=0;i--){
    const r = ripples[i];
    const t = (now - r.start) / r.life;
    if(t >= 1){ ripples.splice(i,1); continue; }
    const rad = r.maxR * easeOutCubic(t);
    const alpha = (1 - t) * 0.8;
    ctx.beginPath();
    ctx.arc(r.x, r.y, rad, 0, Math.PI*2);
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  requestAnimationFrame(renderRipples);
}
function easeOutCubic(t){ return 1 - Math.pow(1-t, 3); }
requestAnimationFrame(renderRipples);

/* -------- falling letters (finale) -------- */
let columns = [];
let colW = 36;
function calcColumns(){
  const cols = Math.max(6, Math.floor(innerWidth / colW));
  columns = Array.from({length: cols}).map(()=>0);
}
calcColumns();
addEventListener('resize', ()=> { calcColumns(); resizeCanvas(); });

function dropChar(ch){
  const el = document.createElement('div');
  el.className = 'falling-letter';
  el.textContent = ch;
  el.style.color = `hsl(${Math.floor(rand(0,360))},75%,72%)`;
  el.style.left = `${rand(8, innerWidth - 30)}px`;
  el.style.top = `-40px`;
  el.style.transform = `rotate(${rand(-30,30)}deg)`;
  document.body.appendChild(el);
  const mid = Math.floor(columns.length/2);
  let col = Math.floor(rand(0, columns.length));
  if(Math.random() < 0.45) col = Math.max(0, Math.min(columns.length-1, mid + Math.floor(rand(-3,4))));
  const leftTarget = Math.floor(col * colW + rand(8, colW-12));
  const topTarget = innerHeight - 80 - columns[col];
  const duration = Math.floor(rand(700,1200));
  requestAnimationFrame(()=> {
    el.style.transition = `top ${duration}ms cubic-bezier(.12,.9,.24,1), left ${duration}ms ease, transform ${duration}ms cubic-bezier(.12,.9,.24,1)`;
    el.style.left = `${leftTarget}px`;
    el.style.top = `${topTarget}px`;
  });
  setTimeout(()=>{
    columns[col] += 28;
    el.animate([{ transform: 'scale(1.03)' }, { transform:'scale(1)' }], { duration:220, easing:'ease-out' });
    spawnRipple(leftTarget + 8, inner
