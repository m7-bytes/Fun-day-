/***********************
 * Configurable Messages
 ***********************/
const messages = [
  { text: "Hey there! 👋 Ready for a tiny adventure?", color: "#1f2937", bg: "#FFFAE3" },
  { text: "Choose wisely… or not. It all works 😉", color: "#2b2b2b", bg: "#E3F2FD" },
  { text: "You clicked! Officially curious 🤓", color: "#0b6bcb", bg: "#FFF0F5", confetti: true },
  { text: "Fun fact time? 👉 Bananas are berries; strawberries aren’t! 🍌🍓", color: "#cc6600", bg: "#FFF5E1" },
  { text: "Now tell me (in your mind): your favorite fruit 🍍", color: "#9c27b0", bg: "#FCE4EC" },
  { text: "Picture this: beach vibes + coconut drink 🥥🌊", color: "#0f9b9b", bg: "#E0F7FA" },
  { text: "Okay, a quick challenge…", color: "#c62828", bg: "#FFEBEE", shake: true },
  { text: "Count down softly: 5 4 3 2 1…", color: "#222", bg: "#F5F5F5" },
  { text: "Nailed it! 🏆", color: "#1b8a2d", bg: "#E8F5E9", confetti: true, flash: true },
  { text: "One last surprise coming up…", color: "#374151", bg: "#E0F2F1" },
  // Final: will trigger the water-drip spill
  { text: "⭐ You’re awesome. Don’t forget that. ⭐", color: "#d97706", bg: "#FFF3E0", spill: true }
];

/***********************
 * Elements & State
 ***********************/
const messageEl = document.getElementById("message");
const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const btnGroup = document.getElementById("btnGroup");

let index = 0;
let typing = false;
let consecutiveNo = 0;

// Initialize audio context lazily
let audioCtx = null;
function getAudio(){
  if(!audioCtx){
    const A = window.AudioContext || window.webkitAudioContext;
    audioCtx = new A();
  }
  return audioCtx;
}

/***********************
 * Sound effects (WebAudio)
 ***********************/
function beep({freq=600, dur=0.08, type="sine", gain=0.05, glideTo=null}={}){
  try{
    const ctx = getAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    if(glideTo){
      o.frequency.exponentialRampToValueAtTime(glideTo, ctx.currentTime + dur);
    }
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  }catch(e){}
}
const sounds = {
  click: ()=>beep({freq:520,dur:0.07,type:"triangle",gain:0.04}),
  ding:  ()=>beep({freq:880,dur:0.15,type:"sine",gain:0.06}),
  party: ()=>beep({freq:560,dur:0.18,type:"sawtooth",gain:0.05, glideTo: 280})
};

/***********************
 * Utilities
 ***********************/
function rand(min,max){ return Math.random()*(max-min)+min; }
function choose(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

/***********************
 * Typing + Effects
 ***********************/
function clearMessage(){
  messageEl.classList.remove("spill");
  messageEl.innerHTML = "";
}

function typeMessage(text, color){
  return new Promise(resolve=>{
    typing = true;
    clearMessage();
    messageEl.style.color = color || "var(--text)";

    // Split safely for emojis
    const chars = Array.from(text);
    const frag = document.createDocumentFragment();
    chars.forEach(ch=>{
      const span = document.createElement("span");
      span.className = "ch";
      span.textContent = ch;
      span.style.opacity = 0;
      frag.appendChild(span);
    });
    messageEl.appendChild(frag);
    messageEl.style.opacity = 1;

    let i = 0;
    const step = ()=>{
      if(i < messageEl.children.length){
        const node = messageEl.children[i];
        node.style.opacity = 1;
        node.style.transform = "translateY(0)";
        i++;
        setTimeout(step, Math.max(15, 20 + Math.random()*25)); // speed variance
      }else{
        typing = false;
        resolve();
      }
    };
    setTimeout(step, 60);
  });
}

function playConfetti(){
  if(typeof confetti !== "function") return;
  confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
}

function flashBackground(){
  document.body.classList.add("flash-bg");
  setTimeout(()=>document.body.classList.remove("flash-bg"), 1200);
}

function shakeButtons(){
  btnGroup.classList.add("shake");
  setTimeout(()=>btnGroup.classList.remove("shake"), 500);
}

function randomSwapButtons(){
  // 50% chance to swap order visually
  if(Math.random() < 0.5){
    if(yesBtn.nextSibling !== noBtn){
      btnGroup.insertBefore(noBtn, yesBtn);
    }else{
      btnGroup.insertBefore(yesBtn, noBtn);
    }
  }
}

/***********************
 * Water Drip Spill Finale
 ***********************/
function doSpill(){
  // mark for CSS animation
  messageEl.classList.add("spill");

  // add slight randomization per char
  Array.from(messageEl.querySelectorAll(".ch")).forEach((span, idx)=>{
    const delay = rand(0, 0.8) + idx * 0.015;     // staggered
    const dur   = rand(1.2, 1.9);                 // varied duration
    const rot   = `${(Math.random() < 0.5 ? -1:1)*rand(2,12)}deg`;

    span.style.setProperty("--dur", `${dur}s`);
    span.style.setProperty("--rot", rot);
    span.style.animationDelay = `${delay}s`;
  });

  // add a subtle ripple circle
  const ripple = document.createElement("div");
  ripple.className = "ripple";
  document.body.appendChild(ripple);
  setTimeout(()=>ripple.remove(), 1900);
}

/***********************
 * Flow Control
 ***********************/
async function showNext(){
  if(typing) return;

  const item = messages[index];

  // Ambient click
  sounds.click();

  // update background
  document.body.style.backgroundColor = item.bg || "var(--bg)";

  // swap buttons for fun
  randomSwapButtons();

  // do typing
  await typeMessage(item.text, item.color);

  // celebratory/special effects
  if(item.shake) shakeButtons();
  if(item.confetti){ playConfetti(); sounds.party(); }
  if(item.flash) flashBackground();

  // If final spill
  if(item.spill){
    // small pause before the spill for drama
    setTimeout(()=>{
      sounds.ding();
      doSpill();
    }, 450);
  }

  // move pointer
  index = (index + 1) % messages.length;
}

/***********************
 * Easter Egg for 3x "No"
 ***********************/
function maybeEasterEgg(wasNo){
  if(wasNo){
    consecutiveNo++;
    if(consecutiveNo >= 3){
      consecutiveNo = 0;
      const t = document.createElement("div");
      t.className = "toast";
      t.textContent = "You keep saying no… but we both know you mean yes 😏";
      document.body.appendChild(t);
      setTimeout(()=>t.remove(), 2800);
    }
  }else{
    consecutiveNo = 0;
  }
}

/***********************
 * Wiring
 ***********************/
yesBtn.addEventListener("click", ()=>{ maybeEasterEgg(false); showNext(); });
noBtn .addEventListener("click", ()=>{ maybeEasterEgg(true);  showNext();  });

// Start with the first message visible nicely
(function boot(){
  messageEl.style.opacity = 1;
})();
