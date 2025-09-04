/* -------- DOM elements -------- */
const messageEl = document.getElementById('message');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const nameModal = document.getElementById('nameModal');
const nameInput = document.getElementById('nameInput');
const nameStart = document.getElementById('nameStart');
const noPopup = document.getElementById('noPopup');
const rippleCanvas = document.getElementById('rippleCanvas');
const musicToggle = document.getElementById('musicToggle');

/* -------- Canvas setup -------- */
const ctx = rippleCanvas.getContext('2d');
function resizeCanvas(){ rippleCanvas.width = innerWidth; rippleCanvas.height = innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* -------- Messages -------- */
let playerName = '';
const baseMessages = [
  "Hey {name}! 👋 Can I ask you something?",
  "Promise you'll answer honestly? 🤨",
  "Do you like surprises? 🎁",
  "Good... because this will be fun 😏",
  "Do you want to see a tiny game?",
  "Here we go...",
  "Final question incoming...",
  "Do you want to see the grand finale? 🤯",
  "YOU WON 🎊"
];
let messages = [...baseMessages];

/* -------- State -------- */
let idx = 0;
let noClicksConsec = 0;
let runningUsed = 0;

/* -------- Utilities -------- */
const rand = (a,b)=> Math.random()*(b-a)+a;
const choose = arr => arr[Math.floor(Math.random()*arr.length)];

/* -------- Name modal -------- */
nameStart.addEventListener('click', ()=>{
  const val = nameInput.value.trim();
  if(!val) return;
  playerName = val;
  nameModal.style.display = 'none';
  startMessages();
});

/* -------- Show message -------- */
function showMessage(text){
  messageEl.textContent = text.replace(/{name}/g, playerName);
}

/* -------- Next message -------- */
function nextMessage(){
  if(idx >= messages.length) {
    finaleLetters("YOU WON! 🎉");
    return;
  }
  showMessage(messages[idx]);
  idx++;
}

/* -------- No popup -------- */
noBtn.addEventListener('click', ()=>{
  noClicksConsec++;
  if(noClicksConsec>=3){
    showNoPopup();
    noClicksConsec = 0;
    return;
  }
  if(runningUsed<5){
    makeNoRunOnce();
    runningUsed++;
  }
});

function showNoPopup(){
  noPopup.classList.add('show');
  setTimeout(()=>{
    noPopup.classList.remove('show');
    // reset No button
    noBtn.style.position = 'static';
    noBtn.style.left = '';
    noBtn.style.top = '';
  },2200);
}

/* -------- Yes button -------- */
yesBtn.addEventListener('click', ()=>{
  nextMessage();
});

/* -------- Running No button -------- */
function makeNoRunOnce(){
  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  noBtn.style.position = 'fixed';
  noBtn.style.left = `${rand(0, innerWidth-w)}px`;
  noBtn.style.top = `${rand(100, innerHeight-h-100)}px`;
}

/* -------- Final letters effect -------- */
function finaleLetters(text){
  const letters = text.split('');
  letters.forEach(l=>{
    const el = document.createElement('div');
    el.className='falling-letter';
    el.textContent = l;
    el.style.left = `${rand(20, innerWidth-30)}px`;
    el.style.top = `-40px`;
    el.style.color = `hsl(${rand(0,360)},70%,70%)`;
    document.body.appendChild(el);
    const duration = rand(800,1500);
    requestAnimationFrame(()=>{
      el.style.transition = `top ${duration}ms ease, left ${duration}ms ease`;
      el.style.top = `${innerHeight-60}px`;
    });
  });
}

/* -------- Start game -------- */
function startMessages(){
  idx = 0;
  nextMessage();
}

/* -------- Ripple effect placeholder -------- */
function spawnRipple(x,y){
  if(!ctx) return;
  ctx.beginPath();
  ctx.arc(x,y,20,0,Math.PI*2);
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.stroke();
}

/* -------- Music toggle placeholder -------- */
musicToggle.addEventListener('click', ()=>{
  alert("Background music toggle not implemented in this version");
});
