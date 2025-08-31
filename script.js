/* ================================
   SETTINGS (toggle effects here)
   ================================ */
const SETTINGS = {
  emojiOnClick: true,
  emojiRainOnConfetti: true,
  confettiOnMilestones: true,
  backgroundShift: true,
  popupOn3No: true,
  rippleOnLanding: true
};

/* ================================
   Messages (easy to edit)
   Keep conversational flow so each step feels connected.
   ================================ */
const messages = [
  "Hey 👋 Can I ask you something?",
  "Promise you'll answer honestly? 🤨",
  "Do you like surprises? 🎁",
  "Good... because this will be fun 😏",
  "Do you think I can guess your favorite color? 🎨",
  "Haha — I was going to say blue anyway 💙",
  "Want to try a tiny game?",
  "Okay... are you ready?",
  "Here we go — 3... 2... 1...",
  "SURPRISE! 🎉 You're awesome!",
  "Seriously, you made it this far... respect ✊",
  "Final question incoming...",
  "Do you want to see the grand finale? 🤯",
  "YOU WON 🎊" // final/trigger the spill
];

/* ================================
   Simple state
   ================================ */
let idx = 0;
let noCount = 0;

/* elements */
const messageEl = document.getElementById('message');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const rippleCanvas = document.getElementById('rippleCanvas');
const ctx = rippleCanvas.getContext && rippleCanvas.getContext('2d');

/* sizing canvas */
function resizeCanvas(){
  rippleCanvas.width = window.innerWidth;
  rippleCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* ===== utility helpers ===== */
const rand = (a,b)=> Math.random()*(b-a)+a;
const choose = arr => arr[Math.floor(Math.random()*arr.length)];

/* ===== floating emoji on click ===== */
function spawnEmoji(x=null, y=null){
  if(!SETTINGS.emojiOnClick) return;
  const emojiList = ["🎉","😂","😍","😏","💖","✨","💦","🔥","🥳","🫧","🌟"];
  const el = document.createElement('div');
  el.className = 'float-emoji';
  el.textContent = choose(emojiList);
  el.style.left = (x ?? (window.innerWidth * Math.random())) + 'px';
  el.style.top  = (y ?? (window.innerHeight - 40)) + 'px';
  el.style.opacity = 0;
  document.body.appendChild(el);

  // animate up and fade
  const targetY = parseFloat(el.style.top) - (rand(120, 220));
  el.style.transition = `transform ${rand(1200,2200)}ms cubic-bezier(.2,.9,.2,1), opacity 800ms`;
  requestAnimationFrame(()=>{
    el.style.opacity = 1;
    el.style.transform = `translateY(-${parseFloat(el.style.top) - targetY}px) translateX(${rand(-40,40)}px) scale(${rand(0.94,1.12)})`;
  });
  // remove later
  setTimeout(()=> el.remove(), 2300);
}

/* ===== confetti utility (uses canvas-confetti lib) ===== */
function doConfetti(){
  if(!SETTINGS.confettiOnMilestones || typeof confetti !== 'function') return;
  confetti({ particleCount: 120, spread: 70, origin: { y: 0.45 } });
}

/* ===== popup toast after 3 No clicks ===== */
function showToast(text="Hmm...") {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(()=> t.style.opacity = '1', 10);
  setTimeout(()=> t.remove(), 2600);
}

/* ===== animated text change (typing-lite + pop) ===== */
let typingLock = false;
function showMessageText(text, cb){
  // quick type effect but non-blocking (buttons still work)
  typingLock = true;
  messageEl.classList.remove('pop');
  messageEl.textContent = '';
  const chars = Array.from(text);
  let i = 0;
  const id = setInterval(()=>{
    messageEl.textContent += chars[i] ?? '';
    i++;
    if(i >= chars.length){
      clearInterval(id);
      // small pop bounce
      messageEl.classList.add('pop');
      setTimeout(()=> messageEl.classList.remove('pop'), 380);
      typingLock = false;
      if(cb) cb();
    }
  }, 32); // fast type
}

/* ===== background shift on each click ===== */
function shiftBackground(){
  if(!SETTINGS.backgroundShift) return;
  const palettes = [
    ['#0f172a','#0f3753'],
    ['#071b2e','#011627'],
    ['#0f2027','#2c5364'],
    ['#232526','#414345'],
    ['#141E30','#243B55']
  ];
  const p = choose(palettes);
  document.body.style.background = `linear-gradient(120deg, ${p[0]}, ${p[1]})`;
}

/* ===== emoji rain (for milestone) ===== */
function emojiRain(count=18){
  const list = ["🎉","✨","💖","🌟","🥳","🫧","🍾"];
  for(let i=0;i<count;i++){
    const e = document.createElement('div');
    e.className = 'float-emoji';
    e.textContent = choose(list);
    e.style.fontSize = `${rand(18,30)}px`;
    e.style.left = `${rand(0, window.innerWidth)}px`;
    e.style.top  = `-40px`;
    document.body.appendChild(e);
    // animate falling
    const dur = rand(1200,2600);
    e.style.transition = `transform ${dur}ms linear, opacity 400ms`;
    requestAnimationFrame(()=> {
      e.style.transform = `translateY(${window.innerHeight+60}px) rotate(${rand(-120,120)}deg)`;
    });
    setTimeout(()=> e.remove(), dur+200);
  }
}

/* ===== ripple system on canvas ===== */
const ripples = []; // {x,y,r,tStart,duration}
function spawnRipple(x,y){
  if(!SETTINGS.rippleOnLanding || !ctx) return;
  ripples.push({ x, y, r: 0, start: performance.now(), life: 800, maxR: rand(22,42) });
}
function renderRipples(){
  if(!ctx) return;
  ctx.clearRect(0,0,rippleCanvas.width, rippleCanvas.height);
  const now = performance.now();
  for(let i = ripples.length-1; i>=0; i--){
    const rp = ripples[i];
    const t = (now - rp.start) / rp.life;
    if(t >= 1){ ripples.splice(i,1); continue; }
    const radius = rp.maxR * easeOutCubic(t);
    const alpha = (1 - t) * 0.65;
    ctx.beginPath();
    ctx.arc(rp.x, rp.y, radius, 0, Math.PI*2);
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  requestAnimationFrame(renderRipples);
}
function easeOutCubic(t){ return 1 - Math.pow(1-t, 3); }
requestAnimationFrame(renderRipples);

/* ===== final spill: falling letters that pile (columns-based) ===== */
const columns = []; // will be initialized by calcColumns()
let colW = 34; // column width to place letters
function calcColumns(){
  const cols = Math.max(6, Math.floor(window.innerWidth / colW));
  columns.length = 0;
  for(let i=0;i<cols;i++) columns.push(0); // height (px) already piled
}
calcColumns();
window.addEventListener('resize', ()=>{
  calcColumns();
  resizeCanvas();
});

/* drop and pile letters - uses columns[] heights */
function spillFinalText(text){
  // for each character create a falling node and drop into a column
  const chars = Array.from(text);
  chars.forEach((ch, i)=>{
    const el = document.createElement('div');
    el.className = 'falling-letter';
    el.textContent = ch;
    // random pastel color
    el.style.color = `hsl(${Math.floor(rand(0,360))},75%,70%)`;
    el.style.left = `${rand(8, window.innerWidth - 40)}px`;
    el.style.top  = `-40px`;
    el.style.transform = `rotate(${rand(-40,40)}deg)`;
    document.body.appendChild(el);

    // pick a random column to land in (bias towards center)
    const centerBias = () => {
      const mid = Math.floor(columns.length/2);
      const r = Math.random();
      if(r < 0.2) return mid + Math.floor(rand(-2,3));
      return Math.floor(rand(0, columns.length));
    };
    const col = Math.max(0, Math.min(columns.length-1, centerBias()));
    const leftTarget = Math.floor(col * colW + (colW/2) + rand(-8,8));
    const letterHeight = 26; // approximate vertical space occupied
    const topTarget = window.innerHeight - 80 - columns[col]; // stack upwards from bottom
    // animate falling
    const fallDuration = rand(700, 1200);
    // initial drop with translate animation
    requestAnimationFrame(()=> {
      el.style.transition = `top ${fallDuration}ms cubic-bezier(.12,.9,.24,1), left ${fallDuration}ms ease, transform ${fallDuration}ms cubic-bezier(.12,.9,.24,1)`;
      el.style.left = `${leftTarget}px`;
      el.style.top  = `${topTarget}px`;
      el.style.transform = `rotate(${rand(-30,30)}deg) scale(${rand(0.9,1.04)})`;
    });
    // after it lands, update column height and spawn ripple
    setTimeout(()=>{
      columns[col] += letterHeight;
      // small bounce (scale)
      el.style.transition = `transform 260ms cubic-bezier(.2,.8,.2,1)`;
      el.style.transform += ' scale(1.03)';
      setTimeout(()=> el.style.transform = el.style.transform.replace(' scale(1.03)',''), 260);
      // spawn ripple at landing coordinate (near bottom)
      const landingX = leftTarget + 8;
      const landingY = window.innerHeight - 60;
      spawnRipple(landingX, landingY);
    }, fallDuration + 10 + i*8);
  });
}

/* ===== flow control & wiring ===== */
function next(){
  // if we passed last index, do nothing (or loop) — here we stop after final
  if(idx >= messages.length) return;
  const text = messages[idx];
  showMessageText(text, ()=> {
    // special actions when shown
    // milestone confetti on specific indices
    if([9].includes(idx) && SETTINGS.confettiOnMilestones){ // SURPRISE index
      doConfetti();
      emojiRain(20);
    }
  });

  // shift background (subtle) per step
  shiftBackground();

  // move to next index so next click advances
  idx++;
}

/* Buttons: both call next but handle special side effects */
yesBtn.addEventListener('click', (ev)=>{
  spawnEmoji(ev.clientX, ev.clientY);
  // reset no counter since user said yes
  noCount = 0;
  // small button glow
  yesBtn.animate([{ transform:'translateY(0)' }, { transform:'translateY(-6px)' }, { transform:'translateY(0)' }], { duration:220 });
  // milestone confetti sometimes
  if(Math.random() < 0.08 && SETTINGS.confettiOnMilestones) doConfetti();
  next();
});

noBtn.addEventListener('click', (ev)=>{
  spawnEmoji(ev.clientX, ev.clientY);
  noCount++;
  // playful wiggle
  noBtn.animate([{ transform:'translateX(0)' }, { transform:'translateX(-8px)' }, { transform:'translateX(6px)' }, { transform:'translateX(0)' }], { duration:360 });
  if(SETTINGS.popupOn3No && noCount >= 3){
    noCount = 0;
    showToast("😏 You keep saying No... but it won't stop the fun!");
    // continue after a short pause automatically
    setTimeout(()=> next(), 900);
    return;
  }
  next();
});

/* Start: show first message immediately */
next();

/* When final text is displayed (the last message), trigger the spill after a short delay */
const observer = new MutationObserver(()=> {
  // if last message displayed and idx == messages.length (we just incremented)
  if(idx === messages.length){
    // small delay so user sees final message, then spill
    setTimeout(()=> {
      // spawn confetti + emoji rain for drama
      if(SETTINGS.confettiOnMilestones) doConfetti();
      emojiRain(28);
      // final spill text => use the message text (last one)
      const finalText = messages[messages.length - 1] || "YOU WON";
      spillFinalText(finalText);
    }, 900);
    // stop observing after triggered once
    observer.disconnect();
  }
});
observer.observe(messageEl, { childList: true, characterData: true, subtree:true });

/* helper to expose function to global for debugging */
function spillFinalText(text){
  spillFinalText = spillFinalText; // no-op to satisfy linter (we use inner function below)
}
(function(){ /* local final spill wrapper to avoid hoisting confusion */
  // overwrite the placeholder with real function
  window.spillFinalText = function(text){
    // clear current message box
    messageEl.textContent = '';
    // use our stacked columns approach
    spawnRipple(window.innerWidth/2, window.innerHeight - 60); // central ripple for drama
    // drop letters spaced out
    spillFinalText_inner(text);
  };

  function spillFinalText_inner(text){
    // split into characters
    const chars = Array.from(text);
    // drop in short waves for natural feel
    chars.forEach((ch, i) => {
      setTimeout(()=> {
        // call the piling function
        spillFinalSingle(ch);
      }, i * 80 + Math.random()*140);
    });
  }

  function spillFinalSingle(ch){
    // create element and perform drop/stack
    const el = document.createElement('div');
    el.className = 'falling-letter';
    el.textContent = ch;
    el.style.color = `hsl(${Math.floor(rand(0,360))},75%,72%)`;
    // start at random x near top
    el.style.left = `${rand(40, window.innerWidth - 40)}px`;
    el.style.top  = `-40px`;
    el.style.opacity = '1';
    el.style.transform = `rotate(${rand(-30,30)}deg) scale(${rand(0.92,1.06)})`;
    document.body.appendChild(el);

    // pick column index (bias towards center)
    const mid = Math.floor(columns.length/2);
    let col = Math.floor(rand(0, columns.length));
    // 40% chance bias to center
    if(Math.random() < 0.4){
      const shift = Math.floor(rand(-3,4));
      col = Math.max(0, Math.min(columns.length-1, mid + shift));
    }
    const leftTarget = Math.floor(col * colW + rand(8, colW-12));
    // compute top target based on column height
    const topTarget = window.innerHeight - 80 - columns[col];

    // animate to target
    const duration = Math.floor(rand(650, 1150));
    requestAnimationFrame(()=>{
      el.style.transition = `top ${duration}ms cubic-bezier(.12,.9,.24,1), left ${duration}ms ease, transform ${duration}ms cubic-bezier(.12,.9,.24,1)`;
      el.style.left = `${leftTarget}px`;
      el.style.top  = `${topTarget}px`;
    });

    // after landing update column height and create ripple
    setTimeout(() => {
      columns[col] += 28; // approximate letter height
      // small landing bounce
      el.animate([{ transform: 'translateY(0) scale(1.02)'}, { transform:'translateY(0) scale(1)' }], { duration:240, easing:'ease-out' });
      // spawn ripple
      spawnRipple(leftTarget + 6, window.innerHeight - 60);
    }, duration + 18);
  }

})(); // end local wrapper

/* Expose some debug functions (optional) */
window._doConfetti = doConfetti;
window._spawnEmoji = spawnEmoji;
