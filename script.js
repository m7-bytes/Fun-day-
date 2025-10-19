const questions = [
  name => `Hi ${name}! Ready for something fun?`,
  () => "Do you like surprises?",
  () => "What if I told you this site can read your mind? 👀",
  () => "Would you believe that?",
  () => "Okay fine 😅 last question...",
  () => "Do you want to see something cool? 🎉",
  () => "✨ Grand Finale! 🎆"
];

let current = 0;
let name = "";
let noClickCount = 0;

const questionEl = document.getElementById("question");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const iosAlert = document.getElementById("iosAlert");
const alertTitle = document.getElementById("alertTitle");
const alertMessage = document.getElementById("alertMessage");
const nameInput = document.getElementById("nameInput");
const alertCancel = document.getElementById("alertCancel");
const alertOk = document.getElementById("alertOk");

const clickSound = new Audio("sounds/click.mp3");
const confettiSound = new Audio("sounds/confetti.mp3");

function showAlert() {
  iosAlert.classList.remove("hidden");
}

function closeAlert() {
  iosAlert.classList.add("hidden");
}

alertCancel.onclick = () => closeAlert();

alertOk.onclick = () => {
  name = nameInput.value.trim() || "Friend";
  closeAlert();
  startGame();
};

function startGame() {
  questionEl.textContent = questions[current](name);
}

yesBtn.onclick = () => {
  clickSound.play();
  nextQuestion();
};

noBtn.onclick = () => {
  clickSound.play();
  noClickCount++;

  if (noClickCount >= 3) {
    noClickCount = 0;
    showAlertBox("Hey!", "You can’t say no to this 😜");
    return;
  }

  moveNoButton();
};

function nextQuestion() {
  noClickCount = 0;
  current++;

  if (current < questions.length - 1) {
    questionEl.textContent = questions[current](name);
  } else {
    triggerFinale();
  }
}

function moveNoButton() {
  const x = Math.random() * 200 - 100;
  const y = Math.random() * 200 - 100;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

function showAlertBox(title, message) {
  iosAlert.classList.remove("hidden");
  alertTitle.textContent = title;
  alertMessage.textContent = message;
  nameInput.style.display = "none";
  alertCancel.style.display = "none";
  alertOk.textContent = "OK";
  alertOk.onclick = () => {
    iosAlert.classList.add("hidden");
    resetNoButton();
  };
}

function resetNoButton() {
  noBtn.style.transform = "translate(0, 0)";
}

function triggerFinale() {
  questionEl.textContent = "🎉 Boom! You made it! 🎊";
  yesBtn.style.display = "none";
  noBtn.style.display = "none";
  confettiSound.play();

  const duration = 2 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      startVelocity: 25,
      spread: 360,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

showAlert();
